# Complete MCP Server Directory
*Updated: October 22, 2025*

## Installation Quick Reference

### Syntax for claude_desktop_config.json
```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "package-name"],
      "env": {
        "KEY": "value"
      }
    }
  }
}
```

---

## ⭐ Essential Servers for CoCoA

### 1. Obsidian Integration
**obsidian-mcp-server**
```bash
# Install
npx -y @smithery/cli install obsidian-mcp --client claude
```

**Config:**
```json
"obsidian": {
  "command": "npx",
  "args": ["-y", "obsidian-mcp-server"],
  "env": {
    "OBSIDIAN_API_KEY": "your_key",
    "OBSIDIAN_HOST": "127.0.0.1",
    "OBSIDIAN_PORT": "27124"
  }
}
```
**Requires:** Obsidian Local REST API plugin
**Source:** https://github.com/cyanheads/obsidian-mcp-server

---

### 2. Memory Server
**@modelcontextprotocol/server-memory**
```bash
# Install
npm install -g @modelcontextprotocol/server-memory
```

**Config:**
```json
"memory": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-memory"]
}
```
**Features:** Knowledge graph, persistent memory
**Source:** https://github.com/modelcontextprotocol/server-memory

---

### 3. Filesystem Server
**@modelcontextprotocol/server-filesystem**
```bash
# Install
npm install -g @modelcontextprotocol/server-filesystem
```

**Config:**
```json
"filesystem": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "C:\\path\\to\\directory"
  ]
}
```
**You already have this!** ✅

---

## 📁 File & Data Management

### Git Server
```bash
npm install -g @modelcontextprotocol/server-git
```
```json
"git": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-git"]
}
```
**Features:** Git operations, commit, branch, diff
**Source:** https://github.com/modelcontextprotocol/server-git

### GitHub Server
```bash
npm install -g @modelcontextprotocol/server-github
```
```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token"
  }
}
```
**Features:** Repos, issues, PRs, file operations
**Source:** https://github.com/modelcontextprotocol/server-github

---

## 🗄️ Database Servers

### PostgreSQL
```bash
npm install -g @modelcontextprotocol/server-postgres
```
```json
"postgres": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres"],
  "env": {
    "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@host:5432/db"
  }
}
```

### SQLite
```bash
npm install -g @jparkerweb/mcp-sqlite
```
```json
"sqlite": {
  "command": "npx",
  "args": ["-y", "mcp-sqlite", "path/to/database.db"]
}
```
**Source:** https://github.com/jparkerweb/mcp-sqlite

### MongoDB
```bash
npm install -g @kiliczsh/mcp-mongo-server
```
```json
"mongodb": {
  "command": "npx",
  "args": ["-y", "mcp-mongo-server"],
  "env": {
    "MONGODB_URI": "mongodb://localhost:27017"
  }
}
```

### DuckDB
```bash
pip install mcp-server-duckdb --break-system-packages
```
**Source:** https://github.com/ktanaka101/mcp-server-duckdb

---

## 🌐 Web & Browser

### Web Search (Brave)
```bash
npm install -g @modelcontextprotocol/server-brave-search
```
```json
"brave-search": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-brave-search"],
  "env": {
    "BRAVE_API_KEY": "your_api_key"
  }
}
```
**You have web_search built-in!** ✅

### Puppeteer (Browser Automation)
```bash
npm install -g @modelcontextprotocol/server-puppeteer
```
```json
"puppeteer": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
}
```
**Features:** Web scraping, automation
**Source:** https://github.com/modelcontextprotocol/server-puppeteer

### Playwright
```bash
npm install -g @microsoft/playwright-mcp
```
**Features:** Advanced browser automation
**Source:** https://github.com/microsoft/playwright-mcp

---

## 💬 Communication

### Slack
```bash
npm install -g @modelcontextprotocol/server-slack
```
```json
"slack": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": {
    "SLACK_BOT_TOKEN": "xoxb-your-token",
    "SLACK_TEAM_ID": "T01234567"
  }
}
```
**Source:** https://github.com/modelcontextprotocol/server-slack

### Microsoft Teams
```bash
npm install -g mcp-server-teams
```
**Features:** Read, post, mention in Teams
**Source:** Community contributed

### Gmail
Check for community implementations
**Search:** "gmail mcp server github"

---

## 🤖 AI Enhancement

### Sequential Thinking
```bash
npm install -g @modelcontextprotocol/server-sequential-thinking
```
```json
"sequential-thinking": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
}
```
**Features:** Enhanced reasoning, step-by-step thinking
**Source:** https://github.com/modelcontextprotocol/server-sequential-thinking

### RAG (Ragie)
```bash
npm install -g @ragieai/mcp-server
```
**Features:** Retrieval Augmented Generation
**Source:** https://github.com/ragieai/mcp-server

### Pinecone Assistant
```bash
cargo install pinecone-assistant-mcp
```
**Features:** Vector database, knowledge engine
**Source:** https://github.com/pinecone-io/assistant-mcp

---

## ☁️ Cloud Platforms

### Cloudflare (You have this!) ✅
Already configured in your setup!

### AWS Knowledge Base
```bash
pip install mcp-server-aws-kb-retrieval --break-system-packages
```
**Features:** AWS Bedrock, Knowledge Base retrieval

### Azure OpenAI
Part of Microsoft MCP collection
**Source:** https://github.com/microsoft/mcp

### Google Cloud
Check official registry for GCP MCP servers

---

## 📊 Productivity & Tools

### Calendar (Google Calendar)
```bash
npm install -g mcp-server-google-calendar
```
Check community for latest implementation

### Notion
```bash
npm install -g mcp-server-notion
```
**Features:** Database operations, page creation

### Trello
```bash
npm install -g mcp-server-trello
```
**Features:** Board management, card operations

### Linear
```bash
npm install -g mcp-server-linear
```
**Features:** Issue tracking, project management

---

## 🎨 Media & Content

### EverArt (Image Generation)
```bash
npm install -g @modelcontextprotocol/server-everart
```
```json
"everart": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-everart"],
  "env": {
    "EVERART_API_KEY": "your_key"
  }
}
```

### Spotify
```bash
npm install -g mcp-spotify
```
**Features:** Playback control, playlist management
**Source:** Multiple implementations available

---

## 📍 Location & Maps

### Google Maps
```bash
npm install -g @modelcontextprotocol/server-google-maps
```
```json
"google-maps": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-google-maps"],
  "env": {
    "GOOGLE_MAPS_API_KEY": "your_key"
  }
}
```

### OpenStreetMap
```bash
pip install open-streetmap-mcp --break-system-packages
```
**Source:** https://github.com/jagan-shanmugam/open-streetmap-mcp

---

## 🔧 Development Tools

### Docker
```bash
npm install -g mcp-server-docker
```
**Features:** Container management, image operations

### Kubernetes
```bash
npm install -g multicluster-mcp-server
```
**Features:** Multi-cluster management

### Jenkins
Official Jenkins MCP Server plugin
**Source:** Check Jenkins plugin directory

---

## 📦 Package Managers

### NPM
Built into many Node.js MCP servers

### Homebrew (macOS)
```bash
npm install -g mcp-server-homebrew
```
**Features:** Package installation, management

---

## 🎯 Specialized Servers

### Jira
```bash
npm install -g mcp-server-jira
```
**Features:** Issue tracking, project management

### Confluence
```bash
npm install -g mcp-server-confluence
```
**Features:** Wiki documentation access

### Sentry
```bash
npm install -g @modelcontextprotocol/server-sentry
```
**Features:** Error tracking, issue analysis
**Source:** https://github.com/modelcontextprotocol/server-sentry

---

## 🚀 Microsoft Official Servers

### Microsoft 365 Agents Toolkit
```bash
npm install -g @microsoft/m365-agents-toolkit-mcp
```
**Features:** Complete M365 integration

### Azure DevOps
```bash
npm install -g @microsoft/azure-devops-mcp
```
**Features:** Pipeline management, repos

### Azure AI Foundry
```bash
npm install -g @microsoft/azure-ai-foundry-mcp
```
**Features:** Models, evaluation, knowledge

**Full list:** https://github.com/microsoft/mcp

---

## 📚 Documentation & Learning

### Fetch Server
```bash
npm install -g @modelcontextprotocol/server-fetch
```
**Features:** Web content fetching, conversion
**Source:** https://github.com/modelcontextprotocol/server-fetch

### Everything (Test Server)
```bash
npm install -g @modelcontextprotocol/server-everything
```
**Features:** Demo of all MCP features

---

## 🛠️ Custom Server Development

### FastMCP (Python)
```bash
pip install fastmcp --break-system-packages
```
**Use for:** Creating custom Python MCP servers
**Docs:** https://github.com/jlowin/fastmcp

### MCP TypeScript SDK
```bash
npm install @modelcontextprotocol/sdk
```
**Use for:** Creating custom TypeScript MCP servers

---

## 📋 Installation Templates

### Python Package
```bash
pip install <package-name> --break-system-packages
```

### Node.js Package
```bash
npm install -g <package-name>
# or use directly
npx -y <package-name>
```

### Using Smithery
```bash
npx -y @smithery/cli install <server-name> --client claude
```

---

## 🔍 Discovery Tools

### MCP Registry
**Official:** https://github.com/modelcontextprotocol/registry
**Web:** https://mcp.so (16,000+ servers)

### Curated Lists
1. **wong2/awesome-mcp-servers**
   https://github.com/wong2/awesome-mcp-servers

2. **punkpeye/awesome-mcp-servers**
   https://github.com/punkpeye/awesome-mcp-servers

3. **Glama MCP Directory**
   https://glama.ai/mcp

### Search Commands
```bash
# Search MCP registry
npx -y @smithery/cli search <keyword>

# Browse categories
# Visit: https://mcp.so/categories
```

---

## 🎓 Learning Resources

### Build Your Own Server
Use the **mcp-builder skill**: "Help me create a custom MCP server"

### Templates & Examples
- Official examples: https://github.com/modelcontextprotocol/servers
- FastMCP examples: https://github.com/jlowin/fastmcp
- Community templates: Search GitHub for "mcp-server-template"

---

## 💡 Tips for Success

### Start Small
1. Obsidian integration
2. Memory server
3. One or two productivity tools
4. Expand gradually

### Test Thoroughly
- Verify each server before adding the next
- Check logs regularly
- Monitor performance

### Maintain Config
- Keep backup of config file
- Document custom servers
- Version control recommended

### Get Help
- MCP Discord community
- GitHub issues on server repos
- Obsidian forum for integration help

---

## 🆘 Troubleshooting

### Server Won't Connect
```bash
# Check logs
# Windows:
type %APPDATA%\Claude\logs\mcp-server-*.log

# Test server manually
npx -y <server-name>
```

### Config Issues
- Validate JSON syntax: https://jsonlint.com
- Check for typos in package names
- Verify environment variables
- Restart Claude Desktop

### Performance Issues
- Too many servers? Start with essentials
- Check system resources
- Review server logs for errors

---

**Ready to Install?**

Start with the essential servers in the Quick-Start-Checklist.md, then expand based on your needs!

**Last Updated:** October 22, 2025
**Total Servers Available:** 16,000+
**CoCoA-Ready:** Yes! 🚀
