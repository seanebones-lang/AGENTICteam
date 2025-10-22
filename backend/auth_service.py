#!/usr/bin/env python3
"""
Authentication Service with Enhanced Security
Password strength validation, session management, and secure token handling
"""

import re
import hashlib
import secrets
import sqlite3
from datetime import datetime, timedelta
from typing import Optional, Dict, Tuple
import logging
import bcrypt

logger = logging.getLogger(__name__)

DATABASE_PATH = "agent_marketplace.db"

# Password requirements
MIN_PASSWORD_LENGTH = 8
MAX_PASSWORD_LENGTH = 128
REQUIRE_UPPERCASE = True
REQUIRE_LOWERCASE = True
REQUIRE_DIGIT = True
REQUIRE_SPECIAL = True

# Session settings
SESSION_TIMEOUT_HOURS = 24
MAX_CONCURRENT_SESSIONS = 3

class PasswordStrength:
    """Password strength levels"""
    WEAK = "weak"
    FAIR = "fair"
    GOOD = "good"
    STRONG = "strong"
    VERY_STRONG = "very_strong"

class AuthService:
    """Enhanced authentication service"""
    
    def __init__(self):
        self.db_path = DATABASE_PATH
    
    def _get_connection(self):
        """Get database connection"""
        return sqlite3.connect(self.db_path)
    
    def validate_email(self, email: str) -> Tuple[bool, Optional[str]]:
        """
        Validate email format
        Returns: (is_valid, error_message)
        """
        if not email or len(email) < 3:
            return False, "Email is required"
        
        # RFC 5322 simplified email regex
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        
        if not re.match(email_regex, email):
            return False, "Invalid email format"
        
        # Check for disposable email domains
        disposable_domains = [
            'tempmail.com', 'throwaway.email', '10minutemail.com',
            'guerrillamail.com', 'mailinator.com', 'trashmail.com'
        ]
        
        domain = email.split('@')[1].lower()
        if domain in disposable_domains:
            return False, "Disposable email addresses are not allowed"
        
        return True, None
    
    def check_password_strength(self, password: str) -> Tuple[str, int, list]:
        """
        Check password strength
        Returns: (strength_level, score_0_100, suggestions)
        """
        score = 0
        suggestions = []
        
        # Length check
        if len(password) < MIN_PASSWORD_LENGTH:
            suggestions.append(f"Password must be at least {MIN_PASSWORD_LENGTH} characters")
            return PasswordStrength.WEAK, 0, suggestions
        
        if len(password) >= MIN_PASSWORD_LENGTH:
            score += 20
        if len(password) >= 12:
            score += 10
        if len(password) >= 16:
            score += 10
        
        # Character variety checks
        has_lowercase = bool(re.search(r'[a-z]', password))
        has_uppercase = bool(re.search(r'[A-Z]', password))
        has_digit = bool(re.search(r'\d', password))
        has_special = bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password))
        
        if has_lowercase:
            score += 15
        else:
            suggestions.append("Add lowercase letters")
        
        if has_uppercase:
            score += 15
        else:
            suggestions.append("Add uppercase letters")
        
        if has_digit:
            score += 15
        else:
            suggestions.append("Add numbers")
        
        if has_special:
            score += 15
        else:
            suggestions.append("Add special characters (!@#$%^&*)")
        
        # Check for common patterns
        common_passwords = [
            'password', '12345678', 'qwerty', 'abc123', 'letmein',
            'welcome', 'monkey', '1234567890', 'password123'
        ]
        
        if password.lower() in common_passwords:
            score = min(score, 20)
            suggestions.append("This is a commonly used password. Choose something more unique.")
        
        # Check for sequential characters
        if re.search(r'(012|123|234|345|456|567|678|789|abc|bcd|cde)', password.lower()):
            score -= 10
            suggestions.append("Avoid sequential characters")
        
        # Check for repeated characters
        if re.search(r'(.)\1{2,}', password):
            score -= 10
            suggestions.append("Avoid repeated characters")
        
        # Determine strength level
        if score < 40:
            strength = PasswordStrength.WEAK
        elif score < 60:
            strength = PasswordStrength.FAIR
        elif score < 75:
            strength = PasswordStrength.GOOD
        elif score < 90:
            strength = PasswordStrength.STRONG
        else:
            strength = PasswordStrength.VERY_STRONG
        
        return strength, min(score, 100), suggestions
    
    def validate_password(self, password: str) -> Tuple[bool, Optional[str], Dict]:
        """
        Validate password meets requirements
        Returns: (is_valid, error_message, strength_info)
        """
        if not password:
            return False, "Password is required", {}
        
        if len(password) < MIN_PASSWORD_LENGTH:
            return False, f"Password must be at least {MIN_PASSWORD_LENGTH} characters", {}
        
        if len(password) > MAX_PASSWORD_LENGTH:
            return False, f"Password must be less than {MAX_PASSWORD_LENGTH} characters", {}
        
        # Check strength
        strength, score, suggestions = self.check_password_strength(password)
        
        strength_info = {
            "strength": strength,
            "score": score,
            "suggestions": suggestions
        }
        
        # Enforce minimum strength
        if score < 40:
            return False, "Password is too weak. " + " ".join(suggestions), strength_info
        
        # Check required character types
        if REQUIRE_UPPERCASE and not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter", strength_info
        
        if REQUIRE_LOWERCASE and not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter", strength_info
        
        if REQUIRE_DIGIT and not re.search(r'\d', password):
            return False, "Password must contain at least one number", strength_info
        
        if REQUIRE_SPECIAL and not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return False, "Password must contain at least one special character", strength_info
        
        return True, None, strength_info
    
    def hash_password(self, password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    def verify_password(self, password: str, hashed_password: str) -> bool:
        """Verify password against hash"""
        try:
            return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
        except Exception as e:
            logger.error(f"Password verification failed: {str(e)}")
            return False
    
    def create_session(
        self,
        user_id: int,
        ip_address: str,
        user_agent: str
    ) -> Optional[str]:
        """
        Create new session for user
        Returns: session_token
        """
        try:
            conn = self._get_connection()
            cursor = conn.cursor()
            
            # Check concurrent session limit
            cursor.execute('''
                SELECT COUNT(*) FROM user_sessions
                WHERE user_id = ? AND is_active = TRUE
                AND expires_at > datetime('now')
            ''', (user_id,))
            
            active_sessions = cursor.fetchone()[0]
            
            if active_sessions >= MAX_CONCURRENT_SESSIONS:
                # Revoke oldest session
                cursor.execute('''
                    UPDATE user_sessions
                    SET is_active = FALSE
                    WHERE user_id = ?
                    AND is_active = TRUE
                    ORDER BY created_at ASC
                    LIMIT 1
                ''', (user_id,))
            
            # Generate session token
            session_token = secrets.token_urlsafe(32)
            session_hash = hashlib.sha256(session_token.encode()).hexdigest()
            
            # Create session
            expires_at = datetime.now() + timedelta(hours=SESSION_TIMEOUT_HOURS)
            
            cursor.execute('''
                INSERT INTO user_sessions
                (user_id, session_hash, ip_address, user_agent, expires_at, is_active)
                VALUES (?, ?, ?, ?, ?, TRUE)
            ''', (user_id, session_hash, ip_address, user_agent, expires_at.isoformat()))
            
            conn.commit()
            conn.close()
            
            logger.info(f"Session created for user {user_id}")
            return session_token
        
        except Exception as e:
            logger.error(f"Failed to create session: {str(e)}")
            return None
    
    def validate_session(self, session_token: str) -> Optional[Dict]:
        """
        Validate session token
        Returns: user_data or None
        """
        try:
            session_hash = hashlib.sha256(session_token.encode()).hexdigest()
            
            conn = self._get_connection()
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT s.user_id, s.expires_at, u.email, u.name, u.tier
                FROM user_sessions s
                JOIN users u ON s.user_id = u.id
                WHERE s.session_hash = ?
                AND s.is_active = TRUE
                AND s.expires_at > datetime('now')
            ''', (session_hash,))
            
            result = cursor.fetchone()
            
            if not result:
                conn.close()
                return None
            
            user_id, expires_at, email, name, tier = result
            
            # Update last activity
            cursor.execute('''
                UPDATE user_sessions
                SET last_activity = datetime('now')
                WHERE session_hash = ?
            ''', (session_hash,))
            
            conn.commit()
            conn.close()
            
            return {
                "user_id": user_id,
                "email": email,
                "name": name,
                "tier": tier,
                "expires_at": expires_at
            }
        
        except Exception as e:
            logger.error(f"Session validation failed: {str(e)}")
            return None
    
    def revoke_session(self, session_token: str) -> bool:
        """Revoke (logout) session"""
        try:
            session_hash = hashlib.sha256(session_token.encode()).hexdigest()
            
            conn = self._get_connection()
            cursor = conn.cursor()
            
            cursor.execute('''
                UPDATE user_sessions
                SET is_active = FALSE
                WHERE session_hash = ?
            ''', (session_hash,))
            
            conn.commit()
            conn.close()
            
            return True
        
        except Exception as e:
            logger.error(f"Failed to revoke session: {str(e)}")
            return False
    
    def cleanup_expired_sessions(self):
        """Clean up expired sessions (run periodically)"""
        try:
            conn = self._get_connection()
            cursor = conn.cursor()
            
            cursor.execute('''
                UPDATE user_sessions
                SET is_active = FALSE
                WHERE expires_at < datetime('now')
                AND is_active = TRUE
            ''')
            
            rows_affected = cursor.rowcount
            conn.commit()
            conn.close()
            
            if rows_affected > 0:
                logger.info(f"Cleaned up {rows_affected} expired sessions")
            
            return rows_affected
        
        except Exception as e:
            logger.error(f"Failed to cleanup sessions: {str(e)}")
            return 0

# Global auth service instance
auth_service = AuthService()

