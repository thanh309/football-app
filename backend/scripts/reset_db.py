#!/usr/bin/env python3
"""
Reset the database by dropping and recreating all tables.

Usage:
    python scripts/reset_db.py
"""
import asyncio
import sys
from pathlib import Path

# Add parent dir to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

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
