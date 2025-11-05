# Automated Document Move Script
# Run this from PowerShell to complete the document organization

$outputs = "C:\Users\team\AppData\Roaming\Claude\outputs"
$repo = "C:\PlausiblePotentials-Files\My files\C3-Alliance-Documentation\docs"

Write-Host "Moving C3 Alliance Documents to Repository..." -ForegroundColor Green

# Check if output files exist
$governanceDocs = Get-ChildItem "$outputs\GOVERNANCE-*.docx" -ErrorAction SilentlyContinue
$technicalDocs = Get-ChildItem "$outputs\TECHNICAL-*.docx" -ErrorAction SilentlyContinue
$legalDocs = Get-ChildItem "$outputs\LEGAL-*.docx" -ErrorAction SilentlyContinue

if (-not $governanceDocs -and -not $technicalDocs -and -not $legalDocs) {
    Write-Host "ERROR: No documents found in outputs folder!" -ForegroundColor Red
    Write-Host "Expected location: $outputs" -ForegroundColor Yellow
    exit 1
}

# Move Governance docs
Write-Host "`nMoving Governance documents..." -ForegroundColor Cyan
if ($governanceDocs) {
    Move-Item "$outputs\GOVERNANCE-*.docx" "$repo\governance\" -Force
    Write-Host "  SUCCESS: Moved $($governanceDocs.Count) governance document(s)" -ForegroundColor Green
}

# Move Technical docs
Write-Host "Moving Technical documents..." -ForegroundColor Cyan
if ($technicalDocs) {
    Move-Item "$outputs\TECHNICAL-*.docx" "$repo\technical\" -Force
    Write-Host "  SUCCESS: Moved $($technicalDocs.Count) technical document(s)" -ForegroundColor Green
}

# Move Legal docs
Write-Host "Moving Legal documents..." -ForegroundColor Cyan
if ($legalDocs) {
    Move-Item "$outputs\LEGAL-*.docx" "$repo\legal\" -Force
    Write-Host "  SUCCESS: Moved $($legalDocs.Count) legal document(s)" -ForegroundColor Green
}

# Verify the move
Write-Host "`nVerification:" -ForegroundColor Yellow
$govCount = (Get-ChildItem "$repo\governance\*.docx").Count
$techCount = (Get-ChildItem "$repo\technical\*.docx").Count
$legalCount = (Get-ChildItem "$repo\legal\*.docx").Count
$totalCount = $govCount + $techCount + $legalCount

Write-Host "  Governance folder: $govCount files" -ForegroundColor White
Write-Host "  Technical folder: $techCount files" -ForegroundColor White
Write-Host "  Legal folder: $legalCount files" -ForegroundColor White
Write-Host "  Total: $totalCount files" -ForegroundColor White

if ($totalCount -eq 9) {
    Write-Host "`nSUCCESS! All 9 documents moved correctly!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Run: .\setup-repo.ps1 (to initialize git)" -ForegroundColor White
    Write-Host "2. Create GitHub repository" -ForegroundColor White
    Write-Host "3. Push to GitHub" -ForegroundColor White
} else {
    Write-Host "`nWarning: Expected 9 files, found $totalCount" -ForegroundColor Yellow
    Write-Host "Please verify manually" -ForegroundColor Yellow
}
