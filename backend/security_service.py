#!/usr/bin/env python3
"""
Enterprise Security Service
Handles authentication, rate limiting, free trial tracking, and audit logging
"""

import sqlite3
import hashlib
import secrets
import jwt
import time
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Tuple
from fastapi import Request, HTTPException
import logging

logger = logging.getLogger(__name__)

DATABASE_PATH = "agent_marketplace.db"
JWT_SECRET = secrets.token_urlsafe(32)  # In production, load from secure env var
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Free trial configuration
FREE_TRIAL_AGENT = "ticket-resolver"  # Legacy constant - now ALL agents support free trial
FREE_TRIAL_QUERIES = 3
FREE_TRIAL_WINDOW_HOURS = 24

# Rate limiting configuration
RATE_LIMIT_REQUESTS_PER_MINUTE = 10
RATE_LIMIT_REQUESTS_PER_HOUR = 100
RATE_LIMIT_BLOCK_DURATION_MINUTES = 15

class SecurityService:
    """Enterprise-grade security service"""
    
    def __init__(self):
        self.db_path = DATABASE_PATH
    
    def _get_connection(self):
        """Get database connection"""
        return sqlite3.connect(self.db_path)
    
    def get_client_ip(self, request: Request) -> str:
        """Extract client IP address from request (handles proxies)"""
        # Check for forwarded IP (behind proxy/load balancer)
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        # Fallback to direct client IP
        if request.client:
            return request.client.host
        
        return "unknown"
    
    def get_device_fingerprint(self, request: Request) -> str:
        """Generate device fingerprint from request headers"""
        user_agent = request.headers.get("User-Agent", "")
        accept_language = request.headers.get("Accept-Language", "")
        accept_encoding = request.headers.get("Accept-Encoding", "")
        
        fingerprint_data = f"{user_agent}:{accept_language}:{accept_encoding}"
        return hashlib.sha256(fingerprint_data.encode()).hexdigest()
    
    def log_security_event(
        self,
        event_type: str,
        ip_address: str,
        user_id: Optional[int] = None,
        user_agent: Optional[str] = None,
        endpoint: Optional[str] = None,
        request_data: Optional[Dict] = None,
        response_status: Optional[int] = None,
        threat_level: str = "low",
        details: Optional[str] = None
    ):
        """Log security event to audit log"""
        try:
            conn = self._get_connection()
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO security_audit_log 
                (event_type, ip_address, user_id, user_agent, endpoint, 
                 request_data, response_status, threat_level, details)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                event_type,
                ip_address,
                user_id,
                user_agent,
                endpoint,
                str(request_data) if request_data else None,
                response_status,
                threat_level,
                details
            ))
            
            conn.commit()
            conn.close()
            
            if threat_level in ["high", "critical"]:
                logger.warning(f"Security event: {event_type} from {ip_address} - {details}")
        
        except Exception as e:
            logger.error(f"Failed to log security event: {str(e)}")
    
    def check_rate_limit(
        self,
        ip_address: str,
        endpoint: str,
        requests_per_minute: int = RATE_LIMIT_REQUESTS_PER_MINUTE
    ) -> Tuple[bool, Optional[int]]:
        """
        Check if IP is within rate limits
        Returns: (is_allowed, retry_after_seconds)
        """
        try:
            conn = self._get_connection()
            cursor = conn.cursor()
            
            # Check if IP is currently blocked
            cursor.execute('''
                SELECT block_expires_at FROM rate_limit_tracking
                WHERE ip_address = ? AND is_blocked = TRUE
                AND block_expires_at > datetime('now')
            ''', (ip_address,))
            
            blocked = cursor.fetchone()
            if blocked:
                block_expires = datetime.fromisoformat(blocked[0])
                retry_after = int((block_expires - datetime.now()).total_seconds())
                conn.close()
                return False, retry_after
            
            # Get current window start (1 minute ago)
            window_start = (datetime.now() - timedelta(minutes=1)).isoformat()
            
            # Count requests in current window
            cursor.execute('''
                SELECT request_count FROM rate_limit_tracking
                WHERE ip_address = ? AND endpoint = ?
                AND window_start > ?
            ''', (ip_address, endpoint, window_start))
            
            result = cursor.fetchone()
            current_count = result[0] if result else 0
            
            if current_count >= requests_per_minute:
                # Block IP for 15 minutes
                block_expires = datetime.now() + timedelta(minutes=RATE_LIMIT_BLOCK_DURATION_MINUTES)
                
                cursor.execute('''
                    INSERT OR REPLACE INTO rate_limit_tracking
                    (ip_address, endpoint, request_count, window_start, is_blocked, block_expires_at)
                    VALUES (?, ?, ?, datetime('now'), TRUE, ?)
                ''', (ip_address, endpoint, current_count + 1, block_expires.isoformat()))
                
                conn.commit()
                conn.close()
                
                self.log_security_event(
                    "rate_limit_exceeded",
                    ip_address,
                    endpoint=endpoint,
                    threat_level="medium",
                    details=f"Exceeded {requests_per_minute} requests/minute"
                )
                
                return False, RATE_LIMIT_BLOCK_DURATION_MINUTES * 60
            
            # Increment request count
            cursor.execute('''
                INSERT OR REPLACE INTO rate_limit_tracking
                (ip_address, endpoint, request_count, window_start)
                VALUES (?, ?, ?, datetime('now'))
                ON CONFLICT(ip_address, endpoint, window_start) DO UPDATE SET
                request_count = request_count + 1
            ''', (ip_address, endpoint, current_count + 1))
            
            conn.commit()
            conn.close()
            
            return True, None
        
        except Exception as e:
            logger.error(f"Rate limit check failed: {str(e)}")
            return True, None  # Fail open to avoid blocking legitimate users
    
    def check_free_trial(
        self,
        ip_address: str,
        device_fingerprint: str,
        agent_id: str,
        user_agent: str
    ) -> Tuple[bool, int, Optional[str]]:
        """
        Check if IP/device can use free trial for ANY agent
        Returns: (is_allowed, queries_remaining, block_reason)
        """
        # Free trial now available for ALL agents (not just ticket-resolver)
        
        try:
            conn = self._get_connection()
            cursor = conn.cursor()
            
            # Check if IP is blocked
            cursor.execute('''
                SELECT is_blocked, block_reason FROM free_trial_tracking
                WHERE ip_address = ? AND agent_id = ?
            ''', (ip_address, agent_id))
            
            result = cursor.fetchone()
            
            if result and result[0]:  # is_blocked
                conn.close()
                return False, 0, result[1]
            
            # Get current usage
            cursor.execute('''
                SELECT queries_used, first_query_at FROM free_trial_tracking
                WHERE ip_address = ? AND agent_id = ?
            ''', (ip_address, agent_id))
            
            trial_data = cursor.fetchone()
            
            if not trial_data:
                # First query - create tracking record
                cursor.execute('''
                    INSERT INTO free_trial_tracking
                    (ip_address, device_fingerprint, user_agent, queries_used, agent_id)
                    VALUES (?, ?, ?, 0, ?)
                ''', (ip_address, device_fingerprint, user_agent, agent_id))
                
                conn.commit()
                conn.close()
                
                self.log_security_event(
                    "free_trial_started",
                    ip_address,
                    user_agent=user_agent,
                    details=f"Started free trial for {agent_id}"
                )
                
                return True, FREE_TRIAL_QUERIES, None
            
            queries_used, first_query_at = trial_data
            
            # Check if trial window expired
            first_query_time = datetime.fromisoformat(first_query_at)
            if datetime.now() - first_query_time > timedelta(hours=FREE_TRIAL_WINDOW_HOURS):
                # Trial expired
                cursor.execute('''
                    UPDATE free_trial_tracking
                    SET is_blocked = TRUE,
                        block_reason = 'Trial period expired'
                    WHERE ip_address = ? AND agent_id = ?
                ''', (ip_address, agent_id))
                
                conn.commit()
                conn.close()
                
                return False, 0, "Trial period expired"
            
            # Check if queries exhausted
            if queries_used >= FREE_TRIAL_QUERIES:
                cursor.execute('''
                    UPDATE free_trial_tracking
                    SET is_blocked = TRUE,
                        block_reason = 'Free queries exhausted'
                    WHERE ip_address = ? AND agent_id = ?
                ''', (ip_address, agent_id))
                
                conn.commit()
                conn.close()
                
                self.log_security_event(
                    "free_trial_exhausted",
                    ip_address,
                    user_agent=user_agent,
                    threat_level="low",
                    details=f"Exhausted {FREE_TRIAL_QUERIES} free queries"
                )
                
                return False, 0, "Free queries exhausted"
            
            conn.close()
            return True, FREE_TRIAL_QUERIES - queries_used, None
        
        except Exception as e:
            logger.error(f"Free trial check failed: {str(e)}")
            return False, 0, "System error"
    
    def increment_free_trial_usage(
        self,
        ip_address: str,
        agent_id: str
    ) -> bool:
        """Increment free trial usage counter"""
        try:
            conn = self._get_connection()
            cursor = conn.cursor()
            
            cursor.execute('''
                UPDATE free_trial_tracking
                SET queries_used = queries_used + 1,
                    last_query_at = datetime('now')
                WHERE ip_address = ? AND agent_id = ?
            ''', (ip_address, agent_id))
            
            conn.commit()
            conn.close()
            return True
        
        except Exception as e:
            logger.error(f"Failed to increment free trial usage: {str(e)}")
            return False
    
    def generate_jwt_token(self, user_id: int, email: str) -> str:
        """Generate JWT token for authenticated user"""
        payload = {
            "user_id": user_id,
            "email": email,
            "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
            "iat": datetime.utcnow()
        }
        
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return token
    
    def verify_jwt_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify JWT token and return payload"""
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("JWT token expired")
            return None
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid JWT token: {str(e)}")
            return None

# Global security service instance
security_service = SecurityService()

