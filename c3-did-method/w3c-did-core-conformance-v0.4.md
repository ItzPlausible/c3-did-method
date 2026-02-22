# W3C DID Core Conformance Audit — C3 DID Method v0.4

**Date:** 2026-02-08  
**Auditor:** CoCoA (Claude Cooperative Assistant)  
**Spec Reference:** [W3C DID Core v1.0 (2022-07-19)](https://www.w3.org/TR/did-core/)  
**Subject:** C3 DID Method Specification v0.4

---

## Audit Summary

| Category | Requirements | Pass | Partial | Fail | N/A |
|----------|-------------|------|---------|------|-----|
| DID Syntax | 8 | 8 | 0 | 0 | 0 |
| DID Document | 14 | 13 | 1 | 0 | 0 |
| DID Resolution | 6 | 6 | 0 | 0 | 0 |
| DID URL Dereferencing | 4 | 4 | 0 | 0 | 0 |
| DID Operations | 4 | 4 | 0 | 0 | 0 |
| Security | 5 | 5 | 0 | 0 | 0 |
| Privacy | 4 | 4 | 0 | 0 | 0 |
| **Total** | **45** | **44** | **1** | **0** | **0** |

**Overall Assessment: CONFORMANT** (with 1 partial item requiring minor spec clarification)

---

## 1. DID Syntax (W3C §3.1)

| # | Requirement | Status | C3 Implementation | Notes |
|---|------------|--------|-------------------|-------|
| 1.1 | DID scheme MUST be "did" | ✅ Pass | `did:c3:...` | Prefix verified in Section 3.1 |
| 1.2 | Method name MUST be one or more lowercase letters | ✅ Pass | Method name is `c3` (lowercase) | Section 3.1 |
| 1.3 | Method-specific identifier syntax defined by ABNF | ✅ Pass | Full ABNF in Section 3.3 | `c3-did = "did:c3:" seid ":@" entity-prefix entity-hash` |
| 1.4 | DID MUST be a valid URI per RFC 3986 | ✅ Pass | All characters are URI-safe (Base58 + colon + @) | Base58 alphabet is URI-safe without encoding |
| 1.5 | Method-specific identifier MUST be unique | ✅ Pass | BLAKE2b-512 with ~233 bits of entropy for SEID; entity hash includes tx hash (globally unique) | Section 16.1 collision analysis |
| 1.6 | DID string MUST be case-sensitive | ✅ Pass | Base58 is inherently case-sensitive | ABNF distinguishes uppercase/lowercase |
| 1.7 | DID method specification MUST define ABNF | ✅ Pass | Section 3.3 provides complete ABNF | Includes BASE58CHAR production |
| 1.8 | DID MUST be persistent/immutable | ✅ Pass | DID string never changes after creation | Section 1.2, 5.3 explicitly state immutability |

---

## 2. DID Document (W3C §4)

| # | Requirement | Status | C3 Implementation | Notes |
|---|------------|--------|-------------------|-------|
| 2.1 | DID document MUST include `id` property | ✅ Pass | `"id": "did:c3:..."` | Section 4.2 lists as required |
| 2.2 | `id` MUST be the DID for the document | ✅ Pass | `id` is the full `did:c3:SEID:@prefix+hash` | Example in Section 4.1 |
| 2.3 | DID document MAY include `controller` | ✅ Pass | `"controller": "did:c3:SEID"` (steward's bare SEID DID) | Section 4.2 — required for C3 |
| 2.4 | `controller` MUST be a DID or set of DIDs | ✅ Pass | Controller is steward's SEID DID; for @D may become multi-sig DID set | Section 10.4 |
| 2.5 | DID document MAY include `alsoKnownAs` | ✅ Pass | Used for human-readable display aliases via CoCoA | Section 3.6.1 |
| 2.6 | `verificationMethod` entries MUST include `id`, `type`, `controller` | ✅ Pass | Ed25519VerificationKey2020 with all required fields | Example in Section 4.1 |
| 2.7 | `verificationMethod.id` MUST be a DID URL | ✅ Pass | `"did:c3:...#key-1"` format | Fragment-based DID URLs |
| 2.8 | `authentication` entries MUST reference verification methods | ✅ Pass | `"authentication": ["#key-1"]` | Relative DID URL reference |
| 2.9 | `service` entries MUST include `id`, `type`, `serviceEndpoint` | ✅ Pass | Provenance, Vault, CoCoA services all include required fields | Section 4.1 example |
| 2.10 | `service.id` MUST be a URI | ✅ Pass | `"#provenance"`, `"#vault"`, `"#cocoa"` — relative DID URLs | Fragment-based |
| 2.11 | DID document MUST be serializable as JSON-LD | ✅ Pass | `@context` includes W3C DID context + C3 extension context | Section 4.4 |
| 2.12 | `@context` MUST include `https://www.w3.org/ns/did/v1` as first entry | ✅ Pass | First context URI in all examples | Section 4.1 |
| 2.13 | Extension properties MUST be defined in a registered context | ⚠️ Partial | `c3:*` properties defined in `https://c3alliance.org/ns/titi/v1` context | Context is defined (Section 4.4, schema file exists) but not yet published to a live URL. Must be published before production. |
| 2.14 | DID document MUST NOT contain duplicate properties | ✅ Pass | All properties are unique in examples and schema | Verified in all three example documents |

---

## 3. DID Resolution (W3C §7)

| # | Requirement | Status | C3 Implementation | Notes |
|---|------------|--------|-------------------|-------|
| 3.1 | Resolution takes a DID → returns DID document + metadata | ✅ Pass | Section 6.3 defines full resolution with `didDocument`, `didResolutionMetadata`, `didDocumentMetadata` | Both QR and programmatic flows |
| 3.2 | `didResolutionMetadata` MUST include `contentType` | ✅ Pass | `"contentType": "application/did+ld+json"` | Section 6.6 |
| 3.3 | Resolution MUST return `didDocumentMetadata` | ✅ Pass | Includes `created`, `updated`, `versionId`, `deactivated` | Section 6.6 |
| 3.4 | `didDocumentMetadata.created` SHOULD be present | ✅ Pass | Present in resolution metadata | Section 6.6 |
| 3.5 | `didDocumentMetadata.updated` SHOULD be present | ✅ Pass | Updated on each datum modification | Section 5.3 |
| 3.6 | `didDocumentMetadata.deactivated` MUST be present if deactivated | ✅ Pass | Set to `true` on decommission; DID remains resolvable | Section 13.6 |

---

## 4. DID URL Dereferencing (W3C §7.2)

| # | Requirement | Status | C3 Implementation | Notes |
|---|------------|--------|-------------------|-------|
| 4.1 | Fragments MUST reference document components | ✅ Pass | `#key-1`, `#provenance`, `#vault`, `#cocoa` all dereference to document elements | Section 4.1 |
| 4.2 | Fragment-only DID URLs reference within the document | ✅ Pass | `"authentication": ["#key-1"]` references `verificationMethod` entry | Standard W3C pattern |
| 4.3 | DID URL dereferencing returns the referenced resource | ✅ Pass | Resolver supports fragment dereferencing for keys and services | Section 6.3 step 7 |
| 4.4 | DID URL parameters SHOULD be supported | ✅ Pass | `versionId` parameter supported via datum hash lookup | `didDocumentMetadata.versionId` enables historical resolution |

---

## 5. DID Operations (W3C §8)

| # | Requirement | Status | C3 Implementation | Notes |
|---|------------|--------|-------------------|-------|
| 5.1 | Create operation MUST define how a DID is registered | ✅ Pass | Section 5.1 — Cardano L1 minting with Plutus V2 policy | Full transaction structure documented |
| 5.2 | Read/Resolve MUST be defined | ✅ Pass | Section 6 — full resolution protocol | QR + programmatic flows |
| 5.3 | Update operation MUST define mutable vs. immutable fields | ✅ Pass | Section 5.3 — explicit lists of mutable/immutable fields | On-chain datum updates with chain-of-custody |
| 5.4 | Deactivate operation MUST define how a DID is deactivated | ✅ Pass | Section 5.4 + 13.6 — dual mechanism (StatusList2021 + on-chain burn) | DID remains resolvable after deactivation |

---

## 6. Security Considerations (W3C §9)

| # | Requirement | Status | C3 Implementation | Notes |
|---|------------|--------|-------------------|-------|
| 6.1 | Spec MUST address eavesdropping | ✅ Pass | Midnight ZK for sensitive fields; SEID hash is pseudonymous | Section 17 |
| 6.2 | Spec MUST address replay attacks | ✅ Pass | Sequential datum hashes provide chain-of-custody; each update references previous | Section 5.3 |
| 6.3 | Spec MUST address message insertion | ✅ Pass | Controller signature required for all updates; Plutus enforces minting rules | Section 16.3 |
| 6.4 | Spec MUST address deletion/denial-of-service | ✅ Pass | Cardano L1 immutability; IPFS content-addressing; archival resolution | Section 13.6 |
| 6.5 | Spec MUST address key management | ✅ Pass | Section 16.2 — key rotation, HSM recommendation, multi-sig for @D | Ed25519 key pairs |

---

## 7. Privacy Considerations (W3C §10)

| # | Requirement | Status | C3 Implementation | Notes |
|---|------------|--------|-------------------|-------|
| 7.1 | Spec MUST address correlation risk | ✅ Pass | Section 17.1 — SEID linkability is intentional (accountability); Midnight mitigates identity correlation | Design trade-off documented |
| 7.2 | Spec MUST address data minimization | ✅ Pass | Midnight ZK proofs satisfy data minimization; tiered disclosure (Section 12) | Four authorization tiers |
| 7.3 | Spec MUST address personally identifiable information | ✅ Pass | No PII stored on-chain; SEID is pseudonymous per GDPR Article 4(5) | Section 17.3 |
| 7.4 | Spec SHOULD address right to be forgotten | ✅ Pass | Decommission protocol + IPFS unpinning; acknowledged that content-addressed data may persist | Section 17.3 |

---

## Detailed Findings

### Finding 1: JSON-LD Context Publication (Partial — Item 2.13)

**Status:** ⚠️ Partial  
**Requirement:** W3C DID Core §4.1 requires that extension properties be defined in a JSON-LD context accessible at a stable URL.

**Current State:** The C3 JSON-LD context is defined locally at `spec/schemas/c3-did-context-v1.jsonld` and referenced as `https://c3alliance.org/ns/titi/v1` in all DID documents. The schema file exists and is well-formed, but the URL is not yet published.

**Recommendation:** Prior to mainnet deployment:
1. Publish `c3-did-context-v1.jsonld` to Cloudflare Pages at the declared URL
2. Set `Cache-Control: public, max-age=86400` for stability
3. Register the context URI with the W3C DID Specification Registries
4. Consider a `w3id.org` redirect for long-term URL stability

**Risk Level:** Low — this is a deployment task, not a spec deficiency. The context itself is conformant.

### Finding 2: DID Method Registration

**Status:** ℹ️ Informational (not a conformance requirement)  
**Note:** W3C maintains a DID Method Registry. The `c3` method name should be registered once the spec reaches Candidate Recommendation status. Check for conflicts at [W3C DID Specification Registries](https://www.w3.org/TR/did-spec-registries/).

**Current check:** No existing `did:c3` registration found as of 2026-02-08. The method name is available.

### Finding 3: Verification Method Suite

**Status:** ✅ Conformant  
**Note:** The spec uses `Ed25519VerificationKey2020` exclusively. This is W3C-conformant and well-supported. For future-proofing, consider adding `JsonWebKey2020` as an alternative verification method type in a future spec version, particularly for interoperability with non-Cardano ecosystems.

### Finding 4: Service Endpoint Types

**Status:** ✅ Conformant  
**Note:** The spec defines three custom service types: `TITIProvenance`, `TITVault`, `CoCoAEndpoint`. Per W3C §5.4, service types are method-specific and extensible. These types should be documented in the JSON-LD context (which they are in `c3-did-context-v1.jsonld`).

### Finding 5: Multi-Controller Pattern (@D entities)

**Status:** ✅ Conformant  
**Note:** The @D entity controller transfer pattern (Section 10.4) where `controller` transitions from founding SEID to a governance multi-sig is fully conformant with W3C §4.2, which allows `controller` to be a set of DIDs. The spec correctly maintains the founding SEID in the DID string (immutable) while allowing `controller` to evolve.

---

## Conformance Checklist for Implementers

Before deploying a C3 DID resolver or registrar:

- [ ] JSON-LD context published at `https://c3alliance.org/ns/titi/v1`
- [ ] Cardano Plutus V2 minting policy deployed and policy ID documented
- [ ] Blockfrost API integration tested against PreProd testnet
- [ ] StatusList2021 bitstring IPFS pinning infrastructure operational
- [ ] CoCoA resolver handles all three entity types (@P, @D, @T)
- [ ] Resolution returns all three metadata objects (`didDocument`, `didResolutionMetadata`, `didDocumentMetadata`)
- [ ] Deactivated DIDs resolve with `deactivated: true` (not 404)
- [ ] Fragment dereferencing works for `#key-*`, `#provenance`, `#vault`, `#cocoa`
- [ ] `did:c3` method registered with W3C DID Specification Registries
- [ ] Midnight ZK proof verification integrated for Tier 1+ resolution

---

*End of W3C DID Core Conformance Audit — C3 DID Method v0.4*
