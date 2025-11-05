"""
Quick Test Script for Agent-Communications
Tests all components individually before running full system
"""

import sys
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent))

print("""
╔══════════════════════════════════════════════════════════╗
║     AGENT-COMMUNICATIONS - COMPONENT TEST SUITE          ║
╚══════════════════════════════════════════════════════════╝
""")

def test_environment():
    """Test 1: Check environment configuration"""
    print("\n🧪 Test 1: Environment Configuration")
    print("-" * 60)
    
    try:
        from dotenv import load_dotenv
        import os
        
        env_path = Path(__file__).parent / '.env'
        if not env_path.exists():
            print("❌ FAIL: .env file not found")
            return False
        
        load_dotenv()
        
        # Check required variables
        required_vars = [
            'PROTON_IMAP_HOST',
            'PROTON_IMAP_PORT',
            'PROTON_IMAP_USERNAME',
            'PROTON_IMAP_PASSWORD',
            'OBSIDIAN_VAULT_PATH'
        ]
        
        missing = []
        for var in required_vars:
            if not os.getenv(var):
                missing.append(var)
        
        if missing:
            print(f"❌ FAIL: Missing variables: {', '.join(missing)}")
            return False
        
        print("✅ PASS: All environment variables configured")
        print(f"   IMAP: {os.getenv('PROTON_IMAP_HOST')}:{os.getenv('PROTON_IMAP_PORT')}")
        print(f"   User: {os.getenv('PROTON_IMAP_USERNAME')}")
        print(f"   Obsidian: {os.getenv('OBSIDIAN_VAULT_PATH')}")
        return True
        
    except Exception as e:
        print(f"❌ FAIL: {e}")
        return False


def test_proton_connection():
    """Test 2: Proton Bridge connection"""
    print("\n🧪 Test 2: Proton Bridge Connection")
    print("-" * 60)
    
    try:
        from monitors.proton_monitor import ProtonEmailMonitor
        
        monitor = ProtonEmailMonitor()
        
        if monitor.connect():
            print("✅ PASS: Connected to Proton Bridge")
            
            # List mailboxes
            mailboxes = monitor.get_all_mailboxes()
            print(f"   Found {len(mailboxes)} mailbox(es)")
            
            monitor.disconnect()
            return True
        else:
            print("❌ FAIL: Could not connect to Proton Bridge")
            print("   Make sure Proton Bridge is running")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: {e}")
        return False


def test_obsidian_access():
    """Test 3: Obsidian vault access"""
    print("\n🧪 Test 3: Obsidian Vault Access")
    print("-" * 60)
    
    try:
        from trackers.obsidian_updater import ObsidianUpdater
        import os
        
        obsidian = ObsidianUpdater()
        
        # Check if vault path exists
        if not obsidian.vault_path.exists():
            print(f"❌ FAIL: Vault path does not exist")
            print(f"   Expected: {obsidian.vault_path}")
            return False
        
        # Check if we can write
        test_file = obsidian.comms_path / ".agent-test"
        test_file.write_text("test")
        test_file.unlink()  # Delete test file
        
        print("✅ PASS: Obsidian vault accessible")
        print(f"   Path: {obsidian.vault_path}")
        print(f"   Comms: {obsidian.comms_path}")
        return True
        
    except Exception as e:
        print(f"❌ FAIL: {e}")
        return False


def test_prioritizer():
    """Test 4: Message prioritizer"""
    print("\n🧪 Test 4: Message Prioritizer")
    print("-" * 60)
    
    try:
        from triage.prioritizer import MessagePrioritizer
        from datetime import datetime
        
        prioritizer = MessagePrioritizer()
        
        # Test message
        test_msg = {
            'channel': 'email',
            'from': 'test@business.com',
            'subject': 'URGENT: Test message',
            'body': 'Please respond ASAP about C3 Alliance.',
            'timestamp': datetime.now().isoformat()
        }
        
        scored = prioritizer.score_message(test_msg)
        
        if 'priority_score' in scored:
            print("✅ PASS: Prioritizer working")
            print(f"   Test score: {scored['priority_score']}/100")
            print(f"   Label: {scored.get('priority_label', 'N/A')}")
            print(f"   Project: {scored.get('project_link', 'None')}")
            return True
        else:
            print("❌ FAIL: Priority score not calculated")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: {e}")
        return False


def test_full_system():
    """Test 5: Full system integration"""
    print("\n🧪 Test 5: Full System Integration")
    print("-" * 60)
    
    try:
        from monitors.proton_monitor import ProtonEmailMonitor
        from triage.prioritizer import MessagePrioritizer
        from trackers.obsidian_updater import ObsidianUpdater
        
        # Initialize components
        email_monitor = ProtonEmailMonitor()
        prioritizer = MessagePrioritizer()
        obsidian = ObsidianUpdater()
        
        # Check email
        print("   Checking email...")
        if not email_monitor.connect():
            print("❌ FAIL: Could not connect to email")
            return False
        
        emails = email_monitor.get_unread_emails()
        email_monitor.disconnect()
        
        print(f"   Found {len(emails)} unread email(s)")
        
        # Triage
        if emails:
            print("   Triaging messages...")
            scored = []
            for email in emails:
                scored_msg = prioritizer.score_message(email)
                actions = prioritizer.extract_action_items(scored_msg)
                scored_msg['action_items'] = actions
                scored.append(scored_msg)
            
            # Update Obsidian
            print("   Updating Obsidian...")
            obsidian.update_dashboard(scored)
            
            print("✅ PASS: Full system working end-to-end")
            print(f"   Processed {len(scored)} message(s)")
            print(f"   Dashboard: {obsidian.dashboard_path}")
            return True
        else:
            print("✅ PASS: System working (no emails to process)")
            print("   Tip: Send yourself a test email to verify full workflow")
            return True
            
    except Exception as e:
        print(f"❌ FAIL: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run all tests"""
    tests = [
        ("Environment", test_environment),
        ("Proton Connection", test_proton_connection),
        ("Obsidian Access", test_obsidian_access),
        ("Prioritizer", test_prioritizer),
        ("Full System", test_full_system)
    ]
    
    results = []
    
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except KeyboardInterrupt:
            print("\n\n⚠️ Tests interrupted by user")
            return
        except Exception as e:
            print(f"\n❌ CRITICAL ERROR in {name}: {e}")
            results.append((name, False))
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    for name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {name}")
    
    total = len(results)
    passed = sum(1 for _, p in results if p)
    
    print(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
        print("\nNext steps:")
        print("1. Run: python orchestrator.py")
        print("2. Check Obsidian dashboard")
        print("3. Review priority scores")
        print("4. Move to Phase 2 (Telegram/Discord)")
    else:
        print("\n⚠️ SOME TESTS FAILED")
        print("Please fix the failed components before running orchestrator.py")
    
    print("\n" + "="*60)


if __name__ == "__main__":
    main()
