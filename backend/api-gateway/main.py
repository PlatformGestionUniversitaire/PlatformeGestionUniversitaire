from fastapi import FastAPI
from routes import router as api_router

app = FastAPI(
    title="University API Gateway",
    description="Point d’entrée unique pour les microservices universitaires",
    version="1.0.0"
)

# Montage des routes
app.include_router(api_router, prefix="/api")
