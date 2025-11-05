# CoCoA Config File BOM Remover
# This script removes the BOM (Byte Order Mark) from claude_desktop_config.json
# Run this in PowerShell as Administrator

Write-Host "=== CoCoA Config File BOM Remover ===" -ForegroundColor Cyan
Write-Host ""

$configPath = "$env:APPDATA\Claude\claude_desktop_config.json"
$backupPath = "$env:APPDATA\Claude\claude_desktop_config.json.backup"

# Check if config file exists
if (-not (Test-Path $configPath)) {
    Write-Host "ERROR: Config file not found at: $configPath" -ForegroundColor Red
    Write-Host "Please check the path and try again." -ForegroundColor Yellow
    exit 1
}

# Create backup
Write-Host "Creating backup..." -ForegroundColor Yellow
Copy-Item $configPath $backupPath -Force
Write-Host "Backup created: $backupPath" -ForegroundColor Green
Write-Host ""

# Read file content
Write-Host "Reading config file..." -ForegroundColor Yellow
$content = Get-Content $configPath -Raw

# Check for BOM
if ($content[0] -eq [char]0xFEFF) {
    Write-Host "BOM detected! Removing..." -ForegroundColor Yellow
    $content = $content.TrimStart([char]0xFEFF)
} else {
    Write-Host "No BOM found, but will re-save with correct encoding anyway..." -ForegroundColor Yellow
}

# Validate JSON
try {
    $null = $content | ConvertFrom-Json
    Write-Host "JSON structure is valid!" -ForegroundColor Green
} catch {
    Write-Host "WARNING: JSON validation failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "File will still be saved. Please check syntax manually." -ForegroundColor Yellow
}

# Write file with UTF-8 without BOM
Write-Host "Saving corrected file..." -ForegroundColor Yellow
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($configPath, $content, $utf8NoBom)

Write-Host ""
Write-Host "SUCCESS! Config file has been corrected." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart Claude Desktop" -ForegroundColor White
Write-Host "2. Check that all MCP servers load correctly" -ForegroundColor White
Write-Host "3. If there are still issues, restore backup: $backupPath" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
