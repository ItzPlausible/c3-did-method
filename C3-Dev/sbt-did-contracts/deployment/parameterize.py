"""
C3 Alliance SBT-DID Contract Parameterization Script
Applies parameters to validators and computes final script hashes.
No external dependencies beyond Python standard library + hashlib.
"""

import json
import hashlib
from pathlib import Path

def blake2b_224(data: bytes) -> bytes:
    """Blake2b-224 hash used by Cardano for script hashes"""
    return hashlib.blake2b(data, digest_size=28).digest()

def apply_parameters_to_uplc(compiled_code_hex: str, params_cbor_hex: str) -> str:
    """
    Apply parameters to a parameterized UPLC script.
    
    In Plutus/Aiken, parameterized scripts work by prepending parameters
    to the script as applied arguments. The result is: [params] [script]
    which when executed becomes: script(params)
    
    For our purposes, we need to compute the hash of the final script.
    The parameterized script = original script with params applied.
    """
    # The compiled code is the UPLC program
    # Parameters are prepended as CBOR-encoded Plutus Data
    # The final script hash is Blake2b-224 of the final CBOR
    
    # Simplified approach: concatenate params + script for hash computation
    # This is a simplification - actual parameterization is more complex
    # but for computing addresses, we need the actual deployed script bytes
    
    script_bytes = bytes.fromhex(compiled_code_hex)
    params_bytes = bytes.fromhex(params_cbor_hex)
    
    # For Plutus V3, the script envelope includes version prefix
    # The hash is computed over the entire script including parameters
    # This is a simplified model - production would use cardano-serialization-lib
    
    return compiled_code_hex  # Return original for now - see note below

def compute_script_address(script_hash_hex: str, network: str = "preprod") -> str:
    """Convert script hash to bech32 address"""
    CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"
    
    def bech32_polymod(values):
        GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3]
        chk = 1
        for v in values:
            b = chk >> 25
            chk = ((chk & 0x1ffffff) << 5) ^ v
            for i in range(5):
                chk ^= GEN[i] if ((b >> i) & 1) else 0
        return chk
    
    def bech32_hrp_expand(hrp):
        return [ord(x) >> 5 for x in hrp] + [0] + [ord(x) & 31 for x in hrp]
    
    def bech32_create_checksum(hrp, data):
        values = bech32_hrp_expand(hrp) + data
        polymod = bech32_polymod(values + [0, 0, 0, 0, 0, 0]) ^ 1
        return [(polymod >> 5 * (5 - i)) & 31 for i in range(6)]
    
    def bech32_encode(hrp, data):
        combined = data + bech32_create_checksum(hrp, data)
        return hrp + '1' + ''.join([CHARSET[d] for d in combined])
    
    def convertbits(data, frombits, tobits, pad=True):
        acc, bits, ret = 0, 0, []
        maxv = (1 << tobits) - 1
        for value in data:
            acc = (acc << frombits) | value
            bits += frombits
            while bits >= tobits:
                bits -= tobits
                ret.append((acc >> bits) & maxv)
        if pad and bits:
            ret.append((acc << (tobits - bits)) & maxv)
        return ret
    
    script_hash_bytes = bytes.fromhex(script_hash_hex)
    header = 0x70  # testnet script address, no staking
    hrp = "addr_test"
    addr_bytes = bytes([header]) + script_hash_bytes
    data = convertbits(list(addr_bytes), 8, 5)
    return bech32_encode(hrp, data)


def main():
    print("=" * 70)
    print("C3 Alliance SBT-DID PreProd Deployment")
    print("=" * 70)
    print()
    
    # Load plutus.json
    project_root = Path(__file__).parent.parent
    plutus_path = project_root / "plutus.json"
    
    with open(plutus_path, "r") as f:
        blueprint = json.load(f)
    
    # Extract validator info
    validators = {v["title"]: v for v in blueprint["validators"]}
    
    # =====================================================
    # DEPLOYMENT CONFIGURATION
    # =====================================================
    
    # Lock script (no parameters - hash is final)
    lock_hash = "eb6b64eac423fdf161a2e12dd06c3f9faa11378165bf10b1de0e3bf6"
    
    # Admin configuration (3-of-5 Pioneer multi-sig)
    admin_config = {
        "threshold": 3,
        "signatories": [
            "9f2721060792fdfd85a2ef1484fc3930d31aaf62f85382574b9b0488",  # Lace wallet
            "aa1689dbe15a4cf56cb41da0e1ec424067f3cd1e588d9bc2cbf0e682",  # Generated
            "91e8782dbb46b1531559302cc40cacbf38f383877ba879473441fa5d",  # Generated
            "466aa7e3d5250fac485c971771fa824175cf64fcaca8f3ff393a38a1",  # Generated
            "ac98817139c49de710106b6c10c719c74d522f0995596a6e39fd0e11",  # Generated
        ]
    }
    
    # Oracle config (empty for now)
    oracle_config = {"kyc_oracles": []}
    
    # Contract config (placeholders)
    contract_config = {
        "governance_contract": "0000000000000000000000000000000000000000000000000000000a",
        "patronage_contract": "0000000000000000000000000000000000000000000000000000000b"
    }
    
    # =====================================================
    # NOTE ON PARAMETERIZATION
    # =====================================================
    # 
    # Aiken's parameterization modifies the script UPLC by applying
    # the parameters. This changes the compiled code and thus the hash.
    # 
    # Since we can't easily replicate Aiken's exact parameterization
    # algorithm here, we have TWO options:
    #
    # OPTION A: Use the pre-parameterized hashes from plutus.json
    #           (These are the hashes BEFORE parameters are applied)
    #           The scripts won't work until properly parameterized.
    #
    # OPTION B: Use mesh.js, lucid, or cardano-serialization-lib
    #           in a Node.js environment to properly parameterize.
    #
    # For this deployment, we'll document the pre-param hashes and
    # provide the configuration. The actual on-chain deployment
    # should use mesh.js or similar to apply parameters correctly.
    # =====================================================
    
    # Pre-parameterization hashes (from plutus.json)
    ref_hash_pre = validators["sbt_did_reference.reference.spend"]["hash"]
    mint_hash_pre = validators["sbt_did_mint.mint.mint"]["hash"]
    
    print("SCRIPT INFORMATION (Pre-Parameterization)")
    print("-" * 70)
    print()
    print("Lock Script (No Parameters - FINAL):")
    print(f"  Hash:    {lock_hash}")
    print(f"  Address: {compute_script_address(lock_hash)}")
    print()
    print("Reference Validator (Pre-Param):")
    print(f"  Hash:    {ref_hash_pre}")
    print(f"  Address: {compute_script_address(ref_hash_pre)}")
    print()
    print("Mint Policy (Pre-Param):")
    print(f"  Hash/Policy ID: {mint_hash_pre}")
    print()
    
    print("=" * 70)
    print("DEPLOYMENT CONFIGURATION")
    print("=" * 70)
    print()
    print("Admin Multi-Sig (3-of-5):")
    print(f"  Threshold: {admin_config['threshold']}")
    for i, sig in enumerate(admin_config['signatories'], 1):
        source = "Lace Wallet" if i == 1 else "Generated Test Key"
        print(f"  Admin {i}: {sig} ({source})")
    print()
    print("Oracle Config:")
    print(f"  KYC Oracles: {oracle_config['kyc_oracles'] or '(empty)'}")
    print()
    print("Contract Config (Placeholders):")
    print(f"  Governance: {contract_config['governance_contract']}")
    print(f"  Patronage:  {contract_config['patronage_contract']}")
    print()
    print("Lock Script Hash:")
    print(f"  {lock_hash}")
    print()
    
    # =====================================================
    # SAVE DEPLOYMENT CONFIG
    # =====================================================
    
    deployment_config = {
        "network": "preprod",
        "blockfrost_project_id": "preprodCU0fTLOVeFEfmoa95ESuVTAmHfmvLakS",
        "scripts": {
            "lock": {
                "hash": lock_hash,
                "address": compute_script_address(lock_hash),
                "parameterized": False,
                "compiled_code": validators["sbt_did_lock.lock.spend"]["compiledCode"]
            },
            "reference": {
                "hash_pre_param": ref_hash_pre,
                "address_pre_param": compute_script_address(ref_hash_pre),
                "parameterized": True,
                "compiled_code": validators["sbt_did_reference.reference.spend"]["compiledCode"],
                "note": "Hash will change after parameterization"
            },
            "mint": {
                "hash_pre_param": mint_hash_pre,
                "parameterized": True,
                "compiled_code": validators["sbt_did_mint.mint.mint"]["compiledCode"],
                "note": "Policy ID will change after parameterization"
            }
        },
        "parameters": {
            "admin_config": admin_config,
            "oracle_config": oracle_config,
            "contract_config": contract_config,
            "lock_script_hash": lock_hash
        }
    }
    
    output_path = Path(__file__).parent / "deployment_config.json"
    with open(output_path, "w") as f:
        json.dump(deployment_config, f, indent=2)
    
    print("=" * 70)
    print("NEXT STEPS")
    print("=" * 70)
    print()
    print("The Aiken CLI parameterization is complex. For production deployment,")
    print("use one of these approaches:")
    print()
    print("1. mesh.js (Recommended):")
    print("   npm install @meshsdk/core")
    print("   Use applyCborParameter() to apply params")
    print()
    print("2. Lucid:")
    print("   Use applyParamsToScript() function")
    print()
    print("3. cardano-serialization-lib:")
    print("   Use apply_params_to_plutus_script()")
    print()
    print(f"Configuration saved to: {output_path}")
    print()
    print("=" * 70)


if __name__ == "__main__":
    main()
