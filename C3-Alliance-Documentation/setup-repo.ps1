# C3 Alliance Documentation - Git Repository Setup Script
# Run this from PowerShell

$repoPath = "C:\PlausiblePotentials-Files\My files\C3-Alliance-Documentation"

Write-Host "Setting up C3 Alliance Documentation Repository..." -ForegroundColor Green

# Navigate to repo
Set-Location $repoPath

# Initialize git repository
Write-Host "`nInitializing Git repository..." -ForegroundColor Yellow
git init
git branch -M main

# Stage all files
Write-Host "`nStaging files..." -ForegroundColor Yellow
git add .

# Create initial commit
Write-Host "`nCreating initial commit..." -ForegroundColor Yellow
git commit -m "docs: initial commit - C3 Alliance documentation structure" -m "Created repository structure with governance, technical, and legal folders" -m "Added comprehensive README with project overview" -m "Added .gitignore for documentation management" -m "Added organization plan for document categorization" -m "Repository contains core C3 Alliance constitutional and technical documentation" -m "Bill of Rights (v2.0, v2.1)" -m "Smart Contract Architecture (v2.2)" -m "Journey Builder Whitepaper" -m "SECO Framework and templates" -m "Articles of Organization and Local Charter templates"

# Display status
Write-Host "`nSUCCESS: Repository initialized successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Copy project documents to appropriate folders (see ORGANIZATION.md)" -ForegroundColor White
Write-Host "2. Create GitHub repository at github.com/new" -ForegroundColor White
Write-Host "3. Run: git remote add origin <your-repo-url>" -ForegroundColor White
Write-Host "4. Run: git push -u origin main" -ForegroundColor White

Write-Host "`nRepository location: $repoPath" -ForegroundColor White
