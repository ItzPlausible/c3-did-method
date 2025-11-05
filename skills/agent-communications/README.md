# Agent-Communications

**Automated multi-channel communications monitoring and management system**

Built for PlausiblePotentials by JW  
Version: 1.0 (Phase 1 - Email Foundation)

---

## Overview

Agent-Communications automates communication monitoring across multiple channels:
- ✅ **Email** (Proton Mail via Bridge) - Phase 1 COMPLETE
- 🚧 **Telegram** - Phase 2
- 🚧 **Discord** - Phase 2  
- 🚧 **Website Chatbot** - Phase 2

**What it does:**
1. **Monitors** all channels for new messages
2. **Triages** messages with intelligent priority scoring
3. **Tracks** everything in Obsidian (primary hub)
4. **Extracts** action items automatically
5. **Updates** dashboard in real-time

**Goal:** Reduce daily communication time by 50% (20 min → 10 min)

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│         AGENT-COMMUNICATIONS CORE               │
│    (Python orchestrator + Proton Bridge)        │
└───┬─────────────────────────────────────────┬───┘
    │                                         │
    ├─ MONITOR (Every 30 min)                │
    │   └─ Proton Mail (IMAP)                │ ✅ DONE
    │                                         │
    ├─ TRIAGE (Priority scoring)             │ ✅ DONE
    │   ├─ Urgency keywords (40 pts)         │
    │   ├─ Sender importance (30 pts)        │
    │   ├─ Time since received (20 pts)      │
    │   └─ Project context (10 pts)          │
    │                                         │
    ├─ TRACK (Obsidian updates)              │ ✅ DONE
    │   ├─ Dashboard auto-update             │
    │   ├─ Save conversations                │
    │   └─ Extract action items              │
    │                                         │
    └─ Primary Hub: Obsidian PPC Vault       │ ✅ DONE
```

---

## Installation

### 1. Prerequisites

**Required:**
- Python 3.8+
- Proton Bridge installed and running
- VS Code (or any Python editor)
- Obsidian vault at: `C:\PlausiblePotentials-Files\My files\My Notes\PPC`

### 2. Install Dependencies

```bash
cd D:\Claude-MCP-Files\agent-communications
pip install -r requirements.txt
```

### 3. Configuration

The `.env` file is already configured with your Proton Bridge credentials:

```env
# IMAP (Reading)
PROTON_IMAP_HOST=127.0.0.1
PROTON_IMAP_PORT=1143
PROTON_IMAP_USERNAME=team@plausiblepotentials.com

# SMTP (Sending)  
PROTON_SMTP_HOST=127.0.0.1
PROTON_SMTP_PORT=1025
PROTON_SMTP_USERNAME=team@plausiblepotentials.com

# Obsidian
OBSIDIAN_VAULT_PATH=C:\PlausiblePotentials-Files\My files\My Notes\PPC
```

**Security:** Never commit `.env` to git!

---

## Usage

### Manual Check (Test Mode)

```bash
python orchestrator.py
```

This will:
1. Connect to Proton Mail via Bridge
2. Fetch unread emails
3. Score and prioritize each message
4. Update Obsidian dashboard
5. Save high-priority conversations
6. Display summary

### Automated Monitoring (Coming Soon)

Phase 3 will add:
- Scheduled checks every 30 minutes
- Windows Task Scheduler integration
- CoCoA morning routine integration

---

## Project Structure

```
agent-communications/
├── orchestrator.py              # Main coordinator
├── monitors/
│   └── proton_monitor.py        # Email IMAP reader
├── triage/
│   └── prioritizer.py           # Message scoring
├── trackers/
│   └── obsidian_updater.py      # Obsidian integration
├── config/
├── logs/
├── .env                         # Credentials (git-ignored)
├── requirements.txt             # Python dependencies
└── README.md                    # This file
```

---

## Priority Scoring

Messages scored 0-100 based on:

**Urgency Keywords (40 pts max)**
- "urgent", "asap", "critical" = 40 pts
- "important", "deadline" = 30 pts
- "priority", "soon" = 20-25 pts
- "fyi", "no rush" = -10 pts (lowers priority)

**Sender Importance (30 pts max)**
- @plausiblepotentials.com = 30 pts (VIP)
- Business domains = 20 pts
- Free email providers = 10 pts

**Time Received (20 pts max)**
- 1 pt per hour old
- Older messages get higher priority

**Project Context (10 pts max)**
- Mentions "C3 Alliance", "CoCoA" = 10 pts

**Priority Levels:**
- 🔴 **HIGH** (70-100): Response within 12h
- 🟡 **MEDIUM** (40-69): Response within 24h
- 🟢 **LOW** (0-39): Response within 36h

---

## Obsidian Integration

All data saved to: `C:\PlausiblePotentials-Files\My files\My Notes\PPC\Communications\`

**Files Created:**
1. **00_Communications-Dashboard.md** - Auto-updated main dashboard
2. **Active-Conversations/Email/** - High-priority email tracking
3. **Drafts-Pending-Approval/** - Response drafts (Phase 2)

**Dashboard Shows:**
- Priority responses needed
- Channel status (unread counts)
- Response SLA tracking
- Active conversations
- Today's goals

---

## Testing

### Test Email Monitor

```bash
cd monitors
python proton_monitor.py
```

Expected output:
```
✅ Connected to Proton IMAP
📧 Found X unread email(s)
📨 First email preview: [shows details]
```

### Test Prioritizer

```bash
cd triage
python prioritizer.py
```

Tests scoring logic with sample messages.

### Test Obsidian Integration

```bash
cd trackers
python obsidian_updater.py
```

Creates test dashboard and conversation files.

### Full System Test

```bash
python orchestrator.py
```

Runs complete check cycle.

---

## Roadmap

### ✅ Phase 1: Email Foundation (COMPLETE)
- Proton Bridge IMAP integration
- Priority scoring system
- Obsidian dashboard updates
- Action item extraction
- Basic monitoring

### 🚧 Phase 2: Multi-Channel (Next)
**Timeline:** Week 2, Days 1-3

1. **Telegram Bot**
   - Create bot via @BotFather
   - Build telegram_monitor.py
   - Add to orchestrator

2. **Discord Bot**
   - Create Discord application
   - Build discord_monitor.py
   - Add to orchestrator

3. **Chatbot Integration**
   - Connect to Cloudflare Workers
   - Build chatbot_monitor.py
   - Add escalation handling

4. **Response Drafting**
   - Template-based generation
   - Save drafts for approval
   - Use existing Communications-System-Reference templates

### 📋 Phase 3: Automation (Future)
**Timeline:** Week 2, Days 4-5

- Scheduled monitoring (Task Scheduler)
- CoCoA morning routine integration
- One-click draft approval + send
- Follow-up reminder system
- Weekly review automation (Friday 4pm)

---

## Configuration

### Adding VIP Senders

Edit `triage/prioritizer.py`:

```python
VIP_SENDERS = [
    '@plausiblepotentials.com',
    '@importantclient.com',  # Add here
    'vip@example.com'        # Or specific addresses
]
```

### Adjusting SLA Times

Edit `.env`:

```env
EMAIL_SLA_HOURS=24        # Change as needed
TELEGRAM_SLA_HOURS=4
DISCORD_SLA_HOURS=8
CHATBOT_SLA_HOURS=1
```

### Project Keywords

Edit `triage/prioritizer.py`:

```python
PROJECT_KEYWORDS = {
    'c3 alliance': 'C3 Alliance',
    'your project': 'Your Project Name',  # Add here
}
```

---

## Troubleshooting

### "Failed to connect to Proton IMAP"

**Solution:**
1. Ensure Proton Bridge is running
2. Check credentials in `.env` match Bridge settings
3. Verify ports 1143 and 1025 are not blocked

### "No unread emails found" (but you have unread emails)

**Solution:**
- Check you're connected to correct account
- Bridge might need restart
- Try marking an email unread and test again

### "Permission denied" writing to Obsidian

**Solution:**
1. Close Obsidian vault
2. Check path in `.env` is correct
3. Ensure you have write permissions to the directory

### Python module not found

**Solution:**
```bash
pip install -r requirements.txt
```

---

## Security Notes

**Never commit these files to git:**
- `.env` (contains credentials)
- `config/*.yaml` (may contain API keys)
- `logs/*.log` (may contain sensitive data)

**Proton Bridge Security:**
- Runs locally (127.0.0.1)
- No external connections
- Credentials never leave your machine

---

## Support & Development

**Developer:** JW (Managing Director, PlausiblePotentials)  
**Project:** CoCoA (Cosmic Commoner Avatar)  
**Email:** team@plausiblepotentials.com

**Key References:**
- Communications System Reference: `C:\PlausiblePotentials-Files\My files\My Notes\PPC\Templates\Communications-System-Reference.md`
- CoCoA Skill: `D:\Claude-MCP-Files\skills\cocoa.md`

---

## Version History

**v1.0 (2025-10-30)** - Phase 1 Complete
- ✅ Proton Mail monitoring (IMAP)
- ✅ Priority scoring system
- ✅ Obsidian integration
- ✅ Action item extraction
- ✅ Dashboard automation

**v0.5 (2025-10-30)** - Initial setup
- Directory structure
- Core architecture
- Configuration files

---

**Next Steps:**
1. Test the system: `python orchestrator.py`
2. Review Obsidian dashboard
3. Adjust priorities/keywords as needed
4. Move to Phase 2 (Telegram/Discord)

**Questions?** Check the Communications-System-Reference.md or ask Claude!
