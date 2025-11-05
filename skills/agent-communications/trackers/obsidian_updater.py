"""
Obsidian Updater - Primary Data Hub
Updates Obsidian vault with communications data
"""

import os
from datetime import datetime
from typing import Dict, List
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


class ObsidianUpdater:
    """Update Obsidian vault with communications tracking"""
    
    def __init__(self):
        self.vault_path = Path(os.getenv('OBSIDIAN_VAULT_PATH'))
        self.comms_path = Path(os.getenv('OBSIDIAN_COMMS_PATH'))
        self.dashboard_path = self.comms_path / "00_Communications-Dashboard.md"
        self.active_conversations_path = self.comms_path / "Active-Conversations"
        self.drafts_path = self.comms_path / "Drafts-Pending-Approval"
        
        # Ensure directories exist
        self._ensure_directories()
    
    def _ensure_directories(self):
        """Create necessary Obsidian directories if they don't exist"""
        dirs = [
            self.comms_path,
            self.active_conversations_path,
            self.active_conversations_path / "Email",
            self.active_conversations_path / "Telegram",
            self.active_conversations_path / "Discord",
            self.active_conversations_path / "Chatbot",
            self.drafts_path
        ]
        
        for dir_path in dirs:
            dir_path.mkdir(parents=True, exist_ok=True)
    
    def update_dashboard(self, emails: List[Dict], telegram: List[Dict] = None, 
                        discord: List[Dict] = None, chatbot: List[Dict] = None):
        """
        Update the main Communications Dashboard
        
        Args:
            emails: List of email message objects
            telegram: List of Telegram message objects
            discord: List of Discord message objects  
            chatbot: List of chatbot message objects
        """
        # Set defaults
        telegram = telegram or []
        discord = discord or []
        chatbot = chatbot or []
        
        # Get priority messages (score >= 70)
        priority_messages = self._get_priority_messages(emails, telegram, discord, chatbot)
        
        # Build dashboard content
        content = f"""# 📬 Communications Dashboard

Last Updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## 🚨 Priority Responses Needed
{self._format_priority_table(priority_messages)}

## 📊 Channel Status

### Email (Proton)
- Unread: {len([e for e in emails if e['status'] == 'unread'])}
- Pending Response: {len([e for e in emails if e.get('priority_score', 0) >= 40])}
- Total Monitored: {len(emails)}

### Telegram
- Active Chats: {len(telegram)}
- Unread: {len([t for t in telegram if t['status'] == 'unread'])}
- Follow-up Needed: {len([t for t in telegram if t.get('priority_score', 0) >= 70])}

### Discord
- Active Channels: {len(discord)}
- @Mentions: {len([d for d in discord if d.get('is_mention', False)])}
- DMs: {len([d for d in discord if d.get('is_dm', False)])}

### Chatbot Status
- Conversations Today: {len(chatbot)}
- Escalations: {len([c for c in chatbot if c.get('needs_escalation', False)])}
- Response Rate: {self._calculate_response_rate(chatbot)}%

## 📅 Response SLAs

| Channel | Target | Status |
|---------|--------|--------|
| Email | 24h | ✅ On track |
| Telegram | 4h | ✅ On track |
| Discord | 8h | ✅ On track |
| Chatbot | 1h | ✅ On track |

## 📝 Active Conversations

{self._format_active_conversations(emails, telegram, discord, chatbot)}

## 🎯 Today's Communication Goals

- [ ] Clear all priority responses
- [ ] Review pending drafts
- [ ] Update project-linked conversations
- [ ] Check for follow-ups

## ✅ Completed Today

{self._get_completed_today()}

---
*Agent-Communications v1.0*  
*Next check: {self._get_next_check_time()}*
*Daily Review: Morning 8am & Evening 5pm*
"""
        
        # Write to dashboard
        self.dashboard_path.write_text(content, encoding='utf-8')
        print(f"✅ Updated dashboard: {self.dashboard_path}")
    
    def save_conversation(self, message: Dict, channel: str):
        """
        Save individual conversation to Active-Conversations folder
        Creates lean triage card with full YAML properties for Obsidian Bases
        
        Args:
            message: Message object
            channel: Channel name (email, telegram, discord, chatbot)
        """
        # Create filename
        timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
        sender = message.get('from', 'unknown').replace('@', '-at-').replace('.', '-')
        subject = message.get('subject', 'no-subject')[:50].replace(' ', '-').replace('/', '-')
        
        filename = f"{timestamp}-{sender}-{subject}.md"
        filepath = self.active_conversations_path / channel.capitalize() / filename
        
        # Extract message preview (first 200-300 chars or ~3-4 sentences)
        body = message.get('body', 'No content')
        preview = self._extract_preview(body)
        
        # Format sender name for contact linking
        from_name = message.get('from_name', message.get('from', 'Unknown'))
        from_email = message.get('from', 'N/A')
        sender_display = f"[[{from_name}]] ({from_email})" if from_name != from_email else from_email
        
        # Build lean triage card content
        content = f"""---
date: {message.get('timestamp', datetime.now().isoformat())}
channel: {channel}
from: {message.get('from', 'unknown')}
subject: {message.get('subject', 'N/A')}
priority_score: {message.get('priority_score', 0)}
status: {message.get('status', 'unread')}
---

# {message.get('subject', 'Message')}

**From:** {sender_display}  
**Subject:** {message.get('subject', 'N/A')}  
**Priority:** {self._priority_emoji(message.get('priority_score', 0))} {message.get('priority_score', 0)}

**Message Preview:**
> {preview}

---
"""
        
        filepath.write_text(content, encoding='utf-8')
        print(f"✅ Saved conversation: {filepath.name}")
    
    def _extract_preview(self, body: str, max_chars: int = 300) -> str:
        """
        Extract clean preview from message body
        
        Args:
            body: Full message body text
            max_chars: Maximum characters for preview
            
        Returns:
            Clean preview text
        """
        if not body or body == 'No content':
            return "No content available"
        
        # Clean up common email artifacts
        body = body.strip()
        
        # Remove excessive whitespace/newlines
        import re
        body = re.sub(r'\n\s*\n', '\n', body)  # Multiple newlines to single
        body = re.sub(r' +', ' ', body)  # Multiple spaces to single
        
        # Try to get first few sentences (up to 3-4)
        sentences = body.split('.')
        preview_parts = []
        char_count = 0
        
        for sentence in sentences[:4]:  # Max 4 sentences
            sentence = sentence.strip()
            if not sentence:
                continue
            
            if char_count + len(sentence) > max_chars:
                # Add partial sentence and break
                remaining = max_chars - char_count
                if remaining > 50:  # Only add if meaningful length remains
                    preview_parts.append(sentence[:remaining].strip() + '...')
                break
            
            preview_parts.append(sentence + '.')
            char_count += len(sentence) + 1
            
            if char_count >= max_chars:
                break
        
        preview = ' '.join(preview_parts).strip()
        
        # Fallback to simple truncation if sentence parsing failed
        if not preview or len(preview) < 50:
            preview = body[:max_chars].strip()
            if len(body) > max_chars:
                preview += '...'
        
        return preview
    
    def save_draft(self, message: Dict, draft_response: str):
        """
        Save draft response for approval
        
        Args:
            message: Original message object
            draft_response: Generated response text
        """
        timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
        channel = message.get('channel', 'email')
        sender = message.get('from', 'unknown').replace('@', '-at-').replace('.', '-')
        
        filename = f"{timestamp}-{channel}-{sender}-DRAFT.md"
        filepath = self.drafts_path / filename
        
        content = f"""---
date_created: {datetime.now().isoformat()}
channel: {channel}
original_from: {message.get('from', 'unknown')}
original_subject: {message.get('subject', 'N/A')}
status: pending_approval
---

# DRAFT: Response to {message.get('subject', 'Message')}

## 📨 Original Message
**From:** {message.get('from_name', message.get('from', 'Unknown'))}  
**Subject:** {message.get('subject', 'N/A')}  
**Date:** {message.get('timestamp', 'N/A')}

### Original Content:
```
{message.get('body', 'No content')[:500]}...
```

## ✍️ Draft Response

{draft_response}

## 🎯 Actions

- [ ] Review and edit draft
- [ ] Approve and send
- [ ] Request revisions
- [ ] Discard

## 📋 Send Instructions

**To send this draft:**
1. Review and edit above
2. Run: `python send_approved_draft.py {filepath.name}`
3. Or manually copy to email client

---
*Generated by Agent-Communications*
*Awaiting human approval*
"""
        
        filepath.write_text(content, encoding='utf-8')
        print(f"✅ Saved draft: {filepath.name}")
        return str(filepath)
    
    def _get_priority_messages(self, *args) -> List[Dict]:
        """Get all messages with priority >= 70"""
        priority = []
        for msg_list in args:
            priority.extend([m for m in msg_list if m.get('priority_score', 0) >= 70])
        
        # Sort by priority score descending
        priority.sort(key=lambda x: x.get('priority_score', 0), reverse=True)
        return priority
    
    def _format_priority_table(self, messages: List[Dict]) -> str:
        """Format priority messages as markdown table"""
        if not messages:
            return "_No priority responses needed_ ✅"
        
        table = "| Channel | From | Topic | Priority | Due | Status |\n"
        table += "|---------|------|-------|----------|-----|--------|\n"
        
        for msg in messages[:10]:  # Top 10
            channel = msg.get('channel', 'unknown')
            from_name = msg.get('from_name', msg.get('from', 'Unknown'))[:30]
            subject = msg.get('subject', 'N/A')[:40]
            priority = f"{self._priority_emoji(msg.get('priority_score', 0))} {msg.get('priority_score', 0)}"
            due = msg.get('response_due', 'N/A')
            status = msg.get('status', 'unread')
            
            table += f"| {channel} | {from_name} | {subject} | {priority} | {due} | {status} |\n"
        
        return table
    
    def _format_active_conversations(self, *args) -> str:
        """Format active conversations list"""
        all_messages = []
        for msg_list in args:
            all_messages.extend(msg_list)
        
        if not all_messages:
            return "_No active conversations_"
        
        lines = []
        for msg in all_messages[:10]:  # Top 10
            channel = msg.get('channel', 'unknown')
            from_name = msg.get('from_name', msg.get('from', 'Unknown'))
            subject = msg.get('subject', 'Message')[:50]
            priority = self._priority_emoji(msg.get('priority_score', 0))
            
            lines.append(f"- {priority} [{channel.upper()}] {from_name}: {subject}")
        
        return '\n'.join(lines)
    
    def _priority_emoji(self, score: int) -> str:
        """Convert priority score to emoji"""
        if score >= 70:
            return "🔴"
        elif score >= 40:
            return "🟡"
        else:
            return "🟢"
    
    def _format_action_items(self, items: List[str]) -> str:
        """Format action items as checklist"""
        if not items:
            return "_No action items extracted_"
        
        return '\n'.join([f"- [ ] {item}" for item in items])
    
    def _calculate_response_rate(self, chatbot_messages: List[Dict]) -> int:
        """Calculate chatbot response rate"""
        if not chatbot_messages:
            return 100
        
        responded = len([m for m in chatbot_messages if m.get('responded', False)])
        return int((responded / len(chatbot_messages)) * 100)
    
    def _get_completed_today(self) -> str:
        """Get today's completed items (placeholder)"""
        return "_Tracking in development_"
    
    def _get_next_check_time(self) -> str:
        """Calculate next check time"""
        from datetime import timedelta
        next_check = datetime.now() + timedelta(minutes=30)
        return next_check.strftime('%H:%M')


def test_obsidian_integration():
    """Test Obsidian integration"""
    print("🧪 Testing Obsidian Updater...")
    
    updater = ObsidianUpdater()
    
    # Test with sample email
    sample_email = {
        'id': 'test123',
        'channel': 'email',
        'from': 'test@example.com',
        'from_name': 'Test Sender',
        'subject': 'Test Email for Agent-Communications',
        'body': 'This is a test email to verify Obsidian integration.',
        'timestamp': datetime.now().isoformat(),
        'status': 'unread',
        'priority_score': 75,
        'response_due': '2025-10-31T12:00:00',
        'project_link': '[[C3 Alliance]]',
        'action_items': ['Review test', 'Confirm integration']
    }
    
    # Update dashboard
    updater.update_dashboard([sample_email])
    
    # Save conversation
    updater.save_conversation(sample_email, 'email')
    
    # Save draft
    draft = "Thanks for reaching out! I'll review this and get back to you shortly."
    updater.save_draft(sample_email, draft)
    
    print("✅ Obsidian integration test complete!")
    print(f"📂 Check: {updater.comms_path}")


if __name__ == "__main__":
    test_obsidian_integration()
