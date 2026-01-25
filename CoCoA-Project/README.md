# CoCoA - Cosmic Commoner Avatar

**Your Personal AI Agent powered by Claude Desktop + MCP**

[![Private](https://img.shields.io/badge/status-private-red)]()
[![Version](https://img.shields.io/badge/version-0.1.0-blue)]()
[![Organization](https://img.shields.io/badge/org-PlausiblePotentials-green)]()

---

## What is CoCoA?

CoCoA is your personalized "Jarvis" - an AI assistant built on Claude Desktop with customized context, personality, and capabilities through Model Context Protocol (MCP) servers. Specifically configured for Web3/Blockchain development and project management.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  CoCoA System                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │   Claude Desktop (Core AI Engine)            │  │
│  │   + CoCoA Personality & Context              │  │
│  └──────────────────────────────────────────────┘  │
│                        │                            │
│       ┌────────────────┴────────────────┐          │
│       │                                  │          │
│  ┌────▼────┐  ┌──────────┐  ┌──────────▼──────┐  │
│  │  MCP    │  │   MCP    │  │   MCP           │  │
│  │ Servers │  │  Memory  │  │  Custom Tools   │  │
│  └─────────┘  └──────────┘  └─────────────────┘  │
│                                                     │
│  • Filesystem Access                               │
│  • Google Workspace                                │
│  • Docker Management                               │
│  • Context Loading                                 │
│  • Future: Discord, Telegram, Obsidian            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Quick Start

1. **Configure your profile:**
   - Edit `context/profile.md` with your information
2. **Install dependencies:**

```bash
   pip install -r requirements.txt
```

3. **Start using CoCoA:**
   - Open Claude Desktop
   - Say: "CoCoA, load my profile and let's get started"

## Skills Library

CoCoA's capabilities are powered by a centralized skills library located at:
**`D:\Claude-MCP-Files\skills`**

### Available Skills
- **cocoa-SKILL.md** - Master CoCoA context and personality
- **productivity-core.md** - Core productivity workflows
- **obsidian-productivity.md** - Obsidian idea management (condensed)
- **obsidian-idea-management.md** - Full Obsidian workflow system
- **communications-core.md** - Email and communication management
- **morning-routine/** - 7-9 AM deep work automation
- **agent-communications/** - Telegram integration (Phase 2C)
- **proton-mail.md** - Proton Suite workflows
- **github-mcp.md** - GitHub integration

**Complete Index**: See `SKILLS-INDEX.md` in the skills folder  
**Project Reference**: See `SKILLS-REFERENCE.md` in this repository

### Why Separate Skills?
Following AI agent development best practices:
- ✅ **CoCoA-Project** = Main repository (Git, documentation, workflows)
- ✅ **skills/** = Reusable skill library (modular components)

This provides clean separation, version control, and skill reusability.

## Project Structure

```
CoCoA-Project/
├── README.md                      # This file
├── INFRASTRUCTURE.md              # Tech stack details
├── context/                       # CoCoA's memory
│   ├── profile.md                # Your personal profile
│   └── learnings.md              # What CoCoA learns
├── src/                          # Custom MCP servers
├── docker/                       # Docker deployment
├── workflows/                    # Automated workflows
├── .gitignore                    # Security protection
└── requirements.txt              # Python dependencies
```

## Key Features

### ✅ Current Capabilities

- **Context Awareness**: Personalized to your preferences
- **File Management**: Access and organize files
- **Google Integration**: Email, calendar, docs
- **Docker Management**: Container operations
- **Personalized Responses**: Adapted to your style

### 🚧 In Development

- **Discord Integration**: Bot for team communication
- **Telegram Integration**: Mobile notifications
- **Custom Workflows**: Automated task sequences
- **Obsidian Integration**: Knowledge base management

### 🔮 Future Vision

- **Docker Deployment**: Decentralized hosting
- **Proactive Assistance**: Anticipate needs
- **Multi-modal**: Vision, audio capabilities
- **True Jarvis**: Advanced AI assistant

## Technology Stack

**Core:**

- Claude Desktop (Sonnet 4.5)
- Model Context Protocol (MCP)
- Python 3.11+ / TypeScript
- Docker, GitHub, Google Workspace

**Integrations:**

- Google Workspace (Email, Calendar, Docs)
- GitHub Desktop (Version Control)
- Docker Desktop (Containerization)
- Discord (Team Communication - planned)
- Telegram (Quick Updates - planned)

## Quick Commands

```
CoCoA, morning check-in
CoCoA, help me with [project]
CoCoA, check my emails
CoCoA, what's on my calendar?
CoCoA, load my profile
```

## Development Roadmap

### Phase 1: Foundation ✅

- [x] Project structure
- [x] Documentation
- [x] Profile system
- [x] GitHub setup

### Phase 2: Integration (Current)

- [ ] Discord bot
- [ ] Telegram bot
- [ ] Custom MCP servers
- [ ] Workflow automation

### Phase 3: Intelligence (Weeks 3-4)

- [ ] Proactive assistance
- [ ] Pattern recognition
- [ ] Advanced context awareness

### Phase 4: Deployment (Month 2)

- [ ] Docker containerization
- [ ] Decentralized hosting
- [ ] Production ready

## Security & Privacy

- 🔒 **Private Repository**: Your personal data stays private
- 🔐 **Encrypted Credentials**: API keys in environment variables
- 🛡️ **No Public Keys**: Blockchain credentials never logged
- 📁 **.gitignore**: Protects sensitive files

## MCP Servers

### Active

- ✅ **Filesystem**: Local file access
- ✅ **Google Workspace**: Email, calendar, docs
- ✅ **Docker**: Container management

### Planned

- 🚧 **Discord**: Team communication
- 🚧 **Telegram**: Mobile notifications
- 🔜 **Obsidian**: Knowledge base
- 🔜 **GitHub**: Repository management

## Contact

- **Organization**: Plausible Potentials
- **Email**: team@plausiblepotentials.com
- **Repository**: https://github.com/PlausiblePotentials-C3/CoCoA-Project

## License

Personal use. Your CoCoA, your way.

---

**Version**: 0.1.0  
**Status**: Active Development  
**Created**: October 23, 2025

**Your Personal AI Agent 🚀**
