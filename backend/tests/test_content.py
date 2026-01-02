import pytest
from httpx import AsyncClient
from fastapi import status

@pytest.mark.asyncio
async def test_create_and_get_post(client: AsyncClient):
    """Test creating a post and retrieving feed."""
    # Auth
    reg_payload = {"username": "poster", "email": "poster@example.com", "password": "pass", "roles": ["Player"]}
    reg_res = await client.post("/api/auth/register", json=reg_payload)
    token = reg_res.json()["accessToken"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create Post
    payload = {
        "content": "Hello World!",
        "visibility": "Public"
    }
    response = await client.post("/api/posts", json=payload, headers=headers)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["content"] == "Hello World!"
    
    # Get Feed
    feed_res = await client.get("/api/posts", headers=headers)
    assert feed_res.status_code == status.HTTP_200_OK
    feed_data = feed_res.json()
    assert len(feed_data) >= 1
    assert feed_data[0]["content"] == "Hello World!"

@pytest.mark.asyncio
async def test_comment_on_post(client: AsyncClient):
    """Test commenting on a post."""
    # Auth
    reg_payload = {"username": "commenter", "email": "commenter@example.com", "password": "pass", "roles": ["Player"]}
    reg_res = await client.post("/api/auth/register", json=reg_payload)
    token = reg_res.json()["accessToken"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create Post
    post_res = await client.post("/api/posts", json={"content": "Topic", "visibility": "Public"}, headers=headers)
    post_id = post_res.json()["postId"]
    
    # Create comment
    c_payload = {"content": "Nice post", "visibility": "Public"}
    c_res = await client.post(f"/api/posts/{post_id}/comments", json=c_payload, headers=headers)
    
    assert c_res.status_code == status.HTTP_201_CREATED
    c_data = c_res.json()
    assert c_data["content"] == "Nice post"
    assert c_data["postId"] == post_id
