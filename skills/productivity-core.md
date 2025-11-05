---
name: productivity-core
description: Obsidian idea management trigger. Load when user wants to capture ideas, process inbox, weekly review, or manage idea pipeline.
---

# Productivity Core (Lean Trigger)

## ACTIVATE WHEN
- "Capture this idea"
- "Weekly review" or "process inbox"
- "What's in my inbox/pipeline?"
- Working with Obsidian PPC vault
- Managing idea workflow

## THE PIPELINE (Quick Reference)
```
📥 Inbox (2 min capture)
  ↓
🔍 Weekly Process (score & decide)
  ↓ 
🔨 Developing (max 5-7 ideas)
  ↓
🚀 Active Projects
  ↓
✅ Archive (Complete/Not-Viable)
```

## FOLDER STRUCTURE
```
000_Ideas/
├── 010_Inbox/         ← Capture here (2 min max)
├── 020_Developing/    ← Working on (max 5-7)
├── 030_Simmering/     ← Good timing later
├── 040_Active-Projects/
└── Archive/
    ├── Completed/
    └── Not-Viable/
```

## QUICK ACTIONS

### Capture Idea (2 min)
```
1. Create: 010_Inbox/Idea_[Name].md
2. Fill: Quick capture, Why now, Related links
3. Save and confirm: "Captured! Review weekly."
4. DONE - no evaluation during capture
```

### Process Inbox Item
```
1. Read idea
2. Score 1-5: Excitement, Feasibility, Uniqueness, Impact
3. Calculate average = Viability Score
4. Decide:
   - 4-5 → Move to 020_Developing/
   - 3 → Move to 030_Simmering/
   - 1-2 → Archive to Not-Viable/
5. Update with developed template if moving to Developing
```

### Check Capacity
```
Count files in 020_Developing/
If > 7: Flag and suggest archiving lowest priority
Report: "X/7 capacity in Developing"
```

## SCORING MATRIX (1-5 Each)
1. **Excitement**: Personal passion for this?
2. **Feasibility**: Can I do this with current resources?
3. **Uniqueness**: Different from what exists?
4. **Impact**: How many could this help?

**Viability = Average of 4 scores**

## KEY COMMANDS → ACTIONS

**"Capture idea"** → Create inbox note, 2-min template only
**"Weekly review"** → Process inbox → Review developing → Update projects → Update dashboard
**"What's in inbox?"** → List all files in 010_Inbox/, count
**"Check capacity"** → Count 020_Developing/, report X/7
**"Archive [idea]"** → Move to Archive/Not-Viable/, ask for learnings
**"Launch [idea]"** → Move to 040_Active-Projects/, convert to project template

## ENFORCE RULES
1. **2-min capture only** - No evaluation while capturing
2. **Max 5-7 developing** - Archive excess immediately
3. **Be ruthless** - 60-70% archive rate is healthy
4. **Weekly consistency** - Push for regular reviews
5. **Action > Perfection** - Launch small, iterate

## LOAD FULL DOCS WHEN
User asks for:
- Complete templates → Read `docs/productivity-guide.md`
- Workflow details → Read `docs/productivity-guide.md`
- Troubleshooting → Read `docs/productivity-guide.md`

**OTHERWISE**: Execute the action, don't explain the system.

## TEMPLATES (Quick Reference)

**Inbox**: Just title, Quick Capture, Why Now, Related
**Developed**: Add assessment scores, research, MVP, next actions
**Project**: Add phases, timeline, metrics, log

Full templates in: `docs/productivity-guide.md`

---
**Tier 2 Reference**: `D:\Claude-MCP-Files\docs\productivity-guide.md`
