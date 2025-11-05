# CoCoA Migration Script
# Moves all files from D:\Claude-MCP-Files to %APPDATA%\Claude

Write-Host "=== CoCoA Migration to AppData ===" -ForegroundColor Cyan
Write-Host ""

$sourceDir = "D:\Claude-MCP-Files"
$destDir = "$env:APPDATA\Claude"

# Create destination if it doesn't exist
if (!(Test-Path $destDir)) {
    Write-Host "Creating $destDir..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

# Items to copy (excluding this script)
$itemsToCopy = @(
    "CoCoA-Project",
    "skills",
    "docker_mcp_server.py",
    "google-workspace-credentials.json",
    "MCP-local",
    "test_dependencies.py"
)

Write-Host "Copying files to $destDir..." -ForegroundColor Green
Write-Host ""

foreach ($item in $itemsToCopy) {
    $sourcePath = Join-Path $sourceDir $item
    if (Test-Path $sourcePath) {
        Write-Host "Copying: $item" -ForegroundColor White
        Copy-Item -Path $sourcePath -Destination $destDir -Recurse -Force
    } else {
        Write-Host "Skipping: $item (not found)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Creating new claude_desktop_config.json..." -ForegroundColor Green

# Create the config with corrected paths
$config = @{
    mcpServers = @{
        cloudflare = @{
            command = "npx"
            args = @("-y", "@cloudflare/mcp-server-cloudflare")
        }
        docker = @{
            command = "python"
            args = @("$destDir\docker_mcp_server.py")
        }
        filesystem = @{
            command = "npx"
            args = @(
                "-y",
                "@modelcontextprotocol/server-filesystem",
                "$destDir\CoCoA-Project",
                "C:\PlausiblePotentials-Files\My files",
                "C:\Users\team\Documents"
            )
        }
        "google-workspace" = @{
            command = "npx"
            args = @("-y", "@anthropic/google-workspace-mcp")
            env = @{
                GOOGLE_CLIENT_SECRET_PATH = "$destDir\google-workspace-credentials.json"
            }
        }
        "windows-desktop" = @{
            command = "npx"
            args = @("-y", "windows-mcp")
        }
    }
    userSkillsDirectory = "$destDir\skills"
}

$configPath = Join-Path $destDir "claude_desktop_config.json"
$config | ConvertTo-Json -Depth 10 | Set-Content -Path $configPath -Encoding UTF8

Write-Host ""
Write-Host "✓ Migration complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Files copied to: $destDir" -ForegroundColor Cyan
Write-Host "Config created at: $configPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Close Claude Desktop completely"
Write-Host "2. Reopen Claude Desktop"
Write-Host "3. Look for the hammer icon (should show 5 servers)"
Write-Host ""
Write-Host "You can now safely delete D:\Claude-MCP-Files if everything works!" -ForegroundColor White
