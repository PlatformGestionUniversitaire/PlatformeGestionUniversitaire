# referentiel_service

Minimal referentiel microservice (FastAPI + SQLAlchemy)

Requirements
- Python 3.11
- PostgreSQL

Setup
1. Create a virtualenv and install requirements:

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt
```

2. Configure `.env` with DATABASE_URL, for example:

```
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/referentiel_db
```

3. Create DB tables:

```powershell
python create_tables.py
```

4. Run the app with uvicorn:

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Docker

Build and run:

```powershell
docker build -t referentiel_service .
docker run -e DATABASE_URL="postgresql+psycopg2://user:password@host:5432/referentiel_db" -p 8000:8000 referentiel_service
```

Notes
- This is a minimal scaffold. Adjust models, migrations (alembic), and error handling as needed.
