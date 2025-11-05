# Phase 2C: Telegram Integration - Build Prompt

**Copy everything below this line and paste into a new Claude chat:**

---

# Project: Build Telegram Integration (Phase 2C)

## Context

I'm JW, Managing Director at Plausible Potentials. I've built a multi-channel Agent-Communications system that currently monitors **Email** (Phase 2A ✅) and **Discord** (Phase 2B ✅). Now I need to add **Telegram** monitoring (Phase 2C).

## What I Already Have

### 1. Working System (Phase 2A + 2B Complete)

**Base Directory:** `D:\Claude-MCP-Files\agent-communications\`

```
agent-communications/
├── monitors/
│   ├── proton_monitor.py        ✅ Email monitoring (Proton Bridge IMAP)
│   ├── discord_monitor.py       ✅ Discord bot integration
│   └── telegram_monitor.py      ⚠️ NEEDS TO BE CREATED
├── triage/
│   └── prioritizer.py           ✅ Multi-channel scoring (Email + Discord)
├── trackers/
│   └── obsidian_updater.py      ✅ Dashboard + conversation saving
├── orchestrator.py              ✅ v1.1 (Email + Discord coordination)
├── requirements.txt             ✅ Has discord.py, needs python-telegram-bot
├── .env                         ✅ Has email/Discord creds, needs Telegram
└── README.md
```

**Current Functionality:**
- ✅ Monitors Proton Mail via IMAP (50 emails processed in last test)
- ✅ Monitors Discord server (bot connected, 0 messages in quiet server)
- ✅ Triages messages with priority scoring (HIGH/MEDIUM/LOW)
- ✅ Updates Obsidian dashboard with metrics
- ✅ Saves high-priority conversations to Obsidian
- ✅ Multi-channel orchestration working

### 2. System Architecture (Current)

```
┌─────────────────────────────────────────────────────┐
│           ORCHESTRATOR v1.1                         │
│  (Coordinates Email + Discord monitoring)           │
└─────────────────────────────────────────────────────┘
           ↓                           ↓
    ┌──────────────┐          ┌──────────────┐
    │ Email Monitor│          │Discord Monitor│
    │  (Proton)    │          │    (Bot)     │
    └──────────────┘          └──────────────┘
           ↓                           ↓
    ┌─────────────────────────────────────────┐
    │         MESSAGE PRIORITIZER             │
    │  (Scores all messages 0-100)            │
    └─────────────────────────────────────────┘
                      ↓
    ┌─────────────────────────────────────────┐
    │       OBSIDIAN UPDATER                  │
    │  (Dashboard + Conversation Tracking)    │
    └─────────────────────────────────────────┘
```

**Target Architecture (Phase 2C):**

```
┌────────────────────────────────────────────────────────────┐
│              ORCHESTRATOR v1.2                             │
│  (Coordinates Email + Discord + TELEGRAM monitoring)       │
└────────────────────────────────────────────────────────────┘
           ↓              ↓                ↓
    ┌──────────┐   ┌──────────┐   ┌──────────────┐
    │  Email   │   │ Discord  │   │  TELEGRAM    │ ← NEW
    │ Monitor  │   │ Monitor  │   │  Monitor     │
    └──────────┘   └──────────┘   └──────────────┘
           ↓              ↓                ↓
    ┌─────────────────────────────────────────────┐
    │         MESSAGE PRIORITIZER v1.2            │
    │  (Enhanced with Telegram scoring)           │
    └─────────────────────────────────────────────┘
                      ↓
    ┌─────────────────────────────────────────────┐
    │       OBSIDIAN UPDATER                      │
    │  (Already supports Telegram data)           │
    └─────────────────────────────────────────────┘
```

### 3. Telegram Context

**Use Case:**
- **Response SLA:** 2-4 hours during work hours
- **Primary Use:** Quick updates, real-time coordination, mobile-first
- **User:** JW (personal Telegram account)

**Bot Requirements:**
- Monitor personal Telegram messages
- Detect mentions/direct messages
- Extract questions and action items
- Track conversation threads
- Support for attachments/media (nice-to-have)

**Technical Approach:**
- Use `python-telegram-bot` library (latest version)
- Long polling or webhook (prefer polling for simplicity)
- Bot token from @BotFather
- Store bot token in `.env`

### 4. Available Tools & Resources

**Python Libraries:**
- `python-telegram-bot` (needs to be added to requirements.txt)
- `python-dotenv` (already installed)

**Existing Patterns:**
- `discord_monitor.py` - Reference implementation for bot-based monitoring
- `proton_monitor.py` - Reference implementation for message parsing
- `prioritizer.py` - Already has scoring framework, needs Telegram rules
- `obsidian_updater.py` - Already has `telegram` parameter in `update_dashboard()`

**Environment:**
- Windows 10/11
- Python 3.x
- File operations via standard Python (no MCP required for this)

## What I Need: Telegram Integration (Phase 2C)

### Primary Goal

Add Telegram monitoring to Agent-Communications so it can:

1. **Monitor Telegram messages**
   - Personal messages (DMs)
   - Group messages (if in any groups)
   - Channel messages (if subscribed)

2. **Parse Telegram data**
   - Message content
   - Sender info
   - Timestamps
   - Media/attachments (optional)
   - Message types (text, photo, document, etc.)

3. **Integrate with existing system**
   - Use same message format as Email/Discord
   - Feed into existing Prioritizer
   - Update Obsidian dashboard
   - Coordinate through Orchestrator v1.2

### Key Requirements

**Telegram Monitor (`monitors/telegram_monitor.py`):**
- Create new monitor class similar to `discord_monitor.py`
- Connect to Telegram bot API
- Fetch recent messages (last 24 hours configurable)
- Parse messages into standard format
- Handle different message types (text, media)
- Return list of message dictionaries

**Message Format (Standard):**
```python
{
    'id': str,                    # Unique message ID
    'channel': 'telegram',        # Channel identifier
    'from': str,                  # Sender username/name
    'from_name': str,             # Display name
    'from_id': str,               # Telegram user ID
    'subject': str,               # "Telegram: DM" or "Telegram: Group Name"
    'body': str,                  # Message content
    'timestamp': str,             # ISO format
    'status': 'unread',           # Always unread initially
    'priority_score': 0,          # Set by prioritizer
    'response_due': None,         # Calculated by prioritizer
    'project_link': None,         # Extracted by prioritizer
    'action_items': [],           # Extracted by prioritizer
    
    # Telegram-specific
    'is_dm': bool,                # Direct message vs group
    'is_question': bool,          # Contains question mark/patterns
    'has_media': bool,            # Has photos/docs
    'media_type': str,            # 'photo', 'document', 'video', etc.
    'chat_type': str,             # 'private', 'group', 'channel'
}
```

**Enhanced Prioritizer (`triage/prioritizer.py`):**
- Add Telegram-specific scoring rules
- Scoring bonuses:
  - DM (private message): +25 points
  - Question: +10 points
  - Media attachment: +5 points
  - Group mention: +15 points
- Use 2-4 hour SLA (from .env)

**Updated Orchestrator (`orchestrator.py` → v1.2):**
- Import and initialize `TelegramMonitor`
- Add `_check_telegram()` method
- Update `run_check()` to include Telegram
- Combine Telegram messages with Email/Discord
- Update summary output

**Requirements File (`requirements.txt`):**
- Add `python-telegram-bot==20.7` (or latest stable)

**Environment Variables (`.env`):**
```bash
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_SLA_HOURS=4
TELEGRAM_CHECK_INTERVAL_SECONDS=900  # 15 minutes
```

### Integration Points

**Files to Modify:**
1. `monitors/telegram_monitor.py` - CREATE NEW
2. `triage/prioritizer.py` - ADD Telegram scoring method
3. `orchestrator.py` - UPDATE to v1.2 with Telegram
4. `requirements.txt` - ADD python-telegram-bot
5. `.env` - ADD Telegram bot token

**Files Already Compatible:**
- ✅ `trackers/obsidian_updater.py` - Already accepts `telegram` parameter
- ✅ Dashboard template already has Telegram section

## My Communication Preferences

**Style:**
- Executive summary first, then details
- Action-oriented, lean responses
- Bold key facts for scannability
- Short descriptive headers (sentence-case)
- Minimal markdown formatting

**Decision-Making:**
- Quick operational decisions
- Thorough analysis for strategic matters
- Calculated risk with clear upside

**Development Approach:**
- Modular components that integrate cleanly
- Follow existing patterns (see Discord/Email monitors)
- Test incrementally
- Document assumptions

## Your Task

Help me build Phase 2C Telegram Integration:

### Step 1: Architecture Review (This Chat)
1. Review existing Email/Discord integration
2. Analyze Telegram bot requirements
3. Design `telegram_monitor.py` architecture:
   - How to connect to Telegram
   - How to fetch messages
   - How to parse different message types
   - How to handle media/attachments
4. Design Telegram-specific scoring rules
5. Plan orchestrator updates

### Step 2: Implementation (This Chat or Next)
- Create `monitors/telegram_monitor.py`
- Enhance `triage/prioritizer.py` with Telegram scoring
- Update `orchestrator.py` to v1.2
- Update `requirements.txt`
- Create example `.env` entries

### Step 3: Testing & Documentation
- Test Telegram monitor standalone
- Test full orchestrator with 3 channels
- Document setup (getting bot token, etc.)
- Update README with Phase 2C status

## Key Files & Paths

**Project Root:**
`D:\Claude-MCP-Files\agent-communications\`

**Reference Files (READ THESE):**
- `monitors/discord_monitor.py` - Bot integration pattern
- `monitors/proton_monitor.py` - Message parsing pattern
- `triage/prioritizer.py` - Current scoring system
- `orchestrator.py` - Current v1.1 orchestration
- `trackers/obsidian_updater.py` - Dashboard updates

**Obsidian Vault:**
`C:\PlausiblePotentials-Files\My files\My Notes\PPC\`

## Success Criteria

Phase 2C is successful when:
- ✅ Telegram messages monitored via bot
- ✅ Messages parsed into standard format
- ✅ Telegram-specific scoring implemented
- ✅ Integration with existing Email/Discord system
- ✅ All 3 channels in unified dashboard
- ✅ Orchestrator v1.2 running all 3 channels
- ✅ Test run shows Telegram messages flowing through system

## Technical Constraints

**Telegram Bot Setup:**
- Need to create bot via @BotFather
- Bot token must be stored in `.env` (never commit)
- Bot needs message reading permissions
- Long polling preferred over webhooks (simpler)

**Message Access:**
- Bot can only see messages sent TO the bot
- For personal message monitoring, user must start conversation with bot
- Group messages require bot to be added to group
- Cannot monitor ALL Telegram messages (privacy limitation)

**Workarounds:**
- If monitoring personal Telegram isn't working, pivot to:
  - Bot-only messages (people message the bot directly)
  - Forward important messages to the bot
  - Or use Telegram Client API (more complex, requires phone auth)

## Questions to Address

As you design Telegram integration, please address:

1. **Bot vs Client API**: Should we use Bot API (simpler) or Client API (full access)? What are tradeoffs?

2. **Message Access**: How do we handle the limitation that bots can't see all personal messages?

3. **Polling Strategy**: What's the optimal polling frequency? How does it differ from Discord?

4. **Media Handling**: Should we download/process media files, or just note their presence?

5. **Conversation Threading**: Telegram has message threading - how do we track conversations?

6. **Integration Pattern**: Should Telegram monitor follow Discord pattern (connect, collect, disconnect) or different approach?

7. **Scoring Rules**: What makes a Telegram message high priority vs Discord/Email?

## Implementation Approach

### Phase 2C-1: Core Monitor (Priority)
1. Create `telegram_monitor.py` with basic message fetching
2. Test bot connection and message retrieval
3. Implement standard message parsing

### Phase 2C-2: Integration (Priority)
1. Add Telegram scoring to `prioritizer.py`
2. Update `orchestrator.py` to v1.2
3. Test 3-channel coordination

### Phase 2C-3: Enhancement (Nice-to-Have)
1. Media attachment handling
2. Message threading/context
3. Rich message types (polls, locations, etc.)

## Getting Started

Please begin by:
1. Reading the existing `discord_monitor.py` and `proton_monitor.py` files
2. Proposing an architecture for `telegram_monitor.py`
3. Explaining bot vs client API tradeoffs
4. Designing Telegram-specific scoring rules
5. Creating implementation plan for Phase 2C

I prefer **executive summaries followed by technical details**. Let's add Telegram to this multi-channel system!

---

**End of Phase 2C starter prompt**
