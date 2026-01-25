# Period Review System - Quick Start Guide

> **For:** JW  
> **System:** CoCoA Interactive Period Reviews  
> **Version:** 1.0

---

## What Changed?

**Old System (BROKEN):**
- Script auto-generated meaningless placeholder content
- Reviews had generic reflections like "(Add reflections as needed)"
- No actual conversation or input from you
- Defeated the entire purpose of reflection

**New System (FIXED):**
- Script gathers stats automatically
- **You have a conversation with CoCoA** to capture real insights
- Review files contain YOUR actual reflections
- Meaningful, useful reviews

---

## How It Works

### 3-Phase Workflow

```
4:00 PM → Stats Script Runs → Notification Appears
   ↓
You open Claude Desktop → Conversation with CoCoA
   ↓
CoCoA saves responses → Finalization Script Runs → Done!
```

### Your Daily Routine

**At 4:00 PM:**
1. Desktop notification appears: "CoCoA: Ready for Period Review"
2. Open Claude Desktop
3. Say something like: "Ready for review" or "Let's do my review"

**During Conversation (5-10 minutes):**
4. CoCoA asks you questions about your day/week/month
5. You answer naturally - just reflect honestly
6. CoCoA captures your responses

**Automatic Completion:**
7. CoCoA saves everything and runs finalization
8. Review files generated with YOUR content
9. Tomorrow's Daily-Focus.md created
10. Done!

---

## What CoCoA Will Ask

### Daily Review Questions (EOD)
1. "How did today go overall? What stood out?"
2. "Your deep work task was: '[task]' - how did that session go?"
3. "What blocked or slowed you down today?"
4. "What's your #1 priority for tomorrow's deep work block?"

### Weekly Review Questions (EOW)
1. "What were your biggest wins this week?"
2. "What challenges came up?"
3. "What did you learn this week?"
4. "What are your top 3 priorities for next week?"

### Monthly Review Questions (EOM)
1. "What were the major accomplishments this month?"
2. "Which projects moved forward? Which stalled?"
3. "What patterns do you notice in how you're working?"
4. "What are your strategic priorities for next month?"

*Quarterly and Annual reviews have similar strategic questions*

---

## Multi-Period Days

**When multiple periods end on the same day** (like Friday = EOD + EOW):
- CoCoA does the shorter review first (daily)
- Then progresses to longer periods (weekly)
- Uses context from shorter reviews in longer ones
- Smooth transitions: "Great. Now let's zoom out to the full week..."

**Example Multi-Period Days:**
- **Every Friday:** EOD + EOW
- **Last day of month:** EOD + EOM (+ EOW if Friday)
- **Dec 31:** All periods (if it's Friday: EOD + EOW + EOM + EOQ + EOY)

---

## File Locations

### Review Files Saved To:
```
C:\PlausiblePotentials-Files\My files\My Notes\PPC\Next-Actions\
├── EOD-Reviews\
│   └── 2025-11-03-Daily.md
├── EOW-Reviews\
│   └── 2025-11-03-Weekly.md
├── EOM-Reviews\
│   └── 2025-11-Monthly.md
├── EOQ-Reviews\
│   └── 2025-Q4-Quarterly.md
└── EOY-Reviews\
    └── 2025-Annual.md
```

### System Files:
```
D:\Claude-MCP-Files\CoCoA-Project\workflows\
├── period-review-stats.ps1         # Phase 1 (scheduled)
├── period-review-finalize.ps1      # Phase 3 (auto-triggered)
├── period-review-templates\        # Templates
│   ├── daily-template.md
│   ├── weekly-template.md
│   ├── monthly-template.md
│   ├── quarterly-template.md
│   └── annual-template.md
└── temp\
    ├── review-context.json         # Stats data
    └── review-responses.json       # Your responses
```

---

## Tips for Good Reviews

### Be Honest
- Don't sugarcoat or perform
- Reflections are for you, not for show
- Acknowledge both wins and struggles

### Be Specific
- Instead of: "Got some work done"
- Try: "Completed the architecture design doc for period reviews"

### Be Forward-Thinking
- Use reviews to identify patterns
- Spot recurring blockers
- Adjust strategy based on what's working/not working

### Be Brief But Substantive
- You don't need essays
- But one-word answers aren't useful either
- Aim for 1-3 sentences per response

---

## Troubleshooting

### "I didn't get a notification"
- Check that scheduled task is running
- Verify task is set to: `period-review-stats.ps1`
- Check task history in Task Scheduler
- Run script manually: `.\period-review-stats.ps1`

### "CoCoA doesn't see the review context"
- Check if `temp\review-context.json` exists
- If not, run: `.\period-review-stats.ps1`
- Then start conversation again

### "Conversation got interrupted"
- Your responses are saved in `review-responses.json`
- Can resume by saying "Let's finish my review"
- CoCoA will skip questions already answered

### "Review files have weird placeholders"
- This means finalization script didn't run
- Manually run: `.\period-review-finalize.ps1`
- Check temp\ folder for both JSON files

### "Script won't run - execution policy error"
```powershell
# Run with bypass flag:
powershell.exe -ExecutionPolicy Bypass -File "D:\...\period-review-stats.ps1"
```

---

## Testing the New System

### First Time Setup

**Step 1: Test Stats Script**
```powershell
cd D:\Claude-MCP-Files\CoCoA-Project\workflows
.\period-review-stats.ps1 -TestMode
```
- Should show what it would do without actually doing it
- Verify periods detected correctly
- Check stats match your Daily-Focus.md

**Step 2: Test Conversation**
1. Run stats script for real (no `-TestMode`)
2. Open Claude Desktop
3. Say "I'm ready for my review"
4. Complete conversation
5. Verify review files generated

**Step 3: Check Output Quality**
1. Open your review files
2. Verify NO placeholder text like "{{USER_*}}"
3. Check that YOUR responses are in the files
4. Verify next Daily-Focus.md looks good

---

## What Success Looks Like

After one week of using the new system:

✅ Reviews happen at 4 PM automatically
✅ Conversations feel natural and quick
✅ Review files contain meaningful content
✅ You actually WANT to do the reviews (not a chore)
✅ Next-day priorities are clear and actionable
✅ You're gaining insights from the reflection process

---

## Getting Help

### In Conversation with CoCoA
- Just tell CoCoA if something's unclear
- CoCoA can adjust questions or skip sections
- Can exit and resume later if needed

### Technical Issues
- Check `IMPLEMENTATION-TESTING.md` for detailed troubleshooting
- Review script output for error messages
- Check temp\ folder for JSON files to debug

### Want to Modify
- Templates are in `period-review-templates\`
- Questions defined in `COCOA-CONVERSATION-FLOW.md`
- Both are easy to customize

---

## Quick Commands Reference

```powershell
# Test stats gathering
.\period-review-stats.ps1 -TestMode

# Run stats gathering for real
.\period-review-stats.ps1

# Manually run finalization (if needed)
.\period-review-finalize.ps1

# View context data
Get-Content temp\review-context.json | ConvertFrom-Json

# View your responses
Get-Content temp\review-responses.json | ConvertFrom-Json

# Check scheduled task
Get-ScheduledTask -TaskName "*Period Review*"
```

---

## Timeline

**Ready to Deploy:** Now  
**First Test Run:** Next 4 PM  
**Week 1:** Monitor and adjust  
**Week 2+:** Should be running smoothly

---

*System built with ❤️ by JW & CoCoA - November 2025*
