import asyncio
import os
import sys

# Ensure the parent directory is in the path to run as a script if needed
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database import engine, Base

# Import all models to ensure they are registered in Base.metadata
from app.models import (
    booking, enums, field, match, media, moderation,
    notification, player, social, team, user
)

async def reset_db():
    print("Resetting database...")
    print(f"Registered tables: {list(Base.metadata.tables.keys())}")
    
    async with engine.begin() as conn:
        print("Dropping all tables...")
        await conn.run_sync(Base.metadata.drop_all)
        print("Creating all tables...")
        await conn.run_sync(Base.metadata.create_all)
    
    print("Database reset successfully.")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(reset_db())
