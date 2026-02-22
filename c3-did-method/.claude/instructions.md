# C3 DID Method — v0.4 (W3C Conformant)

## DID Structure
- did:c3:SEID:@P<hash> — Persona (human member)
- did:c3:SEID:@D<hash> — DACO (cooperative entity)
- did:c3:SEID:@T<hash> — Tool/TIT (intelligent agent)

## SEID Generation
BLAKE2b-512(PolicyID || AssetName) → Base58 encoding → truncate to 40 characters

## Layer Separation
- SEID: Core identifier (on-chain, Cardano native asset)
- FEID: Federation layer (credential concerns)
- NEID: Network layer (routing)

## Implementation
- Identus SDK integration
- SBT-DID (Soulbound Token DID) binding
- XPT credential issuance for verified attributes
