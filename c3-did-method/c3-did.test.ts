/**
 * C3 DID Method — Reference Implementation Test Suite
 * 
 * Run: npx ts-node test/c3-did.test.ts
 * Or with a test runner: npx jest test/c3-did.test.ts
 */

import {
  generateSEID,
  generateEntityHash,
  parseDID,
  hashProvenanceDocument,
  isBase58,
  isValidHex,
  hexToBytes,
  bytesToHex,
  generateEntityBatch,
} from '../src/c3-did';

// Simple test runner (no external dependency needed)
let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

function assertThrows(fn: () => void, message: string): void {
  try {
    fn();
    console.error(`  ✗ FAIL (no throw): ${message}`);
    failed++;
  } catch {
    console.log(`  ✓ ${message}`);
    passed++;
  }
}

// ─── Test Data ───────────────────────────────────────────────────────────────

const VALID_POLICY_ID = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4';
const VALID_ASSET_NAME = '536f756c426f756e64546f6b656e';
const VALID_TX_HASH = 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789';
const VALID_PROV_HASH = 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';

// ─── Tests ───────────────────────────────────────────────────────────────────

console.log('\n═══ C3 DID Method — Test Suite ═══\n');

// --- Utility Tests ---
console.log('── Utility Functions ──');

assert(isBase58('123ABCabc'), 'Base58 valid chars accepted');
assert(!isBase58('0OIl'), 'Base58 rejects 0, O, I, l');
assert(!isBase58('hello world'), 'Base58 rejects spaces');
assert(isValidHex('abcdef0123456789'), 'Valid hex accepted');
assert(!isValidHex('xyz'), 'Invalid hex rejected');
assert(!isValidHex('abc'), 'Odd-length hex rejected');

const bytes = hexToBytes('deadbeef');
assert(bytes.length === 4, 'hexToBytes correct length');
assert(bytes[0] === 0xde, 'hexToBytes correct first byte');
assert(bytesToHex(bytes) === 'deadbeef', 'bytesToHex roundtrip');

// --- SEID Generation Tests ---
console.log('\n── SEID Generation ──');

const seid1 = generateSEID(VALID_POLICY_ID, VALID_ASSET_NAME);
assert(seid1.seid.length === 40, 'SEID is exactly 40 characters');
assert(isBase58(seid1.seid), 'SEID contains only Base58 characters');
assert(seid1.policyId === VALID_POLICY_ID, 'SEID preserves policyId input');
assert(seid1.assetName === VALID_ASSET_NAME, 'SEID preserves assetName input');
assert(seid1.fullDigestHex.length === 128, 'Full digest is 64 bytes (128 hex chars)');

// Determinism: same inputs → same SEID
const seid2 = generateSEID(VALID_POLICY_ID, VALID_ASSET_NAME);
assert(seid1.seid === seid2.seid, 'SEID generation is deterministic');

// Different inputs → different SEID
const seid3 = generateSEID(
  'ffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  VALID_ASSET_NAME
);
assert(seid1.seid !== seid3.seid, 'Different policyId → different SEID');

const seid4 = generateSEID(VALID_POLICY_ID, 'ff');
assert(seid1.seid !== seid4.seid, 'Different assetName → different SEID');

// Error cases
assertThrows(
  () => generateSEID('short', VALID_ASSET_NAME),
  'Rejects short policyId'
);
assertThrows(
  () => generateSEID('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ', VALID_ASSET_NAME),
  'Rejects non-hex policyId'
);
assertThrows(
  () => generateSEID(VALID_POLICY_ID, 'xyz'),
  'Rejects non-hex assetName'
);

// --- Entity Hash Generation Tests ---
console.log('\n── Entity Hash Generation ──');

const entity1 = generateEntityHash('T', VALID_TX_HASH, VALID_PROV_HASH, seid1.seid);
assert(entity1.entityHash.length === 33, 'Entity hash is 33 chars (prefix + 32)');
assert(entity1.prefix === 'T', 'Entity prefix is T');
assert(entity1.entityHash[0] === 'T', 'Entity hash starts with prefix');
assert(entity1.hashPortion.length === 32, 'Hash portion is 32 chars');
assert(isBase58(entity1.hashPortion), 'Hash portion is Base58');
assert(entity1.did.startsWith('did:c3:'), 'DID starts with did:c3:');
assert(entity1.did.includes(':@T'), 'DID contains :@T separator');

// All three prefixes work
const personaEntity = generateEntityHash('P', VALID_TX_HASH, VALID_PROV_HASH, seid1.seid);
assert(personaEntity.prefix === 'P', '@P prefix accepted');
assert(personaEntity.entityHash[0] === 'P', '@P hash starts with P');

const dacoEntity = generateEntityHash('D', VALID_TX_HASH, VALID_PROV_HASH, seid1.seid);
assert(dacoEntity.prefix === 'D', '@D prefix accepted');
assert(dacoEntity.entityHash[0] === 'D', '@D hash starts with D');

// Same SEID in all three DIDs
assert(personaEntity.did.includes(seid1.seid), '@P DID contains correct SEID');
assert(dacoEntity.did.includes(seid1.seid), '@D DID contains correct SEID');
assert(entity1.did.includes(seid1.seid), '@T DID contains correct SEID');

// Different prefixes → different entity hashes
assert(personaEntity.entityHash !== dacoEntity.entityHash, '@P ≠ @D entity hash');
assert(dacoEntity.entityHash !== entity1.entityHash, '@D ≠ @T entity hash');
assert(personaEntity.entityHash !== entity1.entityHash, '@P ≠ @T entity hash');

// Determinism
const entity2 = generateEntityHash('T', VALID_TX_HASH, VALID_PROV_HASH, seid1.seid);
assert(entity1.entityHash === entity2.entityHash, 'Entity hash generation is deterministic');

// Error cases
assertThrows(
  () => generateEntityHash('X', VALID_TX_HASH, VALID_PROV_HASH, seid1.seid),
  'Rejects invalid entity prefix'
);
assertThrows(
  () => generateEntityHash('T', 'short', VALID_PROV_HASH, seid1.seid),
  'Rejects short tx hash'
);
assertThrows(
  () => generateEntityHash('T', VALID_TX_HASH, 'short', seid1.seid),
  'Rejects short provenance hash'
);
assertThrows(
  () => generateEntityHash('T', VALID_TX_HASH, VALID_PROV_HASH, 'short'),
  'Rejects short SEID'
);

// --- DID Parsing Tests ---
console.log('\n── DID Parsing ──');

const parsed1 = parseDID(entity1.did);
assert(parsed1.isValid, 'Valid DID parses successfully');
assert(parsed1.method === 'c3', 'Method is c3');
assert(parsed1.seid === seid1.seid, 'Parsed SEID matches');
assert(parsed1.entityPrefix === 'T', 'Parsed prefix is T');
assert(parsed1.entityHash === entity1.hashPortion, 'Parsed entity hash matches');

// Invalid DIDs
assert(!parseDID('did:web:example.com').isValid, 'Rejects non-c3 DID');
assert(!parseDID('did:c3:short:@Tabc').isValid, 'Rejects short SEID');
assert(!parseDID('did:c3:' + seid1.seid + ':@Xbad').isValid, 'Rejects invalid prefix');
assert(!parseDID('not-a-did').isValid, 'Rejects non-DID string');
assert(!parseDID('did:c3:' + seid1.seid).isValid, 'Rejects DID without entity segment');

// Roundtrip: generate → parse → verify
const roundtrip = parseDID(entity1.did);
const reconstructed = `did:c3:${roundtrip.seid}:@${roundtrip.entityPrefix}${roundtrip.entityHash}`;
assert(reconstructed === entity1.did, 'Parse → reconstruct roundtrip matches');

// --- Provenance Hash Tests ---
console.log('\n── Provenance Hash ──');

const doc1 = '{"manufacturer":"C3 Alliance","model":"Bot-1"}';
const hash1 = hashProvenanceDocument(doc1);
assert(hash1.length === 64, 'Provenance hash is 64 hex chars (32 bytes)');
assert(isValidHex(hash1), 'Provenance hash is valid hex');

// Deterministic
const hash2 = hashProvenanceDocument(doc1);
assert(hash1 === hash2, 'Provenance hash is deterministic');

// Different input → different hash
const hash3 = hashProvenanceDocument('{"manufacturer":"Different"}');
assert(hash1 !== hash3, 'Different document → different hash');

// --- Batch Generation Tests ---
console.log('\n── Batch Generation ──');

const batch = generateEntityBatch(seid1.seid, [
  { prefix: 'T', registrationTxHash: VALID_TX_HASH, provenanceHash: VALID_PROV_HASH },
  { prefix: 'T', registrationTxHash: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', provenanceHash: VALID_PROV_HASH },
  { prefix: 'P', registrationTxHash: VALID_TX_HASH, provenanceHash: VALID_PROV_HASH },
]);

assert(batch.length === 3, 'Batch generates correct count');
assert(batch[0].prefix === 'T', 'Batch item 0 is @T');
assert(batch[1].prefix === 'T', 'Batch item 1 is @T');
assert(batch[2].prefix === 'P', 'Batch item 2 is @P');
assert(batch[0].entityHash !== batch[1].entityHash, 'Different tx hashes → different entity hashes');
assert(batch.every(e => e.seid === seid1.seid), 'All batch items share same SEID');

// ─── Results ─────────────────────────────────────────────────────────────────

console.log(`\n═══ Results: ${passed} passed, ${failed} failed ═══\n`);
process.exit(failed > 0 ? 1 : 0);
