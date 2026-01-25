# C3 Alliance SBT-DID Deployment Script for PreProd
# ===================================================
# This script applies parameters to the validators and generates deployment artifacts
# Requires: aiken CLI installed and available in PATH

$ErrorActionPreference = "Stop"
$DeploymentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $DeploymentDir

Write-Host "=== C3 Alliance SBT-DID PreProd Deployment ===" -ForegroundColor Cyan
Write-Host "Project Root: $ProjectRoot"
Write-Host "Deployment Dir: $DeploymentDir"
Write-Host ""

# Check aiken is available
try {
    $aikenVersion = aiken --version
    Write-Host "Using Aiken: $aikenVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Aiken CLI not found. Please install from https://aiken-lang.org" -ForegroundColor Red
    exit 1
}

# Step 1: Lock script is already final (no params needed)
Write-Host ""
Write-Host "=== Step 1: Lock Script (No Parameters) ===" -ForegroundColor Yellow
$lockScriptHash = "eb6b64eac423fdf161a2e12dd06c3f9faa11378165bf10b1de0e3bf6"
Write-Host "Lock Script Hash: $lockScriptHash" -ForegroundColor Green

# Step 2: Apply parameters to Reference Validator
Write-Host ""
Write-Host "=== Step 2: Apply Parameters to Reference Validator ===" -ForegroundColor Yellow
Write-Host "Applying reference_params.json to sbt_did_reference.reference.spend..."

Set-Location $ProjectRoot

# Apply params - correct syntax: aiken blueprint apply -v <validator> <params_file>
aiken blueprint apply -v "sbt_did_reference.reference.spend" "$DeploymentDir\reference_params.json"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to apply parameters to reference validator" -ForegroundColor Red
    exit 1
}

# Extract new hash from the updated plutus.json
$plutusJson = Get-Content "$ProjectRoot\plutus.json" | ConvertFrom-Json
$refValidator = $plutusJson.validators | Where-Object { $_.title -eq "sbt_did_reference.reference.spend" }
$referenceValidatorHash = $refValidator.hash

Write-Host "Reference Validator Hash: $referenceValidatorHash" -ForegroundColor Green

# Step 3: Create Mint Policy parameters with the reference validator hash
Write-Host ""
Write-Host "=== Step 3: Create Mint Policy Parameters ===" -ForegroundColor Yellow

$mintParams = @{
    constructor = 0
    fields = @(
        @{
            constructor = 0
            fields = @(
                @{ int = 3 }
                @{
                    list = @(
                        @{ bytes = "9f2721060792fdfd85a2ef1484fc3930d31aaf62f85382574b9b0488" }
                        @{ bytes = "aa1689dbe15a4cf56cb41da0e1ec424067f3cd1e588d9bc2cbf0e682" }
                        @{ bytes = "91e8782dbb46b1531559302cc40cacbf38f383877ba879473441fa5d" }
                        @{ bytes = "466aa7e3d5250fac485c971771fa824175cf64fcaca8f3ff393a38a1" }
                        @{ bytes = "ac98817139c49de710106b6c10c719c74d522f0995596a6e39fd0e11" }
                    )
                }
            )
        }
        @{ bytes = $referenceValidatorHash }
        @{ bytes = $lockScriptHash }
    )
}

$mintParams | ConvertTo-Json -Depth 10 | Set-Content "$DeploymentDir\mint_params.json"
Write-Host "Created mint_params.json with reference_validator_hash: $referenceValidatorHash"

# Step 4: Apply parameters to Mint Policy
Write-Host ""
Write-Host "=== Step 4: Apply Parameters to Mint Policy ===" -ForegroundColor Yellow
Write-Host "Applying mint_params.json to sbt_did_mint.mint.mint..."

aiken blueprint apply -v "sbt_did_mint.mint.mint" "$DeploymentDir\mint_params.json"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to apply parameters to mint policy" -ForegroundColor Red
    exit 1
}

# Get final mint policy hash (this is the Policy ID)
$plutusJson = Get-Content "$ProjectRoot\plutus.json" | ConvertFrom-Json
$mintValidator = $plutusJson.validators | Where-Object { $_.title -eq "sbt_did_mint.mint.mint" }
$policyId = $mintValidator.hash

Write-Host "Mint Policy ID: $policyId" -ForegroundColor Green

# Step 5: Generate Script Addresses for PreProd
Write-Host ""
Write-Host "=== Step 5: Generate Script Addresses ===" -ForegroundColor Yellow

# Python script to generate bech32 addresses
$pythonScript = @"
import hashlib

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
    return ret

def script_hash_to_address(script_hash_hex, network="preprod"):
    script_hash_bytes = bytes.fromhex(script_hash_hex)
    header = 0x70
    hrp = "addr_test"
    addr_bytes = bytes([header]) + script_hash_bytes
    data = convertbits(list(addr_bytes), 8, 5)
    return bech32_encode(hrp, data)

lock_hash = "$lockScriptHash"
ref_hash = "$referenceValidatorHash"

print(f"LOCK_ADDR={script_hash_to_address(lock_hash)}")
print(f"REF_ADDR={script_hash_to_address(ref_hash)}")
"@

$pythonScript | python | ForEach-Object {
    if ($_ -match "^LOCK_ADDR=(.+)$") { $lockAddress = $matches[1] }
    if ($_ -match "^REF_ADDR=(.+)$") { $refAddress = $matches[1] }
}

Write-Host ""
Write-Host "=== DEPLOYMENT SUMMARY ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Network: PreProd" -ForegroundColor White
Write-Host ""
Write-Host "Script Hashes & Addresses:" -ForegroundColor Yellow
Write-Host "  Lock Script:"
Write-Host "    Hash:    $lockScriptHash"
Write-Host "    Address: $lockAddress"
Write-Host ""
Write-Host "  Reference Validator:"
Write-Host "    Hash:    $referenceValidatorHash"
Write-Host "    Address: $refAddress"
Write-Host ""
Write-Host "  Mint Policy:"
Write-Host "    Policy ID: $policyId" -ForegroundColor Magenta
Write-Host ""
Write-Host "Admin Configuration (3-of-5):" -ForegroundColor Yellow
Write-Host "  Threshold: 3"
Write-Host "  Admin 1 (Lace): 9f2721060792fdfd85a2ef1484fc3930d31aaf62f85382574b9b0488"
Write-Host "  Admin 2: aa1689dbe15a4cf56cb41da0e1ec424067f3cd1e588d9bc2cbf0e682"
Write-Host "  Admin 3: 91e8782dbb46b1531559302cc40cacbf38f383877ba879473441fa5d"
Write-Host "  Admin 4: 466aa7e3d5250fac485c971771fa824175cf64fcaca8f3ff393a38a1"
Write-Host "  Admin 5: ac98817139c49de710106b6c10c719c74d522f0995596a6e39fd0e11"
Write-Host ""

# Save deployment summary
$summary = @{
    network = "preprod"
    deployed_at = (Get-Date -Format "o")
    scripts = @{
        lock = @{
            hash = $lockScriptHash
            address = $lockAddress
            parameterized = $false
        }
        reference = @{
            hash = $referenceValidatorHash
            address = $refAddress
            parameterized = $true
        }
        mint = @{
            hash = $policyId
            policy_id = $policyId
            parameterized = $true
        }
    }
    admin_config = @{
        threshold = 3
        signatories = @(
            "9f2721060792fdfd85a2ef1484fc3930d31aaf62f85382574b9b0488"
            "aa1689dbe15a4cf56cb41da0e1ec424067f3cd1e588d9bc2cbf0e682"
            "91e8782dbb46b1531559302cc40cacbf38f383877ba879473441fa5d"
            "466aa7e3d5250fac485c971771fa824175cf64fcaca8f3ff393a38a1"
            "ac98817139c49de710106b6c10c719c74d522f0995596a6e39fd0e11"
        )
    }
    blockfrost_project_id = "preprodCU0fTLOVeFEfmoa95ESuVTAmHfmvLakS"
}

$summary | ConvertTo-Json -Depth 10 | Set-Content "$DeploymentDir\deployment_summary.json"
Write-Host "Deployment summary saved to: $DeploymentDir\deployment_summary.json" -ForegroundColor Green
Write-Host ""
Write-Host "=== Deployment Complete ===" -ForegroundColor Cyan
