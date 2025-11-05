# Communications.md - Unified Communication Management

## Purpose
This skill enables Claude to help you manage, coordinate, and streamline communications across multiple channels: Telegram, Discord, virtual meetings (Zoom), email (team@plausiblePotentials.com), and PlausiblePotentials.com website chatbot.

## When to Use This Skill
Claude should reference this skill when you:
- Need to send or check messages across platforms
- Are scheduling or managing meetings
- Want to coordinate communication about a project
- Need to track important conversations
- Are managing the website chatbot
- Want to create communication templates
- Need to organize communication workflows
- Are doing communication audits or cleanup

## Core Philosophy

### The Communication Hub Model
```
📬 UNIFIED INBOX     → All channels monitored
    ↓
🎯 TRIAGE & ROUTE   → Categorize & prioritize
    ↓
💬 RESPOND          → Use right channel for context
    ↓
📝 DOCUMENT         → Capture key decisions/actions
    ↓
✅ FOLLOW UP        → Track commitments & next steps
```

### Key Principles
1. **Right Channel, Right Message** - Match communication type to platform
2. **Response SLAs** - Set clear response time expectations per channel
3. **Centralized Tracking** - One place to see all communication status
4. **Template & Automate** - Reduce repetitive communication work
5. **Archive & Search** - Make past communications findable

## Communication Channels Overview

### 1. Email (team@plausiblePotentials.com)
**Best For:**
- Formal business communication
- Document sharing and attachments
- Detailed proposals and agreements
- External stakeholder communication
- Anything requiring a paper trail

**Response SLA:** 24-48 hours

**Workflow Integration:**
- Link to project notes in Obsidian
- Track action items from emails
- Archive important decisions

### 2. Telegram
**Best For:**
- Quick updates and questions
- Real-time coordination
- Informal team communication
- Mobile-first interactions
- File sharing (images, docs)

**Response SLA:** 2-4 hours during work hours

**Workflow Integration:**
- Capture ideas from chats → Obsidian inbox
- Share project updates
- Quick decision-making

### 3. Discord
**Best For:**
- Community building
- Topic-based discussions (channels)
- Persistent chat history
- Screen sharing and voice
- Team collaboration spaces

**Response SLA:** 4-8 hours, depending on channel

**Workflow Integration:**
- Community feedback → Product ideas
- Support conversations → Knowledge base
- Event coordination → Calendar

### 4. Virtual Meetings (Zoom)
**Best For:**
- Complex discussions
- Stakeholder presentations
- Team brainstorming
- Workshops and training
- Client calls

**Response SLA:** Schedule in advance (24-48 hour notice)

**Workflow Integration:**
- Pre-meeting agendas
- During-meeting notes
- Post-meeting action items → Tasks

### 5. Website Chatbot (PlausiblePotentials.com)
**Best For:**
- Customer first-contact
- FAQ and basic support
- Lead capture
- Product information
- Routing to appropriate channel

**Response SLA:** Instant (automated) + 24h (human escalation)

**Workflow Integration:**
- Capture leads → CRM
- Common questions → Knowledge base
- Escalations → Email or Discord

## Obsidian Structure for Communications

```
Communications/
├── 00_Communications-Dashboard.md  ← Central hub
├── Templates/
│   ├── Email-Template-General.md
│   ├── Email-Template-Proposal.md
│   ├── Meeting-Agenda-Template.md
│   ├── Meeting-Notes-Template.md
│   └── Message-Template-Update.md
├── Active-Conversations/
│   ├── By-Project/              ← Group by project/topic
│   ├── By-Stakeholder/          ← Group by person/org
│   └── By-Channel/              ← Group by platform
├── Meeting-Notes/
│   └── [Year]/
│       └── [Month]/
├── Important-Threads/           ← Key decisions, agreements
└── Archive/
    └── [Year]/
        └── [Quarter]/
```

## Templates

### Template: Communications Dashboard

```markdown
# 📬 Communications Dashboard

Last Updated: {{date}}

## 🎯 Priority Responses Needed
| Channel | From | Topic | Due | Status |
|---------|------|-------|-----|--------|
|         |      |       |     |        |

## 📊 Channel Status
### Email (team@plausiblePotentials.com)
- Unread: XX
- Pending Response: XX
- Awaiting Reply: XX

### Telegram
- Active Chats: XX
- Unread: XX
- Follow-up Needed: XX

### Discord
- Active Channels: XX
- @Mentions: XX
- DMs: XX

### Upcoming Meetings
| Date | Time | Topic | Attendees | Status |
|------|------|-------|-----------|--------|
|      |      |       |           |        |

### Chatbot Status
- Conversations Today: XX
- Escalations: XX
- Response Rate: XX%

## 🗓️ This Week's Communication Plan
### Monday
- [ ] Email: 
- [ ] Meetings: 

### Tuesday
- [ ] 

### Wednesday
- [ ] 

### Thursday
- [ ] 

### Friday
- [ ] Weekly communication review

## 📝 Active Conversations
- [[Project A]] - Last: [channel], Next: [action]
- [[Project B]] - Last: [channel], Next: [action]

## 🎯 Communication Goals This Week
1. 
2. 
3. 

## ✅ Completed This Week
- 

---
*Daily Check: Morning & Evening*
*Weekly Review: Friday 4pm*
```

### Template: Meeting Agenda

```markdown
---
meeting_date: {{date}}
meeting_time: 
duration: 
attendees: 
meeting_link: 
status: scheduled
---

# Meeting: {{title}}

## 📋 Meeting Details
- **Date:** {{date}}
- **Time:** [Start] - [End] ([Duration])
- **Format:** Zoom / Discord / In-person
- **Link:** [Meeting URL]
- **Attendees:**
  - 
  - 
- **Organizer:** 

## 🎯 Meeting Objectives
1. 
2. 
3. 

## 📝 Agenda
### 1. [Topic] (XX min)
- Discussion points:
  - 
  - 

### 2. [Topic] (XX min)
- Discussion points:
  - 
  - 

### 3. Next Steps (5 min)
- Action items
- Follow-up scheduling

## 📎 Pre-Meeting Materials
- 
- 

## 🔗 Related
- Project: [[Project Name]]
- Previous Meeting: [[Link]]
- Next Meeting: [[Link]]

---
*Created: {{date}}*
*Meeting Notes: [[Link to notes]]*
```

### Template: Meeting Notes

```markdown
---
meeting_date: {{date}}
meeting_type: 
attendees: 
duration: 
recording: 
---

# Meeting Notes: {{title}}

## 📋 Meeting Info
- **Date:** {{date}}
- **Attendees:** 
- **Duration:** XX min
- **Recording:** [Link if available]
- **Agenda:** [[Link to agenda]]

## 📝 Discussion Summary
### [Topic 1]
- 
- 

### [Topic 2]
- 
- 

## ✅ Decisions Made
1. 
2. 
3. 

## 📋 Action Items
- [ ] [Action] - @[Person] - Due: [Date]
- [ ] [Action] - @[Person] - Due: [Date]
- [ ] [Action] - @[Person] - Due: [Date]

## 💡 Key Insights
- 
- 

## 📎 Resources Shared
- 
- 

## 🔄 Follow-Up
- Next Meeting: [Date/Time]
- Topics for Next Time:
  - 
  - 

## 🔗 Related
- Project: [[Project Name]]
- Previous Meeting: [[Link]]
- Related Discussions: 

---
*Notes by: [Name]*
*Distributed to: [List]*
*Date: {{date}}*
```

### Template: Email Tracking

```markdown
---
date_sent: {{date}}
channel: email
recipient: 
subject: 
priority: 
status: sent
---

# Email: {{subject}}

## 📧 Email Details
- **To:** 
- **From:** team@plausiblePotentials.com
- **Subject:** 
- **Date Sent:** {{date}}
- **Priority:** High/Medium/Low
- **Status:** Sent / Awaiting Reply / Replied / Closed

## 📝 Context
**Why I'm reaching out:**


**Key points:**
1. 
2. 
3. 

## 📎 Attachments
- 
- 

## 🎯 Desired Outcome
- 

## 📅 Follow-Up Plan
- First follow-up: [Date] if no response
- Second follow-up: [Date] if no response
- Close/Archive: [Date]

## 💬 Response Log
### {{date}}
- **From:** 
- **Summary:** 
- **Action:** 

## 🔗 Related
- Project: [[Link]]
- Previous Emails: [[Link]]

---
*Expected Response: [Timeframe]*
*Actual Response: [Timeframe]*
```

### Template: Quick Message Template

```markdown
# [Platform]: {{subject}}

**To:** 
**Purpose:** Quick update / Question / FYI / Action needed
**Priority:** 🔴 Urgent / 🟡 Normal / 🟢 Low

## Message:


## Next Steps:
- 

## Related:
- [[Project or Context]]

---
*Sent: {{date}}*
```

## Communication Workflows

### Workflow: Daily Communication Check (10 min)

**Morning Check (8am):**
1. Email - Scan for urgent items
2. Telegram - Check overnight messages
3. Discord - Review @mentions
4. Chatbot - Check escalations
5. Update dashboard with priority responses
6. Block time for responses

**Evening Check (5pm):**
1. Clear all responded items
2. Move pending items to tomorrow
3. Set follow-up reminders
4. Update dashboard status

### Workflow: Weekly Communication Review (30 min)

**Every Friday at 4pm:**

1. **Email Cleanup** (10 min)
   - Archive completed threads
   - Follow up on pending responses
   - File important threads to Obsidian

2. **Chat Audit** (10 min)
   - Telegram: Archive closed discussions
   - Discord: Update channels, close threads
   - Extract action items → Task system

3. **Meeting Review** (5 min)
   - Review upcoming week's meetings
   - Ensure all have agendas
   - Distribute any pending action items

4. **Dashboard Update** (5 min)
   - Update metrics
   - Plan next week's communication priorities
   - Set goals

### Workflow: Sending Important Email

**User says:** "I need to send an email to [person] about [topic]"

**Claude does:**
1. Create new note in `Active-Conversations/By-Project/`
2. Use email tracking template
3. Help draft email content:
   - Clear subject line
   - Concise context
   - Specific ask or information
   - Clear next steps
   - Professional close
4. Set follow-up reminders
5. Link to related project

### Workflow: Scheduling Meeting

**User says:** "Schedule a meeting about [topic] with [people]"

**Claude does:**
1. Create meeting agenda in `Meeting-Notes/[Year]/[Month]/`
2. Help define:
   - Clear objectives (max 3)
   - Timed agenda items
   - Required attendees
   - Pre-meeting materials needed
3. Suggest meeting length based on agenda
4. Create calendar reminder
5. Draft meeting invite text
6. Link to relevant project/context

### Workflow: Capturing Communication-Triggered Ideas

**User says:** "Someone suggested [idea] in [Discord/Telegram/Meeting]"

**Claude does:**
1. Create idea note in Productivity system inbox
2. Add context: Source, person, date
3. Link communication thread for reference
4. Note: "Process during weekly idea review"
5. Return to communication

### Workflow: Managing Chatbot Escalations

**User says:** "Check chatbot escalations"

**Claude does:**
1. Review escalation queue
2. Categorize each:
   - Sales inquiry → Create lead note
   - Support issue → Route to appropriate channel
   - General question → Update FAQ/chatbot
   - Bug report → Create issue
3. Respond or route appropriately
4. Update chatbot knowledge base if needed

## Channel Selection Matrix

**Use this to pick the right channel:**

| Need | Best Channel | Backup Channel |
|------|--------------|----------------|
| Urgent response needed | Telegram | Discord DM |
| Formal agreement/contract | Email | Email + meeting |
| Complex discussion | Zoom Meeting | Discord voice |
| Quick question | Telegram | Discord |
| Community engagement | Discord | Website chat |
| Document sharing | Email | Discord |
| Brainstorming session | Zoom | Discord voice |
| Status update | Telegram/Discord | Email |
| Customer first contact | Website chatbot | Email |
| Decision requiring discussion | Meeting → Email summary | Discord thread |

## Message Templates

### Template: Project Update (Multi-channel)

**Email Version:**
```
Subject: [Project Name] - Update [Date]

Hi [Name],

Quick update on [Project Name]:

✅ Completed:
- 
- 

🚀 In Progress:
- 
- 

🎯 Next Steps:
- 
- 

⚠️ Blockers/Needs:
- 

Timeline: [On track / Adjusted / Details]

Let me know if you have questions!

Best,
[Your name]
```

**Telegram/Discord Version:**
```
📊 [Project Name] Update

✅ Done: [brief bullets]
🚀 Doing: [brief bullets]
🎯 Next: [brief bullets]
⚠️ Blocks: [if any]

On track for [date]. Thoughts?
```

### Template: Meeting Follow-Up

```
Subject: Follow-up: [Meeting Topic] - [Date]

Hi [Attendees],

Thanks for the productive discussion today!

📝 Key Decisions:
1. 
2. 

✅ Action Items:
- [Name]: [Action] by [Date]
- [Name]: [Action] by [Date]

🔄 Next Meeting:
[Date/Time] to discuss [Topics]

📎 Resources:
- Meeting Notes: [Link]
- Mentioned Documents: [Links]

Let me know if I missed anything!

Best,
[Your name]
```

### Template: Response to Lead/Inquiry

```
Subject: Re: [Their Subject] - PlausiblePotentials

Hi [Name],

Thanks for reaching out to PlausiblePotentials!

[Answer their question specifically]

[If appropriate] I'd love to learn more about [their need/project]. 
Would you be open to a brief call? I have availability:
- [Option 1]
- [Option 2]
- [Option 3]

Or feel free to book directly: [Calendly link]

Looking forward to connecting!

Best,
[Your name]
PlausiblePotentials
team@plausiblePotentials.com
```

## Communication Metrics

### Response Metrics
- **Email Response Rate:** % responded within 24h
- **Message Response Rate:** % responded within 4h
- **Meeting Attendance:** % of scheduled meetings held
- **Chatbot Containment:** % resolved without escalation

### Quality Metrics
- **Action Item Completion:** % of meeting actions completed on time
- **Follow-up Success:** % of follow-ups that got response
- **Communication Clarity:** Track "clarifying questions" received

### Efficiency Metrics
- **Templates Used:** % of messages using templates
- **Time to Response:** Average hours to first response
- **Communication Time:** Hours per week on communication

## Integration Points

### With Productivity System
- **Capture:** Ideas from communications → Inbox
- **Coordination:** Project updates via communications
- **Documentation:** Meeting notes linked to projects

### With Calendar
- **Meetings:** Sync all meeting times
- **Follow-ups:** Create reminders for responses
- **Reviews:** Schedule communication reviews

### With Task Management
- **Action Items:** Meeting actions → Tasks
- **Responses:** Pending responses → Tasks
- **Follow-ups:** Scheduled follow-ups → Tasks

## Best Practices

### DO:
✅ Match channel to message urgency and formality
✅ Set clear expectations for response times
✅ Document important decisions in Obsidian
✅ Use templates for common communications
✅ Follow up on pending items regularly
✅ Archive completed conversations
✅ Extract action items from all communications
✅ Link communications to relevant projects

### DON'T:
❌ Use email for urgent matters (call/message instead)
❌ Let messages pile up without triage
❌ Forget to document meeting decisions
❌ Mix personal and business communications
❌ Skip meeting agendas (wastes time)
❌ Leave follow-ups hanging
❌ Lose track of action items
❌ Forget to check all channels daily

## Common Pitfalls & Solutions

### Pitfall: "I'm drowning in messages"
**Solution:**
1. Set specific check times (morning/evening only)
2. Turn off non-urgent notifications
3. Use templates for common responses
4. Batch process messages by channel
5. Set better boundaries on response times

### Pitfall: "Lost track of important conversation"
**Solution:**
1. Tag/flag important threads immediately
2. Copy to Obsidian for documentation
3. Create follow-up reminders
4. Use dashboard to track status
5. Regular weekly cleanup and archiving

### Pitfall: "Meetings have no outcomes"
**Solution:**
1. Require agenda before accepting meeting
2. Always document decisions during meeting
3. Share action items within 24h
4. Track action item completion
5. Hold people (including yourself) accountable

### Pitfall: "Chatbot is not helping"
**Solution:**
1. Review escalations weekly
2. Update FAQ based on common questions
3. Improve chatbot responses iteratively
4. Track success rate and adjust
5. Know when to route to human

### Pitfall: "Communication takes all my time"
**Solution:**
1. Use more templates and automation
2. Batch process instead of reactive checking
3. Set clearer boundaries on availability
4. Delegate communication when possible
5. Track time and identify bottlenecks

## Quick Reference Commands

When user says → Claude should:

**"Check my messages"** → Review all channels, create priority list
**"Draft email to [person]"** → Create email tracking note with template
**"Schedule meeting about [topic]"** → Create agenda template, suggest times
**"Update dashboard"** → Refresh all channel statuses and metrics
**"Follow up on [conversation]"** → Find thread, draft follow-up message
**"Summarize this week's communications"** → Generate weekly summary
**"Create meeting notes"** → Use meeting notes template
**"What needs response?"** → List priority pending items
**"Archive this conversation"** → Move to archive with metadata
**"Check chatbot escalations"** → Review and route escalations

## Advanced Features

### Automation Opportunities
- Email filters and labels
- Chatbot response improvements
- Meeting scheduler integration
- Reminder systems for follow-ups
- Dashboard auto-updates

### Analytics & Insights
- Communication time tracking
- Response rate analysis
- Channel effectiveness comparison
- Meeting productivity metrics
- Template usage and improvement

### Team Coordination
- Shared communication calendar
- Handoff protocols
- Escalation procedures
- Response coverage during time off
- Knowledge base building

## System Maintenance

### Daily (10 min)
- Morning/evening channel checks
- Update priority response list
- Clear completed items

### Weekly (30 min)
- Archive completed threads
- Process all action items
- Update dashboard
- Plan next week's communication priorities

### Monthly (60 min)
- Review metrics and trends
- Update templates based on usage
- Improve chatbot responses
- Optimize channel strategy
- Clean up old archives

---

## Claude's Response Patterns

When helping with communications, Claude should:

1. **Suggest Right Channel** - Guide user to appropriate platform
2. **Use Templates** - Offer relevant templates for common tasks
3. **Track Everything** - Create notes for important communications
4. **Set Reminders** - Suggest follow-up dates
5. **Link Context** - Connect communications to projects/ideas
6. **Be Professional** - Help craft clear, professional messages
7. **Capture Actions** - Extract and track commitments
8. **Review Regularly** - Prompt for daily/weekly reviews

---

*Skill Version: 1.0*
*Created: 2025-10-25*
*For: Multi-Channel Communication Management*
