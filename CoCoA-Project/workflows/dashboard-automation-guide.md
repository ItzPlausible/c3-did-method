# Daily-Dashboard Automation Guide

**Created**: November 4, 2025  
**Purpose**: Automatically update Daily-Dashboard with today's schedule  
**Integration**: Part of CoCoA Morning Routine (Phase 3)

---

## Overview

The Daily-Dashboard displays your daily schedule by transcluding the #Schedule section from your daily note. This automation ensures the dashboard always shows TODAY's schedule without manual intervention.

---

## Technical Details

### Files Involved

**Dashboard File:**  
`C:\PlausiblePotentials-Files\My files\My Notes\PPC\Life-Management\Daily-Dashboard.md`

**Daily Note Location:**  
`C:\PlausiblePotentials-Files\My files\My Notes\PPC\Life-Management\Daily-Notes\YYYY-MM-DD.md`

**Daily Note Template:**  
`C:\PlausiblePotentials-Files\My files\My Notes\PPC\Templates\Daily-Note-Template.md`

### The Problem

**Original Syntax (doesn't work):**
```markdown
![[Life-Management/Daily-Notes/{{date:YYYY-MM-DD}}#Schedule]]
```

**Why it fails:**
- Templater syntax (`{{date}}`) only works when template is being inserted
- When viewing the file, Obsidian doesn't evaluate the date placeholder
- Result: Broken link, no schedule display

### The Solution

**Templater Syntax (needs trigger):**
```markdown
![[Life-Management/Daily-Notes/<% tp.date.now("YYYY-MM-DD") %>#Schedule]]
```

**After CoCoA Automation (actual link):**
```markdown
![[Life-Management/Daily-Notes/2025-11-04#Schedule]]
```

**Why this works:**
- CoCoA reads the current date
- Replaces the Templater syntax with the actual date
- Creates a working link to today's daily note
- Transclusion displays the #Schedule section

---

## Automation Workflow

### Trigger
Say: **"CoCoA, morning setup"** or **"CoCoA, good morning"**

### Execution Steps

1. **Read Dashboard File**
   - Open: `Daily-Dashboard.md`
   - Locate the Today's Overview section
   - Find the schedule transclusion line

2. **Get Current Date**
   - Format: YYYY-MM-DD (e.g., 2025-11-04)
   - Use system date/time

3. **Replace Syntax**
   - Find: `![[Life-Management/Daily-Notes/<% tp.date.now("YYYY-MM-DD") %>#Schedule]]`
   - Replace with: `![[Life-Management/Daily-Notes/2025-11-04#Schedule]]`
   - Save file

4. **Verify Daily Note**
   - Check if today's daily note exists
   - If missing, offer to create from template
   - Confirm #Schedule section exists

5. **Report Status**
   - ✅ Dashboard updated successfully
   - ✅ Daily note verified
   - ✅ Schedule transclusion active

---

## Error Handling

### Issue: Daily Note Missing
**Detection**: Today's daily note file doesn't exist  
**Response**:
```
⚠️ Daily note for 2025-11-04 not found.
Would you like me to create it from template? (yes/no)
```

### Issue: No #Schedule Section
**Detection**: Daily note exists but has no #Schedule heading  
**Response**:
```
⚠️ Daily note exists but missing #Schedule section.
This may be expected if using an older template.
Dashboard updated anyway - add #Schedule to your daily note manually.
```

### Issue: Dashboard File Not Found
**Detection**: Daily-Dashboard.md is missing  
**Response**:
```
❌ Daily-Dashboard.md not found at expected location.
Please verify file location or restore from backup.
```

---

## Manual Override

If you need to manually trigger just the dashboard update:

**Command**: "CoCoA, update dashboard"

**What it does**:
- Skips application launches
- Skips system health checks
- Only updates Daily-Dashboard.md
- Quick 2-second operation

---

## Testing & Validation

### Test Checklist

- [ ] Dashboard shows correct date after automation
- [ ] Schedule section displays properly
- [ ] Daily note exists and is accessible
- [ ] #Schedule heading is present
- [ ] Time blocks visible in dashboard
- [ ] Deep Work block displays correctly

### Validation Script

Run these checks manually:
1. Open `Daily-Dashboard.md` in Obsidian
2. Check "Today's Overview" section
3. Verify schedule is visible (not a broken link)
4. Confirm date matches today
5. Check that time blocks are displaying

---

## Maintenance Notes

### When Daily Note Template Changes

If you update your daily note template structure:
1. Ensure #Schedule heading remains
2. Test transclusion in dashboard
3. Verify automation still works
4. Update this guide if needed

### If Moving Files

If you reorganize your vault structure:
1. Update file paths in automation
2. Test morning routine
3. Update documentation
4. Verify all links work

### Backup Strategy

**Files to backup regularly:**
- Daily-Dashboard.md
- Daily note template
- Morning routine workflow
- CoCoA skill file

---

## Future Enhancements

**Potential Improvements:**
- Auto-create daily note if missing
- Smart scheduling suggestions
- Task carry-over from yesterday
- Priority extraction from calendar
- Weather and location context

---

## Troubleshooting

### Dashboard shows old date
**Fix**: Run "CoCoA, morning setup" again

### Schedule not displaying
**Check**:
1. Is today's daily note created?
2. Does it have #Schedule heading?
3. Is the link syntax correct?
4. Try opening daily note manually

### Templater syntax still visible
**Fix**: Automation didn't run - trigger morning routine

### Link is broken
**Check**:
1. Daily note file name format (should be YYYY-MM-DD.md)
2. File location (should be in Daily-Notes folder)
3. #Schedule heading exists in daily note

---

## Support

**For issues or questions:**
1. Check this guide first
2. Review morning-routine.md
3. Inspect Daily-Dashboard.md manually
4. Ask CoCoA: "What's wrong with my dashboard?"

---

**Integration**: Fully integrated with CoCoA Morning Routine  
**Status**: Active and tested  
**Next Review**: As needed or when template structure changes
