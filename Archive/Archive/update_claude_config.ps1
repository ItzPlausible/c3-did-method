# Update Claude Desktop Config Script
# Run this script AFTER closing Claude Desktop

$sourceConfig = "D:\Claude-MCP-Files\claude_desktop_config_UPDATED.json"
$targetConfig = "$env:APPDATA\Claude\claude_desktop_config.json"
$backupConfig = "$env:APPDATA\Claude\claude_desktop_config.backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').json"

Write-Host "🔄 Updating Claude Desktop Configuration..." -ForegroundColor Cyan

# Check if Claude Desktop is running
$claudeProcess = Get-Process -Name "Claude" -ErrorAction SilentlyContinue
if ($claudeProcess) {
    Write-Host "⚠️  WARNING: Claude Desktop is currently running!" -ForegroundColor Yellow
    Write-Host "   Please close Claude Desktop first, then run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Backup current config
if (Test-Path $targetConfig) {
    Copy-Item $targetConfig $backupConfig -Force
    Write-Host "✅ Backup created: $backupConfig" -ForegroundColor Green
}

# Copy new config
Copy-Item $sourceConfig $targetConfig -Force
Write-Host "✅ Configuration updated successfully!" -ForegroundColor Green

Write-Host "`n📄 New configuration includes:" -ForegroundColor Cyan
Write-Host "   • Docker MCP Server" -ForegroundColor White
Write-Host "   • Filesystem MCP Server (with your directories)" -ForegroundColor White
Write-Host "   • Google Workspace MCP Server" -ForegroundColor White
Write-Host "   • User Skills Directory: D:\Claude-MCP-Files\skills" -ForegroundColor White

Write-Host "`n🚀 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Launch Claude Desktop" -ForegroundColor White
Write-Host "   2. Your CoCoA skills should now be available!" -ForegroundColor White

Read-Host "`nPress Enter to exit"
