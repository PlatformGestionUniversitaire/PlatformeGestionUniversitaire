from app.db.session import Base, engine
from app.models.user import User

def init_db():
    Base.metadata.create_all(bind=engine)
