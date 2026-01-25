# CoCoA Skills Reference

## Skills Location
All CoCoA skills are centralized in: `D:\Claude-MCP-Files\skills`

## Master Skill
The primary CoCoA skill is located at:
**`D:\Claude-MCP-Files\skills\cocoa-SKILL.md`**

This skill contains:
- Complete CoCoA context and personality
- Project structure and workflows
- MCP integration status
- Communication preferences
- All commands and triggers
- Morning routine automation
- Interactive period review system
- C3 Alliance project details

## Loading CoCoA Context
To activate full CoCoA functionality, say:
- "Cocoa" or "CoCoA" in any chat
- This loads the master skill from the skills folder
- Claude will reference `D:\Claude-MCP-Files\skills\cocoa-SKILL.md`

## All Available Skills
See the complete index: `D:\Claude-MCP-Files\skills\SKILLS-INDEX.md`

Skills include:
- **cocoa-SKILL.md** - Master CoCoA context
- **productivity-core.md** - Core productivity workflows
- **obsidian-productivity.md** / **obsidian-idea-management.md** - Obsidian workflows
- **communications-core.md** - Email and communication management
- **morning-routine/** - 7-9 AM automation
- **agent-communications/** - Telegram integration (Phase 2C)
- **proton-mail.md** - Proton Suite integration
- **github-mcp.md** - GitHub workflows
- And more...

## Why Skills Are Separate
Following best practices for AI agent development:

✅ **CoCoA-Project** = Main project repository (Git, documentation, workflows)  
✅ **skills/** = Reusable skill library (modular, shareable components)

This separation provides:
- Clean project structure
- Version control for project code
- Reusable skills across potential future projects
- Easy skill updates without cluttering project repo
- Clear distinction between project and resources

## Workflow-Specific Skills in This Project
Some skills remain in the CoCoA-Project because they're workflow-specific:

**Period Review Skill**: `workflows/period-review-redesign/REVIEW-TRIGGER-SKILL.md`
- Tightly coupled to the period review automation
- References temp files in this project
- Part of the three-phase review system

## MCP Configuration
Your Claude Desktop MCP configuration should point to:
```json
"skills": {
  "path": "D:\\Claude-MCP-Files\\skills"
}
```

## Updating Skills
When updating skills:
1. Edit files in `D:\Claude-MCP-Files\skills`
2. Changes are immediately available to Claude Desktop
3. No need to update CoCoA-Project unless workflow logic changes
4. Maintain version history in skill files
5. Update SKILLS-INDEX.md when adding/removing skills

## Development Workflow
1. **Project Documentation** → Edit in `CoCoA-Project/`
2. **Skills Updates** → Edit in `skills/`
3. **Workflow Scripts** → Edit in `CoCoA-Project/workflows/`
4. **Context Files** → Edit in `CoCoA-Project/context/`

---

**Note**: This file serves as a reference pointer. The actual skill content is maintained in the centralized skills library.

**Last Updated**: November 4, 2025
