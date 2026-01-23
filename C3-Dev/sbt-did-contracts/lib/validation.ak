//// SBT-DID Validation Module
//// =========================
//// Helper functions for authorization checks, datum validation, and common
//// validation patterns used across SBT-DID validators.
////
//// Module: c3_alliance/sbt_did/validation

use aiken/collection/dict
use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Address, Credential, Script, VerificationKey}
use cardano/assets.{PolicyId, AssetName, Value}
use cardano/transaction.{
  Input, Output, OutputReference, Transaction, find_input,
}

use types.{
  AdminConfig, AuthorizedParty, ContractConfig, MemberSelf, AdminMultisig,
  KycOracle, GovernanceContract, PatronageContract, OracleConfig,
  SbtDidDatum, ScriptParams, UpdateAction, UpdateStatus, UpdateKyc,
  UpdateAccreditation, UpdateNodeAffiliation, UpdateGovernanceRoles,
  UpdatePatronage, UpdateTier, core_identity_preserved, version_incremented,
  timestamp_updated,
}

// ============================================================================
// SIGNATURE VERIFICATION
// ============================================================================

/// Count how many of the required signatories have signed the transaction.
pub fn count_signatures(
  signatories: List<ByteArray>,
  tx_signers: List<VerificationKeyHash>,
) -> Int {
  list.foldl(
    signatories,
    0,
    fn(signatory, acc) {
      if list.has(tx_signers, signatory) {
        acc + 1
      } else {
        acc
      }
    },
  )
}

/// Check if the admin multi-sig threshold is met.
/// During Pioneer phase: 3-of-5 required.
pub fn admin_multisig_signed(
  admin_config: AdminConfig,
  tx_signers: List<VerificationKeyHash>,
) -> Bool {
  let signature_count = count_signatures(admin_config.signatories, tx_signers)
  signature_count >= admin_config.threshold
}

/// Check if a specific address has signed the transaction.
/// Used for member self-authorization checks.
pub fn address_signed(address: Address, tx_signers: List<VerificationKeyHash>) -> Bool {
  when address.payment_credential is {
    VerificationKey(pkh) -> list.has(tx_signers, pkh)
    Script(_) -> False
  }
}

/// Check if the member (vault owner) has signed the transaction.
pub fn member_signed(datum: SbtDidDatum, tx_signers: List<VerificationKeyHash>) -> Bool {
  address_signed(datum.vault_address, tx_signers)
}

// ============================================================================
// CONTRACT/ORACLE AUTHORIZATION
// ============================================================================

/// Check if a KYC oracle is present in the transaction inputs.
pub fn kyc_oracle_present(
  oracle_config: OracleConfig,
  tx_inputs: List<Input>,
) -> Bool {
  list.any(
    tx_inputs,
    fn(input) {
      when input.output.address.payment_credential is {
        Script(script_hash) -> list.has(oracle_config.kyc_oracles, script_hash)
        VerificationKey(_) -> False
      }
    },
  )
}

/// Check if the governance contract is present in the transaction inputs.
pub fn governance_contract_present(
  contract_config: ContractConfig,
  tx_inputs: List<Input>,
) -> Bool {
  list.any(
    tx_inputs,
    fn(input) {
      when input.output.address.payment_credential is {
        Script(script_hash) -> script_hash == contract_config.governance_contract
        VerificationKey(_) -> False
      }
    },
  )
}

/// Check if the patronage contract is present in the transaction inputs.
pub fn patronage_contract_present(
  contract_config: ContractConfig,
  tx_inputs: List<Input>,
) -> Bool {
  list.any(
    tx_inputs,
    fn(input) {
      when input.output.address.payment_credential is {
        Script(script_hash) -> script_hash == contract_config.patronage_contract
        VerificationKey(_) -> False
      }
    },
  )
}

// ============================================================================
// AUTHORIZATION MATRIX CHECKS
// ============================================================================

/// Determine which authorized party is acting based on transaction context.
pub fn identify_authorized_party(
  params: ScriptParams,
  datum: SbtDidDatum,
  tx: Transaction,
) -> Option<AuthorizedParty> {
  if admin_multisig_signed(params.admin_config, tx.extra_signatories) {
    Some(AdminMultisig)
  } else if member_signed(datum, tx.extra_signatories) {
    Some(MemberSelf)
  } else if governance_contract_present(params.contract_config, tx.inputs) {
    Some(GovernanceContract)
  } else if patronage_contract_present(params.contract_config, tx.inputs) {
    Some(PatronageContract)
  } else if kyc_oracle_present(params.oracle_config, tx.inputs) {
    Some(KycOracle)
  } else {
    None
  }
}

/// Check if the given action is authorized for the identified party.
pub fn is_action_authorized(action: UpdateAction, party: AuthorizedParty) -> Bool {
  when action is {
    UpdateStatus { .. } ->
      when party is {
        AdminMultisig -> True
        _ -> False
      }
    UpdateKyc { .. } ->
      when party is {
        AdminMultisig -> True
        KycOracle -> True
        _ -> False
      }
    UpdateAccreditation { .. } ->
      when party is {
        MemberSelf -> True
        AdminMultisig -> True
        _ -> False
      }
    UpdateNodeAffiliation { .. } ->
      when party is {
        MemberSelf -> True
        AdminMultisig -> True
        _ -> False
      }
    UpdateGovernanceRoles { .. } ->
      when party is {
        GovernanceContract -> True
        MemberSelf -> True
        _ -> False
      }
    UpdatePatronage { .. } ->
      when party is {
        PatronageContract -> True
        GovernanceContract -> True
        _ -> False
      }
    UpdateTier { .. } ->
      when party is {
        AdminMultisig -> True
        GovernanceContract -> True
        _ -> False
      }
  }
}

// ============================================================================
// DATUM UPDATE VALIDATION
// ============================================================================

/// Validate that only the fields allowed by the action were changed.
pub fn validate_update(
  action: UpdateAction,
  old_datum: SbtDidDatum,
  new_datum: SbtDidDatum,
  current_time: Int,
) -> Bool {
  let identity_ok = core_identity_preserved(old_datum, new_datum)
  let version_ok = version_incremented(old_datum, new_datum)
  let timestamp_ok = new_datum.last_updated >= current_time
  
  let fields_ok = when action is {
    UpdateStatus { new_status } ->
      and {
        new_datum.status == new_status,
        old_datum.tier == new_datum.tier,
        old_datum.kyc_status == new_datum.kyc_status,
        old_datum.kyc_provider_hash == new_datum.kyc_provider_hash,
        old_datum.kyc_expiry == new_datum.kyc_expiry,
        old_datum.accredited_self_attestation == new_datum.accredited_self_attestation,
        old_datum.accreditation_date == new_datum.accreditation_date,
        old_datum.jurisdiction == new_datum.jurisdiction,
        old_datum.node_affiliation == new_datum.node_affiliation,
        old_datum.patronage_epoch == new_datum.patronage_epoch,
        old_datum.voting_weight == new_datum.voting_weight,
        old_datum.steward_roles == new_datum.steward_roles,
        old_datum.delegation_to == new_datum.delegation_to,
      }
    UpdateKyc { kyc_status, provider_hash, expiry } ->
      and {
        new_datum.kyc_status == kyc_status,
        new_datum.kyc_provider_hash == provider_hash,
        new_datum.kyc_expiry == expiry,
        old_datum.status == new_datum.status,
        old_datum.tier == new_datum.tier,
        old_datum.accredited_self_attestation == new_datum.accredited_self_attestation,
        old_datum.accreditation_date == new_datum.accreditation_date,
        old_datum.jurisdiction == new_datum.jurisdiction,
        old_datum.node_affiliation == new_datum.node_affiliation,
        old_datum.patronage_epoch == new_datum.patronage_epoch,
        old_datum.voting_weight == new_datum.voting_weight,
        old_datum.steward_roles == new_datum.steward_roles,
        old_datum.delegation_to == new_datum.delegation_to,
      }
    UpdateAccreditation { attested, date } ->
      and {
        new_datum.accredited_self_attestation == attested,
        new_datum.accreditation_date == date,
        old_datum.status == new_datum.status,
        old_datum.tier == new_datum.tier,
        old_datum.kyc_status == new_datum.kyc_status,
        old_datum.kyc_provider_hash == new_datum.kyc_provider_hash,
        old_datum.kyc_expiry == new_datum.kyc_expiry,
        old_datum.jurisdiction == new_datum.jurisdiction,
        old_datum.node_affiliation == new_datum.node_affiliation,
        old_datum.patronage_epoch == new_datum.patronage_epoch,
        old_datum.voting_weight == new_datum.voting_weight,
        old_datum.steward_roles == new_datum.steward_roles,
        old_datum.delegation_to == new_datum.delegation_to,
      }
    UpdateNodeAffiliation { new_node } ->
      and {
        new_datum.node_affiliation == new_node,
        old_datum.status == new_datum.status,
        old_datum.tier == new_datum.tier,
        old_datum.kyc_status == new_datum.kyc_status,
        old_datum.kyc_provider_hash == new_datum.kyc_provider_hash,
        old_datum.kyc_expiry == new_datum.kyc_expiry,
        old_datum.accredited_self_attestation == new_datum.accredited_self_attestation,
        old_datum.accreditation_date == new_datum.accreditation_date,
        old_datum.jurisdiction == new_datum.jurisdiction,
        old_datum.patronage_epoch == new_datum.patronage_epoch,
        old_datum.voting_weight == new_datum.voting_weight,
        old_datum.steward_roles == new_datum.steward_roles,
        old_datum.delegation_to == new_datum.delegation_to,
      }
    UpdateGovernanceRoles { roles, delegation } ->
      and {
        new_datum.steward_roles == roles,
        new_datum.delegation_to == delegation,
        old_datum.status == new_datum.status,
        old_datum.tier == new_datum.tier,
        old_datum.kyc_status == new_datum.kyc_status,
        old_datum.kyc_provider_hash == new_datum.kyc_provider_hash,
        old_datum.kyc_expiry == new_datum.kyc_expiry,
        old_datum.accredited_self_attestation == new_datum.accredited_self_attestation,
        old_datum.accreditation_date == new_datum.accreditation_date,
        old_datum.jurisdiction == new_datum.jurisdiction,
        old_datum.node_affiliation == new_datum.node_affiliation,
        old_datum.patronage_epoch == new_datum.patronage_epoch,
        old_datum.voting_weight == new_datum.voting_weight,
      }
    UpdatePatronage { epoch, voting_weight } ->
      and {
        new_datum.patronage_epoch == epoch,
        new_datum.voting_weight == voting_weight,
        types.is_valid_voting_weight(voting_weight),
        old_datum.status == new_datum.status,
        old_datum.tier == new_datum.tier,
        old_datum.kyc_status == new_datum.kyc_status,
        old_datum.kyc_provider_hash == new_datum.kyc_provider_hash,
        old_datum.kyc_expiry == new_datum.kyc_expiry,
        old_datum.accredited_self_attestation == new_datum.accredited_self_attestation,
        old_datum.accreditation_date == new_datum.accreditation_date,
        old_datum.jurisdiction == new_datum.jurisdiction,
        old_datum.node_affiliation == new_datum.node_affiliation,
        old_datum.steward_roles == new_datum.steward_roles,
        old_datum.delegation_to == new_datum.delegation_to,
      }
    UpdateTier { new_tier } ->
      and {
        new_datum.tier == new_tier,
        old_datum.status == new_datum.status,
        old_datum.kyc_status == new_datum.kyc_status,
        old_datum.kyc_provider_hash == new_datum.kyc_provider_hash,
        old_datum.kyc_expiry == new_datum.kyc_expiry,
        old_datum.accredited_self_attestation == new_datum.accredited_self_attestation,
        old_datum.accreditation_date == new_datum.accreditation_date,
        old_datum.jurisdiction == new_datum.jurisdiction,
        old_datum.node_affiliation == new_datum.node_affiliation,
        old_datum.patronage_epoch == new_datum.patronage_epoch,
        old_datum.voting_weight == new_datum.voting_weight,
        old_datum.steward_roles == new_datum.steward_roles,
        old_datum.delegation_to == new_datum.delegation_to,
      }
  }
  
  and {
    identity_ok,
    version_ok,
    timestamp_ok,
    fields_ok,
  }
}

// ============================================================================
// OUTPUT VALIDATION
// ============================================================================

/// Validate that the output has an inline datum attached.
pub fn has_inline_datum(output: Output) -> Bool {
  when output.datum is {
    transaction.InlineDatum(_) -> True
    _ -> False
  }
}

// ============================================================================
// MINTING VALIDATION HELPERS
// ============================================================================

/// Count tokens of a specific asset in the mint field.
pub fn count_minted(
  mint: Value,
  policy_id: PolicyId,
  asset_name: AssetName,
) -> Int {
  assets.quantity_of(mint, policy_id, asset_name)
}

/// Validate CIP-68 pair minting: exactly 1 reference + 1 user token with matching SEID.
pub fn valid_pair_mint(
  mint: Value,
  policy_id: PolicyId,
  seid_id: ByteArray,
) -> Bool {
  let ref_name = types.make_reference_asset_name(seid_id)
  let user_name = types.make_user_asset_name(seid_id)
  
  let ref_count = count_minted(mint, policy_id, ref_name)
  let user_count = count_minted(mint, policy_id, user_name)
  
  ref_count == 1 && user_count == 1
}

/// Validate that no tokens are being burned.
pub fn no_burns(mint: Value, policy_id: PolicyId) -> Bool {
  let minted_tokens = assets.tokens(mint, policy_id)
  list.all(
    dict.to_pairs(minted_tokens),
    fn(pair) {
      pair.2nd >= 0
    },
  )
}

// ============================================================================
// TESTS
// ============================================================================

test count_zero_signatures() {
  let signatories = [#"aabbcc", #"ddeeff"]
  let tx_signers = []
  count_signatures(signatories, tx_signers) == 0
}

test count_all_signatures() {
  let signatories = [#"aabbcc", #"ddeeff"]
  let tx_signers = [#"aabbcc", #"ddeeff", #"112233"]
  count_signatures(signatories, tx_signers) == 2
}

test count_partial_signatures() {
  let signatories = [#"aabbcc", #"ddeeff", #"112233"]
  let tx_signers = [#"aabbcc", #"112233"]
  count_signatures(signatories, tx_signers) == 2
}

test admin_threshold_met() {
  let config = AdminConfig {
    threshold: 2,
    signatories: [#"aa", #"bb", #"cc"],
  }
  let signers = [#"aa", #"bb"]
  admin_multisig_signed(config, signers)
}

test admin_threshold_not_met() {
  let config = AdminConfig {
    threshold: 3,
    signatories: [#"aa", #"bb", #"cc", #"dd"],
  }
  let signers = [#"aa", #"bb"]
  !admin_multisig_signed(config, signers)
}