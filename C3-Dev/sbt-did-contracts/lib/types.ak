//// SBT-DID Types Module
//// =====================
//// Core type definitions for the C3 Alliance Soulbound Token - Decentralized Identifier system.
//// Implements CIP-68 reference NFT pattern with soulbound enforcement.
////
//// Module: c3_alliance/sbt_did/types

use aiken/collection/list
use cardano/address.{Address}
use aiken/primitive/bytearray

// ============================================================================
// CONSTANTS
// ============================================================================

/// CIP-68 label for reference tokens (label 100)
pub const label_reference: ByteArray = #"000643b0"

/// CIP-68 label for user tokens (label 222)  
pub const label_user: ByteArray = #"000de140"

/// Expected length of SEID identifier in bytes
pub const seid_length: Int = 28

/// Basis points representing 1.0 (100%)
pub const basis_points_max: Int = 10000

// ============================================================================
// MEMBERSHIP STATUS ENUM
// ============================================================================

/// Represents the current membership status of a C3 Alliance member.
/// 
/// - `Active`: Member in good standing with full privileges
/// - `Suspended`: Temporarily suspended, privileges paused
/// - `Revoked`: Permanently revoked, no privileges
/// - `Emeritus`: Honorary status, limited privileges
pub type MembershipStatus {
  Active
  Suspended
  Revoked
  Emeritus
}

/// Convert MembershipStatus to integer for comparison/storage
pub fn membership_status_to_int(status: MembershipStatus) -> Int {
  when status is {
    Active -> 0
    Suspended -> 1
    Revoked -> 2
    Emeritus -> 3
  }
}

// ============================================================================
// MEMBERSHIP TIER ENUM
// ============================================================================

/// Represents the membership tier within the C3 Alliance hierarchy.
///
/// - `Founder`: Original founding members, highest privileges
/// - `Pioneer`: Early adopters during Pioneer phase
/// - `Steward`: Members with governance responsibilities
/// - `Member`: Standard cooperative members
pub type MembershipTier {
  Founder
  Pioneer
  Steward
  Member
}

/// Convert MembershipTier to integer for comparison
pub fn membership_tier_to_int(tier: MembershipTier) -> Int {
  when tier is {
    Founder -> 0
    Pioneer -> 1
    Steward -> 2
    Member -> 3
  }
}

// ============================================================================
// KYC STATUS ENUM
// ============================================================================

/// Represents the Know Your Customer verification status.
///
/// - `Pending`: Verification in progress
/// - `Verified`: Successfully verified
/// - `Expired`: Verification has expired, renewal required
/// - `Failed`: Verification failed
pub type KycStatus {
  Pending
  Verified
  Expired
  Failed
}

/// Convert KycStatus to integer for comparison
pub fn kyc_status_to_int(status: KycStatus) -> Int {
  when status is {
    Pending -> 0
    Verified -> 1
    Expired -> 2
    Failed -> 3
  }
}

// ============================================================================
// SBT-DID DATUM
// ============================================================================

/// The primary datum structure attached to the reference token.
/// Contains all on-chain identity and membership data for a C3 Alliance member.
///
/// ## Field Categories:
/// 
/// ### Core Identity (Immutable after mint)
/// These fields are set at minting time and can NEVER be changed:
/// - `seid_id`: 28-byte Sovereign Entity Identifier derived from DID
/// - `did_uri`: Full DID string (e.g., "did:c3:seid:...")
/// - `vault_address`: Member's Lace wallet address (the "Vault")
/// - `issued_at`: POSIX timestamp of issuance
/// - `issuer_node`: NEID of the N3 Node that issued this credential
///
/// ### Membership Status (Mutable - Admin controlled)
/// - `status`: Current membership status
/// - `tier`: Membership tier level
///
/// ### Compliance (Mutable - KYC Oracle or Admin)
/// - `kyc_status`: Current KYC verification status
/// - `kyc_provider_hash`: Hash of the KYC provider identity
/// - `kyc_expiry`: Optional expiration timestamp for KYC
/// - `accredited_self_attestation`: Self-attested accredited investor status
/// - `accreditation_date`: Date of accreditation attestation
/// - `jurisdiction`: ISO 3166-1 alpha-2 country code
///
/// ### Cooperative (Mutable - Various authorized parties)
/// - `node_affiliation`: NEID of the member's primary N3 Node
/// - `patronage_epoch`: Current patronage calculation epoch
/// - `voting_weight`: Voting power in basis points (10000 = 1.0)
///
/// ### Governance (Mutable - Governance Contract or Member)
/// - `steward_roles`: List of stewardship role identifiers
/// - `delegation_to`: Optional address for vote delegation
///
/// ### Metadata
/// - `datum_version`: Increments on every update
/// - `last_updated`: POSIX timestamp of last modification
pub type SbtDidDatum {
  // CORE IDENTITY (Immutable after mint)
  seid_id: ByteArray,
  did_uri: ByteArray,
  vault_address: Address,
  issued_at: Int,
  issuer_node: ByteArray,
  // MEMBERSHIP STATUS (Mutable)
  status: MembershipStatus,
  tier: MembershipTier,
  // COMPLIANCE (Mutable)
  kyc_status: KycStatus,
  kyc_provider_hash: ByteArray,
  kyc_expiry: Option<Int>,
  accredited_self_attestation: Bool,
  accreditation_date: Option<Int>,
  jurisdiction: ByteArray,
  // COOPERATIVE (Mutable)
  node_affiliation: ByteArray,
  patronage_epoch: Int,
  voting_weight: Int,
  // GOVERNANCE (Mutable)
  steward_roles: List<ByteArray>,
  delegation_to: Option<Address>,
  // METADATA
  datum_version: Int,
  last_updated: Int,
}

// ============================================================================
// MINTING POLICY REDEEMER
// ============================================================================

/// Redeemer for the SBT-DID minting policy.
///
/// - `MintSbtDid`: Mint a new SBT-DID pair (reference + user token)
/// - `BurnSbtDid`: Attempt to burn tokens (ALWAYS FAILS - soulbound)
pub type MintAction {
  /// Mint a new SBT-DID for a member
  /// - `seid_id`: The 28-byte SEID identifier for the new credential
  /// - `vault_address`: The member's Vault (Lace wallet) address
  MintSbtDid { seid_id: ByteArray, vault_address: Address }
  /// Burn action - always fails as tokens are soulbound
  BurnSbtDid
}

// ============================================================================
// REFERENCE TOKEN SPENDING REDEEMER
// ============================================================================

/// Redeemer for the reference token spending validator.
/// Each variant corresponds to a specific field update operation
/// with its own authorization requirements per the authorization matrix.
pub type UpdateAction {
  /// Update membership status (Admin only)
  UpdateStatus { new_status: MembershipStatus }
  /// Update KYC information (Admin or KYC Oracle)
  UpdateKyc {
    kyc_status: KycStatus,
    provider_hash: ByteArray,
    expiry: Option<Int>,
  }
  /// Update accredited investor attestation (Member or Admin)
  UpdateAccreditation { attested: Bool, date: Option<Int> }
  /// Update N3 Node affiliation (Member or Admin)
  UpdateNodeAffiliation { new_node: ByteArray }
  /// Update governance roles and delegation (Governance Contract)
  UpdateGovernanceRoles { roles: List<ByteArray>, delegation: Option<Address> }
  /// Update patronage data (Patronage Contract)
  UpdatePatronage { epoch: Int, voting_weight: Int }
  /// Update membership tier (Admin or Governance Contract)
  UpdateTier { new_tier: MembershipTier }
}

// ============================================================================
// LOCK SCRIPT REDEEMER
// ============================================================================

/// Redeemer for the soulbound lock script.
/// This script is designed to be impossible to spend, so the redeemer
/// is defined but will never successfully validate.
pub type LockAction {
  /// Attempt to unlock - ALWAYS FAILS
  AttemptUnlock
}

// ============================================================================
// AUTHORIZED PARTY IDENTIFIERS
// ============================================================================

/// Identifies the type of authorized party attempting an action.
/// Used in authorization checks within the spending validator.
pub type AuthorizedParty {
  /// The member who owns this SBT-DID (signs with vault_address key)
  MemberSelf
  /// The admin multi-sig (3-of-5 during Pioneer phase)
  AdminMultisig
  /// An authorized KYC provider oracle
  KycOracle
  /// The C3 Alliance governance smart contract
  GovernanceContract
  /// The C3 Alliance patronage calculation contract
  PatronageContract
}

// ============================================================================
// SCRIPT PARAMETERS
// ============================================================================

/// Configuration parameters for the admin multi-sig.
/// Parameterized to allow transition from Pioneer (3-of-5) to Council governance.
pub type AdminConfig {
  /// Minimum number of signatures required
  threshold: Int,
  /// List of authorized admin public key hashes (28 bytes each)
  signatories: List<ByteArray>,
}

/// Configuration for authorized oracle addresses.
pub type OracleConfig {
  /// List of authorized KYC provider script/payment credential hashes
  kyc_oracles: List<ByteArray>,
}

/// Configuration for authorized contract addresses.
pub type ContractConfig {
  /// Payment credential hash of the governance contract
  governance_contract: ByteArray,
  /// Payment credential hash of the patronage contract
  patronage_contract: ByteArray,
}

/// Combined script parameters passed to validators.
pub type ScriptParams {
  admin_config: AdminConfig,
  oracle_config: OracleConfig,
  contract_config: ContractConfig,
  /// Script hash of the reference token validator (for minting policy checks)
  reference_validator_hash: ByteArray,
  /// Script hash of the soulbound lock script
  lock_script_hash: ByteArray,
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/// Validate that a SEID has the correct length (28 bytes)
pub fn is_valid_seid(seid: ByteArray) -> Bool {
  bytearray.length(seid) == seid_length
}

/// Construct a reference token asset name from SEID
/// Asset Name = Label (4 bytes) + seid_id (28 bytes)
pub fn make_reference_asset_name(seid_id: ByteArray) -> ByteArray {
  bytearray.concat(label_reference, seid_id)
}

/// Construct a user token asset name from SEID
/// Asset Name = Label (4 bytes) + seid_id (28 bytes)
pub fn make_user_asset_name(seid_id: ByteArray) -> ByteArray {
  bytearray.concat(label_user, seid_id)
}

/// Extract SEID from a CIP-68 asset name (removes first 4 bytes)
pub fn extract_seid_from_asset_name(asset_name: ByteArray) -> ByteArray {
  bytearray.drop(asset_name, 4)
}

/// Check if an asset name is a reference token (starts with label 100)
pub fn is_reference_token(asset_name: ByteArray) -> Bool {
  bytearray.take(asset_name, 4) == label_reference
}

/// Check if an asset name is a user token (starts with label 222)
pub fn is_user_token(asset_name: ByteArray) -> Bool {
  bytearray.take(asset_name, 4) == label_user
}

/// Verify that core identity fields are preserved between old and new datum.
/// These fields must NEVER change after minting.
pub fn core_identity_preserved(old: SbtDidDatum, new: SbtDidDatum) -> Bool {
  and {
    old.seid_id == new.seid_id,
    old.did_uri == new.did_uri,
    old.vault_address == new.vault_address,
    old.issued_at == new.issued_at,
    old.issuer_node == new.issuer_node,
  }
}

/// Check if voting weight is within valid range (0 to basis_points_max)
pub fn is_valid_voting_weight(weight: Int) -> Bool {
  weight >= 0 && weight <= basis_points_max
}

/// Check if datum version was properly incremented
pub fn version_incremented(old: SbtDidDatum, new: SbtDidDatum) -> Bool {
  new.datum_version == old.datum_version + 1
}

/// Check if timestamp was updated (new must be >= old)
pub fn timestamp_updated(old: SbtDidDatum, new: SbtDidDatum) -> Bool {
  new.last_updated >= old.last_updated
}

// ============================================================================
// TESTS
// ============================================================================

test seid_length_constant() {
  seid_length == 28
}

test basis_points_constant() {
  basis_points_max == 10000
}

test membership_status_ordering() {
  and {
    membership_status_to_int(Active) == 0,
    membership_status_to_int(Suspended) == 1,
    membership_status_to_int(Revoked) == 2,
    membership_status_to_int(Emeritus) == 3,
  }
}

test membership_tier_ordering() {
  and {
    membership_tier_to_int(Founder) == 0,
    membership_tier_to_int(Pioneer) == 1,
    membership_tier_to_int(Steward) == 2,
    membership_tier_to_int(Member) == 3,
  }
}

test kyc_status_ordering() {
  and {
    kyc_status_to_int(Pending) == 0,
    kyc_status_to_int(Verified) == 1,
    kyc_status_to_int(Expired) == 2,
    kyc_status_to_int(Failed) == 3,
  }
}

test reference_token_label() {
  label_reference == #"000643b0"
}

test user_token_label() {
  label_user == #"000de140"
}

test make_reference_asset_name_correct() {
  let test_seid = #"0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c"
  let expected = #"000643b00102030405060708090a0b0c0d0e0f101112131415161718191a1b1c"
  make_reference_asset_name(test_seid) == expected
}

test make_user_asset_name_correct() {
  let test_seid = #"0102030405060708091011121314151617181920212223242526272829"
  let expected = #"000de1400102030405060708091011121314151617181920212223242526272829"
  make_user_asset_name(test_seid) == expected
}

test is_reference_token_true() {
  let ref_asset = #"000643b00102030405060708091011121314151617181920212223242526272829"
  is_reference_token(ref_asset)
}

test is_reference_token_false() {
  let user_asset = #"000de1400102030405060708091011121314151617181920212223242526272829"
  !is_reference_token(user_asset)
}

test is_user_token_true() {
  let user_asset = #"000de1400102030405060708091011121314151617181920212223242526272829"
  is_user_token(user_asset)
}

test is_user_token_false() {
  let ref_asset = #"000643b00102030405060708091011121314151617181920212223242526272829"
  !is_user_token(ref_asset)
}

test valid_voting_weight() {
  and {
    is_valid_voting_weight(0),
    is_valid_voting_weight(5000),
    is_valid_voting_weight(10000),
    !is_valid_voting_weight(-1),
    !is_valid_voting_weight(10001),
  }
}
