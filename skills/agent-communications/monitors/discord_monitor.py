"""
Discord Monitor - Community Intelligence & Message Tracking
Monitors Discord server for messages, DMs, mentions, and community activity
"""

import discord
import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class DiscordMonitor:
    """Monitor Discord server for messages and community activity"""
    
    def __init__(self):
        self.token = os.getenv('DISCORD_BOT_TOKEN')
        self.guild_id = int(os.getenv('DISCORD_GUILD_ID'))
        
        # Bot setup with intents
        intents = discord.Intents.default()
        intents.message_content = True  # Read message content
        intents.members = True          # Track member joins/activity
        intents.presences = True        # See online status
        
        self.client = discord.Client(intents=intents)
        self.guild = None
        self.messages_collected = []
        self.stats_collected = {}
        self.activity_collected = {}
        
        # Setup event handlers
        @self.client.event
        async def on_ready():
            print(f"✅ Connected to Discord as {self.client.user}")
            self.guild = self.client.get_guild(self.guild_id)
            
            if self.guild:
                print(f"✅ Found guild: {self.guild.name}")
                print(f"   Members: {self.guild.member_count}")
                print(f"   Channels: {len(self.guild.text_channels)}")
                
                # Collect data
                await self._collect_messages()
                await self._collect_stats()
                await self._collect_activity()
                
            else:
                print(f"❌ Guild {self.guild_id} not found!")
            
            # Close after collecting data
            await self.client.close()
    
    async def _collect_messages(self, hours_back: int = 24):
        """Collect messages from all channels"""
        if not self.guild:
            return
        
        print(f"\n📧 Fetching messages (last {hours_back} hours)...")
        messages = []
        cutoff_time = datetime.utcnow() - timedelta(hours=hours_back)
        
        text_channels = [ch for ch in self.guild.channels if isinstance(ch, discord.TextChannel)]
        print(f"📱 Checking {len(text_channels)} channels...")
        
        for channel in text_channels:
            try:
                async for message in channel.history(limit=50, after=cutoff_time):
                    # Skip bot's own messages
                    if message.author.id == self.client.user.id:
                        continue
                    
                    # Check if message mentions server owner (you)
                    is_mention = any(mention.id == self.guild.owner_id for mention in message.mentions)
                    
                    # Parse message
                    msg_data = self._parse_message(message, channel, is_mention)
                    messages.append(msg_data)
                    
            except discord.Forbidden:
                print(f"  ⚠️ No access to #{channel.name}")
            except Exception as e:
                print(f"  ❌ Error reading #{channel.name}: {e}")
        
        # Sort by timestamp
        messages.sort(key=lambda x: x['timestamp'], reverse=True)
        self.messages_collected = messages
        
        print(f"  Found {len(messages)} message(s)")
    
    def _parse_message(self, message: discord.Message, channel, is_mention: bool = False) -> Dict:
        """Parse Discord message into standard format"""
        
        # Determine if this is a question
        is_question = any(q in message.content.lower() for q in ['?', 'how', 'what', 'when', 'where', 'why', 'who', 'can you', 'could you'])
        
        # Build message object
        msg_data = {
            'id': str(message.id),
            'channel': 'discord',
            'channel_name': channel.name,
            'from': str(message.author),
            'from_name': message.author.display_name,
            'from_id': str(message.author.id),
            'subject': f"Discord: #{channel.name}" + (" - @mention" if is_mention else ""),
            'body': message.content,
            'timestamp': message.created_at.isoformat(),
            'status': 'unread',
            'priority_score': 0,
            'response_due': None,
            'project_link': None,
            'action_items': [],
            
            # Discord-specific
            'is_mention': is_mention,
            'is_question': is_question,
            'has_attachments': len(message.attachments) > 0,
            'attachment_count': len(message.attachments),
            'reaction_count': len(message.reactions),
            'jump_url': message.jump_url,
            
            # Community tracking
            'author_roles': [role.name for role in message.author.roles] if hasattr(message.author, 'roles') else [],
            'author_joined': message.author.joined_at.isoformat() if hasattr(message.author, 'joined_at') else None,
        }
        
        return msg_data
    
    async def _collect_stats(self):
        """Collect community statistics"""
        if not self.guild:
            return
        
        print(f"\n📊 Collecting community stats...")
        
        stats = {
            'total_members': self.guild.member_count,
            'online_members': len([m for m in self.guild.members if m.status != discord.Status.offline]),
            'total_channels': len(self.guild.text_channels),
            'created_at': self.guild.created_at.isoformat(),
            'member_list': []
        }
        
        # Get member info
        for member in list(self.guild.members)[:20]:
            if not member.bot:
                stats['member_list'].append({
                    'name': member.display_name,
                    'username': str(member),
                    'id': str(member.id),
                    'status': str(member.status),
                    'joined': member.joined_at.isoformat() if member.joined_at else None,
                    'roles': [role.name for role in member.roles if role.name != "@everyone"]
                })
        
        self.stats_collected = stats
        print(f"  Total Members: {stats['total_members']}")
        print(f"  Online: {stats['online_members']}")
    
    async def _collect_activity(self, hours_back: int = 24):
        """Collect channel activity"""
        if not self.guild:
            return
        
        print(f"\n📈 Collecting channel activity...")
        
        activity = {}
        cutoff_time = datetime.utcnow() - timedelta(hours=hours_back)
        
        for channel in self.guild.text_channels:
            try:
                message_count = 0
                async for _ in channel.history(limit=100, after=cutoff_time):
                    message_count += 1
                
                activity[channel.name] = {
                    'message_count': message_count,
                    'channel_id': str(channel.id)
                }
                
            except discord.Forbidden:
                pass
        
        self.activity_collected = activity
    
    def get_new_messages(self, hours_back: int = 24) -> List[Dict]:
        """Get collected messages - call this after run()"""
        return self.messages_collected
    
    def get_community_stats(self) -> Dict:
        """Get collected stats - call this after run()"""
        return self.stats_collected
    
    def get_channel_activity(self, hours_back: int = 24) -> Dict:
        """Get collected activity - call this after run()"""
        return self.activity_collected
    
    def run(self):
        """Run the bot and collect data"""
        try:
            self.client.run(self.token)
        except Exception as e:
            print(f"❌ Error: {e}")


def test_connection():
    """Test Discord bot connection and fetch messages"""
    print("🧪 Testing Discord Monitor...")
    
    monitor = DiscordMonitor()
    monitor.run()
    
    # After run completes, data is collected
    print("\n" + "="*60)
    print("RESULTS")
    print("="*60)
    
    # Show stats
    stats = monitor.get_community_stats()
    if stats:
        print(f"\n📊 Community Stats:")
        print(f"  Total Members: {stats.get('total_members', 0)}")
        print(f"  Online: {stats.get('online_members', 0)}")
        print(f"  Channels: {stats.get('total_channels', 0)}")
    
    # Show messages
    messages = monitor.get_new_messages()
    if messages:
        print(f"\n📨 Recent Messages ({len(messages)} found):")
        for i, msg in enumerate(messages[:3], 1):
            print(f"\n  {i}. Channel: #{msg['channel_name']}")
            print(f"     From: {msg['from_name']}")
            print(f"     Message: {msg['body'][:100]}...")
            print(f"     Link: {msg['jump_url']}")
            if msg['is_mention']:
                print(f"     ⚠️ MENTIONS YOU!")
            if msg['is_question']:
                print(f"     ❓ Looks like a question")
    else:
        print("\n  No recent messages found")
    
    # Show activity
    activity = monitor.get_channel_activity()
    if activity:
        print(f"\n📈 Channel Activity (last 24h):")
        for channel_name, data in activity.items():
            print(f"  #{channel_name}: {data['message_count']} messages")
    
    print("\n✅ Test complete!")


if __name__ == "__main__":
    test_connection()
