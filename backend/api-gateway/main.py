# api-gateway/main.py
import httpx

# Configure logging for the gateway (shared config)
import services.auth_service.app.logging_config as logging_config  # noqa: F401

from services.auth_service.app.main import app


@app.post("/api/auth/login")
async def login(credentials: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://auth_service:8001/login",
            json=credentials
        )
    return response.json()