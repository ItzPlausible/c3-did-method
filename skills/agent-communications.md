---
name: agent-communications
description: Quick trigger for Agent-Communications system - automated multi-channel communication monitoring (Email, Telegram, Discord, Chatbot). Use when user mentions communications, email management, message monitoring, or channel coordination.
---

# Agent-Communications

**Automated multi-channel communications monitoring system**

## Quick Reference

**Location**: `D:\Claude-MCP-Files\agent-communications\`

**Status**: Phase 1 Complete (Email), Phase 2 In Development

**What It Does**:
- Monitors: Email (Proton), Telegram, Discord, Chatbot
- Triages: Priority scoring (0-100)
- Tracks: Everything in Obsidian (primary hub)
- Extracts: Action items automatically

## Running the System

**Manual Check**:
```bash
cd D:\Claude-MCP-Files\agent-communications
python orchestrator.py
```

**Test Components**:
```bash
python test_system.py
```

## Key Files

- `orchestrator.py` - Main coordinator
- `monitors/proton_monitor.py` - Email monitoring
- `triage/prioritizer.py` - Message scoring
- `trackers/obsidian_updater.py` - Obsidian integration
- `.env` - Proton Bridge credentials

## Obsidian Output

**Dashboard**: `C:\PlausiblePotentials-Files\My files\My Notes\PPC\Communications\00_Communications-Dashboard.md`

**Conversations**: `C:\PlausiblePotentials-Files\My files\My Notes\PPC\Communications\Active-Conversations\`

## Priority Scoring

- 🔴 **HIGH** (70-100): Response within 12h
- 🟡 **MEDIUM** (40-69): Response within 24h  
- 🟢 **LOW** (0-39): Response within 36h

**Factors**:
- Urgency keywords (40 pts)
- Sender importance (30 pts)
- Time received (20 pts)
- Project context (10 pts)

## Common Commands

**Check status**: View Obsidian dashboard
**Run check**: Execute orchestrator.py
**Test system**: Run test_system.py
**View logs**: Check logs/ directory

## Integration Points

- **Proton Bridge**: 127.0.0.1:1143 (IMAP), :1025 (SMTP)
- **Obsidian**: Primary data hub
- **CoCoA**: Morning routine integration (Phase 3)

## Phase Roadmap

✅ **Phase 1**: Email foundation (COMPLETE)
🚧 **Phase 2**: Telegram, Discord, Chatbot (Next)
📋 **Phase 3**: Automation, scheduling, CoCoA integration

## Full Documentation

**README**: `D:\Claude-MCP-Files\agent-communications\README.md`
**Reference**: `C:\PlausiblePotentials-Files\My files\My Notes\PPC\Templates\Communications-System-Reference.md`

---

*When user mentions communications, load full context from README.md and orchestrator.py*
