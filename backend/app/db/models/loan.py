from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy.sql import func

from app.db.base import Base

class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    amount = Column(Float)
    term = Column(String)
    status = Column(String, default="pending")
    annual_inc = Column(Float)
    purpose = Column(String)
    grade = Column(String)
    dti = Column(Float)
    emp_length = Column(String)
    home_ownership = Column(String)
    delinq_2yrs = Column(Integer)
    inq_last_6mths = Column(Integer)
    int_rate = Column(Float)
    installment = Column(Float)
    default_risk_score = Column(Float)
    created_at = Column(DateTime, server_default=func.now())