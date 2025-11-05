"""
Proton Email Monitor - IMAP Reader
Connects to Proton Bridge local IMAP server to read emails
"""

import imaplib
import email
from email.header import decode_header
import os
from datetime import datetime
from typing import List, Dict, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class ProtonEmailMonitor:
    """Monitor Proton Mail via local Bridge IMAP"""
    
    def __init__(self):
        self.host = os.getenv('PROTON_IMAP_HOST', '127.0.0.1')
        self.port = int(os.getenv('PROTON_IMAP_PORT', '1143'))
        self.username = os.getenv('PROTON_IMAP_USERNAME')
        self.password = os.getenv('PROTON_IMAP_PASSWORD')
        self.connection = None
        
    def connect(self) -> bool:
        """Connect to Proton Bridge IMAP server"""
        try:
            self.connection = imaplib.IMAP4(self.host, self.port)
            self.connection.starttls()
            self.connection.login(self.username, self.password)
            print(f"✅ Connected to Proton IMAP: {self.username}")
            return True
        except Exception as e:
            print(f"❌ Failed to connect to Proton IMAP: {e}")
            return False
    
    def disconnect(self):
        """Disconnect from IMAP server"""
        if self.connection:
            try:
                self.connection.logout()
                print("✅ Disconnected from Proton IMAP")
            except:
                pass
    
    def get_unread_emails(self, mailbox: str = "INBOX", limit: int = 50) -> List[Dict]:
        """
        Fetch unread emails from specified mailbox
        
        Args:
            mailbox: IMAP mailbox name (default: INBOX)
            limit: Maximum number of emails to fetch
            
        Returns:
            List of email dictionaries with parsed data
        """
        if not self.connection:
            if not self.connect():
                return []
        
        try:
            # Select mailbox
            self.connection.select(mailbox)
            
            # Search for unread emails
            status, messages = self.connection.search(None, 'UNSEEN')
            
            if status != 'OK':
                print(f"❌ Failed to search emails in {mailbox}")
                return []
            
            email_ids = messages[0].split()
            
            # Limit results
            email_ids = email_ids[-limit:] if len(email_ids) > limit else email_ids
            
            emails = []
            for email_id in email_ids:
                email_data = self._fetch_email(email_id)
                if email_data:
                    emails.append(email_data)
            
            print(f"📧 Found {len(emails)} unread email(s) in {mailbox}")
            return emails
            
        except Exception as e:
            print(f"❌ Error fetching emails: {e}")
            return []
    
    def _fetch_email(self, email_id: bytes) -> Optional[Dict]:
        """Fetch and parse a single email"""
        try:
            # Fetch email by ID
            status, msg_data = self.connection.fetch(email_id, '(RFC822)')
            
            if status != 'OK':
                return None
            
            # Parse email
            raw_email = msg_data[0][1]
            msg = email.message_from_bytes(raw_email)
            
            # Extract subject
            subject = self._decode_header(msg.get('Subject', ''))
            
            # Extract sender
            from_header = msg.get('From', '')
            sender = self._extract_email_address(from_header)
            sender_name = self._extract_sender_name(from_header)
            
            # Extract date
            date_str = msg.get('Date', '')
            email_date = self._parse_date(date_str)
            
            # Extract body
            body = self._get_email_body(msg)
            
            # Build email object
            email_obj = {
                'id': email_id.decode(),
                'channel': 'email',
                'from': sender,
                'from_name': sender_name,
                'subject': subject,
                'body': body,
                'timestamp': email_date,
                'raw_date': date_str,
                'status': 'unread',
                'priority_score': 0,  # Will be calculated by triage
                'response_due': None,  # Will be calculated by triage
                'project_link': None,
                'action_items': []
            }
            
            return email_obj
            
        except Exception as e:
            print(f"❌ Error parsing email {email_id}: {e}")
            return None
    
    def _decode_header(self, header: str) -> str:
        """Decode email header (handles encoding)"""
        if not header:
            return ''
        
        decoded_parts = decode_header(header)
        decoded_str = ''
        
        for part, encoding in decoded_parts:
            if isinstance(part, bytes):
                decoded_str += part.decode(encoding or 'utf-8', errors='ignore')
            else:
                decoded_str += part
        
        return decoded_str.strip()
    
    def _extract_email_address(self, from_header: str) -> str:
        """Extract email address from From header"""
        if '<' in from_header and '>' in from_header:
            start = from_header.index('<') + 1
            end = from_header.index('>')
            return from_header[start:end].strip()
        return from_header.strip()
    
    def _extract_sender_name(self, from_header: str) -> str:
        """Extract sender name from From header"""
        if '<' in from_header:
            name = from_header.split('<')[0].strip()
            return self._decode_header(name.strip('"'))
        return self._decode_header(from_header)
    
    def _parse_date(self, date_str: str) -> str:
        """Parse email date to ISO format"""
        try:
            from email.utils import parsedate_to_datetime
            dt = parsedate_to_datetime(date_str)
            return dt.isoformat()
        except:
            return datetime.now().isoformat()
    
    def _get_email_body(self, msg) -> str:
        """Extract email body (prefer plain text)"""
        body = ""
        
        if msg.is_multipart():
            for part in msg.walk():
                content_type = part.get_content_type()
                disposition = str(part.get('Content-Disposition', ''))
                
                # Skip attachments
                if 'attachment' in disposition:
                    continue
                
                # Get plain text
                if content_type == 'text/plain':
                    try:
                        body = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                        break
                    except:
                        pass
                
                # Fallback to HTML if no plain text
                if not body and content_type == 'text/html':
                    try:
                        html_body = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                        # Simple HTML stripping (could use BeautifulSoup for better results)
                        body = html_body
                    except:
                        pass
        else:
            # Non-multipart email
            try:
                body = msg.get_payload(decode=True).decode('utf-8', errors='ignore')
            except:
                body = str(msg.get_payload())
        
        return body.strip()
    
    def mark_as_read(self, email_id: str):
        """Mark email as read"""
        try:
            self.connection.store(email_id.encode(), '+FLAGS', '\\Seen')
            print(f"✅ Marked email {email_id} as read")
        except Exception as e:
            print(f"❌ Failed to mark email as read: {e}")
    
    def get_all_mailboxes(self) -> List[str]:
        """Get list of all mailboxes"""
        if not self.connection:
            if not self.connect():
                return []
        
        try:
            status, mailboxes = self.connection.list()
            if status == 'OK':
                return [mb.decode().split('"')[-2] for mb in mailboxes]
            return []
        except Exception as e:
            print(f"❌ Error listing mailboxes: {e}")
            return []


def test_connection():
    """Test Proton IMAP connection"""
    print("🧪 Testing Proton Email Monitor...")
    
    monitor = ProtonEmailMonitor()
    
    if monitor.connect():
        print("✅ Connection successful!")
        
        # List mailboxes
        mailboxes = monitor.get_all_mailboxes()
        print(f"📂 Available mailboxes: {mailboxes}")
        
        # Get unread emails
        emails = monitor.get_unread_emails()
        print(f"📧 Unread emails: {len(emails)}")
        
        # Show first email details
        if emails:
            print("\n📨 First email preview:")
            email = emails[0]
            print(f"  From: {email['from_name']} <{email['from']}>")
            print(f"  Subject: {email['subject']}")
            print(f"  Date: {email['timestamp']}")
            print(f"  Body preview: {email['body'][:200]}...")
        
        monitor.disconnect()
        return True
    else:
        print("❌ Connection failed!")
        return False


if __name__ == "__main__":
    test_connection()
