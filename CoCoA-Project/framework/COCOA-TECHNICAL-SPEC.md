# CoCoA Detailed Technical Specification
## Cosmic Commoner Avatar — Technical Deep Dive

**Version:** 0.1.0 | **Created:** January 21, 2026

---

## 1. Component Stack

```
CLIENT INTERFACES
├── Web App (PWA) - Primary interface
├── Mobile App (React Native) - iOS/Android
├── Voice Interface - Speech-to-text + TTS
└── QR Scanner - Camera integration

CoCoA API GATEWAY
├── Authentication (SEID-based)
├── Rate limiting
├── Request routing
└── Logging/Analytics

CoCoA COORDINATION ENGINE
├── LLM Layer (Claude API) - Natural language processing
├── Intent Router - Classify and route requests
├── Context Manager - Member state and history
└── Action Orchestrator - Execute multi-step workflows

SERVICE INTEGRATIONS
├── Quest Service - Quest/Mission/IO management
├── C3DEX Service - Token operations
├── Vault Service - Member wallet operations
├── RWA Service - Asset registry and verification
└── Governance Service - Voting, proposals, faction ops

BLOCKCHAIN LAYER
├── Cardano Node - L1 settlement
├── Midnight Node - Privacy layer
├── Smart Contracts - Business logic on-chain
└── IPFS - Decentralized storage
```

---

## 2. Data Architecture

### Member Profile (SEID-linked)
```json
{
  "seid": "C3-SEID-xxxx-xxxx",
  "vault_address": "addr1...",
  "faction": "producer",
  "star_tier": 2,
  "cocoa_preferences": {
    "voice_enabled": true,
    "notification_level": "important",
    "privacy_default": "shielded",
    "language": "en"
  },
  "active_quests": ["quest_id_1", "quest_id_2"],
  "ppt_balance": 150,
  "comm_balance": 500
}
```

### Quest Object
```json
{
  "quest_id": "quest_xxxx",
  "title": "Onboard 5 New Members",
  "description": "Recruit and onboard 5 new C3 Alliance members",
  "faction": "promoter",
  "status": "active",
  "progress": { "target": 5, "current": 3 },
  "ppt_reward": 50,
  "deadline": "2026-02-01T00:00:00Z",
  "verification_type": "syndicate_approval"
}
```

### RWA Asset Object
```json
{
  "asset_id": "rwa_xxxx",
  "asset_type": "infrastructure",
  "name": "Solar Panel Array #127",
  "location": "N3 Commons",
  "qr_code": "C3-RWA-xxxx",
  "steward_seid": "C3-SEID-yyyy",
  "monthly_yield_ppt": 2.3,
  "maintenance_log": [],
  "tokenization_status": "active"
}
```

---

## 3. Security Model

### Authentication
- SEID-based identity (sovereign, self-custodial)
- Biometric options for mobile
- Hardware key support (future)

### Authorization
- Faction-scoped permissions
- Quest-specific access
- Transaction limits (configurable per member)

### Privacy
- Midnight integration for shielded COMM transactions
- JLZ visible for governance transparency
- Local-first data where possible
- Zero-knowledge proofs for verification without exposure

---

## 4. Intent Classification System

### Primary Intent Categories

| Category | Examples | Handler |
|----------|----------|---------|
| QUEST_QUERY | "What are my quests?" | Quest Service |
| QUEST_UPDATE | "I finished X" | Quest Service + PPT |
| BALANCE_CHECK | "How much COMM do I have?" | Vault Service |
| SWAP_REQUEST | "Trade 100 COMM for JLZ" | C3DEX Service |
| ASSET_SCAN | [QR scan event] | RWA Service |
| ASSET_LOG | "Log maintenance on X" | RWA Service |
| GOVERNANCE | "Vote on proposal X" | Governance Service |
| HELP | "How do I..." | Context + Docs |

### Intent Routing Flow
```
User Input
    |
    v
[NLU Layer - Claude API]
    |
    v
[Intent Classification]
    |
    +---> QUEST_* --> Quest Service
    |
    +---> BALANCE/SWAP --> C3DEX/Vault Service
    |
    +---> ASSET_* --> RWA Service
    |
    +---> GOVERNANCE --> Governance Service
    |
    v
[Action Orchestrator]
    |
    v
[Response Generation]
    |
    v
User Response
```

---

## 5. Interaction Patterns

### Pattern: Confirmation Flow (High-Stakes)
```
Member: "Transfer 500 COMM to addr1xyz..."
CoCoA: "Confirm transfer of 500 COMM to addr1xyz...? 
        This action cannot be undone. [Confirm] [Cancel]"
Member: [Confirms]
CoCoA: "Transfer initiated. Transaction ID: tx_xxxx. 
        Expected confirmation in ~2 minutes."
```

### Pattern: Progressive Disclosure
```
Member: "What's happening with my quests?"
CoCoA: "You have 3 active quests:
        1. Onboard Members (60% - 3 days left)
        2. Aquaponics Setup (25% - 2 weeks left)
        3. Documentation (10% - 1 month left)
        
        Want details on any of these?"
```

### Pattern: Proactive Suggestion
```
[Triggered by: Quest deadline approaching]
CoCoA: "Heads up - your 'Onboard Members' quest has 3 days left 
        and you're at 60%. Need 2 more referrals. 
        Want me to draft an invite message?"
```

### Pattern: Error Recovery
```
Member: "Send 10000 COMM to..."
CoCoA: "Your current COMM balance is 500. 
        Would you like to:
        - Transfer your full balance (500 COMM)
        - Check your JLZ balance for a swap
        - Cancel this transaction"
```

---

## 6. API Endpoints (Draft)

### CoCoA Gateway
```
POST /api/v1/intent
  Body: { "seid": "...", "input": "...", "context": {...} }
  Response: { "response": "...", "actions": [...], "state": {...} }

GET /api/v1/member/{seid}/profile
GET /api/v1/member/{seid}/quests
GET /api/v1/member/{seid}/balances

POST /api/v1/quest/{quest_id}/update
POST /api/v1/transaction/swap
POST /api/v1/asset/{asset_id}/log
```

---

## 7. Success Metrics

### Member Experience
- Response time: < 2 seconds for common queries
- Task completion: 90%+ of intents successfully resolved
- Member satisfaction: NPS > 50

### System Performance
- Uptime: 99.5%+
- Transaction success: 99%+
- Error rate: < 1%

### Adoption
- Active members: 80%+ of registered SEIDs using CoCoA weekly
- Feature adoption: Track usage across Quest, C3DEX, RWA capabilities

---

## 8. Related Documents

- [[COCOA-FRAMEWORK-ARCHITECTURE]] - High-level overview
- [[C3 Alliance Articles of Organization]]
- [[Tokenomics - JLZ/COMM/PPT]]
- [[SEID Specification]]
- [[Quest System Design]] (TBD)
- [[C3DEX API Specification]] (TBD)

*v0.1.0 - 2026-01-21*
