# auth_service/app/__init__.py
"""
Auth Service Application
"""

# auth_service/app/api/__init__.py
"""
API Routes
"""
from api import auth

# auth_service/app/models/__init__.py
"""
Database Models
"""
from models.user import User

__all__ = ["User"]

# auth_service/app/schemas/__init__.py
"""
Pydantic Schemas
"""
from schemas.user import (
    UserBase,
    UserCreate,
    UserLogin,
    UserResponse,
    UserUpdate,
    Token,
    TokenData
)

__all__ = [
    "UserBase",
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "UserUpdate",
    "Token",
    "TokenData"
]

# auth_service/app/services/__init__.py
"""
Business Logic Services
"""
from services.auth_service import AuthService

__all__ = ["AuthService"]

# auth_service/app/db/__init__.py
"""
Database Configuration
"""
from db.session import get_db, engine, AsyncSessionLocal, Base
from db.init_db import init_db, drop_db

__all__ = ["get_db", "engine", "AsyncSessionLocal", "Base", "init_db", "drop_db"]