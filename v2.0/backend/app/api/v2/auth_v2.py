"""
Authentication API v2 - Enhanced JWT with session management
15-min access tokens, 7-day refresh tokens, Redis sessions
"""

from fastapi import APIRouter, HTTPException, Depends, Request, Response, status
from fastapi.security import HTTPBearer
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import time
import uuid
import hashlib

from app.core.auth import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    create_refresh_token,
    verify_token
)
from app.core.redis import redis_client
from app.core.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()
security = HTTPBearer(auto_error=False)


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    company: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 900  # 15 minutes
    user: Dict[str, Any]


class RefreshTokenRequest(BaseModel):
    refresh_token: str


@router.post("/register", response_model=TokenResponse)
async def register_user(
    user_data: UserRegister,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    """Register a new user with enhanced security"""
    
    try:
        # Check if user already exists
        # TODO: Implement actual database check
        existing_user = None  # db.query(User).filter(User.email == user_data.email).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Validate password strength
        if len(user_data.password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 8 characters long"
            )
        
        # Hash password with bcrypt cost=14
        password_hash = get_password_hash(user_data.password)
        
        # Create user (mock implementation)
        user_id = str(uuid.uuid4())
        user_record = {
            "id": user_id,
            "email": user_data.email,
            "name": user_data.name,
            "company": user_data.company,
            "password_hash": password_hash,
            "tier": "basic",
            "credits": 10.0,  # Starter credits
            "created_at": datetime.utcnow().isoformat(),
            "is_active": True
        }
        
        # TODO: Save to database
        # db.add(User(**user_record))
        # db.commit()
        
        # Create session with device info
        device_info = {
            "ip_address": request.client.host if request.client else "unknown",
            "user_agent": request.headers.get("user-agent", ""),
            "registration_device": True
        }
        
        # Create tokens
        access_token, refresh_token = await create_user_session(
            user_id, user_record, device_info
        )
        
        # Set HTTP-only cookies
        set_secure_cookies(response, access_token, refresh_token)
        
        # Return response
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user={
                "id": user_id,
                "email": user_data.email,
                "name": user_data.name,
                "tier": "basic",
                "credits": 10.0
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login", response_model=TokenResponse)
async def login_user(
    login_data: UserLogin,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    """Login user with enhanced session management"""
    
    try:
        # Rate limiting check
        client_ip = request.client.host if request.client else "unknown"
        rate_limit_key = f"login_attempts:{client_ip}"
        
        # Check current attempts
        current_attempts = await redis_client.get(rate_limit_key)
        attempts = int(current_attempts) if current_attempts else 0
        
        if attempts >= 100:  # 100 attempts per minute limit
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many login attempts. Please try again later."
            )
        
        # Increment attempt counter
        await redis_client.setex(rate_limit_key, 60, attempts + 1)
        
        # TODO: Get user from database
        # user = db.query(User).filter(User.email == login_data.email).first()
        
        # Mock user for testing
        user = {
            "id": "user_123",
            "email": login_data.email,
            "name": "Test User",
            "password_hash": get_password_hash("testpassword"),  # For testing
            "tier": "basic",
            "credits": 25.0,
            "is_active": True
        }
        
        if not user or not verify_password(login_data.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        if not user["is_active"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated"
            )
        
        # Create session with device info
        device_info = {
            "ip_address": client_ip,
            "user_agent": request.headers.get("user-agent", ""),
            "login_time": time.time(),
            "remember_me": login_data.remember_me
        }
        
        # Create tokens
        access_token, refresh_token = await create_user_session(
            user["id"], user, device_info
        )
        
        # Set HTTP-only cookies
        set_secure_cookies(response, access_token, refresh_token)
        
        # Reset rate limiting on successful login
        await redis_client.delete(rate_limit_key)
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user={
                "id": user["id"],
                "email": user["email"],
                "name": user["name"],
                "tier": user["tier"],
                "credits": user["credits"]
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )


@router.post("/refresh")
async def refresh_access_token(
    refresh_data: RefreshTokenRequest,
    request: Request,
    response: Response
):
    """Refresh access token using refresh token"""
    
    try:
        # Verify refresh token
        payload = verify_token(refresh_data.refresh_token, "refresh")
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        # Check if refresh token exists in Redis session
        session_valid = await validate_refresh_token(refresh_data.refresh_token, user_id)
        
        if not session_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token has been revoked"
            )
        
        # TODO: Get updated user data from database
        user_data = {
            "id": user_id,
            "email": "user@example.com",
            "name": "Test User",
            "tier": "basic",
            "credits": 25.0
        }
        
        # Create new access token
        new_access_token = create_access_token(data={"sub": user_id, **user_data})
        
        # Update session last accessed time
        await update_session_access_time(user_id, refresh_data.refresh_token)
        
        return {
            "access_token": new_access_token,
            "token_type": "bearer",
            "expires_in": 900,  # 15 minutes
            "user": user_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token refresh failed"
        )


@router.post("/logout")
async def logout_user(
    request: Request,
    response: Response,
    current_user: Optional[Dict] = Depends(get_current_user_optional)
):
    """Logout user and revoke session"""
    
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    try:
        # Get refresh token from cookie
        refresh_token = request.cookies.get("refresh_token")
        
        if refresh_token:
            # Revoke the specific session
            await revoke_user_session(current_user["id"], refresh_token)
        
        # Clear cookies
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        
        return {"message": "Successfully logged out"}
        
    except Exception as e:
        # Even if session revocation fails, clear cookies
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        
        return {"message": "Logged out (with warnings)", "warning": str(e)}


@router.get("/me")
async def get_current_user_info(
    current_user: Dict = Depends(require_auth)
):
    """Get current user information"""
    
    # TODO: Get fresh user data from database
    user_data = {
        "id": current_user["id"],
        "email": current_user.get("email"),
        "name": current_user.get("name"),
        "tier": current_user.get("tier", "basic"),
        "credits": current_user.get("credits", 0),
        "created_at": current_user.get("created_at"),
        "last_login": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }
    
    return {"user": user_data}


# Helper functions
async def create_user_session(
    user_id: str, 
    user_data: Dict[str, Any],
    device_info: Dict[str, Any]
) -> tuple[str, str]:
    """Create a new user session with Redis storage"""
    
    # Create tokens
    access_token = create_access_token(data={"sub": user_id, **user_data})
    refresh_token = create_refresh_token({"sub": user_id})
    
    # Create session record
    session_id = str(uuid.uuid4())
    session_data = {
        "session_id": session_id,
        "user_id": user_id,
        "user_data": user_data,
        "device_info": device_info,
        "refresh_token": refresh_token,
        "created_at": time.time(),
        "last_accessed": time.time(),
        "is_active": True
    }
    
    # Store session in Redis (7-day expiry)
    session_key = f"session:{session_id}"
    await redis_client.setex(session_key, 86400 * 7, session_data)
    
    # Add to user's active sessions
    user_sessions_key = f"user_sessions:{user_id}"
    await redis_client.sadd(user_sessions_key, session_id)
    await redis_client.expire(user_sessions_key, 86400 * 7)
    
    return access_token, refresh_token


async def validate_refresh_token(refresh_token: str, user_id: str) -> bool:
    """Validate refresh token exists in active sessions"""
    
    try:
        user_sessions_key = f"user_sessions:{user_id}"
        active_sessions = await redis_client.smembers(user_sessions_key)
        
        for session_id in active_sessions:
            session_key = f"session:{session_id}"
            session_data = await redis_client.get_json(session_key)
            
            if session_data and session_data.get("refresh_token") == refresh_token:
                return session_data.get("is_active", False)
        
        return False
        
    except Exception:
        return False


async def update_session_access_time(user_id: str, refresh_token: str):
    """Update session last accessed time"""
    
    try:
        user_sessions_key = f"user_sessions:{user_id}"
        active_sessions = await redis_client.smembers(user_sessions_key)
        
        for session_id in active_sessions:
            session_key = f"session:{session_id}"
            session_data = await redis_client.get_json(session_key)
            
            if session_data and session_data.get("refresh_token") == refresh_token:
                session_data["last_accessed"] = time.time()
                await redis_client.setex(session_key, 86400 * 7, session_data)
                break
                
    except Exception:
        pass  # Non-critical operation


async def revoke_user_session(user_id: str, refresh_token: str):
    """Revoke a specific user session"""
    
    try:
        user_sessions_key = f"user_sessions:{user_id}"
        active_sessions = await redis_client.smembers(user_sessions_key)
        
        for session_id in active_sessions:
            session_key = f"session:{session_id}"
            session_data = await redis_client.get_json(session_key)
            
            if session_data and session_data.get("refresh_token") == refresh_token:
                # Mark session as inactive
                session_data["is_active"] = False
                session_data["revoked_at"] = time.time()
                await redis_client.setex(session_key, 3600, session_data)  # Keep for 1 hour for audit
                
                # Remove from active sessions
                await redis_client.srem(user_sessions_key, session_id)
                break
                
    except Exception:
        pass  # Non-critical operation


def set_secure_cookies(response: Response, access_token: str, refresh_token: str):
    """Set secure HTTP-only cookies for tokens"""
    
    # Access token cookie (15 minutes)
    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=15 * 60,  # 15 minutes
        httponly=True,
        secure=True,  # HTTPS only in production
        samesite="lax"
    )
    
    # Refresh token cookie (7 days)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        max_age=7 * 24 * 60 * 60,  # 7 days
        httponly=True,
        secure=True,  # HTTPS only in production
        samesite="lax"
    )


async def get_current_user_optional(request: Request) -> Optional[Dict[str, Any]]:
    """Get current user (optional - allows free trial usage)"""
    
    try:
        # Try to get token from Authorization header
        auth_header = request.headers.get("authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            # Try to get from cookie
            token = request.cookies.get("access_token")
        
        if not token:
            return None
        
        # Verify token
        payload = verify_token(token, "access")
        return payload
        
    except Exception:
        return None


async def require_auth(request: Request) -> Dict[str, Any]:
    """Require authentication (no optional)"""
    
    user = await get_current_user_optional(request)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return user
