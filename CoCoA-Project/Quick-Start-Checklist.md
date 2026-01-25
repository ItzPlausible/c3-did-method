# CoCoA Quick Start Checklist

## Phase 0: Preparation (30 minutes)

### Read Documentation
- [ ] Read the complete MCP-Setup-Guide.md
- [ ] Understand Skills system
- [ ] Review Obsidian integration options

### Backup
- [ ] Backup your existing Obsidian vault
- [ ] Consider setting up Git for version control
- [ ] Document current Claude Desktop config

---

## Phase 1: Obsidian Setup (1 hour)

### Install Obsidian REST API Plugin
1. [ ] Open Obsidian Settings
2. [ ] Go to Community Plugins
3. [ ] Disable Safe Mode (if enabled)
4. [ ] Browse community plugins
5. [ ] Search for "Local REST API"
6. [ ] Click Install
7. [ ] Enable the plugin
8. [ ] Go to plugin settings
9. [ ] **Copy the API key** (save it somewhere safe!)
10. [ ] Note the port number (usually 27124)

### Create CoCoA Vault Structure
```
In Obsidian, create these folders:
- CoCoA/
  - Memory/
    - Conversations/
    - Context/
    - Learnings/
  - Preferences/
  - Projects/
  - Daily-Notes/
- Knowledge-Base/
  - Technical/
  - Personal/
  - Work/
- Templates/
```

Tasks:
- [ ] Create folder structure in Obsidian
- [ ] Copy CoCoA-Profile-Template.md to CoCoA/Preferences/
- [ ] Fill out your CoCoA profile
- [ ] Create your first daily note

---

## Phase 2: MCP Configuration (30 minutes)

### Locate Config File
**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**How to get there:**
1. Press Win + R
2. Type: %APPDATA%\Claude
3. Open claude_desktop_config.json

### Backup Current Config
- [ ] Copy your current claude_desktop_config.json
- [ ] Save backup as claude_desktop_config.backup.json

### Add Obsidian MCP Server

#### Option A: Using Smithery (Easiest)
```bash
npx -y @smithery/cli install obsidian-mcp --client claude
```
- [ ] Run command
- [ ] Verify installation
- [ ] Check config file was updated

#### Option B: Manual Configuration
Add this to your claude_desktop_config.json:

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "npx",
      "args": ["-y", "obsidian-mcp-server"],
      "env": {
        "OBSIDIAN_API_KEY": "YOUR_API_KEY_HERE",
        "OBSIDIAN_HOST": "127.0.0.1",
        "OBSIDIAN_PORT": "27124"
      }
    }
  }
}
```

Tasks:
- [ ] Replace YOUR_API_KEY_HERE with your actual API key
- [ ] Save the file
- [ ] Restart Claude Desktop
- [ ] Look for hammer icon in Claude Desktop

---

## Phase 3: Test Connection (15 minutes)

### Verify Obsidian MCP
In Claude Desktop, try these commands:

1. [ ] "Can you see my Obsidian vault?"
2. [ ] "List the files in my CoCoA folder"
3. [ ] "Read my CoCoA profile"
4. [ ] "Create a test note in CoCoA/Memory/test.md"

### Expected Results
- Claude should see your files
- Claude should be able to read content
- Claude should be able to create new notes
- Hammer icon should be visible in UI

### Troubleshooting
If it doesn't work:
- [ ] Check API key is correct
- [ ] Verify Obsidian REST API plugin is running
- [ ] Check port number (27124)
- [ ] Restart Obsidian
- [ ] Restart Claude Desktop
- [ ] Check logs: %APPDATA%\Claude\logs\mcp-server-*.log

---

## Phase 4: Add Essential MCP Servers (1 hour)

### Memory Server (Recommended)
```bash
npm install -g @modelcontextprotocol/server-memory
```

Add to config:
```json
"memory": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-memory"]
}
```

- [ ] Install memory server
- [ ] Add to config
- [ ] Restart Claude Desktop
- [ ] Test: "Remember that I prefer morning coding sessions"

### GitHub Server (if you use Git)
```bash
npm install -g @modelcontextprotocol/server-github
```

Add to config:
```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
  }
}
```

- [ ] Create GitHub Personal Access Token
- [ ] Install GitHub server
- [ ] Add to config
- [ ] Test: "List my GitHub repositories"

---

## Phase 5: Create Your First Workflow (30 minutes)

### Morning Check-in Workflow
1. [ ] Create template: Templates/morning-checkin.md
2. [ ] Ask Claude: "Help me set up a morning check-in routine"
3. [ ] Test the workflow
4. [ ] Refine based on results

### Daily Note Creation
1. [ ] Create template: Templates/daily-note.md
2. [ ] Ask Claude: "Create today's daily note using the template"
3. [ ] Add automatic date stamps
4. [ ] Link to projects and tasks

### Project Documentation
1. [ ] Ask Claude: "Help me document the CoCoA project in Obsidian"
2. [ ] Create project structure
3. [ ] Add backlinks between notes
4. [ ] Tag appropriately

---

## Phase 6: Customize CoCoA (Ongoing)

### Fill Out Preferences
- [ ] Complete CoCoA profile with your information
- [ ] Define communication style
- [ ] Set work preferences
- [ ] Add project context

### Create Custom Workflows
- [ ] Morning routine
- [ ] Code review process
- [ ] Meeting preparation
- [ ] End of day wrap-up

### Test and Iterate
- [ ] Use CoCoA for real tasks
- [ ] Note what works well
- [ ] Identify improvements needed
- [ ] Update profile regularly

---

## Phase 7: Advanced Features (Week 2+)

### Custom MCP Server
- [ ] Use mcp-builder skill to create CoCoA server
- [ ] Implement custom tools
- [ ] Add personality features
- [ ] Test and deploy

### Create CoCoA Skill
- [ ] Use skill-creator skill
- [ ] Define CoCoA capabilities
- [ ] Add context management
- [ ] Document usage patterns

### Integration Expansion
- [ ] Add calendar integration
- [ ] Connect email management
- [ ] Link productivity tools
- [ ] Automate routine tasks

---

## Verification Checklist

Before moving forward, verify:

✅ **Obsidian Integration**
- [ ] Can read notes
- [ ] Can create notes
- [ ] Can search vault
- [ ] Can modify existing notes

✅ **MCP Functionality**
- [ ] Hammer icon visible
- [ ] Multiple servers connected
- [ ] No error messages in logs
- [ ] Responses include tool usage

✅ **Basic Workflows**
- [ ] Morning check-in works
- [ ] Daily note creation works
- [ ] Project documentation works
- [ ] Search and retrieval works

---

## Common Issues & Solutions

### Issue: "Can't connect to Obsidian"
**Solutions:**
1. Verify REST API plugin is enabled
2. Check API key is correct
3. Ensure Obsidian is running
4. Confirm port 27124 is not blocked
5. Restart both Obsidian and Claude Desktop

### Issue: "No hammer icon in Claude Desktop"
**Solutions:**
1. Check config file syntax (must be valid JSON)
2. Verify MCP server paths are correct
3. Check logs for errors
4. Reinstall MCP servers
5. Restart Claude Desktop

### Issue: "Skills not working"
**Solutions:**
1. Skills are automatic - just ask for them
2. Example: "Use the docx skill to create a document"
3. I'll read the skill automatically
4. No manual configuration needed

---

## Next Steps After Setup

### Day 1-7: Foundation
- Use CoCoA for daily tasks
- Build note-taking habits
- Refine workflows
- Update profile based on learnings

### Week 2-4: Enhancement
- Add more MCP servers
- Create custom integrations
- Develop advanced workflows
- Build knowledge base

### Month 2-3: Optimization
- Fine-tune personality
- Create custom MCP server
- Automate repetitive tasks
- Expand capabilities

---

## Resources

### Documentation
- MCP-Setup-Guide.md (your main guide)
- CoCoA-Profile-Template.md (your preferences)
- https://modelcontextprotocol.io (MCP docs)

### Help & Support
- Ask me! I'm here to help
- Obsidian Forum: https://forum.obsidian.md
- MCP Discord: via modelcontextprotocol.io

### Inspiration
- Check the examples in MCP-Setup-Guide.md
- Browse awesome-mcp-servers lists
- Read blog posts about MCP + Obsidian

---

## Success Metrics

You'll know CoCoA is working when:
- ✅ You ask a question and I reference your notes
- ✅ I help create notes automatically
- ✅ You save time on routine tasks
- ✅ Your knowledge base grows organically
- ✅ Context is maintained across conversations
- ✅ You feel like you have a personal assistant

---

**Ready to Begin?**

Start with Phase 1 and work through each phase. Take your time and don't rush. Building the perfect AI assistant is an iterative process!

**Current Date:** October 22, 2025
**Version:** 1.0
**Status:** Ready for launch 🚀
