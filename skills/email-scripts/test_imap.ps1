# Test Proton Bridge IMAP Connection using PowerShell
$ErrorActionPreference = "Stop"

Write-Host "`n🔌 Testing Proton Bridge IMAP Connection..." -ForegroundColor Cyan
Write-Host "   Server: 127.0.0.1:1143" -ForegroundColor Gray
Write-Host "   Username: team@plausiblepotentials.com`n" -ForegroundColor Gray

try {
    # Test if port is listening
    $connection = Test-NetConnection -ComputerName 127.0.0.1 -Port 1143 -WarningAction SilentlyContinue
    
    if ($connection.TcpTestSucceeded) {
        Write-Host "✅ Port 1143 is listening" -ForegroundColor Green
        Write-Host "`nProton Bridge appears to be running and accepting connections." -ForegroundColor Green
        Write-Host "Ready to configure email reading capability." -ForegroundColor Green
    } else {
        Write-Host "❌ Port 1143 is not listening" -ForegroundColor Red
        Write-Host "`nPossible issues:" -ForegroundColor Yellow
        Write-Host "   • Proton Bridge is not running" -ForegroundColor Yellow
        Write-Host "   • Bridge is using a different port" -ForegroundColor Yellow
        Write-Host "   • IMAP is not enabled in Bridge settings" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error testing connection: $_" -ForegroundColor Red
}

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
