from fastapi import FastAPI
from app.api import auth
from app.db.init_db import init_db

app = FastAPI(title="Auth Service")

# Inclure les routes
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Initialiser la base de données au démarrage
@app.on_event("startup")
def on_startup():
    init_db()
