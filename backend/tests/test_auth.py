import pytest
from httpx import AsyncClient
from fastapi import status
import uuid

@pytest.mark.asyncio
async def test_register_user_success(client: AsyncClient):
    """Test successful user registration."""
    payload = {
        "username": f"testuser_{str(uuid.uuid4())[:6]}",
        "email": f"test_{str(uuid.uuid4())[:6]}@example.com",
        "password": "strongpassword123",
        "roles": ["Player"]
    }
    
    response = await client.post("/api/auth/register", json=payload)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert "accessToken" in data
    assert "refreshToken" in data
    assert data["user"]["username"] == payload["username"]

@pytest.mark.asyncio
async def test_login_user_success(client: AsyncClient):
    """Test successful user login."""
    username = f"loginuser_{str(uuid.uuid4())[:6]}"
    password = "loginpassword123"
    
    # Register
    await client.post("/api/auth/register", json={
        "username": username,
        "email": f"login_{str(uuid.uuid4())[:6]}@example.com",
        "password": password,
        "roles": ["Player"]
    })
    
    # Login
    response = await client.post("/api/auth/login", json={
        "username": username,
        "password": password
    })
    
    assert response.status_code == status.HTTP_200_OK
    assert "accessToken" in response.json()

@pytest.mark.asyncio
async def test_get_current_user_success(client: AsyncClient, player_headers):
    """Test getting current user profile with valid token."""
    response = await client.get("/api/auth/me", headers=player_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "username" in data

@pytest.mark.asyncio
async def test_login_invalid_credentials(client: AsyncClient):
    """Test login with wrong password."""
    username = f"wrong_{str(uuid.uuid4())[:6]}"
    password = "correctpassword"
    
    await client.post("/api/auth/register", json={
        "username": username,
        "email": f"wrong_{str(uuid.uuid4())[:6]}@example.com",
        "password": password,
        "roles": ["Player"]
    })
    
    response = await client.post("/api/auth/login", json={
        "username": username,
        "password": "wrongpassword"
    })
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.asyncio
async def test_logout(client: AsyncClient, player_headers):
    """Test logout."""
    # Logout usually just returns success if stateless or blacklists token
    response = await client.post("/api/auth/logout", headers=player_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == "Logged out successfully"

@pytest.mark.asyncio
async def test_refresh_token(client: AsyncClient):
    """Test refreshing token."""
    # Register to get refresh token
    res = await client.post("/api/auth/register", json={
        "username": f"refresh_{str(uuid.uuid4())[:6]}",
        "email": f"refresh_{str(uuid.uuid4())[:6]}@example.com",
        "password": "p", "roles": ["Player"]
    })
    refresh_token = res.json()["refreshToken"]
    
    # Refresh
    # Controller expects refresh_token as Query Param
    response = await client.post("/api/auth/refresh", params={"refresh_token": refresh_token})
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "accessToken" in data

@pytest.mark.asyncio
async def test_update_password(client: AsyncClient):
    """Test updating password."""
    password = "oldpassword"
    username = f"upd_pass_{str(uuid.uuid4())[:6]}"
    
    # Register/Login to get token
    reg_res = await client.post("/api/auth/register", json={
        "username": username, "email": f"upd_{str(uuid.uuid4())[:6]}@example.com",
        "password": password, "roles": ["Player"]
    })
    token = reg_res.json()["accessToken"]
    headers = {"Authorization": f"Bearer {token}"}
    
    new_password = "newpassword123"
    
    # Controller uses ChangePasswordRequest with camelCase keys
    response = await client.put("/api/auth/password", json={"currentPassword": password, "newPassword": new_password}, headers=headers)

    assert response.status_code == status.HTTP_200_OK
    
    # Verify login with new password
    login_res = await client.post("/api/auth/login", json={"username": username, "password": new_password})
    assert login_res.status_code == status.HTTP_200_OK
