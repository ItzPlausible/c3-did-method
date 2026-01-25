# CoCoA Phase 3 - Period Review Finalization (Phase 3)
# Merges stats + user responses into final review files
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
$TempPath = "D:\Claude-MCP-Files\CoCoA-Project\workflows\temp"
$TemplatePath = "D:\Claude-MCP-Files\CoCoA-Project\workflows\period-review-templates"
$ContextFile = "$TempPath\review-context.json"
$ResponsesFile = "$TempPath\review-responses.json"

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

function Get-QuarterNumber {
    param([DateTime]$Date)
    [Math]::Ceiling($Date.Month / 3)
}

function Ensure-FolderExists {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        New-Item -Path $Path -ItemType Directory -Force | Out-Null
        Write-Host "  Created folder: $Path" -ForegroundColor Green
    }
}

function Format-StatsSection {
    param(
        [hashtable]$Stats,
        [string]$SectionType
    )
    
    switch ($SectionType) {
        "deep_work" {
            if ($Stats.deep_work.task) {
                $status = if ($Stats.deep_work.completed) { "✅ COMPLETED" } else { "⏳ IN PROGRESS" }
                return "- $status : $($Stats.deep_work.task)"
            } else {
                return "- (No deep work task defined)"
            }
        }
        
        "two_others" {
            if ($Stats.two_others.Count -gt 0) {
                $lines = @()
                foreach ($task in $Stats.two_others) {
                    $status = if ($task.Completed) { "✅" } else { "⏳" }
                    $lines += "- $status $($task.Task)"
                }
                $lines += ""
                $lines += "**Two Others Completion:** $($Stats.two_others | Where-Object { $_.Completed } | Measure-Object).Count of $($Stats.two_others.Count)"
                return $lines -join "`n"
            } else {
                return "- (No tasks defined)"
            }
        }
        
        "blocked" {
            if ($Stats.blocked_items.Count -gt 0) {
                $section = "`n`n### Blocked/Waiting Items`n"
                foreach ($blocked in $Stats.blocked_items) {
                    $section += "- $blocked`n"
                }
                return $section
            } else {
                return ""
            }
        }
        
        "notes" {
            if ($Stats.notes.Count -gt 0) {
                $section = "`n`n### Notes & Insights`n"
                foreach ($note in $Stats.notes) {
                    $section += "- $note`n"
                }
                return $section
            } else {
                return ""
            }
        }
    }
    
    return ""
}

function Format-ProjectActions {
    param([array]$ProjectActions)
    
    if ($ProjectActions.Count -eq 0) {
        return "(No active next-actions found in Projects\)"
    }
    
    $grouped = $ProjectActions | Group-Object -Property Project
    $lines = @()
    
    foreach ($group in $grouped) {
        $lines += "`n### $($group.Name)"
        foreach ($action in $group.Group) {
            $lines += "- $($action.Task)"
        }
    }
    
    return $lines -join "`n"
}

function Format-UserResponse {
    param([string]$Response)
    
    if ([string]::IsNullOrWhiteSpace($Response) -or $Response -eq "null") {
        return "(No response provided)"
    }
    
    return $Response
}

function Render-Template {
    param(
        [string]$TemplatePath,
        [hashtable]$Context,
        [hashtable]$Responses
    )
    
    $template = Get-Content $TemplatePath -Raw
    
    # Get date objects
    $currentDate = [DateTime]::Parse($Context.current_date)
    $nextDate = [DateTime]::Parse($Context.next_work_date)
    
    # Replace date placeholders
    $template = $template -replace '\{\{DATE_FULL\}\}', $currentDate.ToString("MMMM d, yyyy")
    $template = $template -replace '\{\{DATE_WEEK_ENDING\}\}', "Week ending " + $currentDate.ToString("MMMM d, yyyy")
    $template = $template -replace '\{\{DATE_MONTH_YEAR\}\}', $currentDate.ToString("MMMM yyyy")
    $template = $template -replace '\{\{TIMESTAMP\}\}', (Get-Date -Format "yyyy-MM-dd HH:mm")
    $template = $template -replace '\{\{TIME_COMPLETED\}\}', (Get-Date -Format "h:mm tt")
    
    # Replace stats placeholders
    $template = $template -replace '\{\{STATS_COMPLETION_RATE\}\}', $Context.stats.completion_rate
    $template = $template -replace '\{\{STATS_COMPLETED\}\}', $Context.stats.completed_tasks
    $template = $template -replace '\{\{STATS_TOTAL\}\}', $Context.stats.total_tasks
    
    # Replace formatted sections
    $template = $template -replace '\{\{STATS_DEEP_WORK_SECTION\}\}', (Format-StatsSection -Stats $Context.stats -SectionType "deep_work")
    $template = $template -replace '\{\{STATS_TWO_OTHERS_SECTION\}\}', (Format-StatsSection -Stats $Context.stats -SectionType "two_others")
    $template = $template -replace '\{\{STATS_BLOCKED_SECTION\}\}', (Format-StatsSection -Stats $Context.stats -SectionType "blocked")
    $template = $template -replace '\{\{STATS_NOTES_SECTION\}\}', (Format-StatsSection -Stats $Context.stats -SectionType "notes")
    $template = $template -replace '\{\{PROJECT_ACTIONS_SECTION\}\}', (Format-ProjectActions -ProjectActions $Context.project_actions)
    
    # Replace week context if present
    if ($Context.week_context) {
        $template = $template -replace '\{\{WEEK_NUMBER\}\}', $Context.week_context.week_number
        $template = $template -replace '\{\{WEEK_START_DATE\}\}', $currentDate.AddDays(-([int]$currentDate.DayOfWeek - 1)).ToString("MMM d")
        $template = $template -replace '\{\{WEEK_END_DATE\}\}', $currentDate.ToString("MMM d, yyyy")
    }
    
    # Replace month context if present
    if ($Context.month_context) {
        $template = $template -replace '\{\{MONTH_NAME\}\}', $Context.month_context.month_name
        $template = $template -replace '\{\{NEXT_MONTH_NAME\}\}', $nextDate.ToString("MMMM")
        $template = $template -replace '\{\{YEAR\}\}', $currentDate.Year
    }
    
    # Replace quarter context if present
    if ($Context.quarter_context) {
        $template = $template -replace '\{\{QUARTER_NUMBER\}\}', $Context.quarter_context.quarter
        $template = $template -replace '\{\{NEXT_QUARTER_NUMBER\}\}', (($Context.quarter_context.quarter % 4) + 1)
    }
    
    # Replace user response placeholders
    foreach ($key in $Responses.Keys) {
        $placeholder = "{{USER_$($key.ToUpper())}}"
        $value = Format-UserResponse $Responses[$key]
        $template = $template -replace [regex]::Escape($placeholder), $value
    }
    
    return $template
}

function Generate-NextDailyFocus {
    param(
        [DateTime]$ForDate,
        [array]$ProjectActions,
        [hashtable]$TodayStats,
        [hashtable]$UserResponses
    )
    
    $dayName = $ForDate.ToString("dddd, MMMM d, yyyy")
    
    $focus = @"
# Daily Focus - $dayName

> **Generated by CoCoA Smart Period Review** - $(Get-Date -Format "yyyy-MM-dd HH:mm")

---

## Deep Work Block (7-9 AM)

**#1priority**
"@

    # Use tomorrow's priority from user response if available
    if ($UserResponses.tomorrow_priority -and $UserResponses.tomorrow_priority -ne "null") {
        $focus += "`n- [ ] $($UserResponses.tomorrow_priority)"
    } elseif ($ProjectActions.Count -gt 0) {
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
    if ($TodayStats.blocked_items.Count -gt 0) {
        $focus += @"


---

## Blocked/Waiting

"@
        foreach ($blocked in $TodayStats.blocked_items) {
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
Write-Host "  CoCoA Period Review - Phase 3" -ForegroundColor Cyan
Write-Host "  Finalization & File Generation" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# ============================================================================
# STEP 1: LOAD CONTEXT AND RESPONSES
# ============================================================================

Write-Host "[Step 1] Loading review data..." -ForegroundColor Yellow

if (-not (Test-Path $ContextFile)) {
    Write-Host "  ERROR: review-context.json not found!" -ForegroundColor Red
    Write-Host "  Run period-review-stats.ps1 first." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $ResponsesFile)) {
    Write-Host "  ERROR: review-responses.json not found!" -ForegroundColor Red
    Write-Host "  Complete the review conversation with CoCoA first." -ForegroundColor Red
    exit 1
}

$contextJson = Get-Content $ContextFile -Raw | ConvertFrom-Json
$responsesJson = Get-Content $ResponsesFile -Raw | ConvertFrom-Json

Write-Host "  ✅ Loaded review-context.json" -ForegroundColor Green
Write-Host "  ✅ Loaded review-responses.json" -ForegroundColor Green
Write-Host "  Periods to finalize: $($contextJson.periods_ending -join ', ')`n" -ForegroundColor Cyan

# ============================================================================
# STEP 2: GENERATE REVIEW FILES
# ============================================================================

Write-Host "[Step 2] Generating review files..." -ForegroundColor Yellow

foreach ($period in $contextJson.periods_ending) {
    $periodName = switch ($period) {
        "EOD" { "Daily"; $templateFile = "daily-template.md" }
        "EOW" { "Weekly"; $templateFile = "weekly-template.md" }
        "EOM" { "Monthly"; $templateFile = "monthly-template.md" }
        "EOQ" { "Quarterly"; $templateFile = "quarterly-template.md" }
        "EOY" { "Annual"; $templateFile = "annual-template.md" }
    }
    
    Write-Host "  Rendering $periodName review..." -ForegroundColor Cyan
    
    # Load template
    $templatePath = Join-Path $TemplatePath $templateFile
    
    if (-not (Test-Path $templatePath)) {
        Write-Host "    ERROR: Template not found: $templateFile" -ForegroundColor Red
        continue
    }
    
    # Get user responses for this period
    $periodResponses = @{}
    if ($responsesJson.responses.$period) {
        $responsesJson.responses.$period.PSObject.Properties | ForEach-Object {
            $periodResponses[$_.Name] = $_.Value
        }
    }
    
    # Render template
    $reviewContent = Render-Template `
        -TemplatePath $templatePath `
        -Context @{
            current_date = $contextJson.current_date
            next_work_date = $contextJson.next_work_date
            stats = @{
                completion_rate = $contextJson.stats.completion_rate
                completed_tasks = $contextJson.stats.completed_tasks
                total_tasks = $contextJson.stats.total_tasks
                deep_work = $contextJson.stats.deep_work
                two_others = $contextJson.stats.two_others
                blocked_items = $contextJson.stats.blocked_items
                notes = $contextJson.stats.notes
            }
            project_actions = $contextJson.project_actions
            week_context = $contextJson.week_context
            month_context = $contextJson.month_context
            quarter_context = $contextJson.quarter_context
        } `
        -Responses $periodResponses
    
    # Ensure review folder exists
    $reviewFolder = $ReviewFolders[$period]
    Ensure-FolderExists $reviewFolder
    
    # Generate filename
    $currentDate = [DateTime]::Parse($contextJson.current_date)
    $filename = switch ($period) {
        "EOD" { $currentDate.ToString("yyyy-MM-dd") + "-Daily.md" }
        "EOW" { $currentDate.ToString("yyyy-MM-dd") + "-Weekly.md" }
        "EOM" { $currentDate.ToString("yyyy-MM") + "-Monthly.md" }
        "EOQ" { $currentDate.Year + "-Q" + (Get-QuarterNumber $currentDate) + "-Quarterly.md" }
        "EOY" { $currentDate.Year + "-Annual.md" }
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
# STEP 3: GENERATE NEXT DAILY FOCUS
# ============================================================================

Write-Host "[Step 3] Generating next Daily-Focus.md..." -ForegroundColor Yellow

$nextWorkDate = [DateTime]::Parse($contextJson.next_work_date)

# Get user responses for tomorrow's priority (from EOD responses)
$eodResponses = @{}
if ($responsesJson.responses.EOD) {
    $responsesJson.responses.EOD.PSObject.Properties | ForEach-Object {
        $eodResponses[$_.Name] = $_.Value
    }
}

$newFocusContent = Generate-NextDailyFocus `
    -ForDate $nextWorkDate `
    -ProjectActions $contextJson.project_actions `
    -TodayStats $contextJson.stats `
    -UserResponses $eodResponses

if (-not $TestMode) {
    $newFocusContent | Out-File -FilePath $DailyFocusPath -Encoding UTF8
    Write-Host "  ✅ Updated Daily-Focus.md for $($nextWorkDate.ToString('MMMM d, yyyy'))" -ForegroundColor Green
} else {
    Write-Host "  [TEST MODE] Would update Daily-Focus.md" -ForegroundColor Yellow
}

Write-Host ""

# ============================================================================
# STEP 4: CLEANUP TEMP FILES
# ============================================================================

Write-Host "[Step 4] Cleaning up..." -ForegroundColor Yellow

if (-not $TestMode) {
    # Archive the JSON files (don't delete, in case we need them)
    $archiveFolder = "$TempPath\archive"
    Ensure-FolderExists $archiveFolder
    
    $timestamp = Get-Date -Format "yyyy-MM-dd-HHmmss"
    Move-Item $ContextFile "$archiveFolder\review-context-$timestamp.json" -Force
    Move-Item $ResponsesFile "$archiveFolder\review-responses-$timestamp.json" -Force
    
    Write-Host "  ✅ Archived temp files" -ForegroundColor Green
} else {
    Write-Host "  [TEST MODE] Would archive temp files" -ForegroundColor Yellow
}

Write-Host ""

# ============================================================================
# STEP 5: SHOW COMPLETION NOTIFICATION
# ============================================================================

Write-Host "[Step 5] Showing completion notification..." -ForegroundColor Yellow

$periodsList = $contextJson.periods_ending -join ", "
$notificationTitle = "Period Reviews Complete!"
$notificationMessage = @"
$periodsList reviews saved successfully.

Next focus period: $($nextWorkDate.ToString('dddd, MMM d'))
Daily-Focus.md updated.
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
Write-Host "  All Period Reviews Complete!" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
