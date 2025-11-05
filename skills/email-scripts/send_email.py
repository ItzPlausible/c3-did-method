#!/usr/bin/env python3
"""
Send email via Proton Mail SMTP server.

Usage:
    python send_email.py --to recipient@example.com --subject "Subject" --body "Message body" [--cc cc@example.com] [--bcc bcc@example.com] [--html]
"""

import smtplib
import argparse
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

# Proton Mail SMTP Configuration
SMTP_SERVER = "smtp.protonmail.ch"
SMTP_PORT = 587
SMTP_USERNAME = "team@plausiblepotentials.com"
SMTP_TOKEN = "M384YGSFYH37GSVL"

def send_email(to_addr, subject, body, cc=None, bcc=None, is_html=False):
    """
    Send an email via Proton Mail SMTP.
    
    Args:
        to_addr: Recipient email address(es) - can be string or list
        subject: Email subject line
        body: Email body content
        cc: CC recipients (optional)
        bcc: BCC recipients (optional)
        is_html: Whether body is HTML (default: False for plain text)
    
    Returns:
        dict: Status message with success/error info
    """
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = SMTP_USERNAME
        msg['To'] = to_addr if isinstance(to_addr, str) else ', '.join(to_addr)
        msg['Subject'] = subject
        msg['Date'] = datetime.now().strftime('%a, %d %b %Y %H:%M:%S %z')
        
        if cc:
            msg['Cc'] = cc if isinstance(cc, str) else ', '.join(cc)
        if bcc:
            msg['Bcc'] = bcc if isinstance(bcc, str) else ', '.join(bcc)
        
        # Attach body
        content_type = 'html' if is_html else 'plain'
        msg.attach(MIMEText(body, content_type))
        
        # Connect to SMTP server
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # Enable TLS encryption
            server.login(SMTP_USERNAME, SMTP_TOKEN)
            
            # Send email
            recipients = [to_addr] if isinstance(to_addr, str) else to_addr
            if cc:
                recipients.extend([cc] if isinstance(cc, str) else cc)
            if bcc:
                recipients.extend([bcc] if isinstance(bcc, str) else bcc)
            
            server.send_message(msg)
        
        return {
            'success': True,
            'message': f'Email sent successfully to {to_addr}',
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }

def main():
    parser = argparse.ArgumentParser(description='Send email via Proton Mail SMTP')
    parser.add_argument('--to', required=True, help='Recipient email address')
    parser.add_argument('--subject', required=True, help='Email subject')
    parser.add_argument('--body', required=True, help='Email body')
    parser.add_argument('--cc', help='CC recipients (comma-separated)')
    parser.add_argument('--bcc', help='BCC recipients (comma-separated)')
    parser.add_argument('--html', action='store_true', help='Send as HTML email')
    
    args = parser.parse_args()
    
    # Parse CC and BCC if provided
    cc = args.cc.split(',') if args.cc else None
    bcc = args.bcc.split(',') if args.bcc else None
    
    result = send_email(
        to_addr=args.to,
        subject=args.subject,
        body=args.body,
        cc=cc,
        bcc=bcc,
        is_html=args.html
    )
    
    print(f"Status: {'SUCCESS' if result['success'] else 'FAILED'}")
    if result['success']:
        print(result['message'])
    else:
        print(f"Error: {result['error']}")

if __name__ == '__main__':
    main()
