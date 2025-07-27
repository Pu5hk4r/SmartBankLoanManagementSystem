from fastapi import APIRouter, Depends, HTTPException

from app.schemas.user import User, UserCreate
from app.crud.crud_user import create_user, get_user_by_email
from app.db.session import get_db
from sqlalchemy.orm import Session

router = APIRouter(tags=["users"])

@router.post("/register", response_model=User)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db, user)