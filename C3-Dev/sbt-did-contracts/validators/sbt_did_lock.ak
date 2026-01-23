//// SBT-DID Soulbound Lock Validator
//// =================================
//// An impossible-to-spend script that permanently locks the user token.
//// This enforces the soulbound property of the SBT-DID credentials.
////
//// IMPORTANT: Tokens sent to this script's address can NEVER be recovered.
//// This validator ALWAYS returns False, making any UTXO at this address
//// permanently locked on-chain.
////
//// Validator: c3_alliance/sbt_did/lock

use cardano/transaction.{Transaction, OutputReference}

use types.{LockAction, AttemptUnlock}

// ============================================================================
// MAIN VALIDATOR
// ============================================================================

/// Soulbound Lock Validator
///
/// This validator has a single purpose: to ALWAYS fail.
/// Any UTXO sent to this script address is permanently locked.
validator lock {
  spend(
    _datum: Option<Data>,
    redeemer: LockAction,
    _own_ref: OutputReference,
    _tx: Transaction,
  ) {
    when redeemer is {
      AttemptUnlock -> {
        trace @"SBT-DID user tokens are permanently soulbound and cannot be unlocked"
        fail @"Soulbound tokens cannot be spent"
      }
    }
  }
  
  else(_) {
    fail @"Invalid purpose for lock script"
  }
}

// ============================================================================
// TESTS
// ============================================================================

test lock_always_fails() {
  True
}