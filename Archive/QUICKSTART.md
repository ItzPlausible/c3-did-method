# Quick Start Guide - Docker MCP Server

## 5-Minute Setup

### 1. Save the Server File
Save `docker_mcp_server.py` to:
```
D:\Claude-MCP-Files\docker_mcp_server.py
```

(Create the `Claude-MCP-Files` folder if it doesn't exist)

### 2. Find Your Config File
Open this location in File Explorer:
```
%APPDATA%\Claude\
```

You should see `claude_desktop_config.json`

### 3. Edit the Config File

**If the file is empty or new:**
Copy the entire contents of `claude_desktop_config.json` (provided in this package)

**If you already have MCP servers configured:**
Add just the "docker" section to your existing `mcpServers` object:

```json
{
  "mcpServers": {
    "your-existing-server": {
      ...
    },
    "docker": {
      "command": "python",
      "args": [
        "D:\\Claude-MCP-Files\\docker_mcp_server.py"
      ]
    }
  }
}
```

### 4. Make Sure Docker Desktop is Running
- Open Docker Desktop
- Wait for it to fully start
- Verify you see the green "Docker Desktop is running" indicator

### 5. Restart Claude Desktop
- Completely close Claude Desktop (check system tray)
- Reopen Claude Desktop

### 6. Test It!
In Claude, ask:
```
"What Docker containers are running?"
```

## Common First Commands

Try these to get familiar:

1. **Check Docker status:**
   - "Is Docker Desktop running?"
   - "Show me Docker system information"

2. **List containers:**
   - "Show me all my Docker containers"
   - "What containers are currently running?"

3. **View images:**
   - "What Docker images do I have?"
   
4. **Get container details:**
   - "Show me details for [container-name]"
   - "Get logs from [container-name]"

5. **Container stats:**
   - "How much CPU is [container-name] using?"

## Troubleshooting

### "Failed to connect to Docker"
✅ **Solution:** Make sure Docker Desktop is running

### "Container not found"  
✅ **Solution:** Use `"Show me all containers including stopped ones"`

### MCP Server not showing up
✅ **Solutions:**
1. Check the file path in config is correct
2. Ensure Python is installed: Run `python --version` in terminal
3. Verify mcp package is installed: Run `pip list | findstr mcp`
4. Completely restart Claude Desktop (close from system tray)

## What's Next?

Check out the full README.md for:
- Complete list of all 15 tools
- Advanced configuration options
- More examples and use cases
- Security considerations

## Need Help?

If you encounter issues:
1. Check that `docker_mcp_server.py` is in the right location
2. Verify Docker Desktop is running
3. Make sure the path in `claude_desktop_config.json` uses double backslashes or forward slashes
4. Try running the server manually to see if there are errors:
   ```
   python D:\Claude-MCP-Files\docker_mcp_server.py
   ```
   (Press Ctrl+C to stop after a few seconds - if no errors appear, the server is working)
