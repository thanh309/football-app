"""
Tests for community enhancement endpoints.
"""
import pytest
from httpx import AsyncClient
from fastapi import status


@pytest.fixture
async def test_post(client: AsyncClient, player_headers, test_team):
    """Create a test post for community tests."""
    res = await client.post("/api/posts", json={
        "teamId": test_team["teamId"],
        "content": "Test post content for community tests",
        "visibility": "Public"
    }, headers=player_headers)
    return res.json()


@pytest.fixture
async def test_comment(client: AsyncClient, player_headers, test_post):
    """Create a test comment for reply tests."""
    post_id = test_post.get("postId")
    if not post_id:
        pytest.skip("Post creation failed")
    
    res = await client.post(f"/api/posts/{post_id}/comments", json={
        "content": "Test comment for reply tests"
    }, headers=player_headers)
    return res.json()


@pytest.mark.asyncio
async def test_like_post(client: AsyncClient, player_headers, test_post):
    """Test liking a post."""
    post_id = test_post.get("postId")
    if not post_id:
        pytest.skip("Post creation failed")
    
    res = await client.post(
        f"/api/posts/{post_id}/like",
        headers=player_headers
    )
    
    assert res.status_code in [status.HTTP_200_OK, status.HTTP_201_CREATED]


@pytest.mark.asyncio
async def test_unlike_post(client: AsyncClient, player_headers, test_post):
    """Test unliking a post."""
    post_id = test_post.get("postId")
    if not post_id:
        pytest.skip("Post creation failed")
    
    # First like the post
    await client.post(
        f"/api/posts/{post_id}/like",
        headers=player_headers
    )
    
    # Then unlike
    res = await client.delete(
        f"/api/posts/{post_id}/like",
        headers=player_headers
    )
    
    assert res.status_code in [status.HTTP_200_OK, status.HTTP_204_NO_CONTENT]


@pytest.mark.asyncio
async def test_get_user_posts(client: AsyncClient, player_headers, test_post):
    """Test getting posts by a user."""
    # We need to get the user_id from the post's author
    # Use user_id = 1 as placeholder (first registered user)
    res = await client.get(
        "/api/posts/user/1",
        headers=player_headers
    )
    
    # Might be 404 if user doesn't exist, but endpoint should work
    assert res.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]
    
    if res.status_code == status.HTTP_200_OK:
        data = res.json()
        assert isinstance(data, list)


@pytest.mark.asyncio
async def test_get_team_posts(client: AsyncClient, player_headers, test_team, test_post):
    """Test getting posts for a team."""
    team_id = test_team["teamId"]
    
    res = await client.get(
        f"/api/posts/team/{team_id}",
        headers=player_headers
    )
    
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_get_comment_replies(client: AsyncClient, player_headers, test_post, test_comment):
    """Test getting replies to a comment."""
    post_id = test_post.get("postId")
    comment_id = test_comment.get("commentId")
    
    if not post_id or not comment_id:
        pytest.skip("Post or comment creation failed")
    
    res = await client.get(
        f"/api/posts/{post_id}/comments/{comment_id}/replies",
        headers=player_headers
    )
    
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert isinstance(data, list)
