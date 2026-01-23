//// SBT-DID Reference Token Spending Validator
//// ==========================================
//// CIP-68 spending validator for the reference token containing member datum.
//// Enforces per-field authorization matrix for datum updates.
////
//// Key Features:
//// - Core identity fields are IMMUTABLE after minting
//// - Per-field authorization based on authorization matrix
//// - Datum version increments on every update
//// - Reference token must return to same script address
////
//// Validator: c3_alliance/sbt_did/reference

use aiken/collection/list
use aiken/interval.{Finite}
use aiken/collection/dict
use cardano/address.{Address, Credential, Script}
use cardano/assets.{PolicyId, AssetName}
use cardano/transaction.{
  Transaction, Input, Output, OutputReference, InlineDatum, Spend,
}

use types.{
  SbtDidDatum, UpdateAction, ScriptParams, AuthorizedParty,
  make_reference_asset_name, is_reference_token, extract_seid_from_asset_name,
}
use validation.{
  identify_authorized_party, is_action_authorized, validate_update,
  has_inline_datum,
}

// ============================================================================
// MAIN VALIDATOR
// ============================================================================

/// SBT-DID Reference Token Spending Validator
///
/// This validator controls spending of the reference token, which can only
/// happen during datum updates. The token must always return to this same
/// script address with an updated datum.
///
/// ## Spending Rules:
/// 1. Identity Preservation: Core identity fields NEVER change
/// 2. Version Increment: datum_version must increment by exactly 1
/// 3. Timestamp Update: last_updated must be set to current time
/// 4. Authorization Check: Per-field authorization per the matrix
/// 5. Output Continuity: Reference token returns to same script with updated datum
validator reference(params: ScriptParams) {
  spend(
    datum_opt: Option<SbtDidDatum>,
    redeemer: UpdateAction,
    own_ref: OutputReference,
    tx: Transaction,
  ) {
    // Extract the datum (must be present for reference token)
    expect Some(old_datum) = datum_opt
    
    // Find our own input
    expect Some(own_input) = transaction.find_input(tx.inputs, own_ref)
    
    // Get the policy ID from the reference token in our input
    // The reference token is the one with CIP-68 label 100
    expect Some((policy_id, ref_asset_name)) = find_reference_token_in_value(
      own_input.output.value,
    )
    
    // Verify this is actually a reference token
    let is_ref_token = is_reference_token(ref_asset_name)
    
    // Extract SEID from asset name for validation
    let seid = extract_seid_from_asset_name(ref_asset_name)
    
    // Verify SEID matches datum
    let seid_matches = old_datum.seid_id == seid
    
    // Identify the authorized party making this update
    let maybe_party = identify_authorized_party(params, old_datum, tx)
    
    // Verify an authorized party is present
    expect Some(party) = maybe_party
    
    // Verify the action is authorized for this party
    let action_authorized = is_action_authorized(redeemer, party)
    
    // Find the continuing output (reference token must return to same script)
    expect Some(continuing_output) = find_continuing_reference_output(
      own_input,
      tx.outputs,
      policy_id,
      ref_asset_name,
    )
    
    // Verify output has inline datum
    let has_datum = has_inline_datum(continuing_output)
    
    // Extract and validate the new datum
    expect InlineDatum(new_datum_data) = continuing_output.datum
    expect new_datum: SbtDidDatum = new_datum_data
    
    // Get current time from validity range (use lower bound)
    let current_time = get_current_time(tx.validity_range)
    
    // Validate the datum update
    let update_valid = validate_update(redeemer, old_datum, new_datum, current_time)
    
    // Additional member-specific authorization for certain actions
    let member_action_valid = validate_member_specific_actions(
      redeemer,
      party,
      old_datum,
      new_datum,
      tx,
    )
    
    // All checks must pass
    and {
      is_ref_token?,
      seid_matches?,
      action_authorized?,
      has_datum?,
      update_valid?,
      member_action_valid?,
    }
  }
  
  else(_) {
    fail
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/// Find the reference token (CIP-68 label 100) in a value.
/// Returns the policy ID and asset name if found.
fn find_reference_token_in_value(
  value: assets.Value,
) -> Option<(PolicyId, AssetName)> {
  let policies = assets.policies(value)
  find_ref_token_in_policies(policies, value)
}

fn find_ref_token_in_policies(
  policies: List<PolicyId>,
  value: assets.Value,
) -> Option<(PolicyId, AssetName)> {
  when policies is {
    [] -> None
    [policy_id, ..rest] -> {
      let tokens = assets.tokens(value, policy_id)
      let token_pairs = dict.to_pairs(tokens)
      when find_ref_in_tokens(policy_id, token_pairs) is {
        Some(result) -> Some(result)
        None -> find_ref_token_in_policies(rest, value)
      }
    }
  }
}

fn find_ref_in_tokens(
  policy_id: PolicyId,
  token_pairs: List<Pair<AssetName, Int>>,
) -> Option<(PolicyId, AssetName)> {
  when token_pairs is {
    [] -> None
    [pair, ..rest] -> {
      let asset_name = pair.1st
      let qty = pair.2nd
      if qty > 0 && is_reference_token(asset_name) {
        Some((policy_id, asset_name))
      } else {
        find_ref_in_tokens(policy_id, rest)
      }
    }
  }
}

/// Find the continuing output for the reference token.
/// Must return to the same script address.
fn find_continuing_reference_output(
  own_input: Input,
  outputs: List<Output>,
  policy_id: PolicyId,
  asset_name: AssetName,
) -> Option<Output> {
  let own_address = own_input.output.address
  
  list.find(
    outputs,
    fn(output) {
      let address_match = output.address == own_address
      let has_token = assets.quantity_of(output.value, policy_id, asset_name) == 1
      address_match && has_token
    },
  )
}

/// Extract current time from transaction validity range.
/// Uses the lower bound as the "current time" for datum updates.
fn get_current_time(validity_range: transaction.ValidityRange) -> Int {
  when validity_range.lower_bound.bound_type is {
    Finite(time) -> time
    _ -> 0
  }
}

/// Additional validation for member-specific actions.
/// When a member is the authorized party, extra checks apply.
fn validate_member_specific_actions(
  action: UpdateAction,
  party: AuthorizedParty,
  old_datum: SbtDidDatum,
  new_datum: SbtDidDatum,
  tx: Transaction,
) -> Bool {
  when party is {
    types.MemberSelf -> {
      when action is {
        types.UpdateGovernanceRoles { roles, delegation } -> {
          // Member can only change delegation, not steward_roles
          // steward_roles must remain unchanged when member updates
          old_datum.steward_roles == new_datum.steward_roles
        }
        _ -> True  // Other member actions don't need extra validation
      }
    }
    _ -> True  // Non-member parties don't need extra validation
  }
}

// ============================================================================
// EMERGENCY ADMIN OVERRIDE
// ============================================================================

/// In extreme circumstances, the admin multi-sig can update ANY field.
/// This is a safety mechanism for correcting errors or responding to
/// security incidents. Usage should be rare and logged off-chain.
///
/// NOTE: This override is implicit in the authorization matrix where
/// admin can perform most updates. For fields they normally can't update
/// (like patronage_epoch), this would need to be handled by upgrading
/// the contract or through governance.

// ============================================================================
// TESTS
// ============================================================================

test reference_token_detection() {
  // Reference token asset name starts with 000643b0
  let ref_name = #"000643b00102030405060708091011121314151617181920212223242526272829"
  is_reference_token(ref_name)
}

test user_token_not_reference() {
  // User token asset name starts with 000de140
  let user_name = #"000de1400102030405060708091011121314151617181920212223242526272829"
  !is_reference_token(user_name)
}

test seid_extraction() {
  let ref_name = #"000643b00102030405060708091011121314151617181920212223242526272829"
  let seid = extract_seid_from_asset_name(ref_name)
  seid == #"0102030405060708091011121314151617181920212223242526272829"
}
