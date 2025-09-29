# api-gateway/main.py
import httpx

from services.auth_service.app.main import app


@app.post("/api/auth/login")
async def login(credentials: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://auth_service:8001/login",
            json=credentials
        )
    return response.json()