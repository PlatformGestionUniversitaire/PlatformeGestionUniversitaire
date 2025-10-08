import logging
import os

def configure_logging():
    """Central logging configuration for all services.

    - Sets a friendly default format
    - Lowers verbosity of sqlalchemy.engine and uvicorn access logs
    """
    level_name = os.getenv("LOG_LEVEL", "INFO").upper()
    try:
        level = getattr(logging, level_name)
    except Exception:
        level = logging.INFO

    logging.basicConfig(
        level=level,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )

    # SQL query noise is typically emitted by this logger at INFO when echo=True
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    # Keep uvicorn error messages visible but quieten access logs by default
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


configure_logging()
