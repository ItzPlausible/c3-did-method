"""
Agent-Communications Orchestrator
Main coordination script for multi-channel communications monitoring
"""

import sys
import os
from datetime import datetime
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent))

from monitors.proton_monitor import ProtonEmailMonitor
from monitors.discord_monitor import DiscordMonitor
from monitors.telegram_monitor import TelegramMonitor
from triage.prioritizer import MessagePrioritizer
from trackers.obsidian_updater import ObsidianUpdater
from dotenv import load_dotenv

load_dotenv()


class AgentCommunications:
    """Main orchestrator for communications monitoring"""
    
    def __init__(self):
        self.email_monitor = ProtonEmailMonitor()
        self.discord_monitor = DiscordMonitor()
        self.telegram_monitor = TelegramMonitor()
        self.prioritizer = MessagePrioritizer()
        self.obsidian = ObsidianUpdater()
        
        print("🤖 Agent-Communications v1.2 initialized")
        print(f"📧 Email: Proton Bridge (team@plausiblepotentials.com)")
        print(f"💬 Discord: Plausible_Potentials server")
        print(f"✈️ Telegram: Bot integration")
        print(f"📂 Obsidian: {self.obsidian.comms_path}")
    
    def run_check(self):
        """Run full communications check cycle"""
        print(f"\n{'='*60}")
        print(f"🔄 Starting communications check: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'='*60}\n")
        
        # Step 1: Monitor channels
        emails = self._check_email()
        discord_messages = self._check_discord()
        telegram_messages = self._check_telegram()
        
        # Combine all messages
        all_messages = emails + discord_messages + telegram_messages
        
        # Step 2: Triage and prioritize
        all_messages = self._triage_messages(all_messages)
        
        # Step 3: Update Obsidian
        self._update_tracking(emails, discord_messages, telegram_messages)
        
        # Step 4: Save individual conversations
        self._save_conversations(all_messages)
        
        # Step 5: Summary
        self._print_summary(all_messages, emails, discord_messages, telegram_messages)
        
        print(f"\n{'='*60}")
        print(f"✅ Check complete: {datetime.now().strftime('%H:%M:%S')}")
        print(f"{'='*60}\n")
    
    def _check_email(self):
        """Check Proton email via IMAP"""
        print("📧 Checking Proton Mail...")
        
        try:
            emails = self.email_monitor.get_unread_emails()
            print(f"  ✅ Found {len(emails)} unread email(s)")
            return emails
        except Exception as e:
            print(f"  ❌ Error checking email: {e}")
            return []
    
    def _check_discord(self):
        """Check Discord for new messages"""
        print("\n💬 Checking Discord...")
        
        try:
            # Run Discord monitor (connects, collects data, disconnects)
            self.discord_monitor.run()
            
            # Get collected messages
            messages = self.discord_monitor.get_new_messages()
            
            print(f"  ✅ Found {len(messages)} Discord message(s)")
            return messages
            
        except Exception as e:
            print(f"  ❌ Error checking Discord: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    def _check_telegram(self):
        """Check Telegram for new messages"""
        print("\n✈️ Checking Telegram...")
        
        try:
            # Run Telegram monitor (connects, collects data, disconnects)
            self.telegram_monitor.run()
            
            # Get collected messages
            messages = self.telegram_monitor.get_new_messages()
            
            print(f"  ✅ Found {len(messages)} Telegram message(s)")
            return messages
            
        except Exception as e:
            print(f"  ❌ Error checking Telegram: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    def _triage_messages(self, messages):
        """Score and prioritize messages"""
        if not messages:
            return []
        
        print(f"\n🎯 Triaging {len(messages)} message(s)...")
        
        scored_messages = []
        for msg in messages:
            try:
                scored = self.prioritizer.score_message(msg)
                
                # Extract action items
                actions = self.prioritizer.extract_action_items(scored)
                scored['action_items'] = actions
                
                scored_messages.append(scored)
                
                # Print triage result
                priority_emoji = self._get_priority_emoji(scored['priority_score'])
                channel_emoji = "📧" if scored['channel'] == 'email' else "💬"
                print(f"  {priority_emoji} {channel_emoji} [{scored['priority_label']}] {scored.get('subject', 'No subject')[:50]}")
                
            except Exception as e:
                print(f"  ❌ Error triaging message: {e}")
                scored_messages.append(msg)
        
        # Sort by priority
        scored_messages.sort(key=lambda x: x.get('priority_score', 0), reverse=True)
        
        return scored_messages
    
    def _update_tracking(self, emails, discord_messages, telegram_messages):
        """Update Obsidian dashboard"""
        print(f"\n📊 Updating Obsidian dashboard...")
        
        try:
            self.obsidian.update_dashboard(
                emails=emails,
                telegram=telegram_messages,
                discord=discord_messages,
                chatbot=[]
            )
            print(f"  ✅ Dashboard updated")
        except Exception as e:
            print(f"  ❌ Error updating dashboard: {e}")
    
    def _save_conversations(self, messages):
        """Save individual conversations to Obsidian"""
        if not messages:
            return
        
        print(f"\n💾 Saving conversations...")
        
        # Save high priority messages
        high_priority = [m for m in messages if m.get('priority_score', 0) >= 70]
        
        if high_priority:
            print(f"  📝 Saving {len(high_priority)} high-priority conversation(s)...")
            for msg in high_priority:
                try:
                    channel = msg.get('channel', 'email')
                    self.obsidian.save_conversation(msg, channel)
                    subject = msg.get('subject', 'No subject')[:40]
                    channel_emoji = "📧" if channel == 'email' else "💬"
                    print(f"    ✅ {channel_emoji} Saved: {subject}")
                except Exception as e:
                    print(f"    ❌ Error saving conversation: {e}")
        else:
            print(f"  ℹ️ No high-priority conversations to save")
    
    def _print_summary(self, all_messages, emails, discord_messages, telegram_messages):
        """Print summary of check results"""
        if not all_messages:
            print("\n✅ No unread messages - all clear!")
            return
        
        print(f"\n📋 Summary:")
        print(f"  Total messages: {len(all_messages)}")
        print(f"    📧 Email: {len(emails)}")
        print(f"    💬 Discord: {len(discord_messages)}")
        print(f"    ✈️ Telegram: {len(telegram_messages)}")
        
        # Count by priority
        high = len([m for m in all_messages if m.get('priority_score', 0) >= 70])
        medium = len([m for m in all_messages if 40 <= m.get('priority_score', 0) < 70])
        low = len([m for m in all_messages if m.get('priority_score', 0) < 40])
        
        print(f"\n  🔴 High priority: {high}")
        print(f"  🟡 Medium priority: {medium}")
        print(f"  🟢 Low priority: {low}")
        
        # Show top 3 priorities
        if all_messages:
            print(f"\n  Top priorities:")
            for i, msg in enumerate(all_messages[:3], 1):
                priority_emoji = self._get_priority_emoji(msg.get('priority_score', 0))
                
                # Channel emoji
                channel = msg.get('channel', 'email')
                if channel == 'email':
                    channel_emoji = "📧"
                elif channel == 'discord':
                    channel_emoji = "💬"
                elif channel == 'telegram':
                    channel_emoji = "✈️"
                else:
                    channel_emoji = "📱"
                
                subject = msg.get('subject', 'No subject')[:50]
                from_name = msg.get('from_name', msg.get('from', 'Unknown'))
                print(f"    {i}. {priority_emoji} {channel_emoji} {subject}")
                print(f"       From: {from_name}")
                print(f"       Due: {msg.get('response_due', 'N/A')}")
    
    def _get_priority_emoji(self, score):
        """Get emoji for priority score"""
        if score >= 70:
            return "🔴"
        elif score >= 40:
            return "🟡"
        else:
            return "🟢"


def main():
    """Main entry point"""
    print("""
╔══════════════════════════════════════════════════════════╗
║      AGENT-COMMUNICATIONS v1.2 (3-Channel)               ║
║      Email + Discord + Telegram Monitor                  ║
╚══════════════════════════════════════════════════════════╝
""")
    
    # Check if .env exists
    env_path = Path(__file__).parent / '.env'
    if not env_path.exists():
        print("❌ Error: .env file not found!")
        print(f"   Expected at: {env_path}")
        print("   Please create .env file with credentials")
        return
    
    try:
        agent = AgentCommunications()
        agent.run_check()
        
    except KeyboardInterrupt:
        print("\n\n⚠️ Interrupted by user")
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
