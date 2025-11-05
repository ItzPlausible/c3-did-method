"""
List All Discord Servers (Guilds) the Bot Can Access
This will show you the correct Guild ID to use
"""

import discord
import os
import asyncio
from dotenv import load_dotenv

load_dotenv()

token = os.getenv('DISCORD_BOT_TOKEN')

print("="*60)
print("Finding All Discord Servers Your Bot Can Access")
print("="*60)

# Setup intents
intents = discord.Intents.default()
intents.message_content = True
intents.members = True
intents.presences = True

client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f"\n✅ Connected as: {client.user.name}\n")
    
    # List all guilds
    guilds = client.guilds
    
    if not guilds:
        print("❌ Bot is not in any servers!")
        print("   Make sure you invited the bot to your server.")
    else:
        print(f"🏠 Bot is in {len(guilds)} server(s):\n")
        
        for i, guild in enumerate(guilds, 1):
            print(f"{i}. Server Name: {guild.name}")
            print(f"   Guild ID: {guild.id}")
            print(f"   Members: {guild.member_count}")
            print(f"   Owner: {guild.owner}")
            print()
    
    # Close after showing info
    await asyncio.sleep(2)
    await client.close()

try:
    client.run(token)
except Exception as e:
    print(f"❌ Error: {e}")
