# Update Claude Desktop Config - NO BOM
# This script closes Claude, updates the config, and restarts

Write-Host "Stopping Claude Desktop..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*claude*"} | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "Updating config file..." -ForegroundColor Yellow
Copy-Item "D:\Claude-MCP-Files\claude_desktop_config_NOBOM.json" "$env:APPDATA\Claude\claude_desktop_config.json" -Force

Write-Host "Config updated successfully!" -ForegroundColor Green
Write-Host "Starting Claude Desktop..." -ForegroundColor Yellow

# Find Claude Desktop executable
$claudePath = "C:\Users\$env:USERNAME\AppData\Local\Programs\Claude\Claude.exe"
if (Test-Path $claudePath) {
    Start-Process $claudePath
    Write-Host "Claude Desktop started!" -ForegroundColor Green
} else {
    Write-Host "Please manually start Claude Desktop" -ForegroundColor Yellow
}
