# Period Review Redesign - Starter Prompt

## Problem Statement

The current `period-review.ps1` script auto-generates review content without user input, creating meaningless reflection sections, insights, and priorities. This defeats the purpose of a meaningful review process.

## Current Behavior (BROKEN)

```
Script runs → Detects periods → Generates files → Populates with generic/AI content → Done
```

**Issues:**
- ❌ Reflection sections written without asking anything
- ❌ Insights/learnings generated without user input  
- ❌ Next priorities set without consultation
- ❌ No interactive conversation happens
- ❌ Reviews contain placeholder/auto-generated content instead of real reflections

## Desired Behavior (TARGET)

```
1. Script Phase 1: Stats gathering + period detection
2. CoCoA Interactive Phase: Conversation-driven review
3. Script Phase 2: File generation with real content
```

### Interactive Review Flow

**Daily Review Questions:**
- "How did today go? What stood out?"
- "Did you complete your deep work block? What was accomplished?"
- "What blocked or slowed you down?"
- "What's your #1 priority for tomorrow?"

**Weekly Review Questions:**
- "What were your wins this week?"
- "What challenges came up?"
- "What did you learn?"
- "Looking at next week - what are your top 3 priorities?"

**Monthly Review Questions:**
- "What were the major accomplishments this month?"
- "What projects moved forward? What stalled?"
- "What patterns do you notice in how you're working?"
- "What are your strategic priorities for next month?"

## Technical Architecture

### Proposed Solution

**File Structure:**
```
period-review.ps1        → Stats gathering + period detection (unchanged)
period-review-interactive.ps1 → Orchestrates the conversation
review-templates/        → Template files with placeholder sections
```

**Workflow:**
1. `period-review.ps1-Interactive` runs at 4 PM
2. Gathers stats (completion rates, tasks, etc.)
3. Detects period boundaries (EOD/EOW/EOM/EOQ/EOY)
4. Creates scaffold files with stats sections populated
5. **Stops and prompts:** "CoCoA: Ready for your [PERIOD] review conversation"
6. CoCoA asks questions, you respond
7. CoCoA populates review sections with YOUR responses
8. Script finalizes files and updates Daily-Focus.md
9. Desktop notification confirms completion

### Current Script Location
`D:\Claude-MCP-Files\CoCoA-Project\workflows\period-review.ps1`

### Output Locations
- Reviews: `C:\PlausiblePotentials-Files\My files\My Notes\PPC\Next-Actions\[PERIOD]-Reviews\`
- Focus: `C:\PlausiblePotentials-Files\My files\My Notes\PPC\Next-Actions\Daily-Focus.md`

## Success Criteria

✅ Script gathers stats automatically (no user input needed)
✅ Script detects period boundaries automatically  
✅ CoCoA initiates interactive review conversation
✅ User provides all reflection content through conversation
✅ Review files contain ONLY user-provided insights
✅ Next priorities are explicitly discussed and confirmed
✅ Process feels natural and conversational, not form-filling
✅ Can handle multiple period boundaries (e.g., EOD+EOW+EOM)

## Technical Considerations

**Data Flow:**
- Stats → PowerShell can calculate
- Reflections → Must come from user conversation
- Priorities → Must come from user + project scanning

**Template Sections:**
- Auto-populate: Date, stats, completion rates, detected periods
- User-provided: Reflections, insights, blockers, priorities, notes

**Conversation Management:**
- CoCoA needs to track which periods to review
- Ask appropriate questions for each period type
- Capture responses and format for file output
- Handle multi-period reviews (ask all questions, then generate all files)

## Next Steps

1. Review existing `period-review.ps1` to understand stats gathering
2. Design template structure with clear auto/manual sections
3. Create conversation flow script for CoCoA
4. Build file population logic that uses conversation responses
5. Test with mock review conversation
6. Integrate with existing workflow automation

## Files to Review

- Current script: `D:\Claude-MCP-Files\CoCoA-Project\workflows\period-review.ps1`
- Daily-Focus template: Check current Monday template in Daily-Focus.md
- Existing review files: Check what garbage was auto-generated (2025-10-31-*.md)

## Context

- User: JW, Managing Director at Plausible Potentials
- Work hours: 7 AM - 4 PM Central Time
- Deep work: 7-9 AM daily
- Review runs at 4 PM via scheduled task
- Part of CoCoA (Claude Cooperative Assistant) automation system
- User prefers conversational interaction over form-filling

## Current Test Results

**2025-10-31 Run:**
- ✅ Period detection working (EOD, EOW, EOM)
- ✅ Stats calculation working (85.7% completion)
- ✅ File creation working
- ❌ Content generation without user input (CRITICAL FAIL)
- ❌ Priorities set without consultation (CRITICAL FAIL)

**Status: REDESIGN REQUIRED**
