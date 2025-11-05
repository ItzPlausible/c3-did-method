# Docker MCP Server

A Model Context Protocol (MCP) server for controlling Docker Desktop from Claude.

## Features

### Container Management (10 tools)
- `list_containers` - List all containers with filtering options
- `get_container_details` - Get detailed information about a specific container
- `get_container_logs` - Retrieve container logs with configurable tail and timestamps
- `start_container` - Start a stopped container
- `stop_container` - Stop a running container gracefully
- `restart_container` - Restart a container
- `remove_container` - Remove a container (with safety checks)
- `get_container_stats` - Get real-time resource usage statistics

### Image Management (3 tools)
- `list_images` - List all locally available images
- `pull_image` - Pull an image from Docker Hub or other registries
- `remove_image` - Remove an image from local storage

### System Information (2 tools)
- `get_docker_info` - Get Docker Desktop system information
- `get_container_stats` - Get resource usage for running containers

## Prerequisites

1. **Docker Desktop** must be installed and running
2. **Python 3.8+** installed
3. **Required packages** (already installed):
   - `mcp`
   - `docker`

## Setup Instructions

### Step 1: Save the Server File

Save `docker_mcp_server.py` to a location on your computer. For example:
- Windows: `D:\Claude-MCP-Files\docker_mcp_server.py`
- macOS/Linux: `~/mcp-servers/docker_mcp_server.py`

### Step 2: Configure Claude Desktop

Add this configuration to your Claude Desktop config file:

**Config file location:**
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

**Configuration to add:**

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

**Important notes:**
- Replace the path with where you saved `docker_mcp_server.py`
- On Windows, use double backslashes (`\\`) or forward slashes (`/`)
- If you have other MCP servers, add this as another entry in the `mcpServers` object

### Step 3: Restart Claude Desktop

Close and reopen Claude Desktop completely for the changes to take effect.

### Step 4: Verify Installation

In Claude, try asking:
- "What Docker containers are running?"
- "Show me my Docker images"
- "Is Docker Desktop running?"

## Example Usage

### Managing Containers

**List all containers:**
```
"Show me all my Docker containers"
"What containers are currently running?"
```

**Get container details:**
```
"Show me details for the nginx container"
"What ports is my-app using?"
```

**View logs:**
```
"Show me the logs for nginx"
"Get the last 50 lines from my-app"
```

**Start/Stop containers:**
```
"Start the postgres container"
"Stop nginx"
"Restart my-app"
```

**Container statistics:**
```
"How much CPU is nginx using?"
"Show memory usage for my-app"
```

### Managing Images

**List images:**
```
"What Docker images do I have?"
"Show me all available images"
```

**Pull images:**
```
"Pull the latest nginx image"
"Get postgres version 15"
```

**Remove images:**
```
"Remove the old ubuntu image"
```

### System Information

**Docker info:**
```
"Is Docker Desktop running?"
"Show me Docker system information"
"How many containers do I have?"
```

## Safety Features

- **Read-only operations by default** - Most tools are non-destructive
- **Confirmation for destructive operations** - Remove operations have safety checks
- **Clear error messages** - Helpful guidance when things go wrong
- **Graceful handling** - Proper timeouts and error recovery

## Troubleshooting

### "Failed to connect to Docker"
- Ensure Docker Desktop is running
- Check that Docker Desktop is properly installed
- Verify Docker daemon is accessible

### "Container not found"
- Use `list_containers(all=True)` to see all containers including stopped ones
- Double-check the container name/ID

### MCP Server Not Connecting
- Verify the path in `claude_desktop_config.json` is correct
- Ensure Python is in your PATH
- Check that all dependencies are installed: `pip list | findstr mcp`
- Restart Claude Desktop completely

### Path Issues on Windows
- Use either `C:\\Users\\...` (double backslash) or `C:/Users/...` (forward slash)
- Avoid single backslashes as they're escape characters in JSON

## Response Formats

Most tools support two response formats:

- **JSON format** (default): Structured data, easy to parse
  ```python
  list_containers(format="json")
  ```

- **Markdown format**: Human-readable, formatted text
  ```python
  list_containers(format="markdown")
  ```

## Character Limits

Responses are automatically truncated at 25,000 characters to avoid overwhelming Claude's context window. For large log files or many containers, results will be truncated with a notice.

## Advanced Configuration

### Using a Virtual Environment

If you want to use a virtual environment:

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

### Custom Docker Host

If Docker is not on the default socket, set the `DOCKER_HOST` environment variable:

```json
{
  "mcpServers": {
    "docker": {
      "command": "python",
      "args": [
        "D:\\Claude-MCP-Files\\docker_mcp_server.py"
      ],
      "env": {
        "DOCKER_HOST": "tcp://localhost:2375"
      }
    }
  }
}
```

## Security Notes

- This server has full access to Docker on your system
- It can start, stop, and remove containers
- It can pull and remove images
- Use appropriate caution with destructive operations
- Consider running Docker Desktop with appropriate permissions

## Support

For issues with:
- **MCP Protocol**: https://modelcontextprotocol.io
- **Docker**: https://docs.docker.com
- **Claude Desktop**: https://support.claude.com

## License

This server is provided as-is for use with Claude Desktop and Docker Desktop.
