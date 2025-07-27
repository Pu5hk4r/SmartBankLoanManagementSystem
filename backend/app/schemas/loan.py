from pydantic import BaseModel

class LoanBase(BaseModel):
    amount: float
    term: str
    annual_inc: float
    purpose: str
    grade: str
    dti: float
    emp_length: str
    home_ownership: str
    delinq_2yrs: int
    inq_last_6mths: int
    int_rate: float
    installment: float

class LoanCreate(LoanBase):
    pass

class Loan(LoanBase):
    id: int
    user_id: int
    status: str
    default_risk_score: float
    user_email: str = None  # Added optional for admin view

    class Config:
        from_attributes = True