from sqlalchemy.orm import Session
from typing import Optional, List

from app.db.models.loan import Loan
from app.db.models.user import User  # Import User
from app.schemas.loan import LoanCreate

def create_loan(db: Session, loan: LoanCreate, user_id: int, risk_score: float):
    db_loan = Loan(**loan.dict(), user_id=user_id, default_risk_score=risk_score)
    db.add(db_loan)
    db.commit()
    db.refresh(db_loan)
    return db_loan

def get_loans(db: Session, user_id: Optional[int] = None) -> List[Loan]:
    if user_id:
        return db.query(Loan).filter(Loan.user_id == user_id).all()
    else:
        # For all loans (admin), join user_email
        query = db.query(Loan, User.email.label("user_email")).join(User, Loan.user_id == User.id)
        return [{"id": loan.id, "user_id": loan.user_id, "amount": loan.amount, "term": loan.term, "annual_inc": loan.annual_inc, "purpose": loan.purpose, "grade": loan.grade, "dti": loan.dti, "emp_length": loan.emp_length, "home_ownership": loan.home_ownership, "delinq_2yrs": loan.delinq_2yrs, "inq_last_6mths": loan.inq_last_6mths, "int_rate": loan.int_rate, "installment": loan.installment, "status": loan.status, "default_risk_score": loan.default_risk_score, "user_email": user_email} for loan, user_email in query.all()]

def get_loan(db: Session, loan_id: int):
    return db.query(Loan).filter(Loan.id == loan_id).first()

def update_loan_status(db: Session, loan_id: int, status: str):
    loan = get_loan(db, loan_id)
    if loan:
        loan.status = status
        db.commit()
        db.refresh(loan)
    return loan