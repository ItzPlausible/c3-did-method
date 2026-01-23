#!/usr/bin/env python3
"""
Set Tomorrow's Priority
Creates/updates tomorrow's daily note and Active-Priority.md
"""

import os
import sys
from datetime import datetime, timedelta
import argparse

# Paths
DAILY_NOTES_DIR = r"C:\PlausiblePotentials-Files\My files\My Notes\PPC\Life-Management\Daily-Notes"
ACTIVE_PRIORITY_FILE = r"C:\PlausiblePotentials-Files\My files\My Notes\PPC\Life-Management\Active-Priority.md"

def get_week_number(date):
    """Get ISO week number"""
    return date.isocalendar()[1]

def create_daily_note(date, priority, set_time):
    """Create daily note with priority"""
    
    # Format date strings
    date_str = date.strftime("%Y-%m-%d")
    day_name = date.strftime("%A")
    month_name = date.strftime("%B")
    day_num = date.strftime("%d")
    year = date.strftime("%Y")
    week_num = get_week_number(date)
    
    # Calculate yesterday and tomorrow
    yesterday = date - timedelta(days=1)
    tomorrow = date + timedelta(days=1)
    
    yesterday_str = yesterday.strftime("%Y-%m-%d")
    yesterday_display = yesterday.strftime("%b %d")
    tomorrow_str = tomorrow.strftime("%Y-%m-%d")
    tomorrow_display = tomorrow.strftime("%b %d")
    
    # Daily note template
    template = f"""---
date: {date_str}
day: {day_name}
week: {week_num}
type: daily-note
priority-set: {set_time}
cocoa-managed: true
---

# {day_name}, {month_name} {day_num}, {year}

> **Week:** [[Life-Management/Weekly-Notes/{year}-W{week_num:02d}|Week {week_num}]]
> **Yesterday:** [[Life-Management/Daily-Notes/{yesterday_str}|{yesterday_display}]]
> **Tomorrow:** [[Life-Management/Daily-Notes/{tomorrow_str}|{tomorrow_display}]]

---

## 🎯 #1 Priority

- [ ] **{priority}**

*Set: {set_time}*

---

## 📬 Morning Communication Check (7:00 AM)

(CoCoA will update this during morning flow)

---

## 📝 Work Notes

(Your notes throughout the day go here)

---

## 💭 Insights & Quotes

(Space for your daily quote or reflection)

---

## 🔄 End of Day (4:00 PM)

**Priority Status:** (CoCoA will ask during day complete)

**Tomorrow's #1 Priority:**
(Set via: "CoCoA, tomorrow's priority: ...")

---

*Daily note managed with CoCoA 2.0*
"""
    
    # Write daily note
    daily_note_path = os.path.join(DAILY_NOTES_DIR, f"{date_str}.md")
    
    # Check if file exists
    if os.path.exists(daily_note_path):
        # File exists, update priority section only
        with open(daily_note_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find priority section and update
        import re
        priority_pattern = r'(## 🎯 #1 Priority\s+- \[ \] \*\*)(.*?)(\*\*\s+\*Set:)(.*?)(\*)'
        if re.search(priority_pattern, content):
            content = re.sub(
                priority_pattern,
                f'\\1{priority}\\3 {set_time}\\5',
                content,
                flags=re.DOTALL
            )
            with open(daily_note_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return "updated"
        else:
            # Priority section not found, create new file
            with open(daily_note_path, 'w', encoding='utf-8') as f:
                f.write(template)
            return "created"
    else:
        # Create new file
        with open(daily_note_path, 'w', encoding='utf-8') as f:
            f.write(template)
        return "created"

def update_active_priority(date, priority, set_time):
    """Update Active-Priority.md"""
    
    date_str = date.strftime("%Y-%m-%d")
    
    # Read current active priority to preserve history
    history = []
    if os.path.exists(ACTIVE_PRIORITY_FILE):
        with open(ACTIVE_PRIORITY_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Extract current priority for history
        import re
        current_match = re.search(r'\*\*Current Date:\*\* (.*?)\n\*\*Priority:\*\* (.*?)\n', content)
        status_match = re.search(r'\*\*Status:\*\* (.*?)\n', content)
        
        if current_match and status_match:
            old_date = current_match.group(1).strip()
            old_priority = current_match.group(2).strip()
            old_status = status_match.group(1).strip()
            
            if old_date != "Not Set" and old_priority != "No priority set yet":
                status_symbol = "✓" if "Complete" in old_status else "○"
                history.append(f"- {old_date}: {old_priority} {status_symbol}")
        
        # Extract existing history
        history_match = re.search(r'## Recent History\n(.*?)\n---', content, re.DOTALL)
        if history_match:
            existing_history = history_match.group(1).strip()
            if existing_history and not existing_history.startswith('('):
                history_lines = [line for line in existing_history.split('\n') if line.strip() and line.startswith('-')]
                history.extend(history_lines[:9])  # Keep last 9 + new = 10 total
    
    # Build history section
    history_text = '\n'.join(history) if history else "(History will appear here as you complete priorities)"
    
    # Create new Active-Priority content
    content = f"""# Active Priority

**Current Date:** {date_str}
**Priority:** {priority}

**Status:** In Progress
**Set:** {set_time}

---

## Recent History
{history_text}

---

*CoCoA 2.0 - Priority Tracking System*
"""
    
    with open(ACTIVE_PRIORITY_FILE, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    parser = argparse.ArgumentParser(description='Set tomorrow\'s priority')
    parser.add_argument('priority', help='Priority description')
    parser.add_argument('--date', help='Date (YYYY-MM-DD), defaults to tomorrow')
    
    args = parser.parse_args()
    
    # Calculate tomorrow's date
    if args.date:
        target_date = datetime.strptime(args.date, "%Y-%m-%d")
    else:
        target_date = datetime.now() + timedelta(days=1)
    
    # Current timestamp
    set_time = datetime.now().strftime("%b %d at %I:%M %p").replace(" 0", " ")
    
    # Create/update daily note
    result = create_daily_note(target_date, args.priority, set_time)
    
    # Update active priority
    update_active_priority(target_date, args.priority, set_time)
    
    # Output success message
    date_display = target_date.strftime("%Y-%m-%d")
    print(f"✅ Tomorrow's priority set: {args.priority}")
    print(f"Daily note {result}: {date_display}.md")
    print(f"Active priority updated.")
    print(f"\nSee you at 7 AM. 🚀")

if __name__ == '__main__':
    main()
