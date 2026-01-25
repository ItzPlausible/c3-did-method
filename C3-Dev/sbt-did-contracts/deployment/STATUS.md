# C3 Alliance SBT-DID Deployment Status

## Current State

You have successfully compiled Aiken contracts. The parameterization step (applying admin keys, etc.) is hitting CLI issues.

## What You Have (READY TO USE)

### Lock Script (FINAL - No Parameters Needed)
```
Hash:    eb6b64eac423fdf161a2e12dd06c3f9faa11378165bf10b1de0e3bf6
Address: addr_test1wr4kke82cs3lmutp5tsjm5rv87065yfhs9jm7y93mc8rhasj0d33y
```

### Admin Keys (3-of-5 Multi-Sig)
| # | PKH | Source |
|---|-----|--------|
| 1 | `9f2721060792fdfd85a2ef1484fc3930d31aaf62f85382574b9b0488` | Your Lace Wallet |
| 2 | `aa1689dbe15a4cf56cb41da0e1ec424067f3cd1e588d9bc2cbf0e682` | Generated (keys in admin_keys.json) |
| 3 | `91e8782dbb46b1531559302cc40cacbf38f383877ba879473441fa5d` | Generated |
| 4 | `466aa7e3d5250fac485c971771fa824175cf64fcaca8f3ff393a38a1` | Generated |
| 5 | `ac98817139c49de710106b6c10c719c74d522f0995596a6e39fd0e11` | Generated |

### Pre-Parameterized Hashes (from plutus.json)
These will CHANGE after parameterization:
- Reference Validator: `c7258d2557347d568bc035f8460a344838a7266997cbf52c99accd75`
- Mint Policy: `33610abecddb9fa2836e995e476c4006624f893fedf697f704230dc1`

## Quick Option: Use mesh.js

```powershell
cd D:\Claude-MCP-Files\C3-Dev\sbt-did-contracts\deployment
npm install
npm run deploy
```

This will:
1. Apply parameters to reference validator
2. Apply parameters to mint policy  
3. Output final hashes and addresses
4. Save everything to deployment_summary.json

## Alternative: Use Lucid (TypeScript)

If mesh.js doesn't work, Lucid is another option:
```typescript
import { Lucid, applyParamsToScript } from "lucid-cardano";
// Apply params similarly
```

## Files Created

| File | Purpose |
|------|---------|
| `admin_keys.json` | Test admin keys 2-5 with signing keys |
| `reference_params.json` | Parameters in Plutus Data JSON format |
| `deploy.mjs` | mesh.js deployment script |
| `package.json` | Node.js dependencies |

## Blockfrost

- **PreProd Project ID:** `preprodCU0fTLOVeFEfmoa95ESuVTAmHfmvLakS`

## Next Steps After Parameterization

Once you have the final Policy ID:
1. Create minting transaction using Blockfrost + mesh.js or lucid
2. Mint first test SBT-DID to your Lace wallet
3. Verify tokens appear correctly

---

The contracts are compiled and ready. The parameterization is just a tooling hurdle - mesh.js should handle it cleanly.
