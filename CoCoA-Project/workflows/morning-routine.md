# CoCoA Morning Routine Workflow

**Purpose**: Automate your 7-9 AM deep work setup  
**Time Saved**: 14+ minutes → 10 seconds  
**Trigger**: "CoCoA, morning setup" or "CoCoA, good morning"

---

## Workflow Sequence

### Phase 1: Application Launch (10 seconds)
1. Launch Visual Studio Code
2. Launch Docker Desktop
3. Launch GitHub Desktop
4. Wait 5 seconds for applications to initialize

### Phase 2: System Health Check (5 seconds)
1. Check C3 Alliance container status (c3site-c3-alliance-1)
2. Check PostgreSQL container status (c3site-postgres-1)
3. Verify both containers are running
4. Check resource usage (CPU, memory)

### Phase 3: Obsidian Dashboard Update (3 seconds)
1. Open Daily-Dashboard.md from PPC vault
2. Replace Templater date syntax with today's actual date
3. Update: `![[Life-Management/Daily-Notes/<% tp.date.now("YYYY-MM-DD") %>#Schedule]]`
4. To: `![[Life-Management/Daily-Notes/2025-11-04#Schedule]]` (using current date)
5. Verify daily note exists for today

### Phase 4: Log Review (5 seconds)
1. Get last 50 lines from C3 Alliance logs
2. Scan for errors, warnings, critical issues
3. Report any problems found

### Phase 5: System Information (2 seconds)
1. Check total system resources
2. Verify Docker Desktop is running
3. Count running vs stopped containers

### Phase 6: Morning Summary (2 seconds)
1. Display comprehensive status report
2. Highlight any issues requiring attention
3. Confirm system ready for development

**Total Execution Time: ~27 seconds**  
**Manual Time Saved: 15+ minutes** (includes Obsidian dashboard prep)

---

## Success Criteria

✅ All development applications launched and ready  
✅ C3 Alliance production environment verified healthy  
✅ No critical errors in recent logs  
✅ System resources within normal range  
✅ Clear status summary provided

---

## Error Handling

**If container is stopped:**
- Report status
- Offer to start container
- Wait for user confirmation

**If errors found in logs:**
- Show error summary
- Provide context (timestamp, severity)
- Suggest investigation

**If application launch fails:**
- Report which application
- Suggest manual launch
- Continue with remaining workflow

---

## Customization Options

**Add/Remove Applications:**
- Obsidian for note-taking
- Telegram for communications
- Proton Mail for email
- Specific VS Code workspace

**Adjust Timing:**
- Longer wait for slower systems
- Parallel launches for speed
- Custom delays between steps

**Report Detail Level:**
- Verbose: Full details
- Normal: Summary only
- Minimal: Issues only

---

## Usage Examples

**Basic Morning Setup:**
```
You: "CoCoA, morning setup"
CoCoA: [Executes full workflow, reports status]
```

**Quick Status Only:**
```
You: "CoCoA, morning status"
CoCoA: [Skips launches, just checks systems]
```

**With Additional Apps:**
```
You: "CoCoA, morning setup with Obsidian"
CoCoA: [Adds Obsidian to launch sequence]
```

---

**Created**: October 24, 2025  
**Last Updated**: November 4, 2025  
**Status**: Active (includes Daily-Dashboard automation)
