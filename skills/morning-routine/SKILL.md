# Morning Routine Automation Skill

## Purpose
Automate JW's 7-9 AM deep work setup, transforming a 15-minute manual process into a 30-second automated workflow. Launch development environment, verify system health, and provide comprehensive status summary to begin the day efficiently.

## Deep Work Hours
**Sacred Time**: 7:00 AM - 9:00 AM CST  
**Goal**: Zero interruptions, maximum productivity  
**Setup Time**: < 1 minute (automated)

## Trigger Commands
- "CoCoA, morning setup"
- "CoCoA, good morning"
- "CoCoA, start my day"
- "morning routine"

## Workflow Phases

### Phase 1: Application Launch (10 seconds)
**Purpose**: Open all development tools simultaneously

**Applications to Launch:**
1. **Visual Studio Code** - Primary code editor
2. **Docker Desktop** - Container management
3. **GitHub Desktop** - Version control
4. **Obsidian** (optional) - Knowledge management

**Commands:**
```powershell
# Launch apps in parallel
Start-Process "code"
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
Start-Process "C:\Users\team\AppData\Local\GitHubDesktop\GitHubDesktop.exe"
```

**Wait**: 5 seconds for initialization

---

### Phase 2: C3 Alliance Health Check (5 seconds)
**Purpose**: Verify production environment is operational

**Checks:**
1. **Container Status**
   - `c3site-c3-alliance-1` (Node.js app)
   - `c3site-postgres-1` (PostgreSQL database)
   - Both should be "running"

2. **Resource Usage**
   - C3 Alliance app: ~110MB RAM baseline
   - PostgreSQL: Standard usage
   - Alert if > 500MB RAM

3. **Port Availability**
   - Verify port 5000 accessible
   - Check for port conflicts

**Actions:**
- If containers stopped → Offer to start them
- If errors detected → Flag for investigation
- If healthy → Confirm ready for development

---

### Phase 3: Log Review (5 seconds)
**Purpose**: Catch overnight issues before starting work

**Log Sources:**
1. **C3 Alliance Application Logs**
   - Last 50 lines
   - Scan for: ERROR, WARN, CRITICAL, EXCEPTION
   - Note timestamps of issues

2. **Docker System Logs**
   - Container restarts
   - Network issues
   - Resource warnings

**Report Format:**
- ✅ No issues → "All clear"
- ⚠️ Warnings → Count + brief summary
- 🚨 Errors → Detailed error list

---

### Phase 4: System Resources Check (3 seconds)
**Purpose**: Ensure adequate resources for development

**Metrics:**
- **Docker**: Should be ~724MB baseline
- **Claude Desktop**: Should be ~1.25GB
- **Total Containers**: Report running vs stopped
- **Total Images**: Count available

**Thresholds:**
- CPU > 80% sustained → Alert
- Memory > 90% → Alert
- Disk space < 10GB → Alert

---

### Phase 5: Obsidian Dashboard Check (optional, 2 seconds)
**Purpose**: Quick glance at today's priorities

**Actions:**
1. Check `000_Ideas-Dashboard.md` in Obsidian
2. Extract "Top 3 Focus This Week"
3. Check for scheduled weekly review
4. Note count of inbox items (if > 10, suggest review)

**Integration**: Uses Obsidian Management Skill

---

### Phase 6: Morning Summary Report (2 seconds)
**Purpose**: Present comprehensive status in readable format

**Report Structure:**
```
🌅 GOOD MORNING, JW!

⏰ Time: [Current Time] CST
📅 Date: [Today's Date]

✅ DEVELOPMENT ENVIRONMENT
   • VS Code: Launched
   • Docker Desktop: Running
   • GitHub Desktop: Ready
   • Obsidian: Available

✅ C3 ALLIANCE STATUS
   • Application: Running (Port 5000)
   • Database: Connected
   • Resources: 110MB RAM, 0% CPU
   • Recent Logs: All Clear ✅
   [OR]
   • Recent Logs: 2 warnings detected ⚠️
     - [Warning 1 summary]
     - [Warning 2 summary]

✅ SYSTEM HEALTH
   • Docker: 7 containers (2 running, 5 stopped)
   • Resources: Healthy (1.95GB used)
   • Images: 13 available

📋 TODAY'S FOCUS (from Obsidian)
   1. [Priority 1]
   2. [Priority 2]
   3. [Priority 3]

💡 INBOX STATUS
   • Ideas to process: [X] ideas
   [If >10: "💭 Consider quick inbox review"]

🚀 READY FOR DEEP WORK (7-9 AM)
   Deep work hours in session. System optimized.

---
Time saved: ~14 minutes | Total workflow: 27 seconds
```

---

## Error Handling

### Scenario: Containers Stopped
```
⚠️ C3 ALLIANCE NOT RUNNING

The following containers are stopped:
• c3site-c3-alliance-1 (Application)
• c3site-postgres-1 (Database)

Would you like me to start them?
[Awaits user confirmation]
```

**Action**: Wait for "yes" → Start containers → Re-check → Confirm

---

### Scenario: Errors in Logs
```
🚨 ERRORS DETECTED IN LOGS

Found 3 errors in last 50 lines:
1. [07:23:15] ERROR: Database connection timeout
2. [07:24:02] ERROR: Failed to fetch user data
3. [07:25:18] CRITICAL: Service unavailable

Recommend investigating before proceeding.
```

**Action**: Present errors → Suggest investigation → Await user decision

---

### Scenario: Application Launch Failure
```
⚠️ LAUNCH FAILED: GitHub Desktop

Could not launch GitHub Desktop.
• Possible cause: Application not installed or path incorrect
• Action: Continuing with remaining workflow

Recommend manual launch if needed.
```

**Action**: Note failure → Continue workflow → Include in summary

---

### Scenario: High Resource Usage
```
⚠️ HIGH RESOURCE USAGE DETECTED

System resources above normal:
• Docker: 1.2GB (baseline: 724MB) - +66%
• Total RAM usage: 14.2GB / 16GB - 89%

This may impact performance during deep work.
Consider:
• Closing unused applications
• Restarting Docker Desktop
• Checking for runaway processes
```

**Action**: Alert → Suggest remedies → Await user decision

---

## Customization Options

### Minimal Mode
**Trigger**: "CoCoA, quick morning"
- Skip application launches
- Status checks only
- Condensed report

### Verbose Mode
**Trigger**: "CoCoA, morning setup verbose"
- Full detailed logs
- All metrics included
- Extended system information

### Weekend Mode
**Trigger**: "CoCoA, weekend morning"
- Skip work containers check
- Personal projects focus
- Relaxed timeline

### Add Custom Applications
**Configuration**: Specify additional apps to launch
- Telegram Desktop
- Proton Mail (when available)
- Specific VS Code workspace
- Browser with tabs

---

## Integration Points

### With Obsidian Management Skill
- Check Ideas Dashboard
- Surface today's priorities
- Alert on inbox size
- Remind of weekly review schedule

### With C3 Alliance Project
- Verify production environment
- Monitor deployment health
- Check for overnight issues
- Resource optimization

### With Communications Skill
- Check for urgent messages (when Proton skill available)
- Surface meeting reminders
- Note action items from yesterday

### With Docker MCP
- Container status and control
- Resource monitoring
- Log retrieval
- Image management

### With Windows MCP
- Application launching
- Process monitoring
- System information
- PowerShell execution

---

## Performance Metrics

### Time Savings
- **Manual setup**: ~15 minutes
  - Launch apps: 2 min
  - Check Docker: 3 min
  - Review logs: 5 min
  - Check Obsidian: 2 min
  - Mental context: 3 min

- **Automated setup**: ~30 seconds
  - Everything: 27 seconds
  - Reading summary: 3 seconds

- **Net savings**: 14+ minutes per day
- **Weekly savings**: 70 minutes
- **Monthly savings**: 280 minutes (4.67 hours)

### Success Criteria
✅ All apps launched and ready  
✅ C3 Alliance verified healthy  
✅ No critical errors  
✅ Resources within normal range  
✅ Today's priorities identified  
✅ Clear status summary provided  
✅ User ready to start deep work  

---

## Usage Examples

### Example 1: Normal Morning
```
You: "CoCoA, morning setup"

CoCoA: [Launches applications]
       [Checks systems]
       [Reviews logs]
       [Presents summary]

       🌅 GOOD MORNING, JW!
       
       ⏰ 7:02 AM CST
       📅 Wednesday, October 29, 2025
       
       ✅ Development environment ready
       ✅ C3 Alliance running smoothly
       ✅ System resources healthy
       
       📋 TODAY'S FOCUS:
       1. Complete CoCoA Phase 3 morning routine
       2. Review C3 Alliance deployment
       3. Weekly idea processing
       
       🚀 Ready for deep work!
```

### Example 2: Issues Detected
```
You: "CoCoA, good morning"

CoCoA: [Launches applications]
       [Detects stopped containers]
       
       ⚠️ C3 ALLIANCE NOT RUNNING
       
       Containers are stopped. Start them?
       
You: "Yes, start them"

CoCoA: [Starting containers...]
       ✅ c3site-c3-alliance-1 started
       ✅ c3site-postgres-1 started
       
       [Presents full summary]
       
       All systems now operational. Ready for development!
```

### Example 3: Quick Status Only
```
You: "CoCoA, quick morning"

CoCoA: ✅ C3 Alliance: Running
       ✅ Docker: Healthy (2 containers up)
       ✅ Resources: Normal
       ✅ Logs: All clear
       
       Ready for deep work!
```

---

## Implementation Notes

### Technical Requirements
- **Windows MCP**: Application launching, PowerShell
- **Docker MCP**: Container management, logs
- **Filesystem MCP**: Obsidian file access (optional)
- **Execution Time**: Target < 30 seconds total

### Error Resilience
- Continue workflow even if steps fail
- Report failures in summary
- Offer remediation options
- Never crash the entire routine

### User Experience
- Clear, scannable output
- Action-oriented language
- Emoji for visual parsing
- Minimal unnecessary detail
- Focus on actionable information

---

## Future Enhancements

### Phase 4 Ideas
- **Calendar Integration**: Show today's meetings (requires Proton/Google)
- **Email Summary**: Urgent overnight emails (requires Proton skill)
- **Weather**: Quick weather check for Houston
- **Git Status**: Uncommitted changes across repos
- **Telegram**: Unread message count
- **Blockchain**: Monitor deployed contracts (when applicable)

### Automation Level 2
- **Predictive**: Anticipate needs based on calendar
- **Adaptive**: Adjust based on day of week
- **Proactive**: Restart containers before issues occur
- **Intelligent**: Learn from patterns

---

**Skill Version**: 1.0  
**Created**: October 29, 2025  
**For**: JW's 7-9 AM Deep Work Setup  
**Time Zone**: Central Time (Houston, Texas)  
**Next Review**: After 1 week of use (November 5, 2025)
