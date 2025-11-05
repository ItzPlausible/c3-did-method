# Installation Guide for D:\Claude-MCP-Files

## Automated Setup (Recommended)

### Option 1: Using the Setup Script

1. **Download all files** to a temporary folder (e.g., Downloads)

2. **Run the setup script:**
   - Double-click `setup.bat`
   - The script will:
     - Create `D:\Claude-MCP-Files` directory
     - Copy all necessary files
     - Open the Claude configuration folder

3. **Configure Claude Desktop:**
   - The script opens `%APPDATA%\Claude`
   - Open `claude_desktop_config.json` in that folder
   - Copy the content from your `claude_desktop_config.json` file

4. **Restart Claude Desktop** completely

5. **Test the connection** by asking Claude: "What Docker containers are running?"

---

## Manual Setup

### Step 1: Create the Directory

Open Command Prompt or PowerShell and run:
```batch
mkdir D:\Claude-MCP-Files
```

Or create it manually in File Explorer.

### Step 2: Copy Files

Copy these files to `D:\Claude-MCP-Files\`:
- `docker_mcp_server.py` (required)
- `README.md` (documentation)
- `QUICKSTART.md` (quick reference)

Your folder structure should look like:
```
D:\Claude-MCP-Files\
├── docker_mcp_server.py
├── README.md
└── QUICKSTART.md
```

### Step 3: Configure Claude Desktop

1. **Find your config file:**
   - Press `Win + R`
   - Type: `%APPDATA%\Claude`
   - Press Enter
   - Look for `claude_desktop_config.json`

2. **Edit the config file:**

   **If the file is empty or doesn't exist:**
   ```json
   {
     "mcpServers": {
       "docker": {
         "command": "python",
         "args": [
           "D:\\Claude-MCP-Files\\docker_mcp_server.py"
         ]
       }
     }
   }
   ```

   **If you already have MCP servers:**
   Add the docker section to your existing configuration:
   ```json
   {
     "mcpServers": {
       "existing-server": {
         "command": "...",
         "args": ["..."]
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

3. **Save the file**

### Step 4: Verify Python and Dependencies

Open Command Prompt and check:
```batch
python --version
pip list | findstr mcp
pip list | findstr docker
```

You should see:
- Python 3.8 or higher
- `mcp` package installed
- `docker` package installed

If missing, run:
```batch
pip install mcp docker
```

### Step 5: Verify Docker Desktop

1. Open Docker Desktop
2. Wait for it to fully start
3. Look for "Docker Desktop is running" status

### Step 6: Restart Claude Desktop

1. **Completely close Claude Desktop**
   - Close the main window
   - Right-click the system tray icon → Exit
   
2. **Reopen Claude Desktop**

### Step 7: Test the Connection

In Claude, try these commands:
- "Is Docker Desktop running?"
- "Show me all Docker containers"
- "What Docker images do I have?"

---

## Troubleshooting

### Issue: "Failed to connect to Docker"

**Cause:** Docker Desktop is not running

**Solution:**
1. Open Docker Desktop
2. Wait for it to fully start
3. Try again in Claude

### Issue: "MCP server not found" or no response

**Cause:** Configuration path is incorrect

**Solution:**
1. Verify `docker_mcp_server.py` exists at: `D:\Claude-MCP-Files\docker_mcp_server.py`
2. Check the path in `claude_desktop_config.json` uses `D:\\Claude-MCP-Files\\` (double backslashes)
3. Alternative: Use forward slashes `D:/Claude-MCP-Files/` (also valid)
4. Restart Claude Desktop completely

### Issue: "Python not found"

**Cause:** Python is not installed or not in PATH

**Solution:**
1. Install Python from https://python.org
2. During installation, check "Add Python to PATH"
3. Or use full Python path in config:
   ```json
   {
     "mcpServers": {
       "docker": {
         "command": "C:\\Python314\\python.exe",
         "args": ["D:\\Claude-MCP-Files\\docker_mcp_server.py"]
       }
     }
   }
   ```

### Issue: "Module not found: mcp" or "Module not found: docker"

**Cause:** Required packages not installed

**Solution:**
```batch
pip install mcp docker
```

Or with --break-system-packages if needed:
```batch
pip install mcp docker --break-system-packages
```

### Issue: Can run server manually but not from Claude

**Test if server works:**
```batch
cd D:\Claude-MCP-Files
python docker_mcp_server.py
```

If you see it hang (no errors), press `Ctrl+C` and that's normal - the server is working!

**If server works but Claude doesn't connect:**
1. Double-check `claude_desktop_config.json` syntax (no missing commas or quotes)
2. Ensure Claude Desktop is completely restarted
3. Check Windows Event Viewer for errors
4. Try using forward slashes in the path instead

---

## Alternative: Using a Virtual Environment

If you prefer to use a Python virtual environment:

### Create Virtual Environment
```batch
cd D:\Claude-MCP-Files
python -m venv venv
venv\Scripts\activate
pip install mcp docker
```

### Update Configuration
```json
{
  "mcpServers": {
    "docker": {
      "command": "D:\\Claude-MCP-Files\\venv\\Scripts\\python.exe",
      "args": [
        "D:\\Claude-MCP-Files\\docker_mcp_server.py"
      ]
    }
  }
}
```

---

## Verifying Installation

### Check Files Are in Place
```batch
dir D:\Claude-MCP-Files
```

Should show:
- docker_mcp_server.py
- README.md
- QUICKSTART.md

### Test Server Manually
```batch
python D:\Claude-MCP-Files\docker_mcp_server.py
```

Press `Ctrl+C` after 5 seconds. If no errors = working!

### Check Configuration File
```batch
notepad %APPDATA%\Claude\claude_desktop_config.json
```

Should contain the docker configuration with correct path.

---

## Support

**For MCP-related issues:**
- Review the README.md in D:\Claude-MCP-Files
- Check https://modelcontextprotocol.io

**For Docker issues:**
- Ensure Docker Desktop is running
- Check https://docs.docker.com

**For Claude Desktop issues:**
- Visit https://support.claude.com

---

## Summary

✅ Create directory: `D:\Claude-MCP-Files`
✅ Copy files to the directory
✅ Configure `claude_desktop_config.json`
✅ Restart Claude Desktop
✅ Test with: "What Docker containers are running?"

Once complete, you'll be able to manage Docker directly through Claude!
