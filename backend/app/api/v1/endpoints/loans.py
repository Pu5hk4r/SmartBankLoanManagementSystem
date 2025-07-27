from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional

from app.schemas.loan import Loan, LoanCreate
from app.crud.crud_loan import create_loan, get_loans, update_loan_status
from app.core.security import get_current_user, get_current_admin
from app.db.models.user import User
from app.db.session import get_db
from app.ml.predict import predict_loan_risk
from sqlalchemy.orm import Session

router = APIRouter(tags=["loans"])

@router.post("/apply", response_model=Loan)
def apply_loan(loan: LoanCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    input_data = loan.dict()
    # Map 'amount' to 'loan_amnt' for the ML model
    input_data['loan_amnt'] = input_data.pop('amount')
    risk_score = predict_loan_risk(input_data)
    return create_loan(db, loan, current_user.id, risk_score)

@router.get("/my-loans", response_model=List[Loan])
def get_my_loans(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_loans(db, user_id=current_user.id)

@router.get("/all-loans", response_model=List[Loan])
def get_all_loans(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    return get_loans(db)

@router.put("/approve/{loan_id}", response_model=Loan)
def approve_loan(loan_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    loan = update_loan_status(db, loan_id, "approved")
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return loan

@router.put("/reject/{loan_id}", response_model=Loan)
def reject_loan(loan_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin)):
    loan = update_loan_status(db, loan_id, "rejected")
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return loan