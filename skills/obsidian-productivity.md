---
name: obsidian-productivity
description: Obsidian idea management - capture, process, develop, launch. Activate for inbox, weekly review, pipeline management.
---

# Obsidian Productivity System

## ACTIVATE WHEN
- Capture/process ideas, weekly review, pipeline check
- Working in Obsidian PPC vault
- Managing idea workflow

## VAULT & TOOLS
**Path**: `C:\PlausiblePotentials-Files\My files\Obsidian\PPC\000_Ideas\`

**Filesystem Tools**:
- Create: `Filesystem:write_file`
- Read: `Filesystem:read_file` 
- Move: `Filesystem:move_file`
- List: `Filesystem:list_directory`
- Search: `Filesystem:search_files`

## PIPELINE
```
📥 Inbox (2min) → 🔍 Process (score) → 🔨 Developing (max 5-7) → 🚀 Projects → ✅ Archive
```

## FOLDERS
```
000_Ideas/
├── 000_Ideas-Dashboard.md
├── 010_Inbox/          ← Capture (2min max)
├── 020_Developing/     ← Active (max 5-7)
├── 030_Simmering/      ← Later timing
├── 040_Active-Projects/
└── Archive/
    ├── Completed/
    └── Not-Viable/
```

## COMMANDS → ACTIONS

| Trigger | Action |
|---------|--------|
| "Capture idea" | Create `010_Inbox/Idea_[Name].md` with inbox template. Fill: core idea, why now, links. Confirm: "Captured! Review weekly." NO evaluation. |
| "Weekly review" | 1. Process inbox: score each, move by viability. 2. Review developing: update logs, graduate/archive. 3. Check projects: update progress. 4. Update dashboard: refresh counts, set top 3. |
| "What's in inbox?" | List files in `010_Inbox/`, show count |
| "Check capacity" | Count `020_Developing/`, report X/7 |
| "Work on [idea]" | Read `020_Developing/[idea]`, review status, work on section, update log, define next actions |
| "Launch [idea]" | ASK permission. Move to `040_Active-Projects/`, convert to project template, link original, update dashboard |
| "Archive [idea]" | ASK permission + learnings. Move to `Archive/Not-Viable/`, update dashboard |
| "Show pipeline" | Count each folder, display: Inbox (X), Developing (X/7), Simmering (X), Projects (X), Archive (X) |
| "Update dashboard" | Refresh `000_Ideas-Dashboard.md` with current counts, dates, top 3 focus |

## SCORING (Process Inbox)
Rate 1-5 each: **Excitement, Feasibility, Uniqueness, Impact**
- Viability = Average
- 4-5 → `020_Developing/`
- 3 → `030_Simmering/`
- 1-2 → `Archive/Not-Viable/`

## TEMPLATES

### Inbox (2min capture)
```markdown
---
created: YYYY-MM-DD HH:MM
stage: inbox
status: captured
---
# [Title]
## 🎯 Quick Capture
[Core idea dump]
## 💭 Why Now?
[Trigger]
## 🔗 Related
[Links]
```

### Developed Idea
```markdown
---
created: YYYY-MM-DD
stage: developing
viability_score: X.X
excitement: X
feasibility: X
uniqueness: X
impact: X
---
# [Title]
## 📊 Scores
Excitement: X/5 | Feasibility: X/5 | Uniqueness: X/5 | Impact: X/5 | Viability: X.X/5
## 🎯 Core Concept
## 💡 Problem → Solution
## 👥 Target Audience
## 🔍 Research
## 🚀 MVP
## 📋 Next Actions
- [ ] 
## 🗓️ Dev Log
### YYYY-MM-DD
- 
## 🔗 Resources
## 💭 Learnings
```

### Project
```markdown
---
created: YYYY-MM-DD
type: project
status: active
progress: 0
---
# 🚀 [Title]
## 📊 Status
Progress: 0% | Started: YYYY-MM-DD | Target: YYYY-MM-DD
## 🎯 Goal
## 📝 Phases
### Phase 1: [Name]
- [ ] 
## 📅 Milestones
| Milestone | Date | Status |
|-----------|------|--------|
## 📊 Success Metrics
## 🔗 Resources
Original: [[link]]
## 🗓️ Project Log
### YYYY-MM-DD
- 
```

### Dashboard
```markdown
---
updated: YYYY-MM-DD
---
# 📊 Ideas Dashboard

## Pipeline Status
- 📥 Inbox: X ideas
- 🔨 Developing: X/7 (XX% capacity)
- 🌡️ Simmering: X ideas
- 🚀 Projects: X active
- ✅ Archived: X total

## Top 3 Focus
1. [Idea/Project name]
2. [Idea/Project name]
3. [Idea/Project name]

## This Week
Processed: X | Archived: X | Launched: X

## Alerts
[Capacity warnings, stale ideas]
```

## RULES
1. **2min capture** - No evaluation during capture
2. **Max 5-7 developing** - Archive excess immediately
3. **Be ruthless** - 60-70% archive rate is healthy
4. **Ask permission** - Before moving/archiving files
5. **Update dashboard** - After any pipeline changes
6. **Replace {{vars}}** - `{{date}}` → ISO format, `{{title}}` → user's title

## PERMISSIONS
**ASK before**: Moving files, archiving, launching, deleting
**Do without asking**: Creating inbox, reading, counting, listing

---
**Combined Version** | Token-optimized merge of productivity-core + obsidian-management
