# Productivity.md - Obsidian Idea Management System

## Purpose
This skill enables Claude to help you manage your complete idea-to-execution workflow in Obsidian. It provides a structured system for capturing, evaluating, developing, and launching ideas while preventing overwhelm and ensuring focus.

## When to Use This Skill
Claude should reference this skill when you:
- Want to capture a new idea quickly
- Need to process/evaluate ideas in your inbox
- Are doing your weekly idea review
- Want to develop an idea further
- Need to move ideas between pipeline stages
- Want to check on active projects
- Are organizing or cleaning up your idea system
- Need help with Obsidian folder structure or templates
- Want metrics or insights on your idea pipeline

## Core Philosophy

### The Pipeline Model
```
📥 CAPTURE (Inbox)     → Raw ideas, 2 min max
    ↓
🔍 PROCESS (Weekly)    → Score & decide: Develop/Simmer/Archive  
    ↓
🔨 DEVELOP (Active)    → Research, validate, plan (max 5-7)
    ↓
🚀 EXECUTE (Project)   → Becomes full project
    ↓
✅ COMPLETE (Archive)  → Close the loop with learnings
```

### Key Principles
1. **Fast Capture** - 2 minutes max, no evaluation during capture
2. **Weekly Processing** - Batch evaluate all ideas once per week
3. **Capacity Limits** - Max 5-7 ideas in development prevents overwhelm
4. **Data-Driven Decisions** - Use assessment matrix, not gut feelings
5. **Archive Guilt-Free** - Most ideas won't launch, and that's okay

## Folder Structure

```
000_Ideas/
├── 000_Ideas-Dashboard.md  ← Weekly starting point
├── 010_Inbox/              ← Capture everything here (2 min)
├── 020_Developing/         ← Working on these (max 5-7)
├── 030_Simmering/          ← Good ideas, wrong timing
├── 040_Active-Projects/    ← Graduated to full projects
└── Archive/
    ├── Completed/          ← Successful launches
    └── Not-Viable/         ← Learned & let go
```

## The Assessment Matrix

Every idea gets scored 1-5 on four dimensions:

1. **Excitement** - Does this excite me personally?
   - 5: Can't stop thinking about it
   - 3: Interesting but not compelling
   - 1: Feels like a chore

2. **Feasibility** - Can I actually do this?
   - 5: Could start today with existing resources
   - 3: Need to learn/acquire some things
   - 1: Major barriers exist

3. **Uniqueness** - Is this differentiated?
   - 5: Haven't seen anything like it
   - 3: Some similar things exist
   - 1: Many competitors/copies exist

4. **Impact** - How many people could this help?
   - 5: Could help thousands+
   - 3: Could help dozens/hundreds
   - 1: Just helps me or a few people

**Viability Score = Average of all four**

**Decision Rules:**
- 4-5/5 → Move to Developing
- 3/5 → Move to Simmering
- 1-2/5 → Archive to Not-Viable

## Templates

### Template: Inbox (2-minute capture)

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

### Template: Developed Idea

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
<!-- What is this idea? One paragraph max -->


## 💡 The Problem It Solves
<!-- What pain point does this address? -->


## 🎨 The Solution
<!-- How does this idea solve the problem? -->


## 👥 Target Audience
<!-- Who is this for? -->


## 🔍 Research & Validation
### Market Research
<!-- What exists already? -->

### Initial Validation
<!-- How can we test this cheaply? -->


## 🚀 Minimum Viable Version
<!-- What's the smallest version we could launch? -->


## 📋 Next Actions
- [ ] 
- [ ] 
- [ ] 


## 🗓️ Development Log
### {{date}}
- 


## 🔗 Resources & Links
- 


## 💭 Notes & Learnings


---
*Stage: Developing | Review: Weekly*
```

### Template: Project (Full Execution)

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
- **Last Updated:** {{date}}

## 🎯 Project Goal
<!-- One clear, measurable outcome -->


## 📝 Project Plan
### Phase 1: 
- [ ] 
- [ ] 

### Phase 2: 
- [ ] 
- [ ] 

### Phase 3: 
- [ ] 
- [ ] 


## 📅 Timeline & Milestones
| Milestone | Target Date | Status |
|-----------|-------------|--------|
|           |             |        |


## 📊 Success Metrics
<!-- How will we know this succeeded? -->


## 🔗 Resources
- Original Idea: [[link to developed idea]]
- 


## 🗓️ Project Log
### {{date}}
- 


## 💭 Learnings & Reflections


---
*Originated from: [[original idea]]*
*Project Start: {{date}}*
```

## Weekly Review Workflow (60 minutes)

### STEP 1: Process Inbox (30 min)

For each idea in `010_Inbox/`:

1. **Quick Read** - Refresh yourself on the idea
2. **Score It** - Use assessment matrix (1-5 on each dimension)
3. **Calculate Viability** - Average of all four scores
4. **Decide & Move:**
   - 4-5 → `020_Developing/` (use developed template)
   - 3 → `030_Simmering/` (add note on what would change this)
   - 1-2 → `Archive/Not-Viable/` (note what you learned)

**Pro Tip:** Be ruthless. Most ideas should be archived or simmered. That's healthy!

### STEP 2: Review Developing Ideas (15 min)

For each idea in `020_Developing/`:

1. **Check Progress** - What happened since last week?
2. **Add Development Log Entry** - Note any research, learning, or actions
3. **Update Next Actions** - What are the 1-3 next steps?
4. **Graduate or Archive:**
   - Ready to launch? → Move to `040_Active-Projects/` (use project template)
   - Stalled 3+ weeks? → Move to `030_Simmering/` or `Archive/Not-Viable/`

**Capacity Check:** Should have max 5-7 here. If more, archive the lowest priority ones.

### STEP 3: Check Active Projects (10 min)

For each project in `040_Active-Projects/`:

1. **Update Progress** - What % complete?
2. **Log Recent Work** - What happened this week?
3. **Identify Blockers** - What's stopping progress?
4. **Complete or Pivot:**
   - Finished? → Move to `Archive/Completed/` + write learnings
   - Need to pivot? → Move back to `020_Developing/` for re-planning

### STEP 4: Update Dashboard (5 min)

Update `000_Ideas-Dashboard.md` with:
- Total counts in each stage
- This week's movement (ideas captured, processed, launched)
- Quick wins or learnings
- Next week's focus

## Dashboard Structure

```markdown
# 🎯 Ideas Dashboard

Last Updated: {{date}}

## 📊 Pipeline Status
- 📥 Inbox: XX ideas
- 🔨 Developing: X/7 ideas (XX% capacity)
- 💭 Simmering: XX ideas
- 🚀 Active Projects: XX
- ✅ Completed: XX lifetime

## 📈 This Week
- Ideas Captured: XX
- Ideas Processed: XX
- Moved to Developing: XX
- Projects Launched: XX

## 🎯 Top 3 Focus This Week
1. 
2. 
3. 

## 🎉 Recent Wins
- 

## 💡 Current Developing Ideas
- [[Idea 1]] - Next: action
- [[Idea 2]] - Next: action
- [[Idea 3]] - Next: action

## 🚀 Active Projects
- [[Project 1]] - XX% complete
- [[Project 2]] - XX% complete

## 📅 Upcoming Reviews
- Next Weekly Review: [Date]
- Next Monthly Review: [Date]

---
*Weekly reviews: Every [Day] at [Time]*
```

## Common Workflows

### Workflow: Quick Idea Capture (2 minutes)

**User says:** "I have an idea about [topic]"

**Claude does:**
1. Create new note in `010_Inbox/`
2. Use naming: `Idea_[Short-Descriptive-Name].md`
3. Apply inbox template
4. Help fill in Quick Capture section only
5. Save and reassure: "Captured! We'll evaluate this during your weekly review."

### Workflow: Weekly Review Session

**User says:** "Let's do my weekly review"

**Claude does:**
1. Check `010_Inbox/` - list all ideas to process
2. For each idea:
   - Read it together
   - Ask scoring questions
   - Calculate viability
   - Recommend stage
   - Move file and update template
3. Check `020_Developing/` - review each, update logs
4. Check `040_Active-Projects/` - update status
5. Update dashboard with counts and insights
6. Celebrate wins!

### Workflow: Develop an Idea

**User says:** "Let's work on [specific idea]"

**Claude does:**
1. Locate the idea (usually in `020_Developing/`)
2. Review current status and next actions
3. Help with whatever section needs work:
   - Research competitors
   - Define MVP
   - Plan validation experiments
   - List next actions
4. Update development log
5. Suggest specific next steps

### Workflow: Launch a Project

**User says:** "I want to launch [idea]"

**Claude does:**
1. Verify idea is in `020_Developing/` and sufficiently developed
2. Create new project note in `040_Active-Projects/`
3. Use project template
4. Help define:
   - Clear project goal
   - Phases and tasks
   - Timeline and milestones
   - Success metrics
5. Link back to original developed idea
6. Update dashboard

### Workflow: Archive Ideas

**User says:** "Help me clean up my ideas"

**Claude does:**
1. Review ideas in all active stages
2. Identify stale items (no updates in 3+ weeks)
3. For each stale item, suggest:
   - Archive to Not-Viable (if not worth pursuing)
   - Move to Simmering (if timing is just wrong)
   - Define next action (if still worth pursuing)
4. Move files accordingly
5. Update dashboard

## Best Practices

### DO:
✅ Capture EVERYTHING - even "silly" ideas
✅ Keep inbox captures under 2 minutes
✅ Do weekly reviews consistently (same day/time)
✅ Be ruthless with archiving - most ideas won't launch
✅ Limit developing ideas to 5-7 maximum
✅ Celebrate small wins and completions
✅ Write learnings when archiving ideas
✅ Update development logs weekly

### DON'T:
❌ Evaluate ideas while capturing (just dump them!)
❌ Skip weekly reviews (system breaks down)
❌ Keep stale ideas in Developing forever
❌ Try to develop everything (focus is key)
❌ Feel guilty about archiving (it's learning!)
❌ Launch before defining MVP (start small)
❌ Forget to log learnings from failures

## Common Pitfalls & Solutions

### Pitfall: "My inbox is overwhelming"
**Solution:** Be more aggressive with archiving. Lower scores = archive faster. Most ideas aren't worth developing, and that's okay!

### Pitfall: "Nothing is launching"
**Solution:** 
1. Define smaller MVPs (what's the tiniest testable version?)
2. Set shorter timelines (launch something this week, even imperfect)
3. Lower the bar (progress > perfection)

### Pitfall: "Too many in Developing, can't focus"
**Solution:**
1. Immediately archive bottom 2-3 by viability score
2. Move lower priority ones to Simmering
3. Focus only on top 3 for next 2 weeks

### Pitfall: "I stopped doing weekly reviews"
**Solution:**
1. Schedule it like a doctor's appointment (non-negotiable)
2. Reduce to 30 minutes if 60 is too much
3. Do it before something fun (create reward)
4. Just process inbox if that's all you have time for

### Pitfall: "System feels too rigid"
**Solution:**
1. Customize folder names if it helps
2. Adjust scoring criteria to what matters to you
3. Change review frequency (but keep it regular)
4. Simplify templates to only sections you use

## Integration with Other Systems

### Task Management
- Ideas → Become projects → Generate tasks
- Use Obsidian Tasks plugin or your task manager
- Link project tasks back to project notes

### Calendar
- Weekly review is a recurring calendar event
- Project milestones go on calendar
- Idea launch dates tracked in calendar

### Reference Library
- Link ideas to relevant reference notes
- Create [[MOC]] pages for idea themes
- Tag ideas by category or domain

### Communication Tools
- Capture ideas from meetings/chats immediately
- Reference communications skill for coordination
- Share idea notes with collaborators (export as needed)

## Quick Reference Commands

When user says → Claude should:

**"Capture this idea"** → Create inbox note, 2-min template
**"Weekly review"** → Step through full 60-min workflow
**"What's in my inbox?"** → List all inbox ideas with counts
**"How many am I developing?"** → Check Developing folder, report X/7 capacity
**"Launch this idea"** → Convert to project, move to Active-Projects
**"Archive [idea]"** → Move to Archive/Not-Viable, ask for learnings
**"What should I focus on?"** → Check dashboard, suggest top 3 priorities
**"Show my pipeline"** → Display counts across all stages
**"Help me clean up"** → Find stale ideas, suggest archiving
**"Update dashboard"** → Refresh all counts and stats

## Metrics & Success Indicators

### Input Metrics (Activity)
- Ideas captured per week (Target: 3-5)
- Weekly reviews completed (Target: 100% consistency)
- Inbox processed to zero (Target: Weekly)

### Throughput Metrics (Flow)
- Ideas in Developing (Target: 3-7)
- Average time in Developing (Trend: decreasing)
- Archive rate (Healthy: 60-70% of captured ideas)

### Output Metrics (Results)
- Ideas moved to Projects (Target: 1-2/month)
- Projects completed (Target: 1/quarter minimum)
- Launch rate (% of developed ideas that launch)

### Quality Metrics (Learning)
- Average viability score (Trend: increasing over time)
- Archive learnings documented (Target: 100%)
- Success patterns identified (Review quarterly)

## Examples

### Example 1: Capturing a Quick Idea

**User:** "I just had an idea for a podcast about AI productivity tools"

**Claude:** 
"Great! Let me capture that quickly in your inbox.

*[Creates: 010_Inbox/Idea_AI-Productivity-Podcast.md]*

I've created the inbox note. Let's take 2 minutes to capture the essentials:

**Quick Capture:** What's the core concept - what would this podcast cover and who's it for?

**Why Now:** What made you think of this right now?

**Related:** Any podcasts or creators that inspired this?

Perfect! Captured in 2 minutes. We'll evaluate this properly during your weekly review on [day]."

### Example 2: Processing During Weekly Review

**User:** "Let's process my inbox"

**Claude:**
"You have 4 ideas in your inbox. Let's score each one:

**Idea 1: AI Productivity Podcast**

Let's score it:
- **Excitement (1-5):** How excited are you about hosting a podcast?
- **Feasibility (1-5):** Do you have recording equipment, time, and guests?
- **Uniqueness (1-5):** How different is this from existing AI podcasts?
- **Impact (1-5):** How many people could this help?

*[User provides scores: 4, 2, 3, 4]*

**Viability Score: 3.25/5**

This is borderline! It's exciting and could help many people, but feasibility is low right now. 

**Recommendation:** Move to **Simmering**. Add a note: 'Needs: recording equipment, clear format, and 5 potential guests committed.'

What do you think?"

### Example 3: Developing an Idea

**User:** "Let's work on my newsletter idea"

**Claude:**
"Opening your Developing Ideas... Found: Newsletter_Weekly-Tech-Insights.md

Current status:
- Viability Score: 4.2/5
- Last updated: 2 weeks ago
- Next Actions: Define content pillars, research competitors

Which section should we work on today?
1. Market Research (find similar newsletters)
2. MVP Definition (what's v1 of this newsletter?)
3. Validation Plan (how to test with 10 subscribers?)

Or should we tackle one of those next actions?"

## File Naming Conventions

### Inbox Ideas
`Idea_[Descriptive-Name].md`
- Example: `Idea_Coffee-Shop-Loyalty-App.md`
- Example: `Idea_Weekly-Tech-Newsletter.md`

### Developing Ideas  
Keep same name as inbox, just move folder

### Active Projects
`Project_[Name].md` or keep original idea name
- Example: `Project_Tech-Newsletter.md`
- Link back to original idea file

### Archives
Keep original names for traceability
- Completed: `Project_Newsletter.md` (with completion date in frontmatter)
- Not Viable: `Idea_Loyalty-App.md` (with archive reason in note)

## Customization Options

After mastering the basics, consider:

1. **Add Categories** - Tag ideas by domain (tech, creative, business, etc.)
2. **Dataview Dashboards** - Auto-generate pipeline views
3. **Custom Scoring** - Add/modify matrix dimensions for your needs
4. **Theme Templates** - Create idea templates for recurring types
5. **Integration** - Connect to task managers, calendars, etc.

## System Maintenance

### Weekly (5 min)
- Process inbox to zero
- Update dashboard counts
- Check capacity in Developing

### Monthly (30 min)
- Review success metrics
- Identify patterns in what works
- Clean up abandoned simmering ideas
- Celebrate completed projects

### Quarterly (60 min)
- Deep review of all archived ideas
- Extract learnings and patterns
- Adjust scoring criteria if needed
- Refine system based on what works

---

## Claude's Response Patterns

When helping with this system, Claude should:

1. **Be Action-Oriented** - Create files, move notes, update templates
2. **Follow the Process** - Don't skip stages (capture → process → develop → execute)
3. **Enforce Limits** - Push back if Developing exceeds 5-7 items
4. **Celebrate Progress** - Acknowledge wins, completions, and good decisions
5. **Be Ruthless** - Encourage archiving low-viability ideas
6. **Stay Focused** - Help user focus on top 3 priorities
7. **Log Everything** - Update development logs and dashboards
8. **Ask for Scores** - Use the matrix, don't guess viability

---

*Skill Version: 1.0*
*Created: 2025-10-25*
*For: Obsidian Idea Management System*
