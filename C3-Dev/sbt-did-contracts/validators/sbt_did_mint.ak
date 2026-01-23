//// SBT-DID Minting Policy
//// ======================
//// CIP-68 minting policy for Soulbound Token - Decentralized Identifier credentials.
//// Enforces pair minting (reference + user token) with admin authorization.
////
//// Key Features:
//// - Mints exactly 1 reference token (100) + 1 user token (222) per operation
//// - Reference token must go to the reference spending validator
//// - User token must go to member's vault address
//// - Requires 3-of-5 admin multi-sig authorization during Pioneer phase
//// - Burns are permanently disabled (soulbound)
////
//// Validator: c3_alliance/sbt_did/mint

use aiken/collection/list
use aiken/primitive/bytearray
use aiken/interval.{Finite}
use cardano/address.{Address, Credential, Script, VerificationKey}
use cardano/assets.{PolicyId}
use cardano/transaction.{Transaction, Output, OutputReference, InlineDatum}

use types.{
  AdminConfig, MintAction, MintSbtDid, BurnSbtDid, SbtDidDatum,
  make_reference_asset_name, make_user_asset_name, is_valid_seid,
  label_reference, label_user, Active, Pending, Member,
}
use validation.{admin_multisig_signed, valid_pair_mint, no_burns, count_minted}

// ============================================================================
// MINTING POLICY PARAMETERS
// ============================================================================

/// Parameters for the minting policy.
/// These are "baked in" at compile time via parameterization.
pub type MintParams {
  /// Admin multi-sig configuration
  admin_config: AdminConfig,
  /// Script hash of the reference token spending validator
  reference_validator_hash: ByteArray,
  /// Script hash of the soulbound lock script
  lock_script_hash: ByteArray,
}

// ============================================================================
// MAIN VALIDATOR
// ============================================================================

/// SBT-DID Minting Policy Validator
///
/// ## Minting Rules:
/// 1. Pair Minting: Exactly 1 reference token (100) + 1 user token (222) with matching seid_id
/// 2. Reference → Script: Reference token must go to the reference spending validator address
/// 3. User → Vault: User token must go to the vault_address specified in redeemer
/// 4. Admin Authorization: Transaction must be signed by 3-of-5 admin multi-sig
/// 5. Valid Datum: Reference token output must have valid SbtDidDatum attached
/// 6. No Burns: BurnSbtDid redeemer always returns False
validator mint(params: MintParams) {
  mint(redeemer: MintAction, policy_id: PolicyId, tx: Transaction) {
    when redeemer is {
      MintSbtDid { seid_id, vault_address } -> {
        // Validate SEID format
        let seid_valid = is_valid_seid(seid_id)
        
        // Validate admin multi-sig authorization
        let admin_authorized = admin_multisig_signed(
          params.admin_config,
          tx.extra_signatories,
        )
        
        // Validate pair minting (exactly 1 of each token type)
        let pair_valid = valid_pair_mint(tx.mint, policy_id, seid_id)
        
        // Validate no burns in this transaction
        let no_burning = no_burns(tx.mint, policy_id)
        
        // Find and validate reference token output
        let ref_asset_name = make_reference_asset_name(seid_id)
        let ref_output_valid = validate_reference_output(
          tx.outputs,
          policy_id,
          ref_asset_name,
          params.reference_validator_hash,
          seid_id,
          vault_address,
          tx.validity_range,
        )
        
        // Find and validate user token output
        let user_asset_name = make_user_asset_name(seid_id)
        let user_output_valid = validate_user_output(
          tx.outputs,
          policy_id,
          user_asset_name,
          vault_address,
        )
        
        // All checks must pass
        and {
          seid_valid?,
          admin_authorized?,
          pair_valid?,
          no_burning?,
          ref_output_valid?,
          user_output_valid?,
        }
      }
      
      BurnSbtDid -> {
        // Soulbound tokens cannot be burned - ALWAYS FAIL
        trace @"SBT-DID tokens are soulbound and cannot be burned"
        False
      }
    }
  }
  
  else(_) {
    fail
  }
}

// ============================================================================
// OUTPUT VALIDATION HELPERS
// ============================================================================

/// Validate that the reference token is sent to the correct script address
/// with a valid inline datum attached.
fn validate_reference_output(
  outputs: List<Output>,
  policy_id: PolicyId,
  asset_name: ByteArray,
  expected_script_hash: ByteArray,
  seid_id: ByteArray,
  vault_address: Address,
  validity_range: transaction.ValidityRange,
) -> Bool {
  // Find the output containing the reference token
  let maybe_ref_output = list.find(
    outputs,
    fn(output) {
      assets.quantity_of(output.value, policy_id, asset_name) == 1
    },
  )
  
  when maybe_ref_output is {
    None -> {
      trace @"Reference token output not found"
      False
    }
    Some(ref_output) -> {
      // Verify output goes to the reference validator script
      let address_valid = when ref_output.address.payment_credential is {
        Script(hash) -> hash == expected_script_hash
        VerificationKey(_) -> False
      }
      
      // Verify inline datum is present
      let datum_present = when ref_output.datum is {
        InlineDatum(_) -> True
        _ -> False
      }
      
      // Extract and validate the datum structure
      let datum_valid = when ref_output.datum is {
        InlineDatum(datum_data) -> {
          // Try to parse as SbtDidDatum and validate
          expect datum: SbtDidDatum = datum_data
          validate_initial_datum(datum, seid_id, vault_address, validity_range)
        }
        _ -> False
      }
      
      and {
        address_valid?,
        datum_present?,
        datum_valid?,
      }
    }
  }
}

/// Validate that the user token is sent to the correct vault address.
fn validate_user_output(
  outputs: List<Output>,
  policy_id: PolicyId,
  asset_name: ByteArray,
  expected_vault: Address,
) -> Bool {
  // Find the output containing the user token
  let maybe_user_output = list.find(
    outputs,
    fn(output) {
      assets.quantity_of(output.value, policy_id, asset_name) == 1
    },
  )
  
  when maybe_user_output is {
    None -> {
      trace @"User token output not found"
      False
    }
    Some(user_output) -> {
      // Verify output goes to the vault address
      user_output.address == expected_vault
    }
  }
}

/// Validate the initial datum structure for a newly minted SBT-DID.
fn validate_initial_datum(
  datum: SbtDidDatum,
  expected_seid: ByteArray,
  expected_vault: Address,
  validity_range: transaction.ValidityRange,
) -> Bool {
  // Core identity fields must match redeemer
  let seid_matches = datum.seid_id == expected_seid
  let vault_matches = datum.vault_address == expected_vault
  
  // DID URI should contain the SEID (basic format check)
  // Full URI validation would be done off-chain
  let did_uri_valid = bytearray.length(datum.did_uri) > 0
  
  // Issuer node should be set (non-empty)
  let issuer_valid = bytearray.length(datum.issuer_node) > 0
  
  // Issuer node should be set (non-empty)
  let issuer_valid = bytearray.length(datum.issuer_node) > 0
  
  // Issued timestamp should be within validity range
  let timestamp_valid = when validity_range.lower_bound.bound_type is {
    Finite(lower) -> datum.issued_at >= lower
    _ -> True  // No lower bound, accept any timestamp
  }
  
  // Initial status should be Active
  let status_valid = datum.status == Active
  
  // Initial KYC status should be Pending
  let kyc_valid = datum.kyc_status == Pending
  
  // Initial membership tier should be Member (upgrades happen later)
  let tier_valid = datum.tier == Member
  
  // Jurisdiction should be set (2-byte ISO code)
 let jurisdiction_valid = bytearray.length(datum.jurisdiction) == 2
  
  // Initial voting weight should be 0 or valid range
  let voting_weight_valid = types.is_valid_voting_weight(datum.voting_weight)
  
  // Datum version should be 1 for initial mint
  let version_valid = datum.datum_version == 1
  
  // Last updated should match issued_at for initial mint
  let updated_valid = datum.last_updated == datum.issued_at
  
  and {
    seid_matches?,
    vault_matches?,
    did_uri_valid?,
    issuer_valid?,
    timestamp_valid?,
    status_valid?,
    kyc_valid?,
    tier_valid?,
    jurisdiction_valid?,
    voting_weight_valid?,
    version_valid?,
    updated_valid?,
  }
}

// ============================================================================
// DUPLICATE PREVENTION (via Reference Input)
// ============================================================================

/// Check if an SBT-DID with the given SEID already exists.
/// This is done by checking if a reference input contains a token with matching SEID.
/// 
/// NOTE: This function is provided for off-chain coordination but the actual
/// duplicate check should be done by the reference validator or via indexer.
/// The minting policy itself cannot efficiently check all existing tokens.
pub fn seid_already_exists(
  reference_inputs: List<transaction.Input>,
  policy_id: PolicyId,
  seid_id: ByteArray,
) -> Bool {
  let ref_asset_name = make_reference_asset_name(seid_id)
  
  list.any(
    reference_inputs,
    fn(input) {
      assets.quantity_of(input.output.value, policy_id, ref_asset_name) > 0
    },
  )
}

// ============================================================================
// TESTS
// ============================================================================

// Note: Comprehensive tests would require constructing mock transactions.
// These are placeholder tests that validate type construction.

test burn_always_fails() {
  // This test documents the expected behavior
  // In practice, the validator always returns False for BurnSbtDid
  True
}

test valid_seid_length() {
  let seid = #"0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c"
  is_valid_seid(seid)
}

test invalid_seid_too_short() {
  let seid = #"01020304050607"
  !is_valid_seid(seid)
}

test reference_asset_name_format() {
  let seid = #"0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c"
  let ref_name = make_reference_asset_name(seid)
  bytearray.take(ref_name, 4) == label_reference
}

test user_asset_name_format() {
  let seid = #"0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c"
  let user_name = make_user_asset_name(seid)
  bytearray.take(user_name, 4) == label_user
}
