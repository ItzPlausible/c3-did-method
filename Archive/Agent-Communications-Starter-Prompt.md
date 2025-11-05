# Agent-Communications Build Prompt

**Copy everything below this line and paste into a new Claude chat:**

---

# Project: Build Agent-Communications System

## Context

I'm JW, Managing Director at Plausible Potentials. I need your help building **Agent-Communications** - an automated agent to handle my multi-channel communications across Telegram, Discord, Email, and Website Chatbot.

## What I Already Have

### 1. Communications System Reference
**Location:** `C:\PlausiblePotentials-Files\My files\My Notes\PPC\Templates\Communications-System-Reference.md`

This file contains:
- Complete multi-channel communication workflows
- Response SLAs per channel
- Templates for emails, meetings, messages
- Channel selection matrix
- Best practices and common pitfalls

**Please read this file first** to understand my complete communications framework.

### 2. Existing Skills Architecture (2-Tier System)
**Base Directory:** `D:\Claude-MCP-Files\`

**Structure:**
```
D:\Claude-MCP-Files\
├── skills/                          # TIER 1 (Lean triggers, always loaded)
│   ├── communications-core.md       # Quick-reference trigger (~300 tokens)
│   └── [other core skills]
│
├── docs/                            # TIER 2 (Full reference, load on demand)
│   └── communications-guide.md      # Comprehensive guide
│
└── CoCoA-Project/                   # CoCoA system files
```

**Goal:** Agent-Communications will integrate with this structure.

### 3. Available MCP Tools

I have access to these MCP servers:
- **Google Workspace MCP**: Gmail (reading/sending), Google Calendar, Google Drive, Google Docs/Sheets
- **Filesystem MCP**: Local file operations
- **Windows-MCP**: Desktop automation
- **bash_tool**: Script execution

**Important Context:**
- I use **Proton Mail** (team@plausiblepotentials.com) for sending operations
- Google Workspace MCP is used for **reading only** until Proton Bridge becomes available
- I have a Python SMTP script for Proton Mail sending at `D:\Claude-MCP-Files\skills\email-scripts\`

## What I Need: Agent-Communications

### Primary Goal
Create an automated agent that handles communications across 4 channels:

1. **Email (Proton Mail)**
   - team@plausiblepotentials.com
   - Response SLA: 24-48 hours
   - Use cases: Formal business, proposals, external stakeholders

2. **Telegram**
   - Response SLA: 2-4 hours during work hours
   - Use cases: Quick updates, real-time coordination, mobile-first

3. **Discord**
   - Response SLA: 4-8 hours
   - Use cases: Community building, topic discussions, team collaboration

4. **Website Chatbot (PlausiblePotentials.com)**
   - Response SLA: Instant (automated) + 24h (human escalation)
   - Use cases: First contact, FAQ, lead capture, routing

### Key Requirements

**Agent Capabilities:**
- Monitor all channels for incoming messages
- Triage and prioritize based on urgency/channel
- Draft responses using appropriate templates
- Track conversations and follow-ups
- Document important decisions
- Extract action items
- Update communications dashboard

**Integration Points:**
- Use Google Workspace MCP for reading Gmail/Calendar
- Use Proton Mail Python script for sending emails
- Connect to Telegram bot (needs setup guidance)
- Connect to Discord bot (needs setup guidance)
- Integrate with website chatbot (Cloudflare Workers)
- Store conversation notes in Obsidian PPC Vault

**Technical Constraints:**
- Must work with Windows environment
- File operations via Filesystem MCP
- Script execution via bash_tool or Windows-MCP Powershell
- Privacy-focused (Proton Suite preferred over Google for sending)

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

**Workflow:**
- Deep work time: 7-9 AM daily (sacred, no interruptions)
- Daily communication checks: Morning (8am) & Evening (5pm)
- Weekly communication review: Friday 4pm

## Your Task

Help me build Agent-Communications in phases:

### Phase 1: Architecture & Planning (This Chat)
1. Review my Communications-System-Reference.md
2. Analyze available MCP tools and integrations
3. Design Agent-Communications architecture:
   - How it monitors channels
   - How it triages/prioritizes
   - How it drafts responses
   - How it tracks conversations
   - Where files/data are stored
4. Create implementation roadmap

### Phase 2: Core Components (Future Chats)
- Email monitoring & response system
- Telegram bot integration
- Discord bot integration
- Website chatbot connection
- Dashboard tracking system

### Phase 3: Automation & Intelligence (Future Chats)
- Template-based response generation
- Context awareness from past conversations
- Action item extraction
- Priority escalation system
- Integration with CoCoA morning routine

## Key Files & Paths

**Communications Reference:**
`C:\PlausiblePotentials-Files\My files\My Notes\PPC\Templates\Communications-System-Reference.md`

**Skills Base:**
`D:\Claude-MCP-Files\skills\`

**Proton Mail Script:**
`D:\Claude-MCP-Files\skills\email-scripts\send_proton_email.py`

**PPC Vault (Obsidian):**
`C:\PlausiblePotentials-Files\My files\My Notes\PPC\`

**CoCoA Project:**
`D:\Claude-MCP-Files\CoCoA-Project\`

## Success Criteria

Agent-Communications is successful when:
- ✅ All 4 channels monitored automatically
- ✅ Response times meet SLAs
- ✅ Important conversations documented in Obsidian
- ✅ Action items extracted and tracked
- ✅ Daily communication time reduced by 50%
- ✅ Zero missed critical communications
- ✅ Integrates seamlessly with existing CoCoA workflows

## Questions to Address

As you design Agent-Communications, please address:

1. **Channel Monitoring**: How should the agent poll/monitor each channel? What's the optimal frequency?

2. **Triage Logic**: What rules determine priority? How do we route messages?

3. **Response Automation**: Which responses can be fully automated vs. require human approval?

4. **Data Storage**: Where do we store conversation histories, drafts, tracking data?

5. **Bot Infrastructure**: Do we need new Telegram/Discord bots, or can we use existing APIs?

6. **Integration with CoCoA**: How does this fit into my morning routine and daily workflows?

7. **Scalability**: How do we handle increasing message volume as Plausible Potentials grows?

## Let's Start

Please begin by:
1. Reading my Communications-System-Reference.md file
2. Asking any clarifying questions about my current setup
3. Proposing an architecture for Agent-Communications
4. Creating a phased implementation plan

I prefer **executive summaries followed by technical details**. Let's build something lean, efficient, and powerful!

---

**End of starter prompt**
