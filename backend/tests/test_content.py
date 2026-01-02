import pytest
from httpx import AsyncClient
from fastapi import status

@pytest.mark.asyncio
async def test_create_and_get_post(client: AsyncClient, player_headers, test_team):
    """Test creating a post and retrieving feed."""
    payload = {
        "content": "Hello World!",
        "visibility": "Public",
        "teamId": test_team["teamId"]
    }
    response = await client.post("/api/posts", json=payload, headers=player_headers)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["content"] == "Hello World!"
    
    # Get Feed
    feed_res = await client.get("/api/posts", headers=player_headers)
    assert feed_res.status_code == status.HTTP_200_OK
    feed_data = feed_res.json()
    assert len(feed_data) >= 1
    assert any(p["content"] == "Hello World!" for p in feed_data)

@pytest.mark.asyncio
async def test_comment_on_post(client: AsyncClient, player_headers, test_team):
    """Test commenting on a post."""
    # Create Post
    post_res = await client.post("/api/posts", json={"content": "Topic", "visibility": "Public", "teamId": test_team["teamId"]}, headers=player_headers)
    post_id = post_res.json()["postId"]
    
    # Create comment
    c_payload = {"content": "Nice post", "parentCommentId": None}
    c_res = await client.post(f"/api/posts/{post_id}/comments", json=c_payload, headers=player_headers)
    
    assert c_res.status_code == status.HTTP_201_CREATED
    c_data = c_res.json()
    assert c_data["content"] == "Nice post"
    assert c_data["postId"] == post_id

@pytest.mark.asyncio
async def test_get_post_by_id(client: AsyncClient, player_headers, test_team):
    """Test retrieving a single post by ID."""
    # Create Post
    post_res = await client.post("/api/posts", json={"content": "Single post", "visibility": "Public", "teamId": test_team["teamId"]}, headers=player_headers)
    post_id = post_res.json()["postId"]
    
    # Get by ID
    get_res = await client.get(f"/api/posts/{post_id}", headers=player_headers)
    assert get_res.status_code == status.HTTP_200_OK
    data = get_res.json()
    assert data["postId"] == post_id
    assert data["content"] == "Single post"

@pytest.mark.asyncio
async def test_delete_post(client: AsyncClient, player_headers, test_team):
    """Test deleting a post."""
    # Create Post
    post_res = await client.post("/api/posts", json={"content": "Delete me", "visibility": "Public", "teamId": test_team["teamId"]}, headers=player_headers)
    post_id = post_res.json()["postId"]
    
    # Delete
    del_res = await client.delete(f"/api/posts/{post_id}", headers=player_headers)
    assert del_res.status_code == status.HTTP_200_OK
    assert del_res.json()["message"] == "Post deleted"
    
    # Verify it's gone
    get_res = await client.get(f"/api/posts/{post_id}", headers=player_headers)
    assert get_res.status_code == status.HTTP_404_NOT_FOUND
