from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.models import User, ExecutionHistory
from app.api.v2.auth import get_current_user

router = APIRouter()

# Pydantic models
class CreditBalance(BaseModel):
    balance: float
    tier: str
    last_updated: datetime

class CreditPurchase(BaseModel):
    amount: float
    payment_method: str

class CreditHistory(BaseModel):
    id: str
    amount: float
    transaction_type: str
    description: str
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/balance", response_model=CreditBalance)
async def get_credit_balance(current_user: User = Depends(get_current_user)):
    """Get user's current credit balance."""
    return CreditBalance(
        balance=current_user.credits_balance,
        tier=current_user.tier,
        last_updated=current_user.updated_at or current_user.created_at
    )

@router.post("/purchase")
async def purchase_credits(
    purchase_data: CreditPurchase,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Purchase credits (mock implementation)."""
    # Mock credit purchase - in production, integrate with Stripe
    if purchase_data.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Purchase amount must be positive"
        )
    
    # Update user's credit balance
    current_user.credits_balance += purchase_data.amount
    db.commit()
    
    return {
        "message": "Credits purchased successfully",
        "new_balance": current_user.credits_balance,
        "amount_purchased": purchase_data.amount
    }

@router.get("/history", response_model=List[CreditHistory])
async def get_credit_history(
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's credit transaction history."""
    # Mock credit history - in production, implement proper credit transaction tracking
    mock_history = [
        CreditHistory(
            id="mock-1",
            amount=10.0,
            transaction_type="purchase",
            description="Credit purchase via Stripe",
            created_at=datetime.utcnow()
        ),
        CreditHistory(
            id="mock-2",
            amount=-0.05,
            transaction_type="usage",
            description="Agent execution - Ticket Resolver",
            created_at=datetime.utcnow()
        )
    ]
    
    return mock_history[:limit]
