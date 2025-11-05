"""
Test the new lean triage card format
"""

import sys
from pathlib import Path
from datetime import datetime

# Add project root to path
sys.path.append(str(Path(__file__).parent))

from trackers.obsidian_updater import ObsidianUpdater

print("🧪 Testing Lean Triage Card Format\n")

# Create updater
updater = ObsidianUpdater()

# Create test email with realistic content
test_email = {
    'id': 'test-lean-format-123',
    'channel': 'email',
    'from': 'john.smith@techcorp.com',
    'from_name': 'John Smith',
    'subject': 'Q4 Strategy Discussion - C3 Alliance',
    'body': '''Hey JW,

Hope this finds you well! I wanted to touch base about our Q4 strategy for the C3 Alliance project. 

I've put together some initial thoughts on the cooperative framework expansion and how it ties into the overall roadmap. There are a few key decisions we need to make before our next board meeting:

1. Timeline for Phase 2 rollout
2. Budget allocation for marketing
3. Partnership opportunities with other cooperatives

Would love to get your input on these items. Are you available for a quick call this week? I'm flexible on timing.

Also, I saw your recent post about the Exit-to-Cooperative model - really insightful stuff! Would be great to incorporate some of those concepts into our strategy.

Looking forward to hearing from you.

Best regards,
John

--
John Smith
CTO, TechCorp
john.smith@techcorp.com
''',
    'timestamp': datetime.now().isoformat(),
    'status': 'unread',
    'priority_score': 85,
    'response_due': '2025-11-02T17:00:00',
    'project_link': '[[C3 Alliance]]',
    'action_items': [
        'Review Q4 strategy document',
        'Schedule call with John',
        'Prepare feedback on timeline and budget'
    ]
}

print("📧 Test Email:")
print(f"   From: {test_email['from_name']} <{test_email['from']}>")
print(f"   Subject: {test_email['subject']}")
print(f"   Priority: {test_email['priority_score']}")
print(f"   Body length: {len(test_email['body'])} chars\n")

# Save with new lean format
print("💾 Saving conversation with lean format...")
try:
    updater.save_conversation(test_email, 'email')
    print("✅ Save successful!\n")
    
    # Find the created file
    import os
    email_dir = updater.active_conversations_path / "Email"
    files = sorted(email_dir.glob("*.md"), key=os.path.getmtime, reverse=True)
    
    if files:
        latest_file = files[0]
        print(f"📄 Created file: {latest_file.name}\n")
        print("="*60)
        print("FILE CONTENT:")
        print("="*60)
        print(latest_file.read_text(encoding='utf-8'))
        print("="*60)
        
        print("\n✅ Test complete! Check the output above to verify:")
        print("   ✓ YAML properties preserved (for Obsidian Bases)")
        print("   ✓ Body is lean (From/Subject/Priority/Preview only)")
        print("   ✓ Preview is ~300 chars with clean formatting")
        print("   ✓ No bloat (action items, drafts, related sections removed)")
        
    else:
        print("❌ Could not find created file")
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
