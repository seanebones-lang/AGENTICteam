#!/usr/bin/env python3
"""
Email Service for User Verification and Notifications
Supports multiple email providers (SendGrid, AWS SES, SMTP)
"""

import os
import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Optional
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger(__name__)

# Email configuration
EMAIL_PROVIDER = os.getenv("EMAIL_PROVIDER", "smtp")  # smtp, sendgrid, ses
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@bizbot.store")
FROM_NAME = os.getenv("FROM_NAME", "BizBot.Store")

# Verification settings
VERIFICATION_TOKEN_EXPIRY_HOURS = 24
BASE_URL = os.getenv("BASE_URL", "https://bizbot.store")

class EmailService:
    """Email service for verification and notifications"""
    
    def __init__(self):
        self.provider = EMAIL_PROVIDER
    
    def generate_verification_token(self, email: str) -> str:
        """Generate secure email verification token"""
        random_data = secrets.token_urlsafe(32)
        timestamp = str(datetime.now().timestamp())
        combined = f"{email}:{random_data}:{timestamp}"
        token = hashlib.sha256(combined.encode()).hexdigest()
        return token
    
    def send_email_smtp(
        self,
        to_email: str,
        subject: str,
        html_body: str,
        text_body: Optional[str] = None
    ) -> bool:
        """Send email via SMTP"""
        try:
            if not SMTP_USER or not SMTP_PASSWORD:
                logger.warning("SMTP credentials not configured, email not sent")
                return False
            
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{FROM_NAME} <{FROM_EMAIL}>"
            msg['To'] = to_email
            
            # Add text and HTML parts
            if text_body:
                part1 = MIMEText(text_body, 'plain')
                msg.attach(part1)
            
            part2 = MIMEText(html_body, 'html')
            msg.attach(part2)
            
            # Send email
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
        
        except Exception as e:
            logger.error(f"Failed to send email via SMTP: {str(e)}")
            return False
    
    def send_verification_email(
        self,
        to_email: str,
        verification_token: str,
        user_name: Optional[str] = None
    ) -> bool:
        """Send email verification email"""
        verification_url = f"{BASE_URL}/verify-email?token={verification_token}"
        
        subject = "Verify your BizBot.Store email address"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to BizBot.Store!</h1>
                </div>
                <div class="content">
                    <p>Hi{' ' + user_name if user_name else ''},</p>
                    
                    <p>Thank you for signing up for BizBot.Store! To complete your registration and start using our AI agent platform, please verify your email address.</p>
                    
                    <p style="text-align: center;">
                        <a href="{verification_url}" class="button">Verify Email Address</a>
                    </p>
                    
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background: white; padding: 10px; border-radius: 5px;">
                        {verification_url}
                    </p>
                    
                    <p><strong>This link will expire in 24 hours.</strong></p>
                    
                    <p>If you didn't create an account with BizBot.Store, you can safely ignore this email.</p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                        <h3>What's Next?</h3>
                        <ul>
                            <li>Try 3 free queries to our Ticket Resolver agent</li>
                            <li>Purchase credits starting at $20 (500 credits)</li>
                            <li>Access all 10 AI agents for your business</li>
                        </ul>
                    </div>
                </div>
                <div class="footer">
                    <p>BizBot.Store - AI Agents for Business Automation</p>
                    <p>If you have questions, contact us at support@bizbot.store</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""
        Welcome to BizBot.Store!
        
        Thank you for signing up! To complete your registration, please verify your email address by clicking the link below:
        
        {verification_url}
        
        This link will expire in 24 hours.
        
        If you didn't create an account with BizBot.Store, you can safely ignore this email.
        
        ---
        BizBot.Store - AI Agents for Business Automation
        """
        
        return self.send_email_smtp(to_email, subject, html_body, text_body)
    
    def send_password_reset_email(
        self,
        to_email: str,
        reset_token: str,
        user_name: Optional[str] = None
    ) -> bool:
        """Send password reset email"""
        reset_url = f"{BASE_URL}/reset-password?token={reset_token}"
        
        subject = "Reset your BizBot.Store password"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .warning {{ background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hi{' ' + user_name if user_name else ''},</p>
                    
                    <p>We received a request to reset your password for your BizBot.Store account.</p>
                    
                    <p style="text-align: center;">
                        <a href="{reset_url}" class="button">Reset Password</a>
                    </p>
                    
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background: white; padding: 10px; border-radius: 5px;">
                        {reset_url}
                    </p>
                    
                    <div class="warning">
                        <strong>Security Notice:</strong> This link will expire in 24 hours. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""
        Password Reset Request
        
        We received a request to reset your password for your BizBot.Store account.
        
        Click the link below to reset your password:
        {reset_url}
        
        This link will expire in 24 hours.
        
        If you didn't request a password reset, please ignore this email.
        
        ---
        BizBot.Store
        """
        
        return self.send_email_smtp(to_email, subject, html_body, text_body)
    
    def send_welcome_email(
        self,
        to_email: str,
        user_name: str,
        credits_balance: float = 0
    ) -> bool:
        """Send welcome email after successful verification"""
        subject = "Welcome to BizBot.Store - Your account is ready!"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .feature {{ background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome to BizBot.Store!</h1>
                </div>
                <div class="content">
                    <p>Hi {user_name},</p>
                    
                    <p>Your account is now active and ready to use! You have access to our powerful AI agent platform.</p>
                    
                    <h3>Your Account:</h3>
                    <div class="feature">
                        <strong>Credits Balance:</strong> {credits_balance} credits
                    </div>
                    
                    <h3>What You Can Do:</h3>
                    <div class="feature">
                        <strong>🎁 Free Trial:</strong> Try our Ticket Resolver agent with 3 free queries
                    </div>
                    <div class="feature">
                        <strong>🤖 10 AI Agents:</strong> Access security, support, analytics, and automation agents
                    </div>
                    <div class="feature">
                        <strong>💳 Flexible Pricing:</strong> Pay-as-you-go or monthly subscriptions starting at $49
                    </div>
                    
                    <p style="text-align: center;">
                        <a href="{BASE_URL}/agents" class="button">Explore Agents</a>
                    </p>
                    
                    <p>Need help getting started? Check out our <a href="{BASE_URL}/docs">documentation</a> or contact support at support@bizbot.store</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email_smtp(to_email, subject, html_body)

# Global email service instance
email_service = EmailService()

