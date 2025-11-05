"""
Telegram Monitor - Bot-based Message Tracking
Monitors Telegram messages sent to bot (direct messages or forwarded)
"""

import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from dotenv import load_dotenv
import asyncio

# Telegram imports
from telegram import Bot, Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters

# Load environment variables
load_dotenv()


class TelegramMonitor:
    """Monitor Telegram messages via bot"""
    
    def __init__(self):
        self.token = os.getenv('TELEGRAM_BOT_TOKEN')
        
        if not self.token:
            raise ValueError("TELEGRAM_BOT_TOKEN not found in .env")
        
        self.bot = None
        self.application = None
        self.messages_collected = []
        self.bot_info = None
    
    async def _initialize(self):
        """Initialize bot and application"""
        # Create bot instance
        self.bot = Bot(token=self.token)
        
        # Get bot info
        self.bot_info = await self.bot.get_me()
        print(f"✅ Connected to Telegram as @{self.bot_info.username}")
        print(f"   Bot name: {self.bot_info.first_name}")
        print(f"   Bot ID: {self.bot_info.id}")
    
    async def _collect_messages(self, hours_back: int = 24):
        """
        Collect messages from last N hours
        
        Note: Telegram Bot API only provides updates (new messages since last check)
        We'll fetch recent updates and filter by time
        """
        print(f"\n📱 Fetching Telegram messages (last {hours_back} hours)...")
        
        cutoff_time = datetime.now() - timedelta(hours=hours_back)
        messages = []
        
        try:
            # Get updates (max 100 recent messages)
            # offset=0 gets all pending updates
            # timeout=10 for long polling
            updates = await self.bot.get_updates(limit=100, timeout=10)
            
            print(f"   Retrieved {len(updates)} update(s) from Telegram")
            
            for update in updates:
                # Check if update has a message
                if not update.message:
                    continue
                
                message = update.message
                
                # Filter by time
                msg_time = message.date
                if msg_time < cutoff_time:
                    continue
                
                # Parse message
                msg_data = self._parse_message(message)
                messages.append(msg_data)
            
            # Sort by timestamp
            messages.sort(key=lambda x: x['timestamp'], reverse=True)
            self.messages_collected = messages
            
            print(f"   Found {len(messages)} message(s) in timeframe")
            
        except Exception as e:
            print(f"   ❌ Error fetching messages: {e}")
            import traceback
            traceback.print_exc()
    
    def _parse_message(self, message) -> Dict:
        """Parse Telegram message into standard format"""
        
        # Determine if this is a forwarded message
        is_forwarded = message.forward_date is not None
        original_chat = None
        
        if is_forwarded:
            # Try to get original chat info
            if message.forward_from:
                original_chat = f"{message.forward_from.first_name} {message.forward_from.last_name or ''}".strip()
            elif message.forward_from_chat:
                original_chat = message.forward_from_chat.title or "Unknown chat"
            else:
                original_chat = "Unknown source"
        
        # Get sender info
        sender = message.from_user
        sender_username = sender.username or f"user{sender.id}"
        sender_name = f"{sender.first_name} {sender.last_name or ''}".strip()
        
        # Get message text
        body = message.text or message.caption or "[Non-text message]"
        
        # Determine if this is a question
        is_question = any(q in body.lower() for q in ['?', 'how', 'what', 'when', 'where', 'why', 'who', 'can you', 'could you', 'would you'])
        
        # Check for media
        has_media = False
        media_type = None
        
        if message.photo:
            has_media = True
            media_type = 'photo'
        elif message.document:
            has_media = True
            media_type = 'document'
        elif message.video:
            has_media = True
            media_type = 'video'
        elif message.audio:
            has_media = True
            media_type = 'audio'
        elif message.voice:
            has_media = True
            media_type = 'voice'
        elif message.sticker:
            has_media = True
            media_type = 'sticker'
        
        # Build subject line
        if is_forwarded:
            subject = f"Telegram: Forwarded from {original_chat}"
        else:
            subject = f"Telegram: DM from {sender_name}"
        
        # Build message object
        msg_data = {
            'id': str(message.message_id),
            'channel': 'telegram',
            'from': f"@{sender_username}",
            'from_name': sender_name,
            'from_id': str(sender.id),
            'subject': subject,
            'body': body,
            'timestamp': message.date.isoformat(),
            'status': 'unread',
            'priority_score': 0,
            'response_due': None,
            'project_link': None,
            'action_items': [],
            
            # Telegram-specific
            'is_dm': True,  # All bot messages are effectively DMs
            'is_question': is_question,
            'has_media': has_media,
            'media_type': media_type,
            'is_forwarded': is_forwarded,
            'original_chat': original_chat,
            'chat_type': message.chat.type,  # 'private', 'group', 'channel'
        }
        
        return msg_data
    
    def get_new_messages(self, hours_back: int = 24) -> List[Dict]:
        """Get collected messages - call this after run()"""
        return self.messages_collected
    
    def run(self, hours_back: int = 24):
        """Run the monitor and collect data"""
        try:
            # Run async collection
            asyncio.run(self._run_async(hours_back))
        except Exception as e:
            print(f"❌ Error running Telegram monitor: {e}")
            import traceback
            traceback.print_exc()
    
    async def _run_async(self, hours_back: int):
        """Async wrapper for running monitor"""
        await self._initialize()
        await self._collect_messages(hours_back)


def test_connection():
    """Test Telegram bot connection and fetch messages"""
    print("🧪 Testing Telegram Monitor...")
    
    # Check for token
    token = os.getenv('TELEGRAM_BOT_TOKEN')
    if not token:
        print("❌ Error: TELEGRAM_BOT_TOKEN not found in .env")
        print("   Please add: TELEGRAM_BOT_TOKEN=your_token_here")
        return False
    
    monitor = TelegramMonitor()
    monitor.run()
    
    # After run completes, data is collected
    print("\n" + "="*60)
    print("RESULTS")
    print("="*60)
    
    # Show messages
    messages = monitor.get_new_messages()
    if messages:
        print(f"\n📨 Recent Messages ({len(messages)} found):")
        for i, msg in enumerate(messages[:5], 1):
            print(f"\n  {i}. {msg['subject']}")
            print(f"     From: {msg['from_name']} ({msg['from']})")
            print(f"     Time: {msg['timestamp']}")
            print(f"     Message: {msg['body'][:100]}...")
            
            if msg['is_forwarded']:
                print(f"     📨 Forwarded from: {msg['original_chat']}")
            if msg['is_question']:
                print(f"     ❓ Looks like a question")
            if msg['has_media']:
                print(f"     📎 Has {msg['media_type']}")
    else:
        print("\n  No recent messages found")
        print("\n💡 Tips:")
        print("  1. Make sure you've started a conversation with your bot")
        print("  2. Send a test message to your bot")
        print("  3. Or forward a message to your bot")
    
    print("\n✅ Test complete!")
    return True


if __name__ == "__main__":
    test_connection()
