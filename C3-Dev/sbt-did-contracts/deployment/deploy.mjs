/**
 * C3 Alliance SBT-DID Contract Deployment Script
 * Uses mesh.js to apply parameters and compute final script hashes
 * 
 * Run: npm install && npm run deploy
 */

import { 
  applyParamsToScript, 
  resolveScriptHash,
  serializePlutusScript
} from '@meshsdk/core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
// CONFIGURATION
// =====================================================

const NETWORK = 'preprod';
const BLOCKFROST_PROJECT_ID = 'preprodCU0fTLOVeFEfmoa95ESuVTAmHfmvLakS';

// Lock script hash (no parameters - already final)
const LOCK_SCRIPT_HASH = 'eb6b64eac423fdf161a2e12dd06c3f9faa11378165bf10b1de0e3bf6';

// Admin configuration (3-of-5 Pioneer multi-sig)
const ADMIN_CONFIG = {
  threshold: 3,
  signatories: [
    '9f2721060792fdfd85a2ef1484fc3930d31aaf62f85382574b9b0488',  // Lace wallet
    'aa1689dbe15a4cf56cb41da0e1ec424067f3cd1e588d9bc2cbf0e682',  // Generated
    '91e8782dbb46b1531559302cc40cacbf38f383877ba879473441fa5d',  // Generated
    '466aa7e3d5250fac485c971771fa824175cf64fcaca8f3ff393a38a1',  // Generated
    'ac98817139c49de710106b6c10c719c74d522f0995596a6e39fd0e11',  // Generated
  ]
};

// Oracle config (empty for now)
const ORACLE_CONFIG = {
  kyc_oracles: []
};

// Contract config (placeholders)
const CONTRACT_CONFIG = {
  governance_contract: '0000000000000000000000000000000000000000000000000000000a',
  patronage_contract: '0000000000000000000000000000000000000000000000000000000b'
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function scriptHashToAddress(scriptHash, network = 'preprod') {
  const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
  
  function bech32Polymod(values) {
    const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
    let chk = 1;
    for (const v of values) {
      const b = chk >> 25;
      chk = ((chk & 0x1ffffff) << 5) ^ v;
      for (let i = 0; i < 5; i++) {
        chk ^= (b >> i) & 1 ? GEN[i] : 0;
      }
    }
    return chk;
  }
  
  function bech32HrpExpand(hrp) {
    const ret = [];
    for (const c of hrp) ret.push(c.charCodeAt(0) >> 5);
    ret.push(0);
    for (const c of hrp) ret.push(c.charCodeAt(0) & 31);
    return ret;
  }
  
  function bech32CreateChecksum(hrp, data) {
    const values = bech32HrpExpand(hrp).concat(data).concat([0, 0, 0, 0, 0, 0]);
    const polymod = bech32Polymod(values) ^ 1;
    return Array.from({length: 6}, (_, i) => (polymod >> 5 * (5 - i)) & 31);
  }
  
  function bech32Encode(hrp, data) {
    const combined = data.concat(bech32CreateChecksum(hrp, data));
    return hrp + '1' + combined.map(d => CHARSET[d]).join('');
  }
  
  function convertBits(data, fromBits, toBits, pad = true) {
    let acc = 0, bits = 0;
    const ret = [];
    const maxv = (1 << toBits) - 1;
    for (const value of data) {
      acc = (acc << fromBits) | value;
      bits += fromBits;
      while (bits >= toBits) {
        bits -= toBits;
        ret.push((acc >> bits) & maxv);
      }
    }
    if (pad && bits) ret.push((acc << (toBits - bits)) & maxv);
    return ret;
  }
  
  const scriptHashBytes = Buffer.from(scriptHash, 'hex');
  const header = 0x70; // testnet script address
  const hrp = 'addr_test';
  const addrBytes = Buffer.concat([Buffer.from([header]), scriptHashBytes]);
  const data = convertBits([...addrBytes], 8, 5);
  return bech32Encode(hrp, data);
}

// =====================================================
// MAIN DEPLOYMENT
// =====================================================

async function main() {
  console.log('='.repeat(70));
  console.log('C3 Alliance SBT-DID PreProd Deployment');
  console.log('='.repeat(70));
  console.log();

  // Load plutus.json
  const plutusPath = path.join(__dirname, '..', 'plutus.json');
  const blueprint = JSON.parse(fs.readFileSync(plutusPath, 'utf8'));
  
  // Extract validators
  const validators = {};
  for (const v of blueprint.validators) {
    validators[v.title] = v;
  }
  
  // Get compiled code
  const refCompiledCode = validators['sbt_did_reference.reference.spend'].compiledCode;
  const mintCompiledCode = validators['sbt_did_mint.mint.mint'].compiledCode;
  const lockCompiledCode = validators['sbt_did_lock.lock.spend'].compiledCode;
  
  console.log('Step 1: Lock Script (No Parameters)');
  console.log('-'.repeat(70));
  console.log(`  Hash:    ${LOCK_SCRIPT_HASH}`);
  console.log(`  Address: ${scriptHashToAddress(LOCK_SCRIPT_HASH)}`);
  console.log();

  // =====================================================
  // Step 2: Apply parameters to Reference Validator
  // =====================================================
  console.log('Step 2: Parameterize Reference Validator');
  console.log('-'.repeat(70));
  
  // ScriptParams structure for reference validator:
  // constructor 0: [admin_config, oracle_config, contract_config, reference_validator_hash, lock_script_hash]
  // 
  // For the reference validator, reference_validator_hash is a placeholder (self-reference issue)
  // We use zeros as placeholder
  
  const refParams = [
    // admin_config: constructor 0 [threshold, signatories]
    {
      alternative: 0,
      fields: [
        ADMIN_CONFIG.threshold,
        ADMIN_CONFIG.signatories.map(s => s)  // List of byte strings
      ]
    },
    // oracle_config: constructor 0 [kyc_oracles]
    {
      alternative: 0,
      fields: [
        ORACLE_CONFIG.kyc_oracles
      ]
    },
    // contract_config: constructor 0 [governance_contract, patronage_contract]
    {
      alternative: 0,
      fields: [
        CONTRACT_CONFIG.governance_contract,
        CONTRACT_CONFIG.patronage_contract
      ]
    },
    // reference_validator_hash (placeholder - zeros)
    '00000000000000000000000000000000000000000000000000000000',
    // lock_script_hash
    LOCK_SCRIPT_HASH
  ];
  
  try {
    // Apply parameters to reference validator
    const parameterizedRefScript = applyParamsToScript(refCompiledCode, refParams, 'JSON');
    const refScriptHash = resolveScriptHash(parameterizedRefScript, 'V3');
    
    console.log(`  Parameterized Hash: ${refScriptHash}`);
    console.log(`  Address: ${scriptHashToAddress(refScriptHash)}`);
    console.log();
    
    // =====================================================
    // Step 3: Apply parameters to Mint Policy
    // =====================================================
    console.log('Step 3: Parameterize Mint Policy');
    console.log('-'.repeat(70));
    
    // MintParams structure:
    // constructor 0: [admin_config, reference_validator_hash, lock_script_hash]
    
    const mintParams = [
      // admin_config
      {
        alternative: 0,
        fields: [
          ADMIN_CONFIG.threshold,
          ADMIN_CONFIG.signatories.map(s => s)
        ]
      },
      // reference_validator_hash (from step 2)
      refScriptHash,
      // lock_script_hash
      LOCK_SCRIPT_HASH
    ];
    
    const parameterizedMintScript = applyParamsToScript(mintCompiledCode, mintParams, 'JSON');
    const mintPolicyId = resolveScriptHash(parameterizedMintScript, 'V3');
    
    console.log(`  Policy ID: ${mintPolicyId}`);
    console.log();
    
    // =====================================================
    // DEPLOYMENT SUMMARY
    // =====================================================
    console.log('='.repeat(70));
    console.log('DEPLOYMENT SUMMARY');
    console.log('='.repeat(70));
    console.log();
    console.log('Network: PreProd');
    console.log();
    console.log('Script Hashes & Addresses:');
    console.log(`  Lock Script:`);
    console.log(`    Hash:    ${LOCK_SCRIPT_HASH}`);
    console.log(`    Address: ${scriptHashToAddress(LOCK_SCRIPT_HASH)}`);
    console.log();
    console.log(`  Reference Validator:`);
    console.log(`    Hash:    ${refScriptHash}`);
    console.log(`    Address: ${scriptHashToAddress(refScriptHash)}`);
    console.log();
    console.log(`  Mint Policy:`);
    console.log(`    Policy ID: ${mintPolicyId}`);
    console.log();
    console.log('Admin Configuration (3-of-5):');
    console.log(`  Threshold: ${ADMIN_CONFIG.threshold}`);
    ADMIN_CONFIG.signatories.forEach((sig, i) => {
      const source = i === 0 ? 'Lace Wallet' : 'Generated';
      console.log(`  Admin ${i + 1}: ${sig} (${source})`);
    });
    console.log();
    
    // Save deployment summary
    const summary = {
      network: NETWORK,
      deployed_at: new Date().toISOString(),
      blockfrost_project_id: BLOCKFROST_PROJECT_ID,
      scripts: {
        lock: {
          hash: LOCK_SCRIPT_HASH,
          address: scriptHashToAddress(LOCK_SCRIPT_HASH),
          compiled_code: lockCompiledCode
        },
        reference: {
          hash: refScriptHash,
          address: scriptHashToAddress(refScriptHash),
          compiled_code: parameterizedRefScript
        },
        mint: {
          policy_id: mintPolicyId,
          compiled_code: parameterizedMintScript
        }
      },
      admin_config: ADMIN_CONFIG,
      oracle_config: ORACLE_CONFIG,
      contract_config: CONTRACT_CONFIG
    };
    
    const summaryPath = path.join(__dirname, 'deployment_summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`Deployment summary saved to: ${summaryPath}`);
    console.log();
    console.log('='.repeat(70));
    console.log('DEPLOYMENT COMPLETE');
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('Error during parameterization:', error);
    console.log();
    console.log('If mesh.js parameterization fails, try using lucid or aiken directly.');
  }
}

main().catch(console.error);
