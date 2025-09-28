from fastapi import APIRouter, Request
import httpx
from config import (
    AUTH_SERVICE_URL, REFERENTIEL_SERVICE_URL, EMPLOI_SERVICE_URL,
    ABSENCE_SERVICE_URL, NOTIFICATION_SERVICE_URL, MESSAGING_SERVICE_URL,
    ANALYTIC_SERVICE_URL, EVENT_SERVICE_URL
)

router = APIRouter()

# Dictionnaire des routes → services
SERVICE_MAP = {
    "auth": AUTH_SERVICE_URL,
    "referentiel": REFERENTIEL_SERVICE_URL,
    "emploi": EMPLOI_SERVICE_URL,
    "absence": ABSENCE_SERVICE_URL,
    "notification": NOTIFICATION_SERVICE_URL,
    "messaging": MESSAGING_SERVICE_URL,
    "analytic": ANALYTIC_SERVICE_URL,
    "event": EVENT_SERVICE_URL,
}

@router.api_route("/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy(service: str, path: str, request: Request):
    """
    Proxy qui redirige les requêtes vers le microservice correspondant
    Exemple : /api/auth/login → http://localhost:8001/login
    """
    if service not in SERVICE_MAP:
        return {"error": "Service non reconnu"}

    target_url = f"{SERVICE_MAP[service]}/{path}"

    # Recrée la requête (méthode, headers, body)
    async with httpx.AsyncClient() as client:
        response = await client.request(
            request.method,
            target_url,
            headers=request.headers.raw,
            content=await request.body()
        )
    return response.json()
