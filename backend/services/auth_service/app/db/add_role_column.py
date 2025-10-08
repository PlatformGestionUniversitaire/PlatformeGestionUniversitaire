import asyncio
import logging
from sqlalchemy import text
from db.session import engine

logger = logging.getLogger(__name__)


async def ensure_role_column():
    """Ensure the 'role' column exists on the users table.

    If the column is missing, this runs an ALTER TABLE statement to add it with
    a sensible default so existing rows are valid.
    """
    async with engine.begin() as conn:
        # Check if column exists
        res = await conn.execute(text("""
            SELECT column_name FROM information_schema.columns
            WHERE table_name = 'users' AND column_name = 'role';
        """))
        row = res.first()

        if row:
            logger.info("Column 'role' already exists on users table.")
            print("Column 'role' already exists on users table.")
            return

        logger.info("Adding column 'role' to users table...")
        print("Adding column 'role' to users table...")
        # Add the column with a default so existing rows get a value
        await conn.execute(text(
            "ALTER TABLE users ADD COLUMN role VARCHAR(32) NOT NULL DEFAULT 'etudiant';"
        ))

        logger.info("Column 'role' added.")
        print("Column 'role' added.")


if __name__ == "__main__":
    asyncio.run(ensure_role_column())
