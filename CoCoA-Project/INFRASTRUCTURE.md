# CoCoA Infrastructure & Tech Stack

**Organization**: Plausible Potentials  
**Last Updated**: October 23, 2025

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CoCoA System                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │   Claude Desktop AI Engine                     │    │
│  │   + Claude Skills for Context/Personality      │    │
│  └────────────────────────────────────────────────┘    │
│                         │                               │
│         ┌───────────────┴────────────────┐             │
│         │                                 │             │
│    ┌────▼─────┐                    ┌─────▼──────┐     │
│    │   MCP    │                    │  Context   │     │
│    │ Servers  │                    │  & Skills  │     │
│    └──────────┘                    └────────────┘     │
│         │                                              │
│    ┌────┴─────────────────────────────────┐          │
│    │                                        │          │
│ ┌──▼──────┐  ┌─────────┐  ┌──────────┐  ┌▼────────┐ │
│ │FileSystem│ │ Google  │  │  Docker  │  │ Future  │ │
│ └──────────┘ │Workspace│  │          │  │ Custom  │ │
│              └─────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Core Components

### AI Engine

**Claude Desktop (Sonnet 4.5)**

- Primary intelligence layer
- Context-aware responses
- Natural language processing
- Code generation and review

**Claude Skills**

- Personality configuration
- Workflow definitions
- Custom capabilities
- Knowledge extensions

---

## Development Tools

### Version Control

**GitHub Desktop**

- Repository: https://github.com/PlausiblePotentials-C3/CoCoA-Project
- Branch Strategy: main (stable), develop (active), feature/\* (new work)
- Private repository for security

**Git Workflow:**

```bash
# Daily workflow
1. Pull latest changes
2. Create feature branch
3. Make changes
4. Commit with descriptive message
5. Push to remote
6. Create PR when ready
```

### Containerization

**Docker Desktop**

- Development: Local testing environment
- Future: Production deployment (decentralized)
- Containers:
  - `cocoa-dev`: Development environment
  - Future: `cocoa-prod`, `cocoa-db`, `cocoa-redis`

---

## Communication Hub

### Platforms

#### 1. Email (Active ✅)

**team@plausiblepotentials.com**

- Integration: Google Workspace MCP
- Response Time: Same-day
- Use: Business communications

#### 2. Telegram (Planned 🚧)

- Use: Quick updates, urgent notifications
- Priority: High (quick response needed)
- Bot: To be configured

#### 3. Discord (Planned 🚧)

- Server: Plausible Potentials
- Use: Team collaboration, development discussions
- Channels: #cocoa-development, #cocoa-updates
- Response Time: Daily check

#### 4. Proton Mail (Active ✅)

- Use: Secure/sensitive communications
- Integration: Manual (no MCP yet)

#### 5. PlausiblePotentials.com (In Development 🚧)

- Website: Public presence
- CMS: To be determined
- CoCoA Role: Content management assistance

---

## MCP Server Configuration

### Active MCP Servers

#### Filesystem ✅

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem"],
  "env": {
    "ALLOWED_DIRECTORIES": "D:\\Claude-MCP-Files"
  }
}
```

**Capabilities:**

- Read/write local files
- Directory navigation
- File search
- Context loading

#### Google Workspace ✅

```json
{
  "command": "npx",
  "args": ["-y", "@anthropic/google-workspace-mcp"],
  "env": {
    "GOOGLE_CLIENT_SECRET_PATH": "D:\\Claude-MCP-Files\\google-workspace-credentials.json"
  }
}
```

**Capabilities:**

- Gmail (read, send, draft)
- Google Calendar (view, create, update events)
- Google Drive (file management)
- Google Docs (read, create, edit)

#### Docker ✅

```json
{
  "command": "python",
  "args": ["D:\\Claude-MCP-Files\\docker_mcp_server.py"]
}
```

**Capabilities:**

- Container management
- Image operations
- Network configuration
- Volume management

### Planned MCP Servers

#### Discord Bot 🚧

```json
{
  "command": "python",
  "args": ["D:\\Claude-MCP-Files\\CoCoA-Project\\src\\discord_mcp_server.py"],
  "env": {
    "DISCORD_BOT_TOKEN": "your_token_here"
  }
}
```

**Planned Capabilities:**

- Send messages to channels
- Monitor mentions
- Post updates
- Team notifications

#### Telegram Bot 🚧

```json
{
  "command": "python",
  "args": ["D:\\Claude-MCP-Files\\CoCoA-Project\\src\\telegram_mcp_server.py"],
  "env": {
    "TELEGRAM_BOT_TOKEN": "your_token_here"
  }
}
```

**Planned Capabilities:**

- Send notifications
- Quick status updates
- Mobile-friendly responses
- Emergency alerts

#### Obsidian 🔜

- Knowledge base integration
- Note management
- Linking and organization
- Search capabilities

---

## Technology Stack

### Languages & Frameworks

- **Python 3.11+**: Backend, MCP servers, automation
- **TypeScript**: Blockchain development, web applications
- **Plutus**: Cardano smart contracts
- **YAML**: Configuration files

### Development Environment

- **IDE**: VS Code
- **Package Manager**: pip (Python), npm (Node.js)
- **Container**: Docker Desktop
- **Version Control**: GitHub Desktop

### Web3/Blockchain

- **Networks**: Midnight Network, Cosmos IBC
- **Focus**: dApp development, Cooperative Economics
- **Tools**: Docker/Kubernetes for deployment
- **Identity**: Self-Sovereign Identity, DIDs

---

## Security & Access Control

### Credentials Management

```yaml
Storage: .env file (never committed)
Location: D:\Claude-MCP-Files\.env

Required Keys:
  - DISCORD_BOT_TOKEN
  - TELEGRAM_BOT_TOKEN
  - GOOGLE_CLIENT_SECRET_PATH
  - (Blockchain keys: separate encrypted vault)
```

### Access Levels

```yaml
Filesystem:
  Allowed: D:\Claude-MCP-Files\
  Restricted: System files, other users

Email:
  Access: team@plausiblepotentials.com only
  Scope: Read, send, draft

Docker:
  Access: Local Docker Desktop only
  Scope: Container management
```

### Security Rules

- ⛔ Never log private keys or mnemonics
- ⛔ Never commit credentials to Git
- ⛔ Never share wallet addresses publicly
- ✅ Use environment variables for secrets
- ✅ Keep profile in private repository
- ✅ Encrypted vaults for blockchain credentials

---

## Development Workflow

### Daily Development

```yaml
Morning: 1. Pull latest from GitHub
  2. Review changes
  3. Plan today's work

Development: 1. Create feature branch
  2. Develop with Docker containers
  3. Test locally
  4. Commit frequently

End of Day: 1. Push changes to GitHub
  2. Update documentation
  3. Log progress in context/
  4. Plan next session
```

### Docker Development

```bash
# Start development environment
docker-compose -f docker/docker-compose.dev.yml up

# Rebuild after changes
docker-compose -f docker/docker-compose.dev.yml up --build

# Stop environment
docker-compose -f docker/docker-compose.dev.yml down

# View logs
docker-compose -f docker/docker-compose.dev.yml logs -f
```

---

## Monitoring & Logging

### Activity Logs

```yaml
Location: context/logs/
Files:
  - session-history.json # Conversation logs
  - actions.log # CoCoA actions
  - errors.log # Error tracking
  - performance.log # Performance metrics
```

### GitHub Activity

- Commits tracked per project
- Pull requests for major changes
- Issues for bug tracking and features
- Project boards for task management

---

## Deployment Strategy

### Phase 1: Local Development (Current)

- Development on local machine
- Testing with Docker containers
- Manual deployment and testing

### Phase 2: Containerized Development (Week 2-4)

- Full Docker environment
- Automated testing
- CI/CD pipeline setup

### Phase 3: Cloud Deployment (Month 2+)

- Container orchestration (Kubernetes)
- Decentralized hosting
- Production monitoring
- Automated backups

---

## Future Enhancements

### Short-term (1-3 months)

- [ ] Discord/Telegram integration
- [ ] Custom MCP servers
- [ ] Workflow automation
- [ ] Obsidian integration

### Medium-term (3-6 months)

- [ ] Advanced AI capabilities
- [ ] Multi-user support
- [ ] API for external integrations
- [ ] Mobile interface

### Long-term (6-12 months)

- [ ] Decentralized deployment
- [ ] Blockchain integration
- [ ] Voice interface
- [ ] Multi-modal capabilities

---

## Support & Resources

### Documentation

- README.md - Project overview
- INFRASTRUCTURE.md - This file
- context/profile.md - User preferences
- docs/ - Additional guides

### External Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [Claude Documentation](https://docs.anthropic.com)
- [Docker Documentation](https://docs.docker.com)

### Contact

- **Organization**: Plausible Potentials
- **Email**: team@plausiblepotentials.com
- **GitHub**: https://github.com/PlausiblePotentials-C3

---

**Version**: 0.1.0  
**Status**: Active Development  
**Location**: Houston, TX (CST)  
**Last Updated**: October 23, 2025
