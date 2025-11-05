"""
Docker MCP Server
A Model Context Protocol server for managing Docker Desktop operations.
"""

import json
import asyncio
from typing import Any
import mcp.types as types
from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
import mcp.server.stdio
import docker
from docker.errors import DockerException, NotFound, APIError

# Constants
CHARACTER_LIMIT = 25000

# Initialize MCP server
app = Server("docker-control")

def get_docker_client():
    """Get Docker client with error handling."""
    try:
        return docker.from_env()
    except DockerException as e:
        raise Exception(f"Failed to connect to Docker. Is Docker Desktop running? Error: {str(e)}")


# ============================================================================
# Helper Functions
# ============================================================================

def truncate_output(content: str, limit: int = CHARACTER_LIMIT) -> str:
    """Truncate content if it exceeds the character limit."""
    if len(content) > limit:
        return content[:limit] + f"\n\n... (truncated, {len(content) - limit} characters omitted)"
    return content


def format_container_info(container, detailed: bool = False) -> dict:
    """Format container information consistently."""
    basic_info = {
        "id": container.short_id,
        "name": container.name,
        "status": container.status,
        "image": container.image.tags[0] if container.image.tags else container.image.short_id,
    }
    
    if detailed:
        basic_info.update({
            "created": container.attrs.get("Created", "Unknown"),
            "ports": container.attrs.get("NetworkSettings", {}).get("Ports", {}),
            "labels": container.labels,
        })
    
    return basic_info


def format_image_info(image, detailed: bool = False) -> dict:
    """Format image information consistently."""
    basic_info = {
        "id": image.short_id,
        "tags": image.tags if image.tags else ["<none>"],
        "size_mb": round(image.attrs.get("Size", 0) / (1024 * 1024), 2),
    }
    
    if detailed:
        basic_info.update({
            "created": image.attrs.get("Created", "Unknown"),
            "labels": image.labels,
        })
    
    return basic_info


# ============================================================================
# MCP Tool Definitions
# ============================================================================

@app.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    """List all available Docker tools."""
    return [
        types.Tool(
            name="list_containers",
            description="""List Docker containers with their status and basic information.
            
This tool retrieves all containers or only running containers from Docker Desktop.
Use this when you need to see what containers exist, their current state, or find
a specific container by name.""",
            inputSchema={
                "type": "object",
                "properties": {
                    "all": {
                        "type": "boolean",
                        "description": "If true, shows all containers including stopped ones. If false (default), only shows running containers.",
                        "default": False
                    },
                    "format": {
                        "type": "string",
                        "enum": ["json", "markdown"],
                        "description": "Response format - 'json' for structured data or 'markdown' for human-readable text.",
                        "default": "json"
                    }
                }
            }
        ),
        types.Tool(
            name="get_container_details",
            description="""Get detailed information about a specific Docker container.
            
This tool retrieves comprehensive details about a container including its configuration,
network settings, ports, environment variables, and current state.""",
            inputSchema={
                "type": "object",
                "required": ["container_id"],
                "properties": {
                    "container_id": {
                        "type": "string",
                        "description": "The container ID (full or short) or container name. Examples: 'a1b2c3d4', 'my-app', 'nginx-server'"
                    },
                    "format": {
                        "type": "string",
                        "enum": ["json", "markdown"],
                        "description": "Response format",
                        "default": "json"
                    }
                }
            }
        ),
        types.Tool(
            name="get_container_logs",
            description="""Retrieve logs from a Docker container.
            
This tool fetches log output from a running or stopped container. Use this to debug
issues, monitor application output, or check what happened in a container.""",
            inputSchema={
                "type": "object",
                "required": ["container_id"],
                "properties": {
                    "container_id": {
                        "type": "string",
                        "description": "The container ID or name to get logs from"
                    },
                    "tail": {
                        "type": "integer",
                        "description": "Number of lines to retrieve from end of logs",
                        "default": 100
                    },
                    "since": {
                        "type": "string",
                        "description": "Timestamp to get logs since (e.g., '2024-01-01T00:00:00')"
                    }
                }
            }
        ),
        types.Tool(
            name="start_container",
            description="""Start a stopped Docker container.
            
This tool starts a container that is currently in 'stopped' or 'exited' state.
The container must already exist - use run_container to create a new container.""",
            inputSchema={
                "type": "object",
                "required": ["container_id"],
                "properties": {
                    "container_id": {
                        "type": "string",
                        "description": "The container ID or name to start"
                    }
                }
            }
        ),
        types.Tool(
            name="stop_container",
            description="""Stop a running Docker container gracefully.
            
This tool stops a running container by sending a SIGTERM signal, waiting for graceful
shutdown, and then forcing a stop if needed after the timeout.""",
            inputSchema={
                "type": "object",
                "required": ["container_id"],
                "properties": {
                    "container_id": {
                        "type": "string",
                        "description": "The container ID or name to stop"
                    },
                    "timeout": {
                        "type": "integer",
                        "description": "Seconds to wait before forcing stop",
                        "default": 10
                    }
                }
            }
        ),
        types.Tool(
            name="restart_container",
            description="""Restart a Docker container.
            
This tool stops and then starts a container. Useful for applying configuration changes
or recovering from issues.""",
            inputSchema={
                "type": "object",
                "required": ["container_id"],
                "properties": {
                    "container_id": {
                        "type": "string",
                        "description": "The container ID or name to restart"
                    },
                    "timeout": {
                        "type": "integer",
                        "description": "Seconds to wait before forcing stop",
                        "default": 10
                    }
                }
            }
        ),
        types.Tool(
            name="remove_container",
            description="""Remove a Docker container.
            
**WARNING: This is a destructive operation.** The container will be permanently deleted.
Container data and logs will be lost unless volumes are used.""",
            inputSchema={
                "type": "object",
                "required": ["container_id"],
                "properties": {
                    "container_id": {
                        "type": "string",
                        "description": "The container ID or name to remove"
                    },
                    "force": {
                        "type": "boolean",
                        "description": "Force removal even if running",
                        "default": False
                    }
                }
            }
        ),
        types.Tool(
            name="list_images",
            description="""List all Docker images available locally.
            
This tool shows all images that have been pulled or built on your system.
Use this to see what images are available for running containers.""",
            inputSchema={
                "type": "object",
                "properties": {
                    "format": {
                        "type": "string",
                        "enum": ["json", "markdown"],
                        "description": "Response format",
                        "default": "json"
                    }
                }
            }
        ),
        types.Tool(
            name="pull_image",
            description="""Pull a Docker image from a registry (Docker Hub by default).
            
This tool downloads an image from a container registry to your local system.
Use this before running a container if the image doesn't exist locally.""",
            inputSchema={
                "type": "object",
                "required": ["image_name"],
                "properties": {
                    "image_name": {
                        "type": "string",
                        "description": "Image name with optional tag (e.g., 'nginx:latest', 'ubuntu:22.04')"
                    }
                }
            }
        ),
        types.Tool(
            name="remove_image",
            description="""Remove a Docker image from local storage.
            
**WARNING: This is a destructive operation.** The image will be permanently deleted.""",
            inputSchema={
                "type": "object",
                "required": ["image_id"],
                "properties": {
                    "image_id": {
                        "type": "string",
                        "description": "The image ID or tag to remove"
                    },
                    "force": {
                        "type": "boolean",
                        "description": "Force removal even if containers use this image",
                        "default": False
                    }
                }
            }
        ),
        types.Tool(
            name="get_docker_info",
            description="""Get Docker system information and status.
            
This tool retrieves comprehensive information about your Docker Desktop installation
including version, resource usage, and configuration.""",
            inputSchema={
                "type": "object",
                "properties": {
                    "format": {
                        "type": "string",
                        "enum": ["json", "markdown"],
                        "description": "Response format",
                        "default": "json"
                    }
                }
            }
        ),
        types.Tool(
            name="get_container_stats",
            description="""Get resource usage statistics for a running container.
            
This tool retrieves real-time CPU, memory, network, and disk I/O statistics for
a container. The container must be running to get statistics.""",
            inputSchema={
                "type": "object",
                "required": ["container_id"],
                "properties": {
                    "container_id": {
                        "type": "string",
                        "description": "The container ID or name to get statistics for"
                    },
                    "format": {
                        "type": "string",
                        "enum": ["json", "markdown"],
                        "description": "Response format",
                        "default": "json"
                    }
                }
            }
        )
    ]


@app.call_tool()
async def handle_call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    """Handle tool calls by routing to appropriate functions."""
    
    try:
        if name == "list_containers":
            result = await list_containers(
                all=arguments.get("all", False),
                format=arguments.get("format", "json")
            )
        elif name == "get_container_details":
            result = await get_container_details(
                container_id=arguments["container_id"],
                format=arguments.get("format", "json")
            )
        elif name == "get_container_logs":
            result = await get_container_logs(
                container_id=arguments["container_id"],
                tail=arguments.get("tail", 100),
                since=arguments.get("since")
            )
        elif name == "start_container":
            result = await start_container(arguments["container_id"])
        elif name == "stop_container":
            result = await stop_container(
                container_id=arguments["container_id"],
                timeout=arguments.get("timeout", 10)
            )
        elif name == "restart_container":
            result = await restart_container(
                container_id=arguments["container_id"],
                timeout=arguments.get("timeout", 10)
            )
        elif name == "remove_container":
            result = await remove_container(
                container_id=arguments["container_id"],
                force=arguments.get("force", False)
            )
        elif name == "list_images":
            result = await list_images(format=arguments.get("format", "json"))
        elif name == "pull_image":
            result = await pull_image(arguments["image_name"])
        elif name == "remove_image":
            result = await remove_image(
                image_id=arguments["image_id"],
                force=arguments.get("force", False)
            )
        elif name == "get_docker_info":
            result = await get_docker_info(format=arguments.get("format", "json"))
        elif name == "get_container_stats":
            result = await get_container_stats(
                container_id=arguments["container_id"],
                format=arguments.get("format", "json")
            )
        else:
            result = f"Unknown tool: {name}"
        
        return [types.TextContent(type="text", text=result)]
    
    except Exception as e:
        return [types.TextContent(type="text", text=f"Error executing {name}: {str(e)}")]


# ============================================================================
# Container Management Functions
# ============================================================================

async def list_containers(all: bool = False, format: str = "json") -> str:
    """List Docker containers with their status and basic information."""
    try:
        client = get_docker_client()
        containers = client.containers.list(all=all)
        
        if not containers:
            msg = "No containers found."
            if not all:
                msg += " Try setting all=True to see stopped containers."
            return msg
        
        container_list = [format_container_info(c) for c in containers]
        
        if format == "json":
            return truncate_output(json.dumps(container_list, indent=2))
        else:
            lines = ["# Docker Containers\n"]
            for c in container_list:
                lines.append(f"**{c['name']}** (`{c['id']}`)")
                lines.append(f"  - Status: {c['status']}")
                lines.append(f"  - Image: {c['image']}\n")
            return truncate_output("\n".join(lines))
            
    except Exception as e:
        return f"Error listing containers: {str(e)}"


async def get_container_details(container_id: str, format: str = "json") -> str:
    """Get detailed information about a specific Docker container."""
    try:
        client = get_docker_client()
        container = client.containers.get(container_id)
        
        info = format_container_info(container, detailed=True)
        info["full_id"] = container.id
        info["command"] = container.attrs.get("Config", {}).get("Cmd", [])
        info["environment"] = container.attrs.get("Config", {}).get("Env", [])
        
        if format == "json":
            return truncate_output(json.dumps(info, indent=2))
        else:
            lines = [f"# Container: {info['name']}\n"]
            lines.append(f"**ID:** {info['id']}")
            lines.append(f"**Status:** {info['status']}")
            lines.append(f"**Image:** {info['image']}")
            lines.append(f"**Created:** {info['created']}\n")
            lines.append("## Ports")
            if info['ports']:
                for container_port, host_bindings in info['ports'].items():
                    if host_bindings:
                        for binding in host_bindings:
                            lines.append(f"  - {container_port} -> {binding['HostIp']}:{binding['HostPort']}")
                    else:
                        lines.append(f"  - {container_port} (not exposed)")
            else:
                lines.append("  - No ports configured")
            
            return truncate_output("\n".join(lines))
            
    except NotFound:
        return f"Container '{container_id}' not found. Use list_containers to see available containers."
    except Exception as e:
        return f"Error getting container details: {str(e)}"


async def get_container_logs(container_id: str, tail: int = 100, since: str = None) -> str:
    """Retrieve logs from a Docker container."""
    try:
        client = get_docker_client()
        container = client.containers.get(container_id)
        
        kwargs = {"tail": tail}
        if since:
            kwargs["since"] = since
            
        logs = container.logs(**kwargs).decode('utf-8', errors='replace')
        
        if not logs:
            return f"No logs available for container '{container_id}'."
        
        return truncate_output(logs)
        
    except NotFound:
        return f"Container '{container_id}' not found. Use list_containers to see available containers."
    except Exception as e:
        return f"Error getting container logs: {str(e)}"


async def start_container(container_id: str) -> str:
    """Start a stopped Docker container."""
    try:
        client = get_docker_client()
        container = client.containers.get(container_id)
        
        if container.status == "running":
            return f"Container '{container.name}' ({container.short_id}) is already running."
        
        container.start()
        return f"Successfully started container '{container.name}' ({container.short_id})."
        
    except NotFound:
        return f"Container '{container_id}' not found. Use list_containers to see available containers."
    except APIError as e:
        return f"Docker API error starting container: {str(e)}"
    except Exception as e:
        return f"Error starting container: {str(e)}"


async def stop_container(container_id: str, timeout: int = 10) -> str:
    """Stop a running Docker container gracefully."""
    try:
        client = get_docker_client()
        container = client.containers.get(container_id)
        
        if container.status != "running":
            return f"Container '{container.name}' ({container.short_id}) is already stopped (status: {container.status})."
        
        container.stop(timeout=timeout)
        return f"Successfully stopped container '{container.name}' ({container.short_id})."
        
    except NotFound:
        return f"Container '{container_id}' not found. Use list_containers to see available containers."
    except APIError as e:
        return f"Docker API error stopping container: {str(e)}"
    except Exception as e:
        return f"Error stopping container: {str(e)}"


async def restart_container(container_id: str, timeout: int = 10) -> str:
    """Restart a Docker container."""
    try:
        client = get_docker_client()
        container = client.containers.get(container_id)
        container.restart(timeout=timeout)
        return f"Successfully restarted container '{container.name}' ({container.short_id})."
        
    except NotFound:
        return f"Container '{container_id}' not found. Use list_containers to see available containers."
    except APIError as e:
        return f"Docker API error restarting container: {str(e)}"
    except Exception as e:
        return f"Error restarting container: {str(e)}"


async def remove_container(container_id: str, force: bool = False) -> str:
    """Remove a Docker container."""
    try:
        client = get_docker_client()
        container = client.containers.get(container_id)
        
        if container.status == "running" and not force:
            return (f"Container '{container.name}' is running. "
                   "Stop it first with stop_container, or use force=True to force removal.")
        
        container_name = container.name
        container_id_short = container.short_id
        container.remove(force=force)
        return f"Successfully removed container '{container_name}' ({container_id_short})."
        
    except NotFound:
        return f"Container '{container_id}' not found."
    except APIError as e:
        return f"Docker API error removing container: {str(e)}"
    except Exception as e:
        return f"Error removing container: {str(e)}"


# ============================================================================
# Image Management Functions
# ============================================================================

async def list_images(format: str = "json") -> str:
    """List all Docker images available locally."""
    try:
        client = get_docker_client()
        images = client.images.list()
        
        if not images:
            return "No images found. Pull an image with 'docker pull <image>' or use pull_image tool."
        
        image_list = [format_image_info(img) for img in images]
        
        if format == "json":
            return truncate_output(json.dumps(image_list, indent=2))
        else:
            lines = ["# Docker Images\n"]
            total_size = 0
            for img in image_list:
                tags_str = ", ".join(img['tags'][:3])
                if len(img['tags']) > 3:
                    tags_str += f" (+{len(img['tags']) - 3} more)"
                lines.append(f"**{tags_str}**")
                lines.append(f"  - ID: {img['id']}")
                lines.append(f"  - Size: {img['size_mb']} MB\n")
                total_size += img['size_mb']
            lines.append(f"**Total size:** {round(total_size, 2)} MB")
            return truncate_output("\n".join(lines))
            
    except Exception as e:
        return f"Error listing images: {str(e)}"


async def pull_image(image_name: str) -> str:
    """Pull a Docker image from a registry."""
    try:
        client = get_docker_client()
        
        if ':' not in image_name:
            image_name = f"{image_name}:latest"
        
        image = client.images.pull(image_name)
        tags = image.tags[0] if image.tags else image.short_id
        return f"Successfully pulled image '{tags}' ({image.short_id})."
        
    except docker.errors.ImageNotFound:
        return f"Image '{image_name}' not found in registry. Check the image name and tag."
    except APIError as e:
        return f"Docker API error pulling image: {str(e)}"
    except Exception as e:
        return f"Error pulling image: {str(e)}"


async def remove_image(image_id: str, force: bool = False) -> str:
    """Remove a Docker image from local storage."""
    try:
        client = get_docker_client()
        client.images.remove(image_id, force=force)
        return f"Successfully removed image '{image_id}'."
        
    except docker.errors.ImageNotFound:
        return f"Image '{image_id}' not found. Use list_images to see available images."
    except APIError as e:
        if "image is being used" in str(e).lower():
            return (f"Image '{image_id}' is being used by containers. "
                   "Stop/remove those containers first, or use force=True to force removal.")
        return f"Docker API error removing image: {str(e)}"
    except Exception as e:
        return f"Error removing image: {str(e)}"


# ============================================================================
# System Information Functions
# ============================================================================

async def get_docker_info(format: str = "json") -> str:
    """Get Docker system information and status."""
    try:
        client = get_docker_client()
        info = client.info()
        version = client.version()
        
        summary = {
            "docker_version": version.get("Version", "Unknown"),
            "api_version": version.get("ApiVersion", "Unknown"),
            "os": info.get("OperatingSystem", "Unknown"),
            "architecture": info.get("Architecture", "Unknown"),
            "containers": {
                "total": info.get("Containers", 0),
                "running": info.get("ContainersRunning", 0),
                "stopped": info.get("ContainersStopped", 0),
                "paused": info.get("ContainersPaused", 0),
            },
            "images": info.get("Images", 0),
            "server_version": info.get("ServerVersion", "Unknown"),
        }
        
        if format == "json":
            return truncate_output(json.dumps(summary, indent=2))
        else:
            lines = ["# Docker System Information\n"]
            lines.append(f"**Docker Version:** {summary['docker_version']}")
            lines.append(f"**OS:** {summary['os']}")
            lines.append(f"**Architecture:** {summary['architecture']}\n")
            lines.append("## Resources")
            lines.append(f"  - **Total Containers:** {summary['containers']['total']}")
            lines.append(f"    - Running: {summary['containers']['running']}")
            lines.append(f"    - Stopped: {summary['containers']['stopped']}")
            lines.append(f"    - Paused: {summary['containers']['paused']}")
            lines.append(f"  - **Total Images:** {summary['images']}")
            return truncate_output("\n".join(lines))
            
    except Exception as e:
        return f"Error getting Docker info: {str(e)}"


async def get_container_stats(container_id: str, format: str = "json") -> str:
    """Get resource usage statistics for a running container."""
    try:
        client = get_docker_client()
        container = client.containers.get(container_id)
        
        if container.status != "running":
            return f"Container '{container.name}' is not running (status: {container.status}). Start it first to get stats."
        
        stats = container.stats(stream=False)
        
        cpu_delta = stats["cpu_stats"]["cpu_usage"]["total_usage"] - \
                   stats["precpu_stats"]["cpu_usage"]["total_usage"]
        system_delta = stats["cpu_stats"]["system_cpu_usage"] - \
                      stats["precpu_stats"]["system_cpu_usage"]
        cpu_percent = 0.0
        if system_delta > 0 and cpu_delta > 0:
            cpu_percent = (cpu_delta / system_delta) * len(stats["cpu_stats"]["cpu_usage"].get("percpu_usage", [1])) * 100
        
        memory_usage = stats["memory_stats"].get("usage", 0)
        memory_limit = stats["memory_stats"].get("limit", 0)
        memory_percent = (memory_usage / memory_limit * 100) if memory_limit > 0 else 0
        
        summary = {
            "container": container.name,
            "cpu_percent": round(cpu_percent, 2),
            "memory_usage_mb": round(memory_usage / (1024 * 1024), 2),
            "memory_limit_mb": round(memory_limit / (1024 * 1024), 2),
            "memory_percent": round(memory_percent, 2),
            "network": stats.get("networks", {}),
        }
        
        if format == "json":
            return truncate_output(json.dumps(summary, indent=2))
        else:
            lines = [f"# Stats for Container: {summary['container']}\n"]
            lines.append(f"**CPU Usage:** {summary['cpu_percent']}%")
            lines.append(f"**Memory:** {summary['memory_usage_mb']} MB / {summary['memory_limit_mb']} MB ({summary['memory_percent']}%)")
            if summary['network']:
                lines.append("\n## Network I/O")
                for interface, net_stats in summary['network'].items():
                    rx_mb = round(net_stats.get('rx_bytes', 0) / (1024 * 1024), 2)
                    tx_mb = round(net_stats.get('tx_bytes', 0) / (1024 * 1024), 2)
                    lines.append(f"  - **{interface}:** ↓ {rx_mb} MB / ↑ {tx_mb} MB")
            return truncate_output("\n".join(lines))
            
    except NotFound:
        return f"Container '{container_id}' not found. Use list_containers to see available containers."
    except Exception as e:
        return f"Error getting container stats: {str(e)}"


# ============================================================================
# Main Entry Point
# ============================================================================

async def main():
    """Run the MCP server."""
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="docker-control",
                server_version="1.0.0",
                capabilities=app.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={}
                )
            )
        )

if __name__ == "__main__":
    asyncio.run(main())
