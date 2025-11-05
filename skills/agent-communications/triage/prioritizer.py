"""
Message Prioritizer - Triage System
Scores messages based on urgency, sender, timing, and project context
Enhanced with Discord-specific scoring
"""

import re
from datetime import datetime, timedelta
from typing import Dict, List
import os
from dotenv import load_dotenv

load_dotenv()


class MessagePrioritizer:
    """Score and prioritize incoming messages"""
    
    # Urgency keywords and their weights
    URGENCY_KEYWORDS = {
        'urgent': 40,
        'asap': 40,
        'critical': 40,
        'emergency': 40,
        'immediately': 35,
        'important': 30,
        'deadline': 30,
        'time-sensitive': 30,
        'priority': 25,
        'soon': 20,
        'quick': 15,
        'fyi': -10,  # Negative weight for low priority
        'no rush': -15
    }
    
    # Important sender domains/addresses
    VIP_SENDERS = [
        '@plausiblepotentials.com',  # Internal team
        # Add client/stakeholder domains here
    ]
    
    # Project keywords for context matching
    PROJECT_KEYWORDS = {
        'c3 alliance': 'C3 Alliance',
        'c3alliance': 'C3 Alliance',
        'plausible potentials': 'PlausiblePotentials',
        'cocoa': 'CoCoA',
        'cooperative': 'C3 Alliance',
        'e2c': 'C3 Alliance',
        'exit to cooperative': 'C3 Alliance'
    }
    
    def __init__(self):
        self.email_sla_hours = int(os.getenv('EMAIL_SLA_HOURS', 24))
        self.telegram_sla_hours = int(os.getenv('TELEGRAM_SLA_HOURS', 4))
        self.discord_sla_hours = int(os.getenv('DISCORD_SLA_HOURS', 8))
        self.chatbot_sla_hours = int(os.getenv('CHATBOT_SLA_HOURS', 1))
    
    def score_message(self, message: Dict) -> Dict:
        """
        Calculate priority score for a message
        
        Args:
            message: Message object with channel, from, subject, body, timestamp
            
        Returns:
            Updated message with priority_score, response_due, project_link
        """
        score = 0
        
        # 1. Urgency keywords in subject/body (max 40 points)
        urgency_score = self._score_urgency(message)
        score += urgency_score
        
        # 2. Sender importance (max 30 points)
        sender_score = self._score_sender(message)
        score += sender_score
        
        # 3. Time since received (max 20 points)
        time_score = self._score_time(message)
        score += time_score
        
        # 4. Project context (max 10 points)
        project_score, project_link = self._score_project(message)
        score += project_score
        
        # 5. Channel-specific bonuses
        if message.get('channel') == 'discord':
            discord_bonus = self._score_discord_specifics(message)
            score += discord_bonus
        elif message.get('channel') == 'telegram':
            telegram_bonus = self._score_telegram_specifics(message)
            score += telegram_bonus
        
        # Ensure score is 0-100
        score = max(0, min(100, score))
        
        # Calculate response due time based on channel SLA
        response_due = self._calculate_response_due(message, score)
        
        # Update message
        message['priority_score'] = score
        message['response_due'] = response_due
        message['project_link'] = project_link
        
        # Add priority label
        message['priority_label'] = self._get_priority_label(score)
        
        return message
    
    def _score_urgency(self, message: Dict) -> int:
        """Score based on urgency keywords"""
        text = f"{message.get('subject', '')} {message.get('body', '')}".lower()
        
        score = 0
        for keyword, weight in self.URGENCY_KEYWORDS.items():
            if keyword in text:
                score += weight
        
        # Cap at 40
        return min(40, score)
    
    def _score_sender(self, message: Dict) -> int:
        """Score based on sender importance"""
        sender = message.get('from', '').lower()
        
        # Check VIP list
        for vip in self.VIP_SENDERS:
            if vip.lower() in sender:
                return 30  # VIP sender
        
        # Check if it's an external domain (potentially client)
        if '@' in sender:
            domain = sender.split('@')[1] if '@' in sender else ''
            
            # Common free email providers = lower priority
            free_providers = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com']
            if domain in free_providers:
                return 10  # Individual sender
            else:
                return 20  # Business email (potential client)
        
        return 15  # Default
    
    def _score_time(self, message: Dict) -> int:
        """Score based on time since received (older = higher priority)"""
        try:
            timestamp_str = message.get('timestamp', '')
            if not timestamp_str:
                return 0
            
            # Parse timestamp
            msg_time = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
            now = datetime.now(msg_time.tzinfo) if msg_time.tzinfo else datetime.now()
            
            # Calculate hours old
            hours_old = (now - msg_time).total_seconds() / 3600
            
            # Score: 1 point per hour, max 20
            return min(20, int(hours_old))
            
        except Exception as e:
            print(f"⚠️ Error calculating time score: {e}")
            return 0
    
    def _score_project(self, message: Dict) -> tuple:
        """
        Score based on project context and extract project link
        
        Returns:
            (score, project_link)
        """
        text = f"{message.get('subject', '')} {message.get('body', '')}".lower()
        
        for keyword, project in self.PROJECT_KEYWORDS.items():
            if keyword in text:
                return (10, f"[[{project}]]")
        
        return (0, None)
    
    def _score_discord_specifics(self, message: Dict) -> int:
        """
        Discord-specific scoring bonuses
        
        Bonuses:
        - @mention: +15 points (direct mention)
        - DM: +20 points (private message)
        - Question: +10 points (needs answer)
        - Multiple reactions: +5 points (community interest)
        """
        bonus = 0
        
        # Direct mention bonus
        if message.get('is_mention'):
            bonus += 15
        
        # DM bonus (highest priority for Discord)
        if message.get('is_dm'):
            bonus += 20
        
        # Question bonus
        if message.get('is_question'):
            bonus += 10
        
        # Community interest bonus (reactions)
        reaction_count = message.get('reaction_count', 0)
        if reaction_count >= 3:
            bonus += 5
        
        return bonus
    
    def _score_telegram_specifics(self, message: Dict) -> int:
        """
        Telegram-specific scoring bonuses
        
        Bonuses:
        - DM to bot: +25 points (all bot messages are DMs)
        - Question: +10 points (needs answer)
        - Media attachment: +5 points (needs review)
        - Forwarded message: +15 points (you deemed important)
        """
        bonus = 0
        
        # All messages to bot are effectively DMs
        if message.get('is_dm'):
            bonus += 25
        
        # Question bonus
        if message.get('is_question'):
            bonus += 10
        
        # Media requires attention
        if message.get('has_media'):
            bonus += 5
        
        # Forwarded messages (you deemed important enough to forward)
        if message.get('is_forwarded'):
            bonus += 15
        
        return bonus
    
    def _calculate_response_due(self, message: Dict, priority_score: int) -> str:
        """Calculate when response is due based on channel SLA and priority"""
        channel = message.get('channel', 'email')
        
        # Get base SLA
        sla_map = {
            'email': self.email_sla_hours,
            'telegram': self.telegram_sla_hours,
            'discord': self.discord_sla_hours,
            'chatbot': self.chatbot_sla_hours
        }
        
        base_sla = sla_map.get(channel, 24)
        
        # Adjust SLA based on priority
        if priority_score >= 70:
            # High priority: halve the SLA
            adjusted_sla = base_sla / 2
        elif priority_score >= 40:
            # Medium priority: use base SLA
            adjusted_sla = base_sla
        else:
            # Low priority: extend SLA by 50%
            adjusted_sla = base_sla * 1.5
        
        # Calculate due time
        try:
            timestamp_str = message.get('timestamp', '')
            if timestamp_str:
                msg_time = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
            else:
                msg_time = datetime.now()
            
            due_time = msg_time + timedelta(hours=adjusted_sla)
            return due_time.strftime('%Y-%m-%d %H:%M')
            
        except:
            # Fallback
            due_time = datetime.now() + timedelta(hours=adjusted_sla)
            return due_time.strftime('%Y-%m-%d %H:%M')
    
    def _get_priority_label(self, score: int) -> str:
        """Convert score to priority label"""
        if score >= 70:
            return "HIGH"
        elif score >= 40:
            return "MEDIUM"
        else:
            return "LOW"
    
    def extract_action_items(self, message: Dict) -> List[str]:
        """
        Extract potential action items from message
        
        Looks for:
        - Bullet points
        - Numbered lists
        - "Please [action]" patterns
        - Question marks (potential questions to answer)
        """
        body = message.get('body', '')
        action_items = []
        
        # Pattern 1: Explicit action requests
        action_patterns = [
            r'please\s+([^.!?\n]+)',
            r'can you\s+([^.!?\n]+)',
            r'could you\s+([^.!?\n]+)',
            r'would you\s+([^.!?\n]+)',
            r'need you to\s+([^.!?\n]+)'
        ]
        
        for pattern in action_patterns:
            matches = re.findall(pattern, body, re.IGNORECASE)
            for match in matches:
                action_items.append(match.strip().capitalize())
        
        # Pattern 2: Questions
        questions = re.findall(r'([^.!?\n]*\?)', body)
        for question in questions[:3]:  # Limit to first 3 questions
            if len(question.strip()) > 10:  # Ignore very short questions
                action_items.append(f"Answer: {question.strip()}")
        
        # Pattern 3: Bullet points or numbered lists
        bullet_pattern = r'^[\s]*[-•*]\s*(.+)$'
        numbered_pattern = r'^[\s]*\d+\.\s*(.+)$'
        
        for line in body.split('\n'):
            bullet_match = re.match(bullet_pattern, line)
            numbered_match = re.match(numbered_pattern, line)
            
            if bullet_match:
                action_items.append(bullet_match.group(1).strip())
            elif numbered_match:
                action_items.append(numbered_match.group(1).strip())
        
        # Deduplicate and limit
        action_items = list(dict.fromkeys(action_items))  # Remove duplicates
        return action_items[:5]  # Limit to 5 action items


def test_prioritizer():
    """Test message prioritizer with Discord examples"""
    print("🧪 Testing Message Prioritizer (with Discord)...")
    
    prioritizer = MessagePrioritizer()
    
    # Test messages
    test_messages = [
        {
            'channel': 'email',
            'from': 'client@business.com',
            'subject': 'URGENT: C3 Alliance proposal needed ASAP',
            'body': 'We need the proposal by end of day. Please send details.',
            'timestamp': (datetime.now() - timedelta(hours=3)).isoformat()
        },
        {
            'channel': 'discord',
            'from': 'CommunityMember#1234',
            'from_name': 'CommunityMember',
            'subject': 'Discord: #general - @mention',
            'body': 'Hey @JW, quick question about C3 Alliance - how does the cooperative model work?',
            'timestamp': datetime.now().isoformat(),
            'is_mention': True,
            'is_dm': False,
            'is_question': True,
            'reaction_count': 2
        },
        {
            'channel': 'discord',
            'from': 'NewMember#5678',
            'from_name': 'NewMember',
            'subject': 'Discord: DM',
            'body': 'Hi! I saw your project and I\'d love to discuss collaboration opportunities.',
            'timestamp': (datetime.now() - timedelta(hours=1)).isoformat(),
            'is_mention': False,
            'is_dm': True,
            'is_question': False,
            'reaction_count': 0
        },
        {
            'channel': 'discord',
            'from': 'RegularUser#9999',
            'from_name': 'RegularUser',
            'subject': 'Discord: #general',
            'body': 'Just sharing some thoughts on Web3...',
            'timestamp': (datetime.now() - timedelta(hours=12)).isoformat(),
            'is_mention': False,
            'is_dm': False,
            'is_question': False,
            'reaction_count': 5
        }
    ]
    
    for msg in test_messages:
        scored = prioritizer.score_message(msg.copy())
        channel_emoji = "📧" if scored['channel'] == 'email' else "💬"
        print(f"\n{channel_emoji} Message: {scored.get('subject', 'No subject')}")
        print(f"  Channel: {scored['channel']}")
        print(f"  Priority: {scored['priority_label']} ({scored['priority_score']}/100)")
        print(f"  Response due: {scored['response_due']}")
        print(f"  Project: {scored.get('project_link', 'None')}")
        
        # Discord-specific info
        if scored['channel'] == 'discord':
            if scored.get('is_mention'):
                print(f"  ⚠️ MENTIONS YOU!")
            if scored.get('is_dm'):
                print(f"  📩 DIRECT MESSAGE!")
            if scored.get('is_question'):
                print(f"  ❓ Contains question")
        
        # Extract action items
        actions = prioritizer.extract_action_items(scored)
        if actions:
            print(f"  Action items: {len(actions)}")
            for action in actions:
                print(f"    - {action}")
    
    print("\n✅ Prioritizer test complete!")


if __name__ == "__main__":
    test_prioritizer()
