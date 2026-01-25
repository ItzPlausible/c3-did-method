# CoCoA Phase 3 - Period Review Stats Gathering (Phase 1)
# Gathers stats and context, prepares for interactive review conversation
# Author: JW / CoCoA
# Created: 2025-11-03

param(
    [switch]$TestMode = $false  # If true, shows output without writing files
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$PPCVault = "C:\PlausiblePotentials-Files\My files\My Notes\PPC"
$DailyFocusPath = "$PPCVault\Next-Actions\Daily-Focus.md"
$ProjectsPath = "$PPCVault\Projects"
$TempPath = "D:\Claude-MCP-Files\CoCoA-Project\workflows\temp"
$ContextFile = "$TempPath\review-context.json"

$ReviewFolders = @{
    "EOD" = "$PPCVault\Next-Actions\EOD-Reviews"
    "EOW" = "$PPCVault\Next-Actions\EOW-Reviews"
    "EOM" = "$PPCVault\Next-Actions\EOM-Reviews"
    "EOQ" = "$PPCVault\Next-Actions\EOQ-Reviews"
    "EOY" = "$PPCVault\Next-Actions\EOY-Reviews"
}

# ============================================================================
# HELPER FUNCTIONS (unchanged from original)
# ============================================================================

function Get-CurrentDateTime {
    Get-Date
}

function Get-QuarterNumber {
    param([DateTime]$Date)
    [Math]::Ceiling($Date.Month / 3)
}

function Get-NextWorkday {
    param([DateTime]$FromDate)
    
    $nextDay = $FromDate.AddDays(1)
    
    # Skip weekends
    while ($nextDay.DayOfWeek -eq [DayOfWeek]::Saturday -or 
           $nextDay.DayOfWeek -eq [DayOfWeek]::Sunday) {
        $nextDay = $nextDay.AddDays(1)
    }
    
    return $nextDay
}

function Test-IsEndOfWeek {
    param([DateTime]$Date)
    return $Date.DayOfWeek -eq [DayOfWeek]::Friday
}

function Test-IsEndOfMonth {
    param([DateTime]$Date)
    $tomorrow = $Date.AddDays(1)
    return $tomorrow.Month -ne $Date.Month
}

function Test-IsEndOfQuarter {
    param([DateTime]$Date)
    $eomDates = @(
        [DateTime]::new($Date.Year, 3, 31),
        [DateTime]::new($Date.Year, 6, 30),
        [DateTime]::new($Date.Year, 9, 30),
        [DateTime]::new($Date.Year, 12, 31)
    )
    return $eomDates -contains $Date.Date
}

function Test-IsEndOfYear {
    param([DateTime]$Date)
    return $Date.Month -eq 12 -and $Date.Day -eq 31
}

function Ensure-FolderExists {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        New-Item -Path $Path -ItemType Directory -Force | Out-Null
        Write-Host "  Created folder: $Path" -ForegroundColor Green
    }
}

function Parse-DailyFocus {
    param([string]$Content)
    
    $stats = @{
        TotalTasks = 0
        CompletedTasks = 0
        DeepWorkTask = ""
        DeepWorkCompleted = $false
        TwoOthers = @()
        TwoOthersCompleted = 0
        BlockedTasks = @()
        Notes = @()
        CompletionRate = 0
    }
    
    $lines = $Content -split "`n"
    $inDeepWork = $false
    $inTwoOthers = $false
    $inBlocked = $false
    $inNotes = $false
    
    foreach ($line in $lines) {
        $line = $line.Trim()
        
        # Section detection
        if ($line -match "## Deep Work Block|### Deep Work Block") {
            $inDeepWork = $true
            $inTwoOthers = $false
            $inBlocked = $false
            $inNotes = $false
            continue
        }
        if ($line -match "## Today's Two Others|### Today's Two Others") {
            $inDeepWork = $false
            $inTwoOthers = $true
            $inBlocked = $false
            $inNotes = $false
            continue
        }
        if ($line -match "## Blocked/Waiting|### Blocked/Waiting") {
            $inDeepWork = $false
            $inTwoOthers = $false
            $inBlocked = $true
            $inNotes = $false
            continue
        }
        if ($line -match "## Notes & Quick Captures|### Notes & Quick Captures") {
            $inDeepWork = $false
            $inTwoOthers = $false
            $inBlocked = $false
            $inNotes = $true
            continue
        }
        
        # Parse tasks
        if ($line -match "^-?\s*\[([ x])\]\s*(.+)$") {
            $isCompleted = $matches[1] -eq 'x'
            $taskText = $matches[2].Trim()
            
            $stats.TotalTasks++
            if ($isCompleted) { $stats.CompletedTasks++ }
            
            if ($inDeepWork) {
                $stats.DeepWorkTask = $taskText
                $stats.DeepWorkCompleted = $isCompleted
            }
            elseif ($inTwoOthers) {
                $taskObj = @{
                    Task = $taskText
                    Completed = $isCompleted
                }
                $stats.TwoOthers += $taskObj
                if ($isCompleted) { $stats.TwoOthersCompleted++ }
            }
        }
        
        # Parse blocked items
        if ($inBlocked -and $line -match "^-\s*(.+)$" -and $line -notmatch "\[[ x]\]") {
            $stats.BlockedTasks += $matches[1].Trim()
        }
        
        # Parse notes
        if ($inNotes -and $line -match "^-\s*(.+)$") {
            $stats.Notes += $matches[1].Trim()
        }
    }
    
    # Calculate completion rate
    if ($stats.TotalTasks -gt 0) {
        $stats.CompletionRate = [Math]::Round(($stats.CompletedTasks / $stats.TotalTasks) * 100, 1)
    }
    
    return $stats
}

function Scan-ProjectsForNextActions {
    param([string]$ProjectsPath)
    
    $nextActions = @()
    
    if (-not (Test-Path $ProjectsPath)) {
        Write-Host "  Projects folder not found, skipping scan" -ForegroundColor Yellow
        return $nextActions
    }
    
    # Get all markdown files in Projects folder
    $projectFiles = Get-ChildItem -Path $ProjectsPath -Filter "*.md" -Recurse -ErrorAction SilentlyContinue
    
    foreach ($file in $projectFiles) {
        $content = Get-Content $file.FullName -Raw
        
        # Look for next-action markers
        if ($content -match "(?mi)^##?\s*next action[s]?:?\s*$") {
            # Extract the section
            $lines = $content -split "`n"
            $inNextActions = $false
            $actionLines = @()
            
            foreach ($line in $lines) {
                if ($line -match "(?i)^##?\s*next action[s]?:?\s*$") {
                    $inNextActions = $true
                    continue
                }
                if ($inNextActions) {
                    if ($line -match "^##\s") {
                        # Hit another section, stop
                        break
                    }
                    if ($line.Trim() -match "^-\s*\[[ x]?\]\s*(.+)$") {
                        $taskText = $matches[1].Trim()
                        $actionLines += @{
                            Project = $file.BaseName
                            Task = $taskText
                        }
                    }
                }
            }
            
            $nextActions += $actionLines
        }
    }
    
    return $nextActions
}

# ============================================================================
# NEW FUNCTION: Generate JSON Context
# ============================================================================

function Generate-ReviewContext {
    param(
        [DateTime]$Date,
        [array]$PeriodsEnding,
        [hashtable]$Stats,
        [array]$ProjectActions,
        [DateTime]$NextWorkDate
    )
    
    # Build context object
    $context = @{
        timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        current_date = $Date.ToString("yyyy-MM-dd")
        periods_ending = $PeriodsEnding
        stats = @{
            total_tasks = $Stats.TotalTasks
            completed_tasks = $Stats.CompletedTasks
            completion_rate = $Stats.CompletionRate
            deep_work = @{
                task = $Stats.DeepWorkTask
                completed = $Stats.DeepWorkCompleted
            }
            two_others = @($Stats.TwoOthers)
            blocked_items = @($Stats.BlockedTasks)
            notes = @($Stats.Notes)
        }
        project_actions = @($ProjectActions)
        next_work_date = $NextWorkDate.ToString("yyyy-MM-dd")
        week_context = @{
            week_number = (Get-Date $Date -UFormat %V)
            is_end_of_week = (Test-IsEndOfWeek $Date)
        }
        month_context = @{
            month = $Date.Month
            month_name = $Date.ToString("MMMM")
            is_end_of_month = (Test-IsEndOfMonth $Date)
        }
    }
    
    # Add quarter context if needed
    if ($PeriodsEnding -contains "EOQ" -or $PeriodsEnding -contains "EOY") {
        $context.quarter_context = @{
            quarter = (Get-QuarterNumber $Date)
            year = $Date.Year
        }
    }
    
    return $context
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  CoCoA Period Review - Phase 1" -ForegroundColor Cyan
Write-Host "  Stats Gathering & Context Generation" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$now = Get-CurrentDateTime
$today = $now.Date

Write-Host "Current Date/Time: $($now.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor White
Write-Host "Day of Week: $($today.DayOfWeek)`n" -ForegroundColor White

# ============================================================================
# STEP 1: DETECT WHICH PERIODS ARE ENDING
# ============================================================================

Write-Host "[Step 1] Detecting Period Boundaries..." -ForegroundColor Yellow

$periodsEnding = @()
$periodsEnding += "EOD"  # Every day

if (Test-IsEndOfWeek $today) {
    $periodsEnding += "EOW"
    Write-Host "  ✅ End of Week detected (Friday)" -ForegroundColor Green
}

if (Test-IsEndOfMonth $today) {
    $periodsEnding += "EOM"
    Write-Host "  ✅ End of Month detected" -ForegroundColor Green
}

if (Test-IsEndOfQuarter $today) {
    $periodsEnding += "EOQ"
    Write-Host "  ✅ End of Quarter detected" -ForegroundColor Green
}

if (Test-IsEndOfYear $today) {
    $periodsEnding += "EOY"
    Write-Host "  ✅ End of Year detected" -ForegroundColor Green
}

Write-Host "`nPeriods to review: $($periodsEnding -join ', ')`n" -ForegroundColor Cyan

# ============================================================================
# STEP 2: READ AND PARSE DAILY FOCUS
# ============================================================================

Write-Host "[Step 2] Reading Daily-Focus.md..." -ForegroundColor Yellow

if (-not (Test-Path $DailyFocusPath)) {
    Write-Host "  ERROR: Daily-Focus.md not found at $DailyFocusPath" -ForegroundColor Red
    exit 1
}

$dailyFocusContent = Get-Content $DailyFocusPath -Raw
$todayStats = Parse-DailyFocus $dailyFocusContent

Write-Host "  Tasks: $($todayStats.CompletedTasks)/$($todayStats.TotalTasks) completed ($($todayStats.CompletionRate)%)" -ForegroundColor Green
Write-Host "  Deep Work: $(if ($todayStats.DeepWorkCompleted) { '✅ Done' } else { '⏳ Pending' })" -ForegroundColor $(if ($todayStats.DeepWorkCompleted) { 'Green' } else { 'Yellow' })
Write-Host "  Two Others: $($todayStats.TwoOthersCompleted)/$($todayStats.TwoOthers.Count) completed`n" -ForegroundColor Green

# ============================================================================
# STEP 3: SCAN PROJECTS FOR NEXT ACTIONS
# ============================================================================

Write-Host "[Step 3] Scanning Projects\ for next-actions..." -ForegroundColor Yellow

$projectActions = Scan-ProjectsForNextActions $ProjectsPath

if ($projectActions.Count -gt 0) {
    Write-Host "  Found $($projectActions.Count) next-action(s) across projects" -ForegroundColor Green
    foreach ($action in $projectActions) {
        Write-Host "    - [$($action.Project)] $($action.Task)" -ForegroundColor Gray
    }
} else {
    Write-Host "  No active next-actions found in Projects\" -ForegroundColor Yellow
}

Write-Host ""

# ============================================================================
# STEP 4: DETERMINE NEXT WORK PERIOD
# ============================================================================

Write-Host "[Step 4] Determining Next Work Period..." -ForegroundColor Yellow

$nextWorkDate = Get-NextWorkday $today

# If EOM, jump to 1st of next month
if ($periodsEnding -contains "EOM") {
    $nextWorkDate = [DateTime]::new($today.Year, $today.Month, 1).AddMonths(1)
    
    while ($nextWorkDate.DayOfWeek -eq [DayOfWeek]::Saturday -or 
           $nextWorkDate.DayOfWeek -eq [DayOfWeek]::Sunday) {
        $nextWorkDate = $nextWorkDate.AddDays(1)
    }
}

# If EOQ, jump to 1st day of next quarter
if ($periodsEnding -contains "EOQ") {
    $nextQuarterMonth = ((Get-QuarterNumber $today) * 3) + 1
    $nextYear = if ($nextQuarterMonth -gt 12) { $today.Year + 1 } else { $today.Year }
    $nextQuarterMonth = if ($nextQuarterMonth -gt 12) { 1 } else { $nextQuarterMonth }
    
    $nextWorkDate = [DateTime]::new($nextYear, $nextQuarterMonth, 1)
    
    while ($nextWorkDate.DayOfWeek -eq [DayOfWeek]::Saturday -or 
           $nextWorkDate.DayOfWeek -eq [DayOfWeek]::Sunday) {
        $nextWorkDate = $nextWorkDate.AddDays(1)
    }
}

# If EOY, jump to Jan 1
if ($periodsEnding -contains "EOY") {
    $nextWorkDate = [DateTime]::new($today.Year + 1, 1, 1)
    
    while ($nextWorkDate.DayOfWeek -eq [DayOfWeek]::Saturday -or 
           $nextWorkDate.DayOfWeek -eq [DayOfWeek]::Sunday) {
        $nextWorkDate = $nextWorkDate.AddDays(1)
    }
}

Write-Host "  Next work period starts: $($nextWorkDate.ToString('dddd, MMMM d, yyyy'))" -ForegroundColor Green
Write-Host ""

# ============================================================================
# STEP 5: GENERATE AND SAVE CONTEXT JSON
# ============================================================================

Write-Host "[Step 5] Generating review-context.json..." -ForegroundColor Yellow

# Ensure temp folder exists
Ensure-FolderExists $TempPath

# Generate context
$reviewContext = Generate-ReviewContext `
    -Date $today `
    -PeriodsEnding $periodsEnding `
    -Stats $todayStats `
    -ProjectActions $projectActions `
    -NextWorkDate $nextWorkDate

# Convert to JSON and save
$jsonContent = $reviewContext | ConvertTo-Json -Depth 10

if (-not $TestMode) {
    $jsonContent | Out-File -FilePath $ContextFile -Encoding UTF8
    Write-Host "  ✅ Saved: review-context.json" -ForegroundColor Green
} else {
    Write-Host "  [TEST MODE] Would save review-context.json" -ForegroundColor Yellow
    Write-Host "`nContext Preview:" -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Write-Host $jsonContent
    Write-Host "----------------------------------------" -ForegroundColor Gray
}

Write-Host ""

# ============================================================================
# STEP 6: SHOW NOTIFICATION
# ============================================================================

Write-Host "[Step 6] Showing Notification..." -ForegroundColor Yellow

$periodsList = $periodsEnding -join ", "
$notificationTitle = "CoCoA: Ready for Period Review"
$notificationMessage = @"
Periods: $periodsList
Completion: $($todayStats.CompletionRate)%

Open Claude Desktop and say:
"Launch end of day review"
"@

if (-not $TestMode) {
    # Show Windows notification
    Add-Type -AssemblyName System.Windows.Forms
    $notification = New-Object System.Windows.Forms.NotifyIcon
    $notification.Icon = [System.Drawing.SystemIcons]::Information
    $notification.BalloonTipTitle = $notificationTitle
    $notification.BalloonTipText = $notificationMessage
    $notification.Visible = $true
    $notification.ShowBalloonTip(10000)
    
    Start-Sleep -Seconds 2
    $notification.Dispose()
    
    Write-Host "  ✅ Notification displayed" -ForegroundColor Green
} else {
    Write-Host "  [TEST MODE] Would show notification:" -ForegroundColor Yellow
    Write-Host "    Title: $notificationTitle" -ForegroundColor Gray
    Write-Host "    Message: $notificationMessage" -ForegroundColor Gray
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Phase 1 Complete!" -ForegroundColor Cyan
Write-Host "  Waiting for CoCoA review conversation..." -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Return summary for potential use in other scripts
return @{
    PeriodsEnding = $periodsEnding
    NextWorkDate = $nextWorkDate
    CompletionRate = $todayStats.CompletionRate
    ProjectActionsFound = $projectActions.Count
    ContextFileSaved = $ContextFile
}
