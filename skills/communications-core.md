---
name: communications-core
description: Multi-channel communication trigger. Load when managing Telegram, Discord, email (Proton), Zoom, or PlausiblePotentials chatbot.
---

# Communications Core (Lean Trigger)

## ACTIVATE WHEN
- Checking/sending messages across platforms
- Scheduling/managing meetings
- Email coordination
- Website chatbot management
- Communication workflows

## CHANNELS (Priority Order)

### 1. Telegram (Urgent)
**Use for**: Quick responses needed, mobile alerts
**Response SLA**: <2 hours
**Tools**: Google Workspace MCP (when integrated)

### 2. team@plausiblepotentials.com (Business)
**Use for**: Formal communication, documents, paper trail
**Response SLA**: 24-48 hours
**Tools**: 
- **Sending**: Proton-Mail skill (SMTP via send_email.py)
- **Reading**: Google Workspace MCP (Gmail functions)
**Note**: Proton-Mail skill now active for outbound email

### 3. Discord (Community)
**Use for**: Plausible Potentials community, team coordination
**Response SLA**: Daily check
**Tools**: Discord MCP (when integrated)

### 4. Zoom (Meetings)
**Use for**: Virtual meetings, screen sharing
**Tools**: Google Calendar MCP for scheduling

### 5. Website Chatbot (Public)
**Use for**: PlausiblePotentials.com visitor engagement
**Tools**: Cloudflare Workers MCP

## QUICK ACTIONS

### Check Email
```
1. Use: Google Workspace MCP - search_gmail_messages
2. Query: "is:unread newer_than:1d"
3. Report: Count + urgent items flagged
4. Execute time: <1 min
```

### Send Email
```
1. Use: Proton-Mail skill (team@plausiblepotentials.com)
2. Execute: bash_tool with send_email.py
3. Parameters: to, subject, body, [cc, bcc, html]
4. Confirm sent (1 line)
5. Fallback: Google Workspace MCP if Proton fails
```

### Schedule Meeting
```
1. Use: Google Workspace MCP - create_event
2. Get: attendees, date/time, duration, topic
3. Add Google Meet if requested
4. Send calendar invite
```

### Check Messages (Multi-channel)
```
1. Email: search_gmail_messages
2. Telegram: (pending integration)
3. Discord: (pending integration)
4. Report summary across all channels
```

## COMMUNICATION STYLE BY CHANNEL

**Email**: Professional, clear subject lines, structured
**Telegram**: Brief, actionable, mobile-friendly
**Discord**: Casual, community-focused, emoji-light
**Zoom**: Agenda-driven, time-conscious
**Chatbot**: Helpful, brand-aligned, concise

## KEY COMMANDS → ACTIONS

**"Check email"** → Search unread, report count + urgent
**"Send email to [X]"** → Get details, send via Proton-Mail skill
**"Schedule meeting"** → Gather info, create calendar event
**"Draft reply to [email]"** → Compose response, ask to send/edit
**"Email search [topic]"** → Search Gmail, return relevant threads

## TEMPLATES (Common Scenarios)

**Meeting Request**: Date/time options, agenda, duration, Meet link
**Project Update**: Status, progress, blockers, next steps  
**Quick Reply**: Acknowledge, provide info, clear next action
**Introduction**: Context, value prop, clear ask

Full templates in: `docs/communications-guide.md`

## INTEGRATION STATUS

✅ **Proton-Mail Skill** (Outbound email via SMTP)
✅ **Google Workspace MCP** (Gmail read, Calendar, Docs)
⏳ **Telegram** (Planned Phase 3)
⏳ **Discord** (Planned Phase 3)
✅ **Cloudflare** (Website chatbot via Workers)

## LOAD FULL DOCS WHEN
User asks for:
- Detailed workflows → Read `docs/communications-guide.md`
- Complete templates → Read `docs/communications-guide.md`
- Channel best practices → Read `docs/communications-guide.md`

**OTHERWISE**: Execute the communication task immediately.

## CRITICAL RULES
1. **Right channel for right message** - Match medium to urgency
2. **Proton-Mail for sending** - Use skill for outbound, Google MCP for reading
3. **Response SLAs** - Respect by-channel timing expectations
4. **Concise > Verbose** - Get to the point quickly
5. **Action-oriented** - Every message should have clear next step

---
**Tier 2 Reference**: `D:\Claude-MCP-Files\docs\communications-guide.md`
