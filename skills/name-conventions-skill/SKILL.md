---
name: name-conventions
description: Apply Ideaverse naming conventions using modified Dewey Decimal Classification. Use when the user asks to "name this note" or needs help naming/organizing files in their Obsidian vault. Provides numbering guidance, formatting rules, and category placement based on content.
---

# Ideaverse Name Conventions

Apply naming conventions to Obsidian notes using a modified Dewey Decimal Classification system.

## Naming Format

```
[DDD]_Descriptive-Name.md
```

**Rules:**
- Three-digit Dewey number in brackets
- Underscore separator after number
- Kebab-case (hyphens between words)
- Title Case for all words
- No spaces, apostrophes, or special characters

**Examples:**
- ✅ `310_Economic-Incentives.md`
- ✅ `620_Programming-MOC.md`
- ✅ `111_Cabin.md`
- ❌ `economic incentives.md` (no number, lowercase, spaces)
- ❌ `310_EconomicIncentives.md` (CamelCase instead of kebab-case)

## Dewey Decimal Categories

```
000 = Knowledge Management (Meta-system)
100 = Personal Management
200 = Philosophy, Psychology, Spirituality, Religion
300 = Social Sciences
400 = Communications, Language, Linguistics
500 = Natural Sciences
600 = Applied Sciences, Technology
700 = Arts, Recreation
800 = Literature
900 = History, Biography, Geography
```

## Numbering Decision Tree

Use this logic to determine the correct number:

1. **Category index?** → X00
   - Example: `310_Economics.md`

2. **Sub-category?** → X10, X20, X30... (+10 increments)
   - Example: `311_Politics.md`, `312_Public-Figures.md`

3. **Major topic within category?** → Start at X00
   - Example: `300_Marketing.md`

4. **Sub-topic?** → X10, X20, X30... (+10 increments)
   - Example: `311_Politics.md`, `312_Governance.md`

5. **Specific instance?** → X11, X12, X13... (+1 increments)
   - Example: `111_Cabin.md`, `112_Finances.md`, `113_Health.md`

## Special Cases

**MOCs (Maps of Content):**
```
[DDD]_Topic-MOC.md
```
Example: `310_Economics-MOC.md`

**Templates:**
```
Template-Purpose.md
```
Example: `Template-Base-Note.md` (no Dewey number)

**Daily Notes:**
```
YYYY-MM-DD.md
```
Example: `2025-10-25.md` (no Dewey number)

## Workflow for "Name This Note"

When the user asks to name a note:

1. **Understand the content** - Ask about the note's topic/purpose if unclear
2. **Identify category** - Determine which primary category (000-900)
3. **Determine hierarchy** - Is it an index, sub-category, topic, or instance?
4. **Apply numbering** - Use decision tree to assign correct number
5. **Format name** - Apply kebab-case Title Case format
6. **Provide rationale** - Explain the category and numbering choice

## Common Category Examples

**Personal Management (100):**
- `110_Life-Map.md` - Sub-category
- `111_My-Virtues.md` - Specific instance
- `112_Mission-Statement.md` - Specific instance

**Social Sciences (300):**
- `310_Economics-MOC.md` - Category MOC
- `311_Economic-Incentives.md` - Sub-topic
- `320_Governance-MOC.md` - Another category MOC

**Technology (600):**
- `610_AI-MOC.md` - Category MOC
- `611_AI-Business-Thoughts.md` - Sub-topic
- `620_Programming-MOC.md` - Another category MOC

## Tags to Suggest

When naming, also suggest relevant tags:

**Status:**
- `#Status/Draft` - New or incomplete
- `#Status/Active` - Currently working
- `#Status/Review` - Needs review
- `#Status/Archive` - Completed/inactive

**Type:**
- `#Type/Concept` - Ideas and concepts
- `#Type/Person` - People notes
- `#Type/Project` - Projects
- `#Type/MOC` - Maps of Content

**Priority:**
- `#Priority/High`
- `#Priority/Medium`
- `#Priority/Low`

## Output Format

When naming a note, provide:

1. **Suggested name:** `[DDD]_Descriptive-Name.md`
2. **Category:** Explain which Dewey category
3. **Numbering rationale:** Why this specific number
4. **Related notes:** Suggest parent/related notes to link
5. **Suggested tags:** 2-3 relevant tags

## Common Mistakes to Avoid

- ❌ Spaces instead of hyphens: `Economic Theory`
- ❌ Lowercase: `economic-theory`
- ❌ CamelCase: `EconomicTheory`
- ❌ Special characters: `Captain's Log`
- ❌ Inconsistent separators: `310-Economics_Theory`
- ❌ Missing Dewey number: `Economics.md`
