import os
from dotenv import load_dotenv

load_dotenv()

# URL des microservices
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001")
REFERENTIEL_SERVICE_URL = os.getenv("REFERENTIEL_SERVICE_URL", "http://localhost:8002")
EMPLOI_SERVICE_URL = os.getenv("EMPLOI_SERVICE_URL", "http://localhost:8003")
ABSENCE_SERVICE_URL = os.getenv("ABSENCE_SERVICE_URL", "http://localhost:8004")
NOTIFICATION_SERVICE_URL = os.getenv("NOTIFICATION_SERVICE_URL", "http://localhost:8005")
MESSAGING_SERVICE_URL = os.getenv("MESSAGING_SERVICE_URL", "http://localhost:8006")
ANALYTIC_SERVICE_URL = os.getenv("ANALYTIC_SERVICE_URL", "http://localhost:8007")
EVENT_SERVICE_URL = os.getenv("EVENT_SERVICE_URL", "http://localhost:8008")
