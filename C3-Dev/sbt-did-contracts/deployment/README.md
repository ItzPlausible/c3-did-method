# C3 Alliance SBT-DID PreProd Deployment

## Quick Start

```powershell
cd D:\Claude-MCP-Files\C3-Dev\sbt-did-contracts\deployment
.\deploy-preprod.ps1
```

## Manual Steps (if script fails)

### Step 1: Lock Script (Already Final)
No parameters needed. Hash is fixed:
```
eb6b64eac423fdf161a2e12dd06c3f9faa11378165bf10b1de0e3bf6
```

### Step 2: Apply Parameters to Reference Validator
```bash
cd D:\Claude-MCP-Files\C3-Dev\sbt-did-contracts
aiken blueprint apply -v "sbt_did_reference.reference.spend" -p deployment/reference_params.json
```

After this, check `plutus.json` for the new hash under `sbt_did_reference.reference.spend`.

### Step 3: Create Mint Parameters
Copy the reference validator hash from Step 2 and update `mint_params.json`:
- Replace `REFERENCE_VALIDATOR_HASH_HERE` with the actual hash

### Step 4: Apply Parameters to Mint Policy
```bash
aiken blueprint apply -v "sbt_did_mint.mint.mint" -p deployment/mint_params.json
```

The resulting hash in `plutus.json` under `sbt_did_mint.mint.mint` is your **Policy ID**.

### Step 5: Generate Script Addresses
Use cardano-cli or this Python snippet:
```python
# Requires pycardano or manual bech32 encoding
# Script hash -> addr_test1w... (PreProd script address)
```

## Files in This Directory

| File | Description |
|------|-------------|
| `reference_params.json` | ScriptParams for reference validator |
| `mint_params.json` | MintParams for minting policy (created by script) |
| `admin_keys.json` | Test admin keys (2-5) for PreProd multi-sig |
| `deploy-preprod.ps1` | Automated deployment script |
| `deployment_summary.json` | Final deployment info (created by script) |

## Admin Multi-Sig Configuration

| Admin | PKH | Source |
|-------|-----|--------|
| 1 | `9f2721060792fdfd85a2ef1484fc3930d31aaf62f85382574b9b0488` | Lace Wallet |
| 2 | `aa1689dbe15a4cf56cb41da0e1ec424067f3cd1e588d9bc2cbf0e682` | Generated |
| 3 | `91e8782dbb46b1531559302cc40cacbf38f383877ba879473441fa5d` | Generated |
| 4 | `466aa7e3d5250fac485c971771fa824175cf64fcaca8f3ff393a38a1` | Generated |
| 5 | `ac98817139c49de710106b6c10c719c74d522f0995596a6e39fd0e11` | Generated |

**Threshold:** 3 of 5 signatures required

## Blockfrost

- **Project ID:** `preprodCU0fTLOVeFEfmoa95ESuVTAmHfmvLakS`
- **Network:** PreProd

## ⚠️ Important Notes

1. **Test Keys Only** - Admin keys 2-5 are for PreProd testing only. Never use on mainnet.
2. **Placeholder Contracts** - `governance_contract` and `patronage_contract` use placeholder hashes.
3. **Empty KYC Oracles** - `kyc_oracles` list is empty; add oracle PKHs when ready.
