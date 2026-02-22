/**
 * C3 DID Method — Reference Implementation
 * SEID Generation & Entity Hash Generation (TypeScript)
 * 
 * Version: 0.4 | Date: 2026-02-08
 * Spec: C3 DID Method Specification v0.4, Sections 3.6.1 and 3.6.2
 * 
 * Dependencies:
 *   npm install blakejs bs58
 *   npm install --save-dev typescript @types/node
 * 
 * Usage:
 *   npx ts-node src/c3-did.ts
 */

import * as blakejs from 'blakejs';
import * as bs58 from 'bs58';

// ─── Constants ───────────────────────────────────────────────────────────────

/** SEID truncation length (Base58 characters) — spec Section 3.6.1 */
const SEID_LENGTH = 40;

/** Entity hash truncation length (Base58 characters, excluding prefix) — spec Section 3.6.2 */
const ENTITY_HASH_LENGTH = 32;

/** BLAKE2b-512 digest size in bytes */
const BLAKE2B_512_BYTES = 64;

/** BLAKE2b-256 digest size in bytes */
const BLAKE2B_256_BYTES = 32;

/** Valid entity type prefixes */
const ENTITY_PREFIXES = ['P', 'D', 'T'] as const;
type EntityPrefix = typeof ENTITY_PREFIXES[number];

/** DID method prefix */
const DID_METHOD_PREFIX = 'did:c3:';

// ─── Core Types ──────────────────────────────────────────────────────────────

/** Represents a generated SEID segment */
export interface SEIDResult {
  /** The 40-character Base58-encoded SEID segment */
  seid: string;
  /** The full BLAKE2b-512 digest (hex) before Base58 encoding */
  fullDigestHex: string;
  /** Input: Cardano minting policy ID (hex) */
  policyId: string;
  /** Input: Cardano asset name (hex) */
  assetName: string;
}

/** Represents a generated entity hash */
export interface EntityHashResult {
  /** The entity prefix + 32-character Base58-encoded hash (33 chars total) */
  entityHash: string;
  /** The entity prefix alone */
  prefix: EntityPrefix;
  /** The 32-character hash portion (without prefix) */
  hashPortion: string;
  /** The full constructed DID string */
  did: string;
  /** Input: Cardano registration transaction hash (hex) */
  registrationTxHash: string;
  /** Input: BLAKE2b-256 hash of IPFS provenance document (hex) */
  provenanceHash: string;
  /** Input: Steward's SEID segment */
  seid: string;
}

/** Full DID components after parsing */
export interface ParsedDID {
  /** The complete DID string */
  did: string;
  /** The method name: "c3" */
  method: string;
  /** The SEID segment (40-char Base58) */
  seid: string;
  /** The entity prefix: P, D, or T */
  entityPrefix: EntityPrefix;
  /** The entity hash (without prefix) */
  entityHash: string;
  /** The full entity segment (@prefix + hash) */
  entitySegment: string;
  /** Whether the DID passes structural validation */
  isValid: boolean;
}

// ─── Validation Helpers ──────────────────────────────────────────────────────

/** Base58 alphabet (Bitcoin variant — no 0, I, O, l) */
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const BASE58_SET = new Set(BASE58_ALPHABET.split(''));

/**
 * Validates that a string contains only Base58 characters.
 */
export function isBase58(s: string): boolean {
  return s.split('').every(ch => BASE58_SET.has(ch));
}

/**
 * Validates a hex string (even length, valid hex chars).
 */
export function isValidHex(s: string): boolean {
  return /^[0-9a-fA-F]*$/.test(s) && s.length % 2 === 0;
}

/**
 * Converts a hex string to a Uint8Array.
 */
export function hexToBytes(hex: string): Uint8Array {
  if (!isValidHex(hex)) {
    throw new Error(`Invalid hex string: "${hex}"`);
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Converts a Uint8Array to a hex string.
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─── SEID Generation ─────────────────────────────────────────────────────────

/**
 * Generate SEID segment from Cardano soul-bound token identifiers.
 * 
 * Algorithm (spec Section 3.6.1):
 *   SEID = Base58(BLAKE2b-512(PolicyID || AssetName))[0:40]
 * 
 * @param policyId - Hex-encoded Cardano minting policy ID (56 hex chars = 28 bytes)
 * @param assetName - Hex-encoded Cardano asset name (variable length)
 * @returns SEIDResult with the 40-character Base58 SEID segment
 * 
 * @throws Error if policyId is not valid 56-char hex
 * @throws Error if assetName is not valid hex
 * 
 * @example
 * ```ts
 * const result = generateSEID(
 *   'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
 *   '536f756c426f756e64546f6b656e'
 * );
 * console.log(result.seid); // 40-character Base58 string
 * ```
 */
export function generateSEID(policyId: string, assetName: string): SEIDResult {
  // Validate inputs
  if (!isValidHex(policyId)) {
    throw new Error(`Invalid policyId: must be hex-encoded. Got: "${policyId}"`);
  }
  if (policyId.length !== 56) {
    throw new Error(`Invalid policyId length: expected 56 hex chars (28 bytes), got ${policyId.length}`);
  }
  if (!isValidHex(assetName)) {
    throw new Error(`Invalid assetName: must be hex-encoded. Got: "${assetName}"`);
  }

  // Step 1: Concatenate PolicyID and AssetName as bytes
  const policyIdBytes = hexToBytes(policyId);
  const assetNameBytes = hexToBytes(assetName);
  const inputBytes = new Uint8Array(policyIdBytes.length + assetNameBytes.length);
  inputBytes.set(policyIdBytes, 0);
  inputBytes.set(assetNameBytes, policyIdBytes.length);

  // Step 2: BLAKE2b-512 hash
  const digest = blakejs.blake2b(inputBytes, undefined, BLAKE2B_512_BYTES);

  // Step 3: Base58 encode
  const base58Full = bs58.encode(Buffer.from(digest));

  // Step 4: Truncate to 40 characters
  const seid = base58Full.substring(0, SEID_LENGTH);

  // Validation: ensure we got enough Base58 characters
  if (seid.length < SEID_LENGTH) {
    throw new Error(
      `SEID generation produced only ${seid.length} Base58 chars (need ${SEID_LENGTH}). ` +
      `This should not happen with BLAKE2b-512 output.`
    );
  }

  return {
    seid,
    fullDigestHex: bytesToHex(digest),
    policyId,
    assetName,
  };
}

// ─── Entity Hash Generation ──────────────────────────────────────────────────

/**
 * Generate entity hash segment from registration provenance data.
 * 
 * Algorithm (spec Section 3.6.2):
 *   EntityHash = EntityPrefix + Base58(BLAKE2b-512(RegistrationTxHash || ProvenanceHash || SEID))[0:32]
 * 
 * @param entityPrefix - Entity type: "P" (Persona), "D" (DACO), or "T" (Tool)
 * @param registrationTxHash - Hex-encoded Cardano transaction hash (64 hex chars = 32 bytes)
 * @param provenanceHash - Hex-encoded BLAKE2b-256 of IPFS provenance document (64 hex chars = 32 bytes)
 * @param seid - The steward's SEID segment (40-character Base58 string)
 * @returns EntityHashResult with the prefix + 32-character Base58 hash
 * 
 * @throws Error if entityPrefix is not P, D, or T
 * @throws Error if registrationTxHash is not valid 64-char hex
 * @throws Error if provenanceHash is not valid 64-char hex
 * @throws Error if seid is not a valid 40-char Base58 string
 * 
 * @example
 * ```ts
 * const result = generateEntityHash(
 *   'T',
 *   'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
 *   'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
 *   '7xK9mP2vLqR4nW8bT3jF5hD6cA0sE4uR9iOqYzX'
 * );
 * console.log(result.entityHash); // "T" + 32-char Base58
 * console.log(result.did);        // "did:c3:7xK9mP2v...:@Tabc..."
 * ```
 */
export function generateEntityHash(
  entityPrefix: string,
  registrationTxHash: string,
  provenanceHash: string,
  seid: string,
): EntityHashResult {
  // Validate entity prefix
  if (!ENTITY_PREFIXES.includes(entityPrefix as EntityPrefix)) {
    throw new Error(`Invalid entity prefix: "${entityPrefix}". Must be one of: ${ENTITY_PREFIXES.join(', ')}`);
  }
  const prefix = entityPrefix as EntityPrefix;

  // Validate registration transaction hash
  if (!isValidHex(registrationTxHash)) {
    throw new Error(`Invalid registrationTxHash: must be hex-encoded. Got: "${registrationTxHash}"`);
  }
  if (registrationTxHash.length !== 64) {
    throw new Error(
      `Invalid registrationTxHash length: expected 64 hex chars (32 bytes), got ${registrationTxHash.length}`
    );
  }

  // Validate provenance hash
  if (!isValidHex(provenanceHash)) {
    throw new Error(`Invalid provenanceHash: must be hex-encoded. Got: "${provenanceHash}"`);
  }
  if (provenanceHash.length !== 64) {
    throw new Error(
      `Invalid provenanceHash length: expected 64 hex chars (32 bytes), got ${provenanceHash.length}`
    );
  }

  // Validate SEID
  if (seid.length !== SEID_LENGTH) {
    throw new Error(`Invalid SEID length: expected ${SEID_LENGTH} chars, got ${seid.length}`);
  }
  if (!isBase58(seid)) {
    throw new Error(`Invalid SEID: contains non-Base58 characters`);
  }

  // Step 1: Concatenate inputs as bytes
  // RegistrationTxHash (hex → bytes) || ProvenanceHash (hex → bytes) || SEID (UTF-8 → bytes)
  const txHashBytes = hexToBytes(registrationTxHash);
  const provHashBytes = hexToBytes(provenanceHash);
  const seidBytes = new TextEncoder().encode(seid);

  const inputBytes = new Uint8Array(txHashBytes.length + provHashBytes.length + seidBytes.length);
  inputBytes.set(txHashBytes, 0);
  inputBytes.set(provHashBytes, txHashBytes.length);
  inputBytes.set(seidBytes, txHashBytes.length + provHashBytes.length);

  // Step 2: BLAKE2b-512 hash
  const digest = blakejs.blake2b(inputBytes, undefined, BLAKE2B_512_BYTES);

  // Step 3: Base58 encode
  const base58Full = bs58.encode(Buffer.from(digest));

  // Step 4: Truncate to 32 characters (entity hash portion)
  const hashPortion = base58Full.substring(0, ENTITY_HASH_LENGTH);

  if (hashPortion.length < ENTITY_HASH_LENGTH) {
    throw new Error(
      `Entity hash generation produced only ${hashPortion.length} Base58 chars (need ${ENTITY_HASH_LENGTH}).`
    );
  }

  // Step 5: Prepend entity prefix
  const entityHash = prefix + hashPortion;

  // Construct the full DID
  const did = `${DID_METHOD_PREFIX}${seid}:@${entityHash}`;

  return {
    entityHash,
    prefix,
    hashPortion,
    did,
    registrationTxHash,
    provenanceHash,
    seid,
  };
}

// ─── Provenance Hash Helper ──────────────────────────────────────────────────

/**
 * Compute BLAKE2b-256 hash of a provenance document (for use in entity hash generation).
 * 
 * @param provenanceDocument - The raw provenance document content (UTF-8 string or bytes)
 * @returns Hex-encoded BLAKE2b-256 hash (64 hex chars)
 */
export function hashProvenanceDocument(provenanceDocument: string | Uint8Array): string {
  const inputBytes = typeof provenanceDocument === 'string'
    ? new TextEncoder().encode(provenanceDocument)
    : provenanceDocument;
  
  const digest = blakejs.blake2b(inputBytes, undefined, BLAKE2B_256_BYTES);
  return bytesToHex(digest);
}

// ─── DID Parsing ─────────────────────────────────────────────────────────────

/**
 * Parse a did:c3 DID string into its component parts.
 * 
 * @param did - A DID string, e.g., "did:c3:7xK9mP2v...:@Tm3N4p5Q6..."
 * @returns ParsedDID with all components and validation status
 * 
 * @example
 * ```ts
 * const parsed = parseDID('did:c3:7xK9mP2vLqR4nW8bT3jF5hD6cA0sE4uR9iOqYzX:@Tm3N4p5Q6r7S8t9U0abcdefghijklmnop');
 * console.log(parsed.seid);          // "7xK9mP2vLqR4nW8bT3jF5hD6cA0sE4uR9iOqYzX"
 * console.log(parsed.entityPrefix);   // "T"
 * console.log(parsed.isValid);        // true
 * ```
 */
export function parseDID(did: string): ParsedDID {
  const result: ParsedDID = {
    did,
    method: '',
    seid: '',
    entityPrefix: 'P',
    entityHash: '',
    entitySegment: '',
    isValid: false,
  };

  // Check prefix
  if (!did.startsWith(DID_METHOD_PREFIX)) {
    return result;
  }

  // Remove prefix
  const methodSpecific = did.substring(DID_METHOD_PREFIX.length);

  // Split on ":@" — the separator between SEID and entity segment
  const atIndex = methodSpecific.indexOf(':@');
  if (atIndex === -1) {
    return result;
  }

  const seid = methodSpecific.substring(0, atIndex);
  const entitySegment = methodSpecific.substring(atIndex + 2); // skip ":@"

  // Validate SEID
  if (seid.length !== SEID_LENGTH || !isBase58(seid)) {
    return result;
  }

  // Validate entity segment (prefix + hash)
  if (entitySegment.length < 2) {
    return result;
  }

  const prefix = entitySegment[0];
  if (!ENTITY_PREFIXES.includes(prefix as EntityPrefix)) {
    return result;
  }

  const entityHash = entitySegment.substring(1);
  if (!isBase58(entityHash)) {
    return result;
  }

  result.method = 'c3';
  result.seid = seid;
  result.entityPrefix = prefix as EntityPrefix;
  result.entityHash = entityHash;
  result.entitySegment = entitySegment;
  result.isValid = true;

  return result;
}

// ─── Batch DID Generation ────────────────────────────────────────────────────

/**
 * Generate multiple entity DIDs under the same SEID (common pattern for steward setup).
 * 
 * @param seid - The steward's SEID segment
 * @param entities - Array of { prefix, registrationTxHash, provenanceHash }
 * @returns Array of EntityHashResult
 */
export function generateEntityBatch(
  seid: string,
  entities: Array<{
    prefix: EntityPrefix;
    registrationTxHash: string;
    provenanceHash: string;
  }>,
): EntityHashResult[] {
  return entities.map(e =>
    generateEntityHash(e.prefix, e.registrationTxHash, e.provenanceHash, seid)
  );
}

// ─── Demo / Self-Test ────────────────────────────────────────────────────────

/**
 * Run a demonstration of all functions with example data.
 */
export function runDemo(): void {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  C3 DID Method — Reference Implementation Demo');
  console.log('  Spec Version: 0.4 | Date: 2026-02-08');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // ── Step 1: Generate SEID ──
  console.log('── Step 1: SEID Generation ──────────────────────────────────\n');
  
  const policyId = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4';
  const assetName = '536f756c426f756e64546f6b656e'; // "SoulBoundToken" in hex
  
  console.log(`  PolicyID:  ${policyId}`);
  console.log(`  AssetName: ${assetName} ("SoulBoundToken")`);
  console.log(`  Algorithm: Base58(BLAKE2b-512(PolicyID || AssetName))[0:40]\n`);
  
  const seidResult = generateSEID(policyId, assetName);
  console.log(`  SEID:      ${seidResult.seid}`);
  console.log(`  Length:    ${seidResult.seid.length} chars`);
  console.log(`  Full hash: ${seidResult.fullDigestHex.substring(0, 32)}...`);
  console.log();

  // ── Step 2: Generate Entity Hashes ──
  console.log('── Step 2: Entity Hash Generation ───────────────────────────\n');

  // Example registration tx hash and provenance hash
  const txHash = 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789';
  
  // Simulate provenance document hashing
  const provenanceDoc = JSON.stringify({
    manufacturer: 'C3 Alliance',
    model: 'MaintenanceBot-Alpha',
    serialNumber: 'MB-2026-001',
    safetyClass: 'IEC-62443-SL2',
    capabilities: ['battery-maintenance', 'solar-panel-inspection'],
  });
  const provHash = hashProvenanceDocument(provenanceDoc);
  
  console.log(`  Reg Tx Hash:     ${txHash.substring(0, 32)}...`);
  console.log(`  Provenance Hash: ${provHash.substring(0, 32)}...`);
  console.log(`  SEID:            ${seidResult.seid}`);
  console.log();

  // Generate all three entity types
  const entities: Array<{ prefix: EntityPrefix; label: string }> = [
    { prefix: 'P', label: '@P (Persona)' },
    { prefix: 'D', label: '@D (DACO)' },
    { prefix: 'T', label: '@T (Tool)' },
  ];

  for (const { prefix, label } of entities) {
    const entityResult = generateEntityHash(prefix, txHash, provHash, seidResult.seid);
    console.log(`  ${label}:`);
    console.log(`    Entity Hash: ${entityResult.entityHash}`);
    console.log(`    Full DID:    ${entityResult.did}`);
    console.log();
  }

  // ── Step 3: Parse DID ──
  console.log('── Step 3: DID Parsing ──────────────────────────────────────\n');
  
  const toolEntity = generateEntityHash('T', txHash, provHash, seidResult.seid);
  const parsed = parseDID(toolEntity.did);
  
  console.log(`  Input DID:      ${parsed.did}`);
  console.log(`  Method:         ${parsed.method}`);
  console.log(`  SEID:           ${parsed.seid}`);
  console.log(`  Entity Prefix:  ${parsed.entityPrefix} (${
    parsed.entityPrefix === 'P' ? 'Persona' :
    parsed.entityPrefix === 'D' ? 'DACO' : 'Tool'
  })`);
  console.log(`  Entity Hash:    ${parsed.entityHash}`);
  console.log(`  Valid:           ${parsed.isValid}`);
  console.log();

  // ── Step 4: Batch Generation ──
  console.log('── Step 4: Batch Generation (Fleet of 3 Tools) ──────────────\n');
  
  const fleetTxHashes = [
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
  ];

  const batch = generateEntityBatch(
    seidResult.seid,
    fleetTxHashes.map(tx => ({
      prefix: 'T' as EntityPrefix,
      registrationTxHash: tx,
      provenanceHash: provHash,
    })),
  );

  batch.forEach((entity, i) => {
    console.log(`  Tool ${i + 1}: ${entity.did}`);
  });
  
  console.log('\n  All 3 tools share the same SEID (same steward).');
  console.log(`  SEID: ${seidResult.seid}`);

  // ── Step 5: Validation Examples ──
  console.log('\n── Step 5: Validation Examples ──────────────────────────────\n');
  
  const testCases = [
    toolEntity.did,
    'did:c3:invalid:@Tabc',
    'did:c3:' + seidResult.seid + ':@Xbadprefix',
    'did:web:example.com',
    'did:c3:' + seidResult.seid + ':@P' + 'a'.repeat(32),
  ];

  testCases.forEach(tc => {
    const p = parseDID(tc);
    console.log(`  ${p.isValid ? '✓' : '✗'} "${tc.substring(0, 60)}${tc.length > 60 ? '...' : ''}"`);
  });

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  Demo complete. All functions operational.');
  console.log('═══════════════════════════════════════════════════════════════');
}

// Run demo if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runDemo();
}
