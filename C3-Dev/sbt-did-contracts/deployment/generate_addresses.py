"""
C3 Alliance SBT-DID Address Generator
Generates Cardano script addresses from script hashes for PreProd testnet.
"""

import hashlib
import json
import sys

# Bech32 encoding
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
    acc = 0
    bits = 0
    ret = []
    maxv = (1 << tobits) - 1
    for value in data:
        acc = (acc << frombits) | value
        bits += frombits
        while bits >= tobits:
            bits -= tobits
            ret.append((acc >> bits) & maxv)
    if pad:
        if bits:
            ret.append((acc << (tobits - bits)) & maxv)
    elif bits >= frombits or ((acc << (tobits - bits)) & maxv):
        return None
    return ret

def script_hash_to_address(script_hash_hex: str, network: str = "preprod") -> str:
    """
    Convert a script hash to a Cardano script address.
    
    For script addresses (type 7 on testnet):
    Header byte = 0x70 (script payment credential, no staking credential, testnet)
    
    Args:
        script_hash_hex: 28-byte script hash in hex (56 chars)
        network: "preprod" or "mainnet"
    
    Returns:
        Bech32-encoded address (addr_test1w... for testnet)
    """
    if len(script_hash_hex) != 56:
        raise ValueError(f"Script hash must be 56 hex chars (28 bytes), got {len(script_hash_hex)}")
    
    script_hash_bytes = bytes.fromhex(script_hash_hex)
    
    # Header byte: 0x70 for testnet script address (no staking credential)
    # 0x71 would include a staking credential
    if network == "preprod":
        header = 0x70  # testnet, script payment, no stake
        hrp = "addr_test"
    else:
        header = 0x71  # mainnet, script payment, no stake (actually 0x61 for enterprise)
        # Actually mainnet enterprise script = 0x70 would be wrong
        # Mainnet script (no stake) = 0x71? No...
        # Let me check: 
        # Type 6 (enterprise key): 0110 xxxx -> 0x60 (mainnet) or 0x70 (testnet)? 
        # Actually: header = (type << 4) | network
        # Type 7 = script payment, no stake = 0111 -> 0x70 testnet, 0x71 mainnet
        # Hmm, let me recalculate
        # Enterprise addresses (no staking): type 6 for key, type 7 for script
        # 0110 = 6, 0111 = 7
        # Network: 0 = testnet, 1 = mainnet
        # So script enterprise testnet = 0111 0000 = 0x70
        # Script enterprise mainnet = 0111 0001 = 0x71
        header = 0x71
        hrp = "addr"
    
    # Build address bytes
    addr_bytes = bytes([header]) + script_hash_bytes
    
    # Convert to 5-bit groups for bech32
    data = convertbits(list(addr_bytes), 8, 5)
    
    return bech32_encode(hrp, data)


def main():
    print("=" * 60)
    print("C3 Alliance SBT-DID Script Address Generator")
    print("=" * 60)
    print()
    
    # Known hashes
    lock_hash = "eb6b64eac423fdf161a2e12dd06c3f9faa11378165bf10b1de0e3bf6"
    
    # Try to read deployment summary if it exists
    try:
        with open("deployment_summary.json", "r") as f:
            summary = json.load(f)
            ref_hash = summary["scripts"]["reference"]["hash"]
            mint_hash = summary["scripts"]["mint"]["hash"]
    except FileNotFoundError:
        print("deployment_summary.json not found.")
        print("Please run deploy-preprod.ps1 first, or enter hashes manually:")
        print()
        ref_hash = input("Reference Validator Hash (or press Enter to skip): ").strip()
        mint_hash = input("Mint Policy Hash/Policy ID (or press Enter to skip): ").strip()
    
    print()
    print("PreProd Script Addresses:")
    print("-" * 60)
    
    # Lock script address
    lock_addr = script_hash_to_address(lock_hash, "preprod")
    print(f"Lock Script:")
    print(f"  Hash:    {lock_hash}")
    print(f"  Address: {lock_addr}")
    print()
    
    # Reference validator address
    if ref_hash and len(ref_hash) == 56:
        ref_addr = script_hash_to_address(ref_hash, "preprod")
        print(f"Reference Validator:")
        print(f"  Hash:    {ref_hash}")
        print(f"  Address: {ref_addr}")
        print()
    
    # Mint policy (note: minting policies don't have addresses, just policy IDs)
    if mint_hash and len(mint_hash) == 56:
        print(f"Mint Policy:")
        print(f"  Policy ID: {mint_hash}")
        print(f"  (Minting policies don't have addresses)")
        print()
    
    print("-" * 60)
    print()
    print("Token Asset Names:")
    print("  Reference Token: 'C3_REF_' + SEID (hex)")
    print("  User Token:      'C3_SBT_' + SEID (hex)")
    print()
    
    # Save addresses to file
    output = {
        "network": "preprod",
        "lock_script": {
            "hash": lock_hash,
            "address": lock_addr
        }
    }
    
    if ref_hash and len(ref_hash) == 56:
        output["reference_validator"] = {
            "hash": ref_hash,
            "address": script_hash_to_address(ref_hash, "preprod")
        }
    
    if mint_hash and len(mint_hash) == 56:
        output["mint_policy"] = {
            "policy_id": mint_hash
        }
    
    with open("script_addresses.json", "w") as f:
        json.dump(output, f, indent=2)
    
    print("Saved to: script_addresses.json")


if __name__ == "__main__":
    main()
