#!/usr/bin/env python3
"""
Morning Flow
Loads today's priority and checks email
"""

import os
import sys
import json
import subprocess
from datetime import datetime
import argparse

# Paths
DAILY_NOTES_DIR = r"C:\PlausiblePotentials-Files\My files\My Notes\PPC\Life-Management\Daily-Notes"
ACTIVE_PRIORITY_FILE = r"C:\PlausiblePotentials-Files\My files\My Notes\PPC\Life-Management\Active-Priority.md"
EMAIL_CHECK_SCRIPT = r"D:\Claude-MCP-Files\skills\email-scripts\check_proton_folders.py"
PYTHON_PATH = r"C:\Python313\python.exe"

# Proton credentials
PROTON_USERNAME = "team@plausiblepotentials.com"
PROTON_PASSWORD = "2639Sqt7gLs0G5qb6NtyyA"

def read_active_priority():
    """Read current priority from Active-Priority.md"""
    
    if not os.path.exists(ACTIVE_PRIORITY_FILE):
        return None, None, None
    
    with open(ACTIVE_PRIORITY_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    import re
    date_match = re.search(r'\*\*Current Date:\*\* (.*?)\n', content)
    priority_match = re.search(r'\*\*Priority:\*\* (.*?)\n', content)
    set_match = re.search(r'\*\*Set:\*\* (.*?)\n', content)
    
    current_date = date_match.group(1).strip() if date_match else None
    priority = priority_match.group(1).strip() if priority_match else None
    set_time = set_match.group(1).strip() if set_match else None
    
    return current_date, priority, set_time

def check_email():
    """Check Proton Mail folders"""
    
    try:
        result = subprocess.run(
            [
                PYTHON_PATH,
                EMAIL_CHECK_SCRIPT,
                '--username', PROTON_USERNAME,
                '--password', PROTON_PASSWORD
            ],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            return json.loads(result.stdout)
        else:
            return None
    except Exception as e:
        return None

def update_daily_note_comm_check(date, email_data):
    """Update today's daily note with communication check"""
    
    date_str = date.strftime("%Y-%m-%d")
    daily_note_path = os.path.join(DAILY_NOTES_DIR, f"{date_str}.md")
    
    if not os.path.exists(daily_note_path):
        return False
    
    with open(daily_note_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Build communication summary
    if email_data and 'error' not in email_data:
        action_count = email_data.get('action_required', 0)
        decision_count = email_data.get('decisions_needed', 0)
        inbox_count = email_data.get('inbox', 0)
        waiting_count = email_data.get('waiting_on_others', 0)
        
        comm_summary = f"""**Proton Mail:**

🔴 Attention Needed:
• @Action-Required: {action_count} messages
• @Decisions-Needed: {decision_count} messages
• Inbox (needs triage): {inbox_count} messages

🟡 Monitoring:
• Waiting-On-Others: {waiting_count} messages

*Communication can wait until 9 AM cardio break.*"""
    else:
        comm_summary = "**Email check unavailable** (Proton Bridge may be offline)"
    
    # Find and replace communication check section
    import re
    pattern = r'(## 📬 Morning Communication Check \(7:00 AM\)\s+)(.*?)(\s+---)'
    
    if re.search(pattern, content, re.DOTALL):
        content = re.sub(
            pattern,
            f'\\1{comm_summary}\\3',
            content,
            flags=re.DOTALL
        )
        
        with open(daily_note_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    parser = argparse.ArgumentParser(description='Morning Flow - Load priority and check email')
    parser.add_argument('--skip-email', action='store_true', help='Skip email check')
    
    args = parser.parse_args()
    
    # Get current date
    today = datetime.now()
    today_str = today.strftime("%Y-%m-%d")
    
    # Read active priority
    priority_date, priority, set_time = read_active_priority()
    
    # Check if priority is for today
    if priority_date != today_str:
        print("⚠️  No priority set for today!")
        print(f"Active priority is for: {priority_date}")
        print("\nSet today's priority with:")
        print('CoCoA, tomorrow\'s priority: [your priority]')
        return
    
    # Check email (unless skipped)
    email_data = None if args.skip_email else check_email()
    
    # Update daily note with email check
    if email_data:
        update_daily_note_comm_check(today, email_data)
    
    # Output morning flow message
    print(f"Good morning, JW. ☀️\n")
    print(f"#1 Priority: {priority}")
    print(f"Set: {set_time}\n")
    
    if email_data and 'error' not in email_data:
        action_count = email_data.get('action_required', 0)
        decision_count = email_data.get('decisions_needed', 0)
        inbox_count = email_data.get('inbox', 0)
        waiting_count = email_data.get('waiting_on_others', 0)
        
        print("📬 Communication Check:\n")
        print("🔴 Attention Needed:")
        print(f"• @Action-Required: {action_count} messages")
        print(f"• @Decisions-Needed: {decision_count} messages")
        print(f"• Inbox (needs triage): {inbox_count} messages\n")
        print("🟡 Monitoring:")
        print(f"• Waiting-On-Others: {waiting_count} messages\n")
        print("Communication can wait until 9 AM cardio break.\n")
    elif args.skip_email:
        print("📬 Email check skipped\n")
    else:
        print("📬 Email check unavailable (Proton Bridge may be offline)\n")
    
    print("Your deep work block (7-9 AM) starts now.")
    print("Ready when you are.")

if __name__ == '__main__':
    main()
