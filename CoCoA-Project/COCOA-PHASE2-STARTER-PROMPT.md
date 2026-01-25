# CoCoA Phase 2 — Starter Prompt

**Created:** January 21, 2026  
**Session:** Phase 0/1 Complete → Ready for Blockfrost Integration  
**Status:** MVP Live, On-Chain Operations Next

---

## 🚀 Starter Prompt

Copy and paste this into a new Claude session:

```
I'm continuing CoCoA development. Load context and proceed to Phase 2: Blockfrost Integration.

## PROJECT SUMMARY

**CoCoA** = Cosmic Commoner Avatar — Universal member interface for C3 Alliance
**Phase 0/1** = COMPLETE ✅ — Conversational Form Completer live
**Phase 2** = Blockfrost API integration for on-chain operations

## LIVE DEPLOYMENTS

| Project | URL | Status |
|---------|-----|--------|
| CoCoA MVP | https://cocoa-mvp.team-d90.workers.dev | ✅ Live |
| C3DEX | https://c3dex.com | ✅ Live |
| CoCoA (pending DNS) | https://cocoa.plausiblepotentials.com | ⏳ Route configured |

## CLOUDFLARE RESOURCES

**Account:** Team@plausiblepotentials.com  
**Account ID:** d90dcd7b745fd3d5fe182073b3f2ad54

| Resource | Name | ID |
|----------|------|-----|
| D1 Database | cocoa-mvp-db | a54ce1a6-5804-40e6-b38d-07fdfea8d478 |
| KV Namespace | cocoa-mvp-COCOA_SESSIONS | 344d8f9a2c25477ab039f8b22d22920b |
| Worker | cocoa-mvp | https://cocoa-mvp.team-d90.workers.dev |
| Worker | c3dex | https://c3dex.com |

## DATABASE SCHEMA (LIVE)

Tables: members, member_feids, balances, ios, io_contributions, auctions, bids, transactions

**Seed Data:**
- 6 IOs (2 Syndicate, 2 Guild, 2 Union)
- 4 VAM Auctions (RWA, Service, Land, E2C Equity)

## PROJECT STRUCTURE

```
D:\Claude-MCP-Files\CoCoA-Project\
├── cocoa-mvp/                    # Main CoCoA Worker
│   ├── wrangler.toml
│   ├── src/
│   │   ├── index.ts              # Entry point
│   │   ├── router.ts             # API routing
│   │   ├── types.ts              # TypeScript definitions
│   │   ├── handlers/
│   │   │   ├── auth.ts           # Wallet connect, sessions
│   │   │   ├── chat.ts           # Conversational interface
│   │   │   ├── ios.ts            # Intent Opportunities
│   │   │   ├── auctions.ts       # VAM auctions
│   │   │   └── member.ts         # Profile, balances, FEIDs
│   │   ├── services/
│   │   │   ├── intent.ts         # Workers AI classification
│   │   │   ├── forms.ts          # Form completion
│   │   │   └── cardano.ts        # Blockchain ops (STUB)
│   │   └── db/queries.ts         # D1 operations
│   └── public/index.html         # Chat UI
├── c3dex-site/                   # C3DEX homepage
│   ├── wrangler.toml
│   ├── src/index.ts
│   └── public/index.html         # With Lace wallet connect
└── COCOA-MVP-STARTER-PROMPT.md   # Previous starter
```

## CURRENT IDENTITY STATE

**JW's Test Account:**
- SEID: SEID-MKO7QXCB-J3HFIX
- Wallet: Connected via Lace (CIP-30)
- Faction: Syndicate (Promoter) — default
- Balances: 0 (needs COMM seeded for testing)

## PHASE 2 OBJECTIVES

### 1. Blockfrost API Integration
- [ ] Add BLOCKFROST_PROJECT_ID secret to Worker
- [ ] Implement wallet balance queries (ADA + native tokens)
- [ ] Query UTXOs for transaction building
- [ ] Verify on-chain asset ownership

### 2. SEID NFT Minting
- [ ] Design SEID metadata schema (CIP-25/CIP-68)
- [ ] Create minting policy script
- [ ] Build mint transaction for new members
- [ ] Submit via Lace wallet signing

### 3. FEID SBT Minting
- [ ] Design faction-specific FEID metadata
- [ ] Mint SBT on first IO contribution per faction
- [ ] Link FEID to member's SEID

### 4. Token Operations
- [ ] COMM token policy
- [ ] Transfer tokens for IO stakes
- [ ] VAM bid escrow mechanism

### 5. Transaction Building
- [ ] Use Mesh.js for tx construction
- [ ] Return unsigned tx to frontend
- [ ] Lace wallet signs
- [ ] Submit to network via Blockfrost

## CARDANO SERVICE STUB (TO IMPLEMENT)

Location: `cocoa-mvp/src/services/cardano.ts`

Current stubs to implement:
- `mintSEID(env, walletAddress, seid)` → Mint SEID NFT
- `mintFEID(env, seid, faction)` → Mint faction SBT
- `getOnChainBalance(env, walletAddress)` → Query balances
- `transferTokens(env, from, to, amount, tokenType)` → Transfer
- `settleAuctionOnChain(env, auctionId, ...)` → Atomic swap

## BLOCKFROST SETUP NEEDED

1. Create Blockfrost account: https://blockfrost.io
2. Create project for Cardano Preprod testnet
3. Get Project ID
4. Add to Worker:
   ```bash
   cd D:\Claude-MCP-Files\CoCoA-Project\cocoa-mvp
   npx wrangler secret put BLOCKFROST_PROJECT_ID
   ```

## API ENDPOINTS (LIVE)

- `GET /api/health` — Health check
- `POST /api/auth/connect` — Wallet connect
- `POST /api/chat` — Conversational interface
- `GET /api/ios` — List Intent Opportunities
- `POST /api/ios/:id/contribute` — Stake on IO
- `GET /api/auctions` — List VAM auctions
- `POST /api/auctions/:id/bid` — Place sealed bid
- `GET /api/member/status` — Full member status

## QUESTIONS TO RESOLVE

1. **Network:** Preprod testnet first, then mainnet?
2. **Token Policy:** Single policy for all C3 tokens or separate?
3. **Minting Authority:** Who can mint? DAO multisig later?
4. **Metadata Standard:** CIP-25 (simple) or CIP-68 (datum-based)?

## IMMEDIATE NEXT ACTIONS

1. Set up Blockfrost account (Preprod)
2. Add Project ID as Worker secret
3. Implement `getOnChainBalance()` to verify wallet
4. Seed test COMM balance to JW's SEID
5. Test IO contribution flow end-to-end

Ready to integrate Cardano L1. Start with Blockfrost setup.
```

---

## 📁 Related Documents

- D:\Claude-MCP-Files\CoCoA-Project\cocoa-mvp\README.md
- D:\Claude-MCP-Files\CoCoA-Project\cocoa-mvp\src\services\cardano.ts
- D:\Claude-MCP-Files\skills\cocoa-SKILL.md

---

**Next Session Goal:** Implement Blockfrost API integration, test on-chain balance queries, prepare for SEID/FEID minting.
