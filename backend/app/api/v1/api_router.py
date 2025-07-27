from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, loans

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth")
api_router.include_router(users.router, prefix="/users")
api_router.include_router(loans.router, prefix="/loans")