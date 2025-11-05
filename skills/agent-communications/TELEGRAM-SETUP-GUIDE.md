# Telegram Bot Setup Guide

## Phase 2C: Telegram Integration Complete! ✅

This guide shows you how to set up your Telegram bot for Agent-Communications v1.2.

## Prerequisites

- Telegram account
- Python 3.x installed
- Agent-Communications v1.2 code (already installed)

## Step 1: Install Dependencies

```bash
cd D:\Claude-MCP-Files\agent-communications
pip install -r requirements.txt
```

This will install `python-telegram-bot==20.7` along with other dependencies.

## Step 2: Create Telegram Bot

### A. Open Telegram and find @BotFather

1. Open Telegram (desktop or mobile)
2. Search for `@BotFather` (verified account with blue checkmark)
3. Start a conversation

### B. Create your bot

Send this command to @BotFather:
```
/newbot
```

BotFather will ask you two questions:

**1. Bot name** (display name, can have spaces):
```
JW Communications Agent
```
Or any name you prefer.

**2. Bot username** (must end with _bot, no spaces):
```
jw_comms_bot
```
Or any unique username ending in `_bot`.

### C. Save your bot token

@BotFather will respond with:
```
Done! Congratulations on your new bot.
Token: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

**COPY THIS TOKEN** - you'll need it in Step 3.

## Step 3: Configure Bot Settings

### A. Disable privacy mode (allows bot to read messages)

Send to @BotFather:
```
/setprivacy
```

1. Select your bot from the list
2. Choose **Disable**

This allows your bot to read messages sent to it.

### B. (Optional) Add bot description

Send to @BotFather:
```
/setdescription
```

Select your bot and add:
```
JW's personal communications agent for monitoring work messages.
```

## Step 4: Update .env File

Open `D:\Claude-MCP-Files\agent-communications\.env`

Add these lines at the end:

```bash
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_actual_token_here
TELEGRAM_SLA_HOURS=4
TELEGRAM_CHECK_INTERVAL_SECONDS=900
```

**Replace `your_actual_token_here` with the token from Step 2C.**

Example:
```bash
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_SLA_HOURS=4
TELEGRAM_CHECK_INTERVAL_SECONDS=900
```

## Step 5: Start Conversation with Your Bot

1. In Telegram, search for your bot's username (e.g., `@jw_comms_bot`)
2. Click **START** button
3. Send a test message: `Hello bot!`

This initializes the conversation and allows your bot to see messages.

## Step 6: Test the Integration

### Test 1: Telegram Monitor Only

```bash
cd D:\Claude-MCP-Files\agent-communications
python monitors/telegram_monitor.py
```

**Expected output:**
```
🧪 Testing Telegram Monitor...
✅ Connected to Telegram as @jw_comms_bot
   Bot name: JW Communications Agent
   Bot ID: 1234567890

📱 Fetching Telegram messages (last 24 hours)...
   Retrieved 1 update(s) from Telegram
   Found 1 message(s) in timeframe

============================================================
RESULTS
============================================================

📨 Recent Messages (1 found):

  1. Telegram: DM from Your Name
     From: Your Name (@yourhandle)
     Time: 2025-10-30T14:30:00+00:00
     Message: Hello bot!...

✅ Test complete!
```

### Test 2: Full System (All 3 Channels)

```bash
python orchestrator.py
```

**Expected output:**
```
╔══════════════════════════════════════════════════════════╗
║      AGENT-COMMUNICATIONS v1.2 (3-Channel)               ║
║      Email + Discord + Telegram Monitor                  ║
╚══════════════════════════════════════════════════════════╝

🤖 Agent-Communications v1.2 initialized
📧 Email: Proton Bridge (team@plausiblepotentials.com)
💬 Discord: Plausible_Potentials server
✈️ Telegram: Bot integration
📂 Obsidian: C:\PlausiblePotentials-Files\...

============================================================
🔄 Starting communications check: 2025-10-30 14:35:00
============================================================

📧 Checking Proton Mail...
  ✅ Found 2 unread email(s)

💬 Checking Discord...
  ✅ Found 0 Discord message(s)

✈️ Checking Telegram...
  ✅ Found 1 Telegram message(s)

🎯 Triaging 3 message(s)...
  🔴 📧 [HIGH] URGENT: C3 Alliance proposal
  🟡 ✈️ [MEDIUM] Telegram: DM from Your Name
  🟢 📧 [LOW] Newsletter subscription

📊 Updating Obsidian dashboard...
  ✅ Dashboard updated

💾 Saving conversations...
  📝 Saving 1 high-priority conversation(s)...
    ✅ 📧 Saved: URGENT: C3 Alliance proposal

📋 Summary:
  Total messages: 3
    📧 Email: 2
    💬 Discord: 0
    ✈️ Telegram: 1

  🔴 High priority: 1
  🟡 Medium priority: 1
  🟢 Low priority: 1

  Top priorities:
    1. 🔴 📧 URGENT: C3 Alliance proposal
       From: client@business.com
       Due: 2025-10-30 18:00
    2. 🟡 ✈️ Telegram: DM from Your Name
       From: Your Name
       Due: 2025-10-30 17:00

============================================================
✅ Check complete: 14:35:05
============================================================
```

## How to Use Your Telegram Bot

### For Direct Messages

Send messages directly to your bot:
```
@jw_comms_bot What's the status of C3 Alliance?
```

Your bot will see these messages and Agent-Communications will triage them.

### For Forwarding Messages

1. In any Telegram chat, long-press a message
2. Select **Forward**
3. Choose your bot
4. Message is forwarded and detected as high priority (forwarded = important)

### Message Priority Scoring

Your bot automatically scores messages:

- **DM to bot**: +25 points (all messages to bot are DMs)
- **Question**: +10 points (contains ?, how, what, when, etc.)
- **Media attachment**: +5 points (photo, document, video)
- **Forwarded message**: +15 points (you deemed important)

**Examples:**
- "Quick question about C3 Alliance?" → MEDIUM (25 DM + 10 question = 35)
- Forwarded urgent message → HIGH (25 DM + 15 forwarded = 40+)
- "Here's the document" + PDF → MEDIUM (25 DM + 5 media = 30)

## Telegram-Specific Features

Your Telegram integration includes:

✅ Direct message detection  
✅ Question pattern recognition  
✅ Media attachment tracking (photo, document, video, audio)  
✅ Forwarded message detection (with original chat name)  
✅ 2-4 hour SLA (configurable)  
✅ Integration with Email + Discord in unified dashboard  

## Troubleshooting

### "TELEGRAM_BOT_TOKEN not found in .env"

**Solution:** Make sure you added the token to `.env` file (Step 4).

### "No recent messages found"

**Solution:** 
1. Verify you pressed START button in bot conversation
2. Send a new test message
3. Run the test again

### "Error checking Telegram: ..."

**Solution:**
1. Check your bot token is correct in `.env`
2. Verify bot is not deleted in @BotFather
3. Check internet connection

### Bot doesn't see messages in groups

**Solution:** 
- Bot API can only see messages sent TO the bot
- Either mention the bot in group: `@jw_comms_bot your message`
- Or forward important group messages to the bot

## Security Notes

✅ **Bot token security:**
- Never commit `.env` to Git (already in .gitignore)
- Token gives access to your bot only, not your Telegram account
- Revoke/regenerate anytime via @BotFather with `/revoke`

✅ **Message access:**
- Bot only sees messages sent TO the bot
- Bot cannot see your other Telegram conversations
- Bot cannot access your phone number or contacts

## Next Steps

✅ Phase 2C Complete! You now have 3-channel monitoring.

**Recommended:**
1. Send a few test messages to your bot
2. Run `python orchestrator.py` to see full integration
3. Check Obsidian dashboard for updated metrics
4. Forward an important Telegram message to test forwarding feature

**Future enhancements:**
- Add more scoring keywords for your projects
- Set up scheduled monitoring (cron/Task Scheduler)
- Add custom command handlers to bot
- Integrate with CoCoA morning routine

---

**Questions?** Check the main README or Phase 2C starter prompt for architecture details.
