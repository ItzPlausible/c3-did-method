# C3 Alliance Documentation - Complete Setup Automation
# This script does everything: moves docs, initializes git, prepares for GitHub

$ErrorActionPreference = "Stop"
$repoPath = "C:\PlausiblePotentials-Files\My files\C3-Alliance-Documentation"

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "   C3 Alliance Documentation Repository Setup" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

# Navigate to repo
Set-Location $repoPath

# Step 1: Move documents
Write-Host "STEP 1: Moving documents from outputs folder..." -ForegroundColor Yellow
Write-Host "-----------------------------------------------" -ForegroundColor DarkGray
& ".\move-documents.ps1"

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nX Document move failed. Please check manually." -ForegroundColor Red
    exit 1
}

# Step 2: Initialize Git
Write-Host "`nSTEP 2: Initializing Git repository..." -ForegroundColor Yellow
Write-Host "-----------------------------------------------" -ForegroundColor DarkGray

# Check if already initialized
if (Test-Path ".git") {
    Write-Host "Warning: Git already initialized. Skipping..." -ForegroundColor Yellow
} else {
    git init
    git branch -M main
    Write-Host "SUCCESS: Git repository initialized" -ForegroundColor Green
}

# Step 3: Stage all files
Write-Host "`nSTEP 3: Staging all files..." -ForegroundColor Yellow
Write-Host "-----------------------------------------------" -ForegroundColor DarkGray
git add .
Write-Host "SUCCESS: Files staged" -ForegroundColor Green

# Step 4: Create initial commit
Write-Host "`nSTEP 4: Creating initial commit..." -ForegroundColor Yellow
Write-Host "-----------------------------------------------" -ForegroundColor DarkGray

git commit -m "docs: initial commit - C3 Alliance documentation repository" -m "Repository structure with organized documentation" -m "Governance: Bill of Rights, Articles, Local Charter" -m "Technical: Smart Contract Architecture, Journey Builder" -m "Legal: SECO Operating Agreement, Articles, Framework" -m "Setup includes comprehensive README, gitignore, guides, and automation" -m "Total: 9 core documents + supporting files" -m "Version: Repository v1.0.0"

Write-Host "SUCCESS: Initial commit created" -ForegroundColor Green

# Step 5: Display status and next steps
Write-Host "`n============================================================" -ForegroundColor Green
Write-Host "   SUCCESS: REPOSITORY SETUP COMPLETE!" -ForegroundColor Green
Write-Host "============================================================`n" -ForegroundColor Green

Write-Host "Repository Status:" -ForegroundColor Cyan
git log --oneline -1
Write-Host ""
git status --short

Write-Host "`nNEXT STEPS:" -ForegroundColor Yellow
Write-Host "-----------------------------------------------" -ForegroundColor DarkGray
Write-Host "1. Create GitHub repository:" -ForegroundColor White
Write-Host "   Go to: https://github.com/new" -ForegroundColor DarkGray
Write-Host "   Name: C3-Alliance-Documentation" -ForegroundColor DarkGray
Write-Host "   Private: Yes (initially)" -ForegroundColor DarkGray
Write-Host "   DO NOT initialize with README" -ForegroundColor DarkGray
Write-Host ""
Write-Host "2. Connect to GitHub:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR-USERNAME/C3-Alliance-Documentation.git" -ForegroundColor DarkGray
Write-Host "   git push -u origin main" -ForegroundColor DarkGray
Write-Host ""
Write-Host "3. Add to GitHub Desktop:" -ForegroundColor White
Write-Host "   File -> Add Local Repository" -ForegroundColor DarkGray
Write-Host "   Choose: $repoPath" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Your C3 Alliance documentation is ready for GitHub!" -ForegroundColor Green
Write-Host ""
