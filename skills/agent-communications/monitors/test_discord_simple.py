"""
Simple Discord Bot Test - Debug Connection Issues
"""

import discord
import os
import asyncio
from dotenv import load_dotenv

load_dotenv()

# Get credentials
token = os.getenv('DISCORD_BOT_TOKEN')
guild_id = int(os.getenv('DISCORD_GUILD_ID'))

print("="*60)
print("Discord Bot Connection Test")
print("="*60)
print(f"Bot Token (first 30 chars): {token[:30]}...")
print(f"Guild ID: {guild_id}")
print("="*60)

# Setup intents
intents = discord.Intents.default()
intents.message_content = True
intents.members = True
intents.presences = True

print("\n✅ Intents configured:")
print(f"   - Message Content: {intents.message_content}")
print(f"   - Members: {intents.members}")
print(f"   - Presences: {intents.presences}")

# Create client
client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f"\n✅ SUCCESS! Connected as: {client.user.name}")
    print(f"   Bot ID: {client.user.id}")
    
    # Get guild
    guild = client.get_guild(guild_id)
    if guild:
        print(f"\n✅ Found your server: {guild.name}")
        print(f"   Members: {guild.member_count}")
        print(f"   Channels: {len(guild.text_channels)} text channels")
        
        # List channels
        print(f"\n📱 Channels:")
        for channel in guild.text_channels:
            print(f"   - #{channel.name}")
    else:
        print(f"\n❌ Could not find guild with ID: {guild_id}")
        print("   Make sure the bot is invited to your server!")
    
    # Close after 3 seconds
    await asyncio.sleep(3)
    await client.close()

print("\n🔌 Attempting to connect...")

try:
    client.run(token)
    print("\n✅ Bot disconnected cleanly")
except discord.errors.PrivilegedIntentsRequired as e:
    print("\n❌ PRIVILEGED INTENTS ERROR!")
    print("   Go to: https://discord.com/developers/applications/")
    print("   Select your app → Bot → Enable all 3 Privileged Gateway Intents")
    print(f"   Error details: {e}")
except discord.errors.LoginFailure:
    print("\n❌ LOGIN FAILED!")
    print("   Your bot token is invalid.")
    print("   Go to Discord Developer Portal and reset your token.")
except Exception as e:
    print(f"\n❌ CONNECTION ERROR: {e}")
    import traceback
    traceback.print_exc()
