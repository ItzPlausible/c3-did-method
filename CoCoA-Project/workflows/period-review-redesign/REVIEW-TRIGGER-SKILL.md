# CoCoA Period Review - Trigger Detection Skill

## Purpose
This skill teaches CoCoA (Claude) to automatically detect and launch period reviews when triggered by the user.

---

## Trigger Phrases

When the user says ANY of these phrases in ANY chat, CoCoA should immediately check for a pending review:

### Primary Triggers
- "launch end of day review"
- "launch eod review"
- "start period review"
- "ready for review"
- "do my review"
- "review time"
- "let's do my review"
- "period review"

### Context Triggers
- "I got the review notification"
- "saw the 4pm notification"
- "time for my daily review"
- "ready to reflect"

### Casual Triggers
- "review?" (with question mark)
- "daily review"
- "weekly review"
- "monthly review"

---

## Detection Process

When ANY trigger phrase is detected:

### Step 1: Check for Review Context
```javascript
// Read the context file
const contextPath = "D:\\Claude-MCP-Files\\CoCoA-Project\\workflows\\temp\\review-context.json";
const contextExists = await filesystem.read_text_file(contextPath);
```

### Step 2: Parse Context
```javascript
const context = JSON.parse(contextExists);
const periodsEnding = context.periods_ending; // ["EOD", "EOW", etc.]
const stats = context.stats;
```

### Step 3: Launch Review
Begin the appropriate conversation flow based on `periods_ending`.

---

## Response Pattern

### If review-context.json EXISTS:
```
"[Greeting based on time]! Time for your [PERIOD] review.

[Stats summary in 1-2 sentences]

Let's reflect on [timeframe]."
```

### If review-context.json DOES NOT EXIST:
```
"I don't see a pending review yet. The review preparation script needs to run first.

Would you like me to:
1. Run the stats gathering script now?
2. Wait for the scheduled 4 PM run?

Or are you looking for a different type of review?"
```

---

## Automatic Detection (Proactive)

### When NOT to auto-check:
- User is asking unrelated questions
- Mid-conversation about other topics
- User hasn't mentioned reviews at all

### When TO auto-check:
- User mentions "review" in any context
- It's between 4:00-5:00 PM
- User seems to be expecting something
- User references notifications or scheduled tasks

---

## Example Conversations

### Scenario 1: User in New Chat
```
User: "ready for review"

CoCoA: [Checks for review-context.json]
       [File exists]
       
"Good afternoon! Time for your end-of-day review. You completed 100% 
of tasks today (1/1) - nice work! Let's reflect on how things went.

How did today go overall? What stood out?"
```

### Scenario 2: No Pending Review
```
User: "launch eod review"

CoCoA: [Checks for review-context.json]
       [File doesn't exist]
       
"I don't see a pending review yet. The stats gathering script hasn't 
run. Would you like me to run it now?

I can execute:
D:\Claude-MCP-Files\CoCoA-Project\workflows\period-review-stats.ps1

This will gather today's stats and prepare for the review."
```

### Scenario 3: Mid-Other-Conversation
```
User: "Can you help me debug this code?"

CoCoA: [Does NOT check for reviews - clearly unrelated]

"Sure, I'd be happy to help. What code are you working on?"
```

---

## File Locations Reference

**Review Context (Check this):**
```
D:\Claude-MCP-Files\CoCoA-Project\workflows\temp\review-context.json
```

**Conversation Flow Guide (Read this):**
```
D:\Claude-MCP-Files\CoCoA-Project\workflows\period-review-redesign\COCOA-CONVERSATION-FLOW.md
```

**Stats Script (Can run this):**
```
D:\Claude-MCP-Files\CoCoA-Project\workflows\period-review-stats.ps1
```

---

## Integration with Existing Workflow

This skill works with the three-phase system:

1. **Phase 1**: Scheduled task runs `period-review-stats.ps1` → creates context file
2. **Phase 2**: User says trigger phrase → CoCoA detects → reads context → starts conversation
3. **Phase 3**: CoCoA saves responses → runs finalization script

---

## Error Handling

### Context file corrupted:
```
"I found the review context file, but it seems corrupted. 
Let me try running the stats script again."
```

### Multiple chats asking for review:
- Only one instance should handle it
- First to respond "claims" the review
- Save started timestamp to prevent duplicates

### User interrupts mid-review:
- Save partial responses
- Allow resuming later
- Don't lose captured data

---

## Critical Notes

✅ **Always check for review-context.json when trigger detected**
✅ **Read COCOA-CONVERSATION-FLOW.md before starting questions**
✅ **Be explicit about what period(s) are being reviewed**
✅ **Don't start review if context file doesn't exist**

---

*This skill ensures seamless review launches from any chat*
