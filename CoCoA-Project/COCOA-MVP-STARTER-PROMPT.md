# CoCoA MVP Development — Starter Prompt

**Created:** January 21, 2026  
**Session:** Framework Planning Complete → Ready for Worker Development  
**Status:** Infrastructure Ready, Code Scaffold Next

---

## 🚀 Starter Prompt

Copy and paste this into a new Claude session:

```
I'm continuing CoCoA MVP development. Load context and proceed to Worker code scaffold.

## PROJECT SUMMARY

**CoCoA** = Cosmic Commoner Avatar — Universal member interface for C3 Alliance
**KoKoA** = JW's personal fine-tuned agent (PAUSED for 1 month)

CoCoA Phase 0/1 = "Conversational Form Completer"
- Members talk, CoCoA translates intent into form fields
- Lace.IO wallet handles all sovereign operations (self-custody)
- Cloudflare hosts compute, IPFS/Iagon for decentralized storage backup

## ARCHITECTURE DECISIONS

1. **Wallet:** Lace.IO (CIP-30) — sovereign vault, member manages keys
2. **Compute:** Cloudflare Workers + Workers AI (Pro account)
3. **Database:** Cloudflare D1 (schema created, seed data loaded)
4. **Sessions:** Cloudflare KV
5. **Blockchain:** Blockfrost API → Cardano L1 (Hydra L2 later)
6. **Storage:** Phase 1 = IPFS + Iagon pinning, Phase 2+ = self-hosted N3 nodes

## FACTION MODEL

| Faction | Role | Patronage Token |
|---------|------|-----------------|
| Syndicate | Promoter | PMT |
| Guild | Procurer | PCT |
| Union | Producer | PDT |

- All new members default to Syndicate (Promoter) — no selection at onboarding
- FEIDs (Faction Entity IDs) minted as SBTs on FIRST IO contribution per faction
- Each member accumulates up to 3 FEIDs over time
- Patronage tokens accrue to respective FEID

## IDENTITY ARCHITECTURE

```
Sovereign Vault (Lace)
├── SEID (Sovereign Entity ID) — created at onboarding
├── FEID:Syndicate (SBT) — minted on first Promoter IO
├── FEID:Guild (SBT) — minted on first Procurer IO
└── FEID:Union (SBT) — minted on first Producer IO
```

## VAM (Vickrey Auction Mechanism)

- Sealed bids, winner pays B2 (second-highest bid)
- Delta (B1-B2) captured for Commons treasury
- Critical for E2C (Exit-to-Cooperative) valuations
- Phase 1: L1 settlement, Phase 2+: Hydra L2

## CLOUDFLARE RESOURCES (READY)

Account: Team@Plausiblepotentials.com (Pro Plan)
Account ID: 03b272f4cb882d3d9bc52091fb5241d8

| Resource | ID |
|----------|-----|
| D1 Database | cocoa-test-db (a65f0d7e-c8d9-4d8a-8952-5011310e9e07) |
| KV Namespace | CoCoA-Test-Namespace (2400bfdcf6b14d829db1c9891415fbcc) |

## DATABASE SCHEMA (CREATED)

Tables: members, member_feids, balances, ios, io_contributions, auctions, bids, transactions

## SEED DATA (LOADED)

**IOs:**
- IO-SYN-001: Community Outreach Campaign (Syndicate, 30 PMT)
- IO-SYN-002: Investor Deck Review (Syndicate, 20 PMT)
- IO-GUI-001: Tool Inventory Audit (Guild, 35 PCT)
- IO-GUI-002: Supplier Research (Guild, 25 PCT)
- IO-UNI-001: Documentation Sprint (Union, 50 PDT)
- IO-UNI-002: Garden Bed Construction (Union, 60 PDT)

**VAM Auctions:**
- VAM-001: Solar Panel Share #001 (RWA, 500 COMM reserve)
- VAM-002: Tool Library Membership (Service, 100 COMM)
- VAM-003: Garden Plot Stewardship (Land, 200 COMM)
- VAM-004: Hardware Store E2C (Equity, 50,000 COMM)

## NEXT ACTIONS

1. Scaffold cocoa-mvp Worker project structure
2. Implement API routes: /auth, /chat, /ios, /auctions, /member
3. Build intent classification with Workers AI
4. Create minimal chat UI with Lace wallet connector
5. Test onboarding → IO contribution → VAM bid flow
6. Deploy to cocoa-mvp.plausiblepotentials.workers.dev

## PROJECT STRUCTURE

```
cocoa-mvp/
├── wrangler.toml
├── package.json
├── src/
│   ├── index.ts
│   ├── router.ts
│   ├── handlers/
│   │   ├── auth.ts
│   │   ├── chat.ts
│   │   ├── ios.ts
│   │   ├── auctions.ts
│   │   └── member.ts
│   ├── services/
│   │   ├── intent.ts
│   │   ├── forms.ts
│   │   └── cardano.ts
│   ├── db/
│   │   └── queries.ts
│   └── types.ts
├── public/
│   └── index.html
└── test/
    └── intents.test.ts
```

## WRANGLER.TOML

```toml
name = "cocoa-mvp"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "cocoa-test-db"
database_id = "a65f0d7e-c8d9-4d8a-8952-5011310e9e07"

[[kv_namespaces]]
binding = "KV"
id = "2400bfdcf6b14d829db1c9891415fbcc"

[ai]
binding = "AI"
```

## KEY INTENTS TO IMPLEMENT

| Intent | Example | Action |
|--------|---------|--------|
| greeting | "Hi CoCoA" | Welcome + status |
| balance_check | "What's my balance?" | Return PPT/COMM/JLZ |
| io_list | "Show me IOs" | List by faction |
| io_contribute | "Contribute to [IO]" | Stake form → Lace sign |
| auction_list | "Show auctions" | List active VAMs |
| auction_bid | "Bid [amount] on [asset]" | Bid form → Lace sign |
| status | "What's my status?" | SEID + all FEIDs + balances |

## QUESTIONS TO RESOLVE

1. UI: Minimal HTML/JS or framework (React/Astro)?
2. Lace connector: Use @lace/cardano-js-sdk or raw CIP-30?
3. Tx building: Lucid or Mesh.js?

Ready to build. Start with Worker scaffold and index.ts entry point.
```

---

## 📁 Related Documents

- Framework architecture notes from this session
- D:\Claude-MCP-Files\CoCoA-Project\context\phase3-plan.md
- D:\Claude-MCP-Files\skills\cocoa-SKILL.md

---

**Next Session Goal:** Generate working cocoa-mvp Worker code, deploy to Cloudflare, test basic chat interaction.
