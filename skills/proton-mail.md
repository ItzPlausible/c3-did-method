---
name: proton-mail
description: Proton Mail email operations via SMTP. Load when user mentions Proton, sending email, or checking team@plausiblepotentials.com. Integrates with communications-core skill.
---

# Proton Mail Integration

**Email**: team@plausiblepotentials.com  
**Script**: `D:\Claude-MCP-Files\skills\email-scripts\send_email.py`  
**Protocol**: SMTP via smtp.protonmail.ch:587

## ACTIVATE WHEN
- "Send email" / "Email [person]"
- "Check Proton" / "Check email"
- "Draft email" / "Reply to [subject]"
- Working with team@plausiblepotentials.com
- Communications workflow needs Proton

## QUICK ACTIONS

### Send Email
```bash
python "D:\Claude-MCP-Files\skills\email-scripts\send_email.py" \
  --to "recipient@example.com" \
  --subject "Your Subject" \
  --body "Your message"
```

**With CC/BCC:**
```bash
--cc "person1@example.com,person2@example.com" \
--bcc "archive@example.com"
```

**HTML Email:**
```bash
--html --body "<h1>Title</h1><p>Content</p>"
```

### Command Patterns

**"Send email to [X] about [Y]"**
→ Get: recipient, subject, body
→ Execute: bash_tool with send_email.py
→ Confirm: "Email sent to [X]" (1 line)
→ No long explanations unless error

**"Draft email"**
→ Gather: to, subject, body
→ Show draft for review
→ Ask: "Send now or edit?"
→ Execute on confirmation

**"Reply to [email/person]"**
→ Use context if provided
→ Draft response
→ Execute with proper subject (Re: ...)

**"Check Proton inbox"**
→ Note: No read capability yet
→ Response: "Proton doesn't support IMAP/POP3 via MCP. Use Proton Mail app or suggest Google Workspace MCP for checking email."
→ Future: Bridge via Proton Bridge when available

## EMAIL TEMPLATES

### Project Update
```
Subject: [Project Name] - Update [Date]

Hi [Name],

Quick update on [project]:

Progress: [what's done]
Current: [what's in progress]
Next: [what's coming]
Blockers: [any issues]

Let me know if you have questions.

Best,
JW
```

### Meeting Request
```
Subject: Meeting Request - [Topic]

Hi [Name],

I'd like to schedule time to discuss [topic].

Available times (CST):
- [Option 1]
- [Option 2]
- [Option 3]

Meeting will be ~[duration] minutes via [Zoom/Google Meet].

Let me know what works best.

Thanks,
JW
```

### Quick Response
```
Subject: Re: [Original Subject]

Hi [Name],

[Direct answer/acknowledgment]

[Action item or next step]

Best,
JW
```

## INTEGRATION WITH COMMUNICATIONS-CORE

**When communications-core loads:**
- Proton Mail = primary email tool for sending
- Google Workspace MCP = checking/reading (until Proton Bridge)
- Match response SLAs: 24-48 hours for business email

**Priority Flow:**
1. Urgent → Telegram
2. Business → Proton Mail (team@plausiblepotentials.com)
3. Formal → Proton with CC/BCC as needed
4. Internal → Discord or Google Chat

## COMMON RECIPIENTS

**Plausible Potentials**: team@plausiblepotentials.com (JW's primary)  
**Personal**: [Add as needed during usage]  
**Business Contacts**: [Load from contacts when needed]

## EXECUTION RULES

1. **Concise confirmations** - "Sent to [X]" not paragraphs
2. **Error handling** - Show error, suggest fix, don't retry automatically
3. **Security** - Never log credentials or full email content in responses
4. **Speed** - Execute immediately when all info provided
5. **Clarity** - Ask for missing info (to/subject/body) once, clearly

## LIMITATIONS & WORKAROUNDS

**Can't Read Email:**
- Proton Bridge required for IMAP/POP3
- Use Google Workspace MCP for reading until Bridge setup
- Or: Manual check in Proton Mail app

**Can't Search:**
- Same limitation - no read access
- Workaround: Ask JW to forward specific emails

**Can't Manage Folders/Labels:**
- SMTP send-only via this integration
- Full management requires Proton Bridge

## RESPONSE PATTERNS

**Success:**
```
✅ Email sent to recipient@example.com
Subject: [subject]
```

**Error:**
```
❌ Failed to send email
Error: [error message]
Try: [specific fix suggestion]
```

**Need Info:**
```
To send email, I need:
- To: [if missing]
- Subject: [if missing]
- Body: [if missing]
```

## BASH EXECUTION TEMPLATE

```python
# Basic send
bash_tool: python "D:\Claude-MCP-Files\skills\email-scripts\send_email.py" --to "user@example.com" --subject "Test" --body "Message"

# With all options
bash_tool: python "D:\Claude-MCP-Files\skills\email-scripts\send_email.py" --to "user@example.com" --subject "Test" --body "Message" --cc "cc@example.com" --bcc "bcc@example.com" --html
```

## KEY COMMANDS

| User Says | Action |
|-----------|--------|
| "Email [X]" | Get subject/body → send |
| "Send Proton email" | Get to/subject/body → send |
| "Draft email" | Compose → review → send |
| "Reply to [X]" | Use context → draft → send |
| "Check Proton" | Explain limitation + suggest workaround |

## SKILL SYNERGY

**Loads WITH:**
- communications-core (multi-channel coordination)
- cocoa (JW's preferences and context)

**References:**
- Communications-guide.md (detailed templates - D:\Claude-MCP-Files\docs\)
- Profile.md (JW's email habits - D:\Claude-MCP-Files\CoCoA-Project\context\)

---

**Token Budget**: Lean trigger → ~170 lines vs 800+ in verbose skills  
**Execution**: Fast, minimal explanation, action-oriented  
**Integration**: Seamless with communications-core workflow
