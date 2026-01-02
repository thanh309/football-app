import pytest
import asyncio
from typing import AsyncGenerator, Generator
from fastapi.testclient import TestClient
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.config import get_settings

# Use in-memory SQLite for testing
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"



@pytest.fixture(scope="session")
async def db_engine():
    """Create a session-scoped database engine."""
    engine = create_async_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield engine
    
    # Drop tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    await engine.dispose()

@pytest.fixture(scope="function")
async def db_session(db_engine) -> AsyncGenerator[AsyncSession, None]:
    """Create a function-scoped database session."""
    async_session = async_sessionmaker(
        db_engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
        autocommit=False,
    )
    
    async with async_session() as session:
        yield session
        # Rollback after each test to ensure isolation
        await session.rollback()

@pytest.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Create a test client with overridden database dependency."""
    
    async def override_get_db():
        yield db_session
        
    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(app=app, base_url="http://test") as c:
        yield c
        
    app.dependency_overrides.clear()

import uuid

@pytest.fixture
def unique_id():
    return str(uuid.uuid4())[:8]

@pytest.fixture
async def create_auth_headers(client):
    """Factory to create a user and return auth headers."""
    async def _create(username_prefix, role="Player"):
        uid = str(uuid.uuid4())[:8]
        username = f"{username_prefix}_{uid}"
        payload = {
            "username": username,
            "email": f"{username}@test.com",
            "password": "password123",
            "roles": [role]
        }
        # Register
        reg_res = await client.post("/api/auth/register", json=payload)
        if reg_res.status_code != 201:
            raise ValueError(f"Register failed: {reg_res.text}")
            
        # Login
        login_res = await client.post("/api/auth/login", json={
            "username": username,
            "password": "password123"
        })
        if login_res.status_code != 200:
             raise ValueError(f"Login failed: {login_res.text}")
            
        token = login_res.json()["accessToken"]
        return {"Authorization": f"Bearer {token}"}
    return _create

@pytest.fixture
async def player_headers(create_auth_headers):
    return await create_auth_headers("player", "Player")

@pytest.fixture
async def owner_headers(create_auth_headers):
    return await create_auth_headers("owner", "FieldOwner")

@pytest.fixture
async def test_team(client, player_headers):
    """Create a default team."""
    team_name = f"Team_{str(uuid.uuid4())[:6]}"
    res = await client.post("/api/teams", json={
        "teamName": team_name,
        "description": "Test Team",
        "logoUrl": "http://example.com/logo.png",
        "location": "Test City",
        "latitude": 10.0,
        "longitude": 10.0
    }, headers=player_headers)
    return res.json()

@pytest.fixture
async def test_field(client, owner_headers, db_session):
    """Create a default field."""
    field_name = f"Field_{str(uuid.uuid4())[:6]}"
    res = await client.post("/api/fields", json={
        "fieldName": field_name,
        "description": "Test Field",
        "location": "Test Location",
        "latitude": 20.0,
        "longitude": 20.0,
        "defaultPricePerHour": 50.0,
        "capacity": 14
    }, headers=owner_headers)
    
    field_id = res.json()["fieldId"]
    
    # Verify field manually to ensure it's available for bookings/matches
    from app.repositories.field_repository import FieldRepository
    from app.models.enums import FieldStatus
    
    field_repo = FieldRepository(db_session)
    field = await field_repo.find_by_id(field_id)
    if field:
        field.status = FieldStatus.VERIFIED
        await field_repo.update(field)
    
    return {**res.json(), "fieldId": field_id}

