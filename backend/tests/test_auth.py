import pytest
from httpx import AsyncClient
from fastapi import status

@pytest.mark.asyncio
async def test_register_user_success(client: AsyncClient):
    """Test successful user registration."""
    payload = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "strongpassword123",
        "roles": ["Player"]
    }
    
    response = await client.post("/api/auth/register", json=payload)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert "accessToken" in data
    assert "refreshToken" in data
    assert data["user"]["username"] == payload["username"]
    assert data["user"]["email"] == payload["email"]


@pytest.mark.asyncio
async def test_login_user_success(client: AsyncClient):
    """Test successful user login."""
    # First register a user
    register_payload = {
        "username": "loginuser",
        "email": "login@example.com",
        "password": "loginpassword123",
        "roles": ["Player"]
    }
    await client.post("/api/auth/register", json=register_payload)
    
    # Then try to login
    login_payload = {
        "username": "loginuser",
        "password": "loginpassword123"
    }
    
    response = await client.post("/api/auth/login", json=login_payload)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "accessToken" in data
    assert data["user"]["username"] == register_payload["username"]


@pytest.mark.asyncio
async def test_get_current_user_success(client: AsyncClient):
    """Test getting current user profile with valid token."""
    # Register and get token
    register_payload = {
        "username": "meuser",
        "email": "me@example.com",
        "password": "mepassword123",
        "roles": ["Player"]
    }
    reg_response = await client.post("/api/auth/register", json=register_payload)
    access_token = reg_response.json()["accessToken"]
    
    # Get profile using token
    headers = {"Authorization": f"Bearer {access_token}"}
    response = await client.get("/api/auth/me", headers=headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["username"] == register_payload["username"]
    assert data["email"] == register_payload["email"]


@pytest.mark.asyncio
async def test_login_invalid_credentials(client: AsyncClient):
    """Test login with wrong password."""
    # Register
    register_payload = {
        "username": "wrongpassuser",
        "email": "wrongpass@example.com",
        "password": "correctpassword",
        "roles": ["Player"]
    }
    await client.post("/api/auth/register", json=register_payload)
    
    # Login with wrong password
    login_payload = {
        "username": "wrongpassuser",
        "password": "wrongpassword"
    }
    
    response = await client.post("/api/auth/login", json=login_payload)
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
