# Obsidian Idea Management Skill

## Purpose
Manage JW's complete idea-to-execution workflow in Obsidian using a structured pipeline system. Help capture, evaluate, develop, and launch ideas while maintaining focus and preventing overwhelm.

## Obsidian Vault Location
**Path**: `C:\PlausiblePotentials-Files\My files\Obsidian\PPC`

## Core System: The Idea Pipeline

```
📥 CAPTURE (Inbox)     → 2 min max, no evaluation
    ↓
🔍 PROCESS (Weekly)    → Score & decide destination
    ↓
🔨 DEVELOP (Active)    → Research & plan (max 5-7 ideas)
    ↓
🚀 EXECUTE (Project)   → Full project execution
    ↓
✅ COMPLETE (Archive)  → Document learnings
```

## Folder Structure

```
000_Ideas/
├── 000_Ideas-Dashboard.md
├── 010_Inbox/              ← Quick capture (2 min)
├── 020_Developing/         ← Active work (max 5-7)
├── 030_Simmering/          ← Good idea, wrong timing
├── 040_Active-Projects/    ← Full execution mode
└── Archive/
    ├── Completed/          ← Successful launches
    └── Not-Viable/         ← Learned & archived
```

## Assessment Matrix (1-5 Scale)

**Score every idea on:**
1. **Excitement** - Personal motivation level
2. **Feasibility** - Can it be done with current resources?
3. **Uniqueness** - How differentiated is it?
4. **Impact** - How many people could it help?

**Viability Score** = Average of all four

**Decision Rules:**
- 4-5/5 → Move to Developing
- 3/5 → Move to Simmering
- 1-2/5 → Archive to Not-Viable

## Key Workflows

### 1. Quick Idea Capture (2 minutes max)
**Trigger**: "I have an idea" or "capture this idea"

**Actions**:
1. Create new note in `010_Inbox/`
2. Filename: `Idea_[Short-Descriptive-Name].md`
3. Use inbox template (frontmatter + quick capture sections)
4. Fill in only: core idea, why now, related links
5. Save and reassure: "We'll evaluate this in weekly review"

### 2. Weekly Review (60 minutes)
**Trigger**: "weekly review" or "let's do my weekly review"

**Step 1: Process Inbox (30 min)**
- For each idea: read, score, calculate viability, move to destination
- Be ruthless: most ideas should be archived or simmered

**Step 2: Review Developing (15 min)**
- Check progress on each idea
- Update development logs
- Graduate ready ideas to Projects or archive stalled ones
- **Enforce limit**: Max 5-7 ideas in Developing

**Step 3: Check Projects (10 min)**
- Update progress percentages
- Log recent work
- Move completed projects to Archive/Completed

**Step 4: Update Dashboard (5 min)**
- Refresh counts across all stages
- Note this week's movement
- Set next week's top 3 focus

### 3. Develop an Idea
**Trigger**: "let's work on [idea name]"

**Actions**:
1. Locate idea in `020_Developing/`
2. Review current status and next actions
3. Work on specific section: research, MVP, validation, etc.
4. Update development log with today's date
5. Define 1-3 specific next actions

### 4. Launch a Project
**Trigger**: "launch [idea]" or "I want to start [idea]"

**Actions**:
1. Verify idea is sufficiently developed
2. Create new project note in `040_Active-Projects/`
3. Define: goal, phases, timeline, milestones, success metrics
4. Link back to original developed idea
5. Update dashboard

### 5. Archive Ideas
**Trigger**: "help me clean up" or "archive [idea]"

**Actions**:
1. Identify stale ideas (no updates in 3+ weeks)
2. For each: suggest Archive or Simmering
3. Ask for learnings before archiving
4. Move files to appropriate Archive subfolder
5. Update dashboard

## Quick Commands Reference

| User Says | Claude Does |
|-----------|-------------|
| "Capture this idea" | Create inbox note, 2-min template |
| "Weekly review" | Full 60-min workflow |
| "What's in my inbox?" | List all inbox ideas + counts |
| "How many am I developing?" | Report X/7 capacity |
| "Launch [idea]" | Convert to project, move to Active-Projects |
| "Archive [idea]" | Move to Archive/Not-Viable, ask for learnings |
| "What should I focus on?" | Check dashboard, suggest top 3 |
| "Show my pipeline" | Display counts across all stages |
| "Update dashboard" | Refresh all counts and stats |

## File Templates

### Inbox Template (2-min capture)
```markdown
---
created: {{date}} {{time}}
stage: inbox
status: captured
---

# {{title}}

## 🎯 Quick Capture
<!-- 2 minutes max! Just dump the core idea -->


## 💭 Why Now?
<!-- What triggered this idea? -->


## 🔗 Related
<!-- Any quick links or references -->


---
*Next: Process during weekly review*
```

### Developed Idea Template
```markdown
---
created: {{date}}
stage: developing
status: active
viability_score: 
excitement: 
feasibility: 
uniqueness: 
impact: 
---

# {{title}}

## 📊 Assessment Scores
- **Excitement:** /5
- **Feasibility:** /5
- **Uniqueness:** /5
- **Impact:** /5
- **Viability Score:** /5

## 🎯 Core Concept

## 💡 The Problem It Solves

## 🎨 The Solution

## 👥 Target Audience

## 🔍 Research & Validation

## 🚀 Minimum Viable Version

## 📋 Next Actions
- [ ] 
- [ ] 
- [ ] 

## 🗓️ Development Log
### {{date}}
- 

## 🔗 Resources & Links

## 💭 Notes & Learnings
```

### Project Template
```markdown
---
created: {{date}}
type: project
status: active
started: 
target_completion: 
---

# 🚀 {{title}}

## 📊 Project Status
- **Status:** Planning/In Progress/Review/Complete
- **Progress:** 0%
- **Started:** 
- **Target Completion:** 

## 🎯 Project Goal

## 📝 Project Plan
### Phase 1: 
- [ ] 

### Phase 2: 
- [ ] 

### Phase 3: 
- [ ] 

## 📅 Timeline & Milestones
| Milestone | Target Date | Status |
|-----------|-------------|--------|
|           |             |        |

## 📊 Success Metrics

## 🔗 Resources
- Original Idea: [[link]]

## 🗓️ Project Log
### {{date}}
- 

## 💭 Learnings & Reflections
```

## Best Practices

**DO:**
- ✅ Capture EVERYTHING (even "silly" ideas)
- ✅ Keep inbox captures under 2 minutes
- ✅ Do weekly reviews consistently
- ✅ Be ruthless with archiving
- ✅ Limit developing ideas to 5-7 maximum
- ✅ Write learnings when archiving

**DON'T:**
- ❌ Evaluate ideas while capturing
- ❌ Skip weekly reviews
- ❌ Keep stale ideas in Developing
- ❌ Try to develop everything
- ❌ Feel guilty about archiving
- ❌ Launch before defining MVP

## Response Patterns

When using this skill, Claude should:
1. **Be Action-Oriented** - Create files, move notes, update templates
2. **Follow the Process** - Don't skip pipeline stages
3. **Enforce Limits** - Max 5-7 in Developing
4. **Celebrate Progress** - Acknowledge wins and completions
5. **Be Ruthless** - Encourage archiving low-viability ideas
6. **Stay Focused** - Help focus on top 3 priorities
7. **Log Everything** - Update development logs and dashboards
8. **Ask for Scores** - Use the matrix, don't guess

## File Naming Conventions

- **Inbox**: `Idea_[Descriptive-Name].md`
- **Developing**: Same name, just move folder
- **Projects**: `Project_[Name].md` or keep original name
- **Archive**: Keep original names for traceability

## Integration Points

- **Communications Skill**: Capture ideas from meetings/emails
- **Morning Routine**: Check dashboard during setup
- **C3 Alliance Project**: Ideas related to platform development
- **Research**: Web search for market validation

---

**Skill Version**: 1.0  
**Created**: October 29, 2025  
**For**: JW's Obsidian Idea Management System  
**Vault**: `C:\PlausiblePotentials-Files\My files\Obsidian\PPC`