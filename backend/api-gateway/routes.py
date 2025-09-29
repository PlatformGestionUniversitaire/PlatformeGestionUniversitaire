# api-gateway/routes.py
from fastapi import APIRouter
from httpx import AsyncClient

router = APIRouter()

SERVICE_URLS = {
    "auth": "http://auth_service:8001",
    "referentiel": "http://referentiel_service:8002",
    "emploi": "http://emploi_service:8003"
}