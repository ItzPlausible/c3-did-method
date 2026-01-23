# SBT-DID Smart Contracts for C3 Alliance

> Soulbound Token - Decentralized Identifier (SBT-DID) implementation on Cardano using Aiken.
> Part of the Cosmic Commons Cooperative Alliance (C3 Alliance) SEID Infrastructure.

## Overview

This project implements CIP-68 compliant soulbound tokens that anchor member identity on-chain for the C3 Alliance cooperative. Each SBT-DID consists of:

- **Reference Token (100)**: Held at a script address, contains mutable membership datum
- **User Token (222)**: Held in member's Vault (Lace wallet), proves membership ownership
- **Soulbound Lock**: Optional lock script for permanently non-transferable credentials

## Project Structure

```
sbt-did-contracts/
├── aiken.toml              # Project configuration
├── lib/
│   ├── types.ak            # Datum schema, enums, redeemers
│   └── validation.ak       # Authorization and validation helpers
├── validators/
│   ├── sbt_did_mint.ak     # Minting policy (pair minting, admin auth)
│   ├── sbt_did_reference.ak # Reference token spending (datum updates)
│   └── sbt_did_lock.ak     # Soulbound lock (impossible to spend)
└── README.md
```

## Prerequisites

### Install Aiken

```bash
# Using the official installer
curl -sSfL https://install.aiken-lang.org | bash

# Or via cargo
cargo install aiken --version 1.1.9

# Verify installation
aiken --version
```

### Additional Tools

- **Blockfrost** or **Ogmios** for transaction submission
- **Lace Wallet** or other CIP-30 compatible wallet
- **cardano-cli** (optional, for manual transaction building)

## Building

```bash
# Navigate to project directory
cd sbt-did-contracts

# Build all validators
aiken build

# Run tests
aiken check

# Generate documentation
aiken docs
```

### Build Output

After building, compiled validators will be in `plutus.json`:

```json
{
  "validators": [
    {
      "title": "mint.mint",
      "hash": "...",
      "compiledCode": "..."
    },
    {
      "title": "reference.spend", 
      "hash": "...",
      "compiledCode": "..."
    },
    {
      "title": "lock.spend",
      "hash": "...",
      "compiledCode": "..."
    }
  ]
}
```

## Configuration

### Admin Multi-sig Setup

Before deployment, update `aiken.toml` with actual admin public key hashes:

```toml
[config.admin]
threshold = 3  # 3-of-5 during Pioneer phase
signatories = [
  "actual_admin_pkh_1_28_bytes_hex",
  "actual_admin_pkh_2_28_bytes_hex",
  "actual_admin_pkh_3_28_bytes_hex",
  "actual_admin_pkh_4_28_bytes_hex",
  "actual_admin_pkh_5_28_bytes_hex",
]
```

### Derive Admin PKH from Address

```bash
# Using cardano-cli
cardano-cli address key-hash --payment-verification-key-file admin1.vkey

# Or extract from bech32 address
echo "addr_test1qz..." | cardano-address address inspect | jq -r '.spending_key_hash'
```

## Deployment

### Step 1: Deploy Lock Script

The lock script has no parameters, deploy it first:

```bash
# Generate script address
aiken blueprint apply -o lock.plutus \
  --validator lock.spend

# Derive address
cardano-cli address build \
  --payment-script-file lock.plutus \
  --testnet-magic 2 \
  --out-file lock.addr
```

### Step 2: Deploy Reference Validator

The reference validator requires script parameters:

```bash
# Apply parameters
aiken blueprint apply -o reference.plutus \
  --validator reference.spend \
  --param "{ admin_config: { threshold: 3, signatories: [...] }, ... }"

# Derive address  
cardano-cli address build \
  --payment-script-file reference.plutus \
  --testnet-magic 2 \
  --out-file reference.addr
```

### Step 3: Deploy Minting Policy

The minting policy references the other validators:

```bash
# Apply parameters (includes reference validator hash and lock script hash)
aiken blueprint apply -o mint.plutus \
  --validator mint.mint \
  --param "{ admin_config: {...}, reference_validator_hash: \"...\", lock_script_hash: \"...\" }"

# Get policy ID
cardano-cli transaction policyid --script-file mint.plutus
```

## Usage

### Minting a New SBT-DID

Transaction structure:
```
Inputs:
  - Admin UTxO 1 (must sign)
  - Admin UTxO 2 (must sign)  
  - Admin UTxO 3 (must sign)
  - Fee input

Outputs:
  - Reference Token → Reference Validator Address (with SbtDidDatum)
  - User Token → Member's Vault Address
  - Change

Mint:
  - 1x Reference Token (000643b0 + seid_id)
  - 1x User Token (000de140 + seid_id)
  
Redeemer:
  MintSbtDid { seid_id, vault_address }
```

### Updating Member Datum

Transaction structure:
```
Inputs:
  - Reference Token UTxO (at reference validator)
  - Authorized Party Input (admin/member/oracle/contract)
  - Fee input

Outputs:
  - Reference Token → Same Reference Validator Address (with updated datum)
  - Change

Redeemer:
  UpdateStatus { new_status: Suspended }
  -- or --
  UpdateKyc { kyc_status: Verified, provider_hash: "...", expiry: Some(1735689600000) }
  -- etc.
```

### Making Token Soulbound

Send the user token to the lock script address:

```
Inputs:
  - User Token UTxO (in member's wallet)
  - Fee input

Outputs:
  - User Token → Lock Validator Address
  - Change
```

⚠️ **WARNING**: This is irreversible. The user token will be permanently locked.

## Authorization Matrix

| Field | Member | Admin | KYC Oracle | Governance | Patronage |
|-------|:------:|:-----:|:----------:|:----------:|:---------:|
| `status` | ❌ | ✅ | ❌ | ❌ | ❌ |
| `tier` | ❌ | ✅ | ❌ | ✅ | ❌ |
| `kyc_*` fields | ❌ | ✅ | ✅ | ❌ | ❌ |
| `accredited_*` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `node_affiliation` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `patronage_epoch` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `voting_weight` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `steward_roles` | ❌ | ❌ | ❌ | ✅ | ❌ |
| `delegation_to` | ✅ | ❌ | ❌ | ✅ | ❌ |

## Testing

### Run Unit Tests

```bash
aiken check
```

### Manual Testing on Preview

1. Get test ADA from [Cardano Testnet Faucet](https://docs.cardano.org/cardano-testnet/tools/faucet/)
2. Deploy contracts to Preview testnet
3. Use Lucid or cardano-cli to build and submit transactions

### Example Lucid Test Script

```typescript
import { Lucid, Blockfrost } from "lucid-cardano";

const lucid = await Lucid.new(
  new Blockfrost("https://cardano-preview.blockfrost.io/api/v0", "<project_id>"),
  "Preview"
);

// Load wallet
lucid.selectWalletFromPrivateKey(privateKey);

// Build mint transaction
const tx = await lucid
  .newTx()
  .mintAssets({
    [policyId + refAssetName]: 1n,
    [policyId + userAssetName]: 1n,
  }, Data.to(mintRedeemer))
  .payToContract(referenceAddr, { inline: datumCbor }, { [policyId + refAssetName]: 1n })
  .payToAddress(vaultAddr, { [policyId + userAssetName]: 1n })
  .addSignerKey(admin1Pkh)
  .addSignerKey(admin2Pkh)
  .addSignerKey(admin3Pkh)
  .attachMintingPolicy(mintPolicy)
  .complete();
```

## Security Considerations

### Immutable Identity Fields

The following fields can NEVER be changed after minting:
- `seid_id`
- `did_uri`
- `vault_address`
- `issued_at`
- `issuer_node`

Any transaction attempting to modify these fields will fail.

### Soulbound Enforcement

- User tokens sent to the lock script are **permanently** locked
- There is no admin override for the lock script
- This is intentional - true soulbound behavior

### Multi-sig Security

- During Pioneer phase: 3-of-5 admin signatures required
- Admin keys should be:
  - Stored in hardware wallets
  - Geographically distributed
  - Held by trusted stewards
  
## Roadmap

- [x] Phase 1: Core SBT-DID contracts
- [ ] Phase 2: KYC Oracle integration
- [ ] Phase 3: Governance contract hooks
- [ ] Phase 4: Patronage contract integration
- [ ] Phase 5: Council transition (M-of-N upgrade)

## License

Apache-2.0

## Contact

Plausible Potentials Consulting DAO LLC  
Managing Director: JW  
Part of the C3 Alliance (Cosmic Commons Cooperative Alliance)

---

*"I coordinate conatus cultivation"* — JW's 2026 Mission
