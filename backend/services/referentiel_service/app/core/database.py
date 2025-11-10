from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
try:
    # prefer the fixed config (config2) if present
    from app.core.config2 import settings
except Exception:
    from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
