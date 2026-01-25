# CoCoA Phase 3 - Smart Period Review Automation
# Cascading EOD/EOW/EOM/EOQ/EOY reviews with intelligent priority setting
# Author: JW / CoCoA
# Created: 2025-10-31

param(
    [switch]$TestMode = $false  # If true, shows output without writing files
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$PPCVault = "C:\PlausiblePotentials-Files\My files\My Notes\PPC"
$DailyFocusPath = "$PPCVault\Next-Actions\Daily-Focus.md"
$ProjectsPath = "$PPCVault\Projects"

$ReviewFolders = @{
    "EOD" = "$PPCVault\Next-Actions\EOD-Reviews"
    "EOW" = "$PPCVault\Next-Actions\EOW-Reviews"
    "EOM" = "$PPCVault\Next-Actions\EOM-Reviews"
    "EOQ" = "$PPCVault\Next-Actions\EOQ-Reviews"
    "EOY" = "$PPCVault\Next-Actions\EOY-Reviews"
}

# ============================================================================
# HELPER FUNCTIONS
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
                $stats.TwoOthers += $taskText
                if ($isCompleted) { $stats.TwoOthersCompleted++ }
            }
        }
        
        # Parse blocked items (bullet points without checkboxes)
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

function Generate-ReviewContent {
    param(
        [string]$Period,      # "Daily", "Weekly", "Monthly", "Quarterly", "Annual"
        [DateTime]$Date,
        [hashtable]$Stats,
        [array]$ProjectActions
    )
    
    $periodName = switch ($Period) {
        "Daily" { "End of Day" }
        "Weekly" { "End of Week" }
        "Monthly" { "End of Month" }
        "Quarterly" { "End of Quarter" }
        "Annual" { "End of Year" }
    }
    
    $dateStr = switch ($Period) {
        "Daily" { $Date.ToString("MMMM d, yyyy") }
        "Weekly" { "Week ending " + $Date.ToString("MMMM d, yyyy") }
        "Monthly" { $Date.ToString("MMMM yyyy") }
        "Quarterly" { "Q" + (Get-QuarterNumber $Date) + " " + $Date.Year }
        "Annual" { $Date.Year.ToString() }
    }
    
    $review = @"
# $periodName Review - $dateStr

> Generated by CoCoA Smart Period Review - $(Get-Date -Format "yyyy-MM-dd HH:mm")

---

## Performance Summary

**Completion Rate:** $($Stats.CompletionRate)% ($($Stats.CompletedTasks) of $($Stats.TotalTasks) tasks)

### Deep Work Block (7-9 AM)
"@

    if ($Stats.DeepWorkTask) {
        $status = if ($Stats.DeepWorkCompleted) { "✅ COMPLETED" } else { "⏳ IN PROGRESS" }
        $review += "`n- $status : $($Stats.DeepWorkTask)"
    } else {
        $review += "`n- (No deep work task defined)"
    }

    $review += @"


### Today's Two Others
"@

    if ($Stats.TwoOthers.Count -gt 0) {
        foreach ($task in $Stats.TwoOthers) {
            # Check if task text indicates completion
            $status = if ($Stats.TwoOthersCompleted -gt 0) { "✅" } else { "⏳" }
            $review += "`n- $status $task"
        }
        $review += "`n`n**Two Others Completion:** $($Stats.TwoOthersCompleted) of $($Stats.TwoOthers.Count)"
    } else {
        $review += "`n- (No tasks defined)"
    }

    if ($Stats.BlockedTasks.Count -gt 0) {
        $review += @"


### Blocked/Waiting Items
"@
        foreach ($blocked in $Stats.BlockedTasks) {
            $review += "`n- $blocked"
        }
    }

    if ($Stats.Notes.Count -gt 0) {
        $review += @"


### Notes & Insights
"@
        foreach ($note in $Stats.Notes) {
            $review += "`n- $note"
        }
    }

    # Add project scan results
    if ($ProjectActions.Count -gt 0) {
        $review += @"


---

## Active Project Next-Actions

"@
        $projectGroups = $ProjectActions | Group-Object -Property Project
        foreach ($group in $projectGroups) {
            $review += "`n### $($group.Name)"
            foreach ($action in $group.Group) {
                $review += "`n- $($action.Task)"
            }
        }
    }

    $review += @"


---

## Reflection

### What Went Well
- (Add reflections as needed)

### What Could Improve
- (Add reflections as needed)

### Key Learnings
- (Add reflections as needed)

---

*Review completed: $(Get-Date -Format "h:mm tt")*
"@

    return $review
}

function Generate-NextDailyFocus {
    param(
        [DateTime]$ForDate,
        [array]$ProjectActions,
        [hashtable]$TodayStats
    )
    
    $dayName = $ForDate.ToString("dddd, MMMM d, yyyy")
    
    $focus = @"
# Daily Focus - $dayName

> **Generated by CoCoA Smart Period Review** - $(Get-Date -Format "yyyy-MM-dd HH:mm")

---

## Deep Work Block (7-9 AM)

**#1priority**
"@

    # Intelligent priority selection
    if ($ProjectActions.Count -gt 0) {
        $topAction = $ProjectActions[0]
        $focus += "`n- [ ] **$($topAction.Project):** $($topAction.Task)"
    } else {
        $focus += "`n- [ ] (Scan Projects\ folder to identify next deep work task)"
    }

    $focus += @"


---

## Today's Two Others

"@

    if ($ProjectActions.Count -gt 1) {
        $focus += "`n1. [ ] **$($ProjectActions[1].Project):** $($ProjectActions[1].Task)"
        
        if ($ProjectActions.Count -gt 2) {
            $focus += "`n2. [ ] **$($ProjectActions[2].Project):** $($ProjectActions[2].Task)"
        } else {
            $focus += "`n2. [ ] (Add second task as needed)"
        }
    } else {
        $focus += @"

1. [ ] (Add task from project priorities)
2. [ ] (Add task from project priorities)
"@
    }

    # Carry forward blocked items if any exist
    if ($TodayStats.BlockedTasks.Count -gt 0) {
        $focus += @"


---

## Blocked/Waiting

"@
        foreach ($blocked in $TodayStats.BlockedTasks) {
            $focus += "`n- $blocked"
        }
    } else {
        $focus += @"


---

## Blocked/Waiting

- (None currently)
"@
    }

    $focus += @"


---

## Completed Today ✅

(Tasks will populate as you complete them)

---

## Notes & Quick Captures

(Add quick notes throughout the day)

---

## Tomorrow's Prep

(Agent will populate this at 4 PM based on project statuses)
"@

    return $focus
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  CoCoA Smart Period Review" -ForegroundColor Cyan
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
# STEP 4: GENERATE AND SAVE REVIEWS
# ============================================================================

Write-Host "[Step 4] Generating Period Reviews..." -ForegroundColor Yellow

foreach ($period in $periodsEnding) {
    $periodName = switch ($period) {
        "EOD" { "Daily" }
        "EOW" { "Weekly" }
        "EOM" { "Monthly" }
        "EOQ" { "Quarterly" }
        "EOY" { "Annual" }
    }
    
    Write-Host "  Generating $periodName review..." -ForegroundColor Cyan
    
    # Generate review content
    $reviewContent = Generate-ReviewContent `
        -Period $periodName `
        -Date $today `
        -Stats $todayStats `
        -ProjectActions $projectActions
    
    # Ensure review folder exists
    $reviewFolder = $ReviewFolders[$period]
    Ensure-FolderExists $reviewFolder
    
    # Generate filename
    $filename = switch ($period) {
        "EOD" { $today.ToString("yyyy-MM-dd") + "-Daily.md" }
        "EOW" { $today.ToString("yyyy-MM-dd") + "-Weekly.md" }
        "EOM" { $today.ToString("yyyy-MM") + "-Monthly.md" }
        "EOQ" { $today.Year + "-Q" + (Get-QuarterNumber $today) + "-Quarterly.md" }
        "EOY" { $today.Year + "-Annual.md" }
    }
    
    $reviewPath = Join-Path $reviewFolder $filename
    
    # Save review
    if (-not $TestMode) {
        $reviewContent | Out-File -FilePath $reviewPath -Encoding UTF8
        Write-Host "    ✅ Saved: $filename" -ForegroundColor Green
    } else {
        Write-Host "    [TEST MODE] Would save: $filename" -ForegroundColor Yellow
    }
}

Write-Host ""

# ============================================================================
# STEP 5: DETERMINE NEXT WORK PERIOD
# ============================================================================

Write-Host "[Step 5] Determining Next Work Period..." -ForegroundColor Yellow

# Calculate next workday based on longest period ending
$nextWorkDate = Get-NextWorkday $today

# If EOM, jump to 1st of next month
if ($periodsEnding -contains "EOM") {
    $nextWorkDate = [DateTime]::new($today.Year, $today.Month, 1).AddMonths(1)
    
    # Skip to next Monday if 1st falls on weekend
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
# STEP 6: GENERATE NEW DAILY FOCUS
# ============================================================================

Write-Host "[Step 6] Generating Daily-Focus.md for next period..." -ForegroundColor Yellow

$newFocusContent = Generate-NextDailyFocus `
    -ForDate $nextWorkDate `
    -ProjectActions $projectActions `
    -TodayStats $todayStats

if (-not $TestMode) {
    $newFocusContent | Out-File -FilePath $DailyFocusPath -Encoding UTF8
    Write-Host "  ✅ Updated Daily-Focus.md for $($nextWorkDate.ToString('MMMM d, yyyy'))" -ForegroundColor Green
} else {
    Write-Host "  [TEST MODE] Would update Daily-Focus.md" -ForegroundColor Yellow
    Write-Host "`nPreview of new Daily-Focus.md:" -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Write-Host $newFocusContent
    Write-Host "----------------------------------------" -ForegroundColor Gray
}

Write-Host ""

# ============================================================================
# STEP 7: SHOW NOTIFICATION
# ============================================================================

Write-Host "[Step 7] Showing Notification..." -ForegroundColor Yellow

$periodsList = $periodsEnding -join ", "
$notificationTitle = "CoCoA Period Review Complete"
$notificationMessage = @"
$periodsList reviews generated.

Next focus period: $($nextWorkDate.ToString('dddd, MMM d'))

Completion today: $($todayStats.CompletionRate)%
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
Write-Host "  Period Review Complete!" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Return summary for potential use in other scripts
return @{
    PeriodsReviewed = $periodsEnding
    NextWorkDate = $nextWorkDate
    CompletionRate = $todayStats.CompletionRate
    ProjectActionsFound = $projectActions.Count
}
