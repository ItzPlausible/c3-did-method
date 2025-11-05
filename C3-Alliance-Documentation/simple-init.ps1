# Simple Git Setup for C3 Alliance Documentation
# Assumes you've already copied the 9 .docx files to the docs/ folders

$repoPath = "C:\PlausiblePotentials-Files\My files\C3-Alliance-Documentation"

Write-Host "Initializing Git Repository..." -ForegroundColor Cyan

Set-Location $repoPath

# Initialize
git init
git branch -M main

# Stage everything
git add .

# Commit
git commit -m "docs: initial C3 Alliance documentation repository"

# Show status
Write-Host "`nDone! Repository initialized." -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Create repo at: https://github.com/new"
Write-Host "2. Run: git remote add origin YOUR-GITHUB-URL"
Write-Host "3. Run: git push -u origin main"
