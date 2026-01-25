# Complete MCP + Claude Desktop Guide
*Your path to maximizing AI agent capabilities*

## Table of Contents
1. [Available MCP Servers](#available-mcp-servers)
2. [Skills System](#skills-system)
3. [CoCoA Project Setup](#cocoa-project-setup)
4. [Obsidian Integration](#obsidian-integration)
5. [Installation Commands](#installation-commands)

---

## 1. Available MCP Servers

### Essential MCP Servers (Highly Recommended)

#### **Obsidian Integration** ⭐⭐⭐
Perfect for your note management needs!

**Option 1: obsidian-mcp-server (Most Popular)**
- **Source:** https://github.com/cyanheads/obsidian-mcp-server
- **Features:** Complete vault operations, search, frontmatter management
- **Install:** Requires Obsidian Local REST API plugin
- **Configuration:**
```json
{
  "obsidian": {
    "command": "npx",
    "args": ["-y", "obsidian-mcp-server"],
    "env": {
      "OBSIDIAN_API_KEY": "your_api_key",
      "OBSIDIAN_HOST": "127.0.0.1",
      "OBSIDIAN_PORT": "27124"
    }
  }
}
```

**Option 2: mcp-obsidian (Alternative)**
- **Source:** https://github.com/MarkusPfundstein/mcp-obsidian
- **Features:** List files, search, patch content, append content
- **Install:** Also requires Obsidian Local REST API plugin

#### **File System** ⭐⭐⭐
You already have this! Can directly access Obsidian vaults.
- **Source:** Official Anthropic reference server
- **Use Case:** Direct file access without REST API

#### **GitHub**
- **Source:** https://github.com/modelcontextprotocol/servers
- **Features:** Repository management, issues, PRs, file operations
- **Use Case:** Version control for CoCoA project

#### **Memory/Knowledge Graph** ⭐
- **Source:** https://github.com/modelcontextprotocol/server-memory
- **Features:** Persistent knowledge graph for maintaining context
- **Use Case:** Perfect for AI agent memory systems!

---

### Popular Community MCP Servers

#### **Development Tools**
- **Git** - Repository operations, commits, branches
  - https://github.com/modelcontextprotocol/server-git
  
- **Sequential Thinking** - Enhanced reasoning
  - https://github.com/modelcontextprotocol/server-sequential-thinking
  
- **Puppeteer** - Browser automation
  - https://github.com/modelcontextprotocol/server-puppeteer

#### **Cloud & Database**
- **PostgreSQL** - Database operations
  - https://github.com/modelcontextprotocol/server-postgres
  
- **SQLite** - Local database
  - https://github.com/jparkerweb/mcp-sqlite
  
- **MongoDB** - NoSQL database
  - https://github.com/kiliczsh/mcp-mongo-server

#### **Productivity**
- **Slack** - Team communication
  - https://github.com/modelcontextprotocol/server-slack
  
- **Gmail** - Email management (if available)
  
- **Calendar** - Schedule management

#### **AI Enhancement**
- **Brave Search** - Web search
  - https://github.com/modelcontextprotocol/server-brave-search
  
- **EverArt** - AI image generation
  
- **Context Memory** - Long-term memory
  - https://github.com/ragieai/mcp-server

---

### Microsoft MCP Servers
Microsoft has released official MCP servers:
- **Azure AI Foundry** - Models, knowledge, evaluation
- **Azure DevOps** - CI/CD pipeline management
- **Microsoft 365 Agents Toolkit** - M365 integration
- **GitHub** - Repository operations
- **SQL MCP** - Database operations

Source: https://github.com/microsoft/mcp

---

## 2. Skills System

### What Are Skills?
Skills are **pre-configured best practices and templates** built into Claude Desktop that help me create high-quality outputs. Think of them as expert knowledge modules.

### Available Skills (Built-in)

#### **Document Creation Skills**
- **docx** - Professional Word documents
  - Location: `/mnt/skills/public/docx/SKILL.md`
  - Use for: Reports, proposals, documentation
  
- **pptx** - PowerPoint presentations
  - Location: `/mnt/skills/public/pptx/SKILL.md`
  - Use for: Slide decks, presentations
  
- **xlsx** - Excel spreadsheets
  - Location: `/mnt/skills/public/xlsx/SKILL.md`
  - Use for: Data analysis, financial models
  
- **pdf** - PDF manipulation
  - Location: `/mnt/skills/public/pdf/SKILL.md`
  - Use for: Form filling, PDF generation

#### **Development Skills**
- **artifacts-builder** - Complex web artifacts
  - Location: `/mnt/skills/examples/artifacts-builder/SKILL.md`
  - Use for: Multi-component React apps
  
- **mcp-builder** - Creating MCP servers
  - Location: `/mnt/skills/examples/mcp-builder/SKILL.md`
  - Use for: Building custom MCP servers (Perfect for CoCoA!)

#### **Design & Branding**
- **canvas-design** - Visual art creation
  - Location: `/mnt/skills/examples/canvas-design/SKILL.md`
  
- **theme-factory** - Styling artifacts
  - Location: `/mnt/skills/examples/theme-factory/SKILL.md`
  
- **brand-guidelines** - Anthropic branding
  - Location: `/mnt/skills/examples/brand-guidelines/SKILL.md`

#### **Specialized Skills**
- **internal-comms** - Corporate communications
- **skill-creator** - Create your own skills!
  - Location: `/mnt/skills/examples/skill-creator/SKILL.md`
  - **Use this to create a CoCoA skill!**

### How to Use Skills
Simply ask me to use a skill! For example:
- "Create a presentation about CoCoA using the pptx skill"
- "Use the mcp-builder skill to create a custom server for CoCoA"
- "Create a CoCoA skill using the skill-creator skill"

I automatically read the skill documentation and apply best practices.

---

## 3. CoCoA Project Setup

### Project Vision: Cosmic Commoner Avatar
*Your personal "Jarvis" AI agent assistant*

### Architecture Recommendations

#### **Core Components**

1. **Memory System**
   - Use MCP Memory server for persistent knowledge graph
   - Integrate with Obsidian for long-term knowledge storage
   - Structure: Context → Short-term → Long-term → Archive

2. **Communication Layer**
   - MCP as the protocol backbone
   - Custom MCP server for CoCoA-specific functions
   - Integration with various tools (Slack, Email, Calendar)

3. **Knowledge Base**
   - Obsidian vault as primary knowledge repository
   - Categorized by: Personal, Work, Learning, Projects
   - Automatic backlinks and tagging

4. **Skill Modules**
   - Create custom CoCoA skill
   - Modular capabilities (coding, writing, research, automation)
   - Context-aware tool selection

#### **Suggested Directory Structure**
```
D:\Claude-MCP-Files\CoCoA-Project\
├── config/
│   ├── mcp-servers.json          # MCP server configurations
│   ├── cocoa-profile.md          # Your preferences and context
│   └── skills/                   # Custom skills
├── memory/
│   ├── short-term/               # Recent context
│   ├── long-term/                # Persistent knowledge
│   └── conversation-history/     # All interactions
├── knowledge-base/               # Links to Obsidian vault
├── tools/
│   ├── custom-mcp-servers/       # CoCoA-specific servers
│   └── automation-scripts/       # Helper scripts
└── docs/
    ├── setup-guide.md            # This file
    ├── workflow-docs/            # How to use CoCoA
    └── development-log.md        # Progress tracking
```

#### **Phase 1: Foundation (Week 1-2)**
- [ ] Set up Obsidian vault structure
- [ ] Configure Obsidian MCP server
- [ ] Create CoCoA profile document
- [ ] Test basic MCP operations

#### **Phase 2: Memory & Context (Week 3-4)**
- [ ] Install Memory MCP server
- [ ] Design knowledge graph structure
- [ ] Create automated note-taking workflows
- [ ] Build context retrieval system

#### **Phase 3: Custom MCP Servers (Week 5-6)**
- [ ] Use mcp-builder skill to create CoCoA server
- [ ] Implement custom tools for your workflow
- [ ] Add personality and response styles
- [ ] Test and iterate

#### **Phase 4: Integration (Week 7-8)**
- [ ] Connect productivity tools (Calendar, Email)
- [ ] Automate routine tasks
- [ ] Create custom shortcuts
- [ ] Fine-tune responses and behaviors

---

## 4. Obsidian Integration

### Setup Steps

#### **Step 1: Install Obsidian Local REST API Plugin**
1. Open Obsidian Settings → Community Plugins
2. Turn off "Safe mode"
3. Browse and search for "Local REST API"
4. Install and enable the plugin
5. Copy the API key from plugin settings

#### **Step 2: Configure MCP Server**
Add to `claude_desktop_config.json`:

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Configuration:**
```json
{
  "mcpServers": {
    "obsidian": {
      "command": "npx",
      "args": ["-y", "obsidian-mcp-server"],
      "env": {
        "OBSIDIAN_API_KEY": "your_api_key_here",
        "OBSIDIAN_HOST": "127.0.0.1",
        "OBSIDIAN_PORT": "27124"
      }
    }
  }
}
```

#### **Step 3: Restart Claude Desktop**
After saving, restart Claude Desktop. You should see a hammer icon indicating the server is connected.

#### **Alternative: File System Approach**
If you don't want to use the REST API, you can use the filesystem MCP (which you already have) by pointing it directly at your Obsidian vault:
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\path\\to\\obsidian\\vault"]
  }
}
```

### Recommended Vault Structure for CoCoA
```
Obsidian Vault/
├── CoCoA/
│   ├── Memory/
│   │   ├── Conversations/
│   │   ├── Context/
│   │   └── Learnings/
│   ├── Preferences/
│   │   ├── Communication Style.md
│   │   ├── Work Patterns.md
│   │   └── Personal Info.md
│   ├── Projects/
│   └── Daily Notes/
├── Knowledge Base/
│   ├── Technical/
│   ├── Personal/
│   └── Work/
└── Templates/
    ├── Daily Note Template
    ├── Project Template
    └── Meeting Notes Template
```

---

## 5. Installation Commands

### Quick Install Commands

#### **Obsidian MCP**
```bash
# Automatic install via Smithery
npx -y @smithery/cli install obsidian-mcp --client claude

# OR Manual install
npm install -g obsidian-mcp-server
```

#### **Memory Server**
```bash
npx -y @modelcontextprotocol/server-memory
```

#### **GitHub Server**
```bash
npx -y @modelcontextprotocol/server-github
```

#### **PostgreSQL Server**
```bash
npx -y @modelcontextprotocol/server-postgres
```

### Verification
After installation, check:
```bash
# View Claude Desktop logs (Windows)
type %APPDATA%\Claude\logs\mcp-server-*.log

# Check if servers are running
# Look for hammer icon in Claude Desktop
```

---

## 6. MCP Server Registry

### Official Registry
The MCP ecosystem now has an official registry:
- **URL:** https://github.com/modelcontextprotocol/registry
- **Website:** https://mcp.so
- Browse 1000+ MCP servers
- Community-driven catalog

### Curated Lists
1. **Awesome MCP Servers** - https://github.com/wong2/awesome-mcp-servers
2. **Punkpeye's Collection** - https://github.com/punkpeye/awesome-mcp-servers
3. **Microsoft MCP** - https://github.com/microsoft/mcp
4. **Glama MCP Directory** - https://glama.ai/mcp

---

## 7. CoCoA-Specific Recommendations

### Must-Have MCP Servers for CoCoA
1. ✅ **Filesystem** (You have this)
2. ⭐ **Obsidian** (For note management)
3. ⭐ **Memory** (For persistent context)
4. ⭐ **GitHub** (For version control)
5. **Sequential Thinking** (Enhanced reasoning)
6. **Google Calendar** (Scheduling)
7. **Gmail** (Email management)
8. **Slack** (Team communication)

### Create a Custom CoCoA Skill
Use the skill-creator skill to make a CoCoA skill that includes:
- Your communication preferences
- Common workflows
- Personality traits
- Tool selection logic
- Context management strategies

### Workflow Example
```
User Request → CoCoA analyzes context → 
Checks Obsidian notes → Recalls from Memory → 
Uses appropriate tools → Logs to Obsidian → 
Updates Memory → Responds with context
```

---

## Next Steps

1. **Immediate Actions:**
   - [ ] Install Obsidian Local REST API plugin
   - [ ] Configure Obsidian MCP server
   - [ ] Test connection with Claude Desktop
   - [ ] Create CoCoA vault structure

2. **This Week:**
   - [ ] Install Memory MCP server
   - [ ] Set up GitHub for CoCoA project
   - [ ] Create initial CoCoA profile document
   - [ ] Design your ideal agent workflows

3. **Next Week:**
   - [ ] Build custom CoCoA MCP server using mcp-builder skill
   - [ ] Create CoCoA skill file
   - [ ] Integrate additional tools (Calendar, Email)
   - [ ] Test automation workflows

---

## Resources

### Documentation
- **MCP Official Docs:** https://modelcontextprotocol.io
- **Claude Desktop MCP Guide:** https://docs.claude.com
- **Obsidian API Docs:** https://docs.obsidian.md

### Community
- **MCP Discord:** Join via modelcontextprotocol.io
- **Obsidian Forum:** https://forum.obsidian.md
- **GitHub Discussions:** https://github.com/modelcontextprotocol/servers/discussions

### Inspiration
- **2000 words in 90 minutes:** https://www.haihai.ai/obsidian-mcp/
- **Custom MCP Server Tutorial:** Multiple Medium articles
- **MCP Best Practices:** Community GitHub wikis

---

*Generated for your CoCoA project*
*Date: October 22, 2025*
*Ready to become a Cosmic Commoner!*
