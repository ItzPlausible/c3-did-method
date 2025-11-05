# CoCoA Skills Library Index

**Last Updated**: November 4, 2025  
**Purpose**: Centralized repository of reusable Claude skills for CoCoA (Claude Cooperative Assistant)

## 📚 Available Skills

### 1. **CoCoA Core Skill** 
**File**: `cocoa-SKILL.md`  
**Description**: Master skill for JW's personal AI assistant system. Comprehensive context including project structure, workflows, MCP integrations, communication preferences, and all CoCoA commands.  
**Triggers**: "Cocoa", "CoCoA", CoCoA-related development  
**Key Features**:
- Morning routine automation (7-9 AM)
- Interactive period reviews (EOD/EOW/EOM/EOQ/EOY)
- C3 Alliance project monitoring
- MCP server integration status
- Personal preferences and communication style

### 2. **Communications Core**
**File**: `communications-core.md`  
**Description**: Email management, professional communication workflows  
**Key Features**:
- Email drafting and templates
- Professional tone matching
- Communication prioritization

### 3. **Agent Communications** 
**Directory**: `agent-communications/`  
**Description**: Advanced communication orchestration system including Telegram integration, monitors, drafters, and trackers  
**Status**: Phase 2C Complete  
**Key Features**:
- Telegram bot integration
- Message orchestration
- Communication monitoring
- Auto-drafting system

### 4. **Productivity Core**
**File**: `productivity-core.md`  
**Description**: Core productivity workflows and task management  
**Key Features**:
- Task prioritization
- Focus time management
- Workflow optimization

### 5. **Obsidian Productivity**
**File**: `obsidian-productivity.md`  
**Description**: Condensed Obsidian idea management system  
**Triggers**: Idea capture, weekly review, pipeline management  
**Key Features**:
- Quick 2-minute idea capture
- Structured pipeline (Inbox → Process → Develop → Execute → Complete)
- Assessment scoring matrix
- Max 5-7 developing ideas enforcement

### 6. **Obsidian Idea Management** (Full Version)
**File**: `obsidian-idea-management.md`  
**Description**: Comprehensive Obsidian idea-to-execution workflow with detailed templates and workflows  
**Vault**: `C:\PlausiblePotentials-Files\My files\Obsidian\PPC`  
**Key Features**:
- Complete workflow documentation
- File templates (Inbox, Developing, Project, Archive)
- Assessment matrix (Excitement, Feasibility, Uniqueness, Impact)
- Weekly review process
- Dashboard management

### 7. **Morning Routine**
**Directory**: `morning-routine/`  
**File**: `SKILL.md`  
**Description**: 7-9 AM deep work automation  
**Time Savings**: 15 min → 30 seconds  
**Key Features**:
- Application launching (VS Code, Docker Desktop, GitHub Desktop)
- Container health checks
- Daily dashboard updates
- System status verification

### 8. **Naming Conventions**
**Directory**: `name-conventions-skill/`  
**File**: `SKILL.md`  
**Description**: File and project naming standards  
**Key Features**:
- Consistent naming patterns
- File organization rules
- Naming best practices

### 9. **Proton Mail**
**Files**: `proton-mail.md`, `proton-mail.zip`  
**Description**: Proton Suite integration and workflows (team@plausiblepotentials.com)  
**Note**: Preferred over Google services for privacy

### 10. **GitHub MCP**
**File**: `github-mcp.md`  
**Description**: GitHub integration workflows via MCP  
**Key Features**:
- Repository management
- Commit workflows
- Issue tracking

### 11. **Email Scripts**
**Directory**: `email-scripts/`  
**File**: `send_email.py`  
**Description**: Python scripts for automated email sending

## 🗂️ Skill Categories

### Personal Productivity
- cocoa-SKILL.md
- productivity-core.md
- obsidian-productivity.md
- obsidian-idea-management.md
- morning-routine/

### Communications
- communications-core.md
- agent-communications/
- proton-mail.md
- email-scripts/

### Development
- github-mcp.md
- name-conventions-skill/

## 🔄 Usage Guidelines

### For CoCoA Development
1. Reference this index when adding new skills
2. Keep skills modular and reusable
3. Document triggers and key features
4. Maintain consistent file structure

### For Claude Desktop
1. Skills folder location: `D:\Claude-MCP-Files\skills`
2. Load skills via MCP configuration
3. Skills activate based on triggers or user requests
4. Multiple skills can be active simultaneously

### Skill File Format
```markdown
---
name: skill-name
description: Brief description
---

# Skill Title

## Purpose
[What this skill does]

## Key Features
[Main capabilities]

## Triggers
[When to activate]

## Workflows
[How to use]
```

## 📍 Related Resources

### CoCoA Project Repository
**Location**: `D:\Claude-MCP-Files\CoCoA-Project`  
**Relationship**: Main project that references these skills  
**Documentation**: 
- README.md - Project overview
- Skills-Complete-Guide.md - Skill usage guide
- MCP-Setup-Guide.md - MCP configuration

### Obsidian Vault
**Location**: `C:\PlausiblePotentials-Files\My files\Obsidian\PPC`  
**Integration**: Obsidian skills manage this vault

## 🚀 Quick Start

### Load CoCoA Core
Say "Cocoa" or "CoCoA" in any chat to activate the main assistant context

### Morning Routine
Say "CoCoA, morning setup" at 7 AM to trigger automated deep work preparation

### Period Reviews
Say "Launch end of day review" at 4 PM (after scheduled task runs) to start interactive review

### Idea Capture
Say "Capture this idea" to trigger 2-minute Obsidian inbox capture

### Weekly Review
Say "Weekly review" to start full Obsidian pipeline processing

## 📝 Maintenance Notes

### Adding New Skills
1. Create skill file in `D:\Claude-MCP-Files\skills` or appropriate subdirectory
2. Follow standard skill format with frontmatter
3. Document in this index
4. Update CoCoA-Project references if applicable
5. Test with Claude Desktop

### Updating Skills
1. Maintain version history in skill file
2. Update this index if triggers or features change
3. Communicate changes to CoCoA project documentation

### Archiving Skills
1. Move deprecated skills to Archive folder
2. Update this index
3. Document deprecation reason

## 🔗 Integration Points

### MCP Servers
Skills work with these MCP servers:
- Filesystem MCP (file operations)
- Docker MCP (container management)
- Windows Desktop Control MCP (UI automation)
- Cloudflare Developer Platform MCP (Web3 infrastructure)
- Google Workspace MCP (planned)

### Projects
Skills support these projects:
- C3 Alliance (Exit-to-Cooperative platform)
- PlausiblePotentials.com (company website)
- CoCoA Project (this AI assistant system)
- Ideaverse (Obsidian knowledge base)

---

**Maintained by**: JW via CoCoA  
**Repository**: D:\Claude-MCP-Files\skills  
**Project**: CoCoA (Claude Cooperative Assistant)
