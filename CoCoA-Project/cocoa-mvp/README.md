# CoCoA MVP - Cosmic Commoner Avatar

Conversational Form Completer for C3 Alliance members. CoCoA is the universal member interface that translates natural language into cooperative actions.

## Overview

- **Phase**: 0/1 - Conversational Form Completer
- **Stack**: Cloudflare Workers + D1 + KV + Workers AI
- **Wallet**: Lace.IO (CIP-30 standard)
- **Blockchain**: Cardano L1 via Blockfrost (Hydra L2 planned)

## Architecture

```
CoCoA MVP
├── Cloudflare Workers (compute)
├── Workers AI (intent classification)
├── D1 Database (members, IOs, auctions)
├── KV (sessions)
└── Lace Wallet (CIP-30 sovereign vault)
```

## Project Structure

```
cocoa-mvp/
├── wrangler.toml          # Cloudflare config
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts           # Entry point
│   ├── router.ts          # API routing
│   ├── types.ts           # TypeScript definitions
│   ├── handlers/
│   │   ├── auth.ts        # Wallet connect, sessions
│   │   ├── chat.ts        # Conversational interface
│   │   ├── ios.ts         # Intent Opportunities
│   │   ├── auctions.ts    # VAM auctions
│   │   └── member.ts      # Profile, balances, FEIDs
│   ├── services/
│   │   ├── intent.ts      # AI intent classification
│   │   ├── forms.ts       # Form completion flow
│   │   └── cardano.ts     # Blockchain operations (stub)
│   └── db/
│       └── queries.ts     # D1 database operations
├── public/
│   └── index.html         # Chat UI with Lace connector
└── test/
    └── intents.test.ts    # Intent classification tests
```

## API Endpoints

### Auth

- `POST /api/auth/connect` - Connect wallet, create/retrieve session
- `GET /api/auth/session` - Get current session
- `POST /api/auth/disconnect` - End session

### Chat

- `POST /api/chat` - Send message, get AI response

### IOs (Intent Opportunities)

- `GET /api/ios` - List IOs (filter by status, faction)
- `GET /api/ios/:id` - Get IO details
- `POST /api/ios/:id/contribute` - Stake on IO

### Auctions (VAM)

- `GET /api/auctions` - List auctions
- `GET /api/auctions/:id` - Get auction details
- `POST /api/auctions/:id/bid` - Place sealed bid
- `POST /api/auctions/:id/settle` - Settle auction (admin)

### Member

- `GET /api/member` - Get profile
- `GET /api/member/status` - Full status (balances, FEIDs, activity)
- `GET /api/member/balances` - Token balances
- `GET /api/member/feids` - Faction Entity IDs
- `GET /api/member/contributions` - IO contributions
- `GET /api/member/bids` - Auction bids

## Faction System

| Faction   | Role     | Token | Description                              |
| --------- | -------- | ----- | ---------------------------------------- |
| Syndicate | Promoter | PMT   | Outreach, marketing, community building  |
| Guild     | Procurer | PCT   | Sourcing, logistics, resource management |
| Union     | Producer | PDT   | Building, creating, delivering value     |

## Identity Architecture

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
- Used for E2C (Exit-to-Cooperative) valuations

## Development

### Prerequisites

- Node.js 18+
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account with Pro plan

### Setup

```bash
cd cocoa-mvp
npm install
wrangler login
```

### Development Server

```bash
npm run dev
```

### Deploy

```bash
npm run deploy
```

### Run Tests

```bash
npm test
```

## Cloudflare Resources

- **Account**: Team@Plausiblepotentials.com (Pro Plan)
- **D1 Database**: cocoa-test-db (a65f0d7e-c8d9-4d8a-8952-5011310e9e07)
- **KV Namespace**: CoCoA-Test-Namespace (2400bfdcf6b14d829db1c9891415fbcc)

## Intent Classification

CoCoA uses Workers AI (Llama 3.1 8B) for intent classification with pattern-matching fallback:

| Intent        | Example                    | Action                  |
| ------------- | -------------------------- | ----------------------- |
| greeting      | "Hi CoCoA"                 | Welcome + status        |
| balance_check | "What's my balance?"       | Return token balances   |
| io_list       | "Show me IOs"              | List by faction         |
| io_contribute | "Contribute to IO-SYN-001" | Stake form              |
| auction_list  | "Show auctions"            | List active VAMs        |
| auction_bid   | "Bid 500 on VAM-001"       | Bid form                |
| status        | "What's my status?"        | SEID + FEIDs + balances |

## Next Steps

1. ✅ Scaffold Worker project structure
2. ⏳ Test deployment to Cloudflare
3. ⏳ Test Lace wallet integration
4. ⏳ Implement on-chain SEID/FEID minting
5. ⏳ Connect Blockfrost for L1 operations
6. ⏳ Add Hydra L2 for VAM settlement

---

**Plausible Potentials Consulting DAO LLC**  
_Sovereign Stewardship as a Service_
