
import pytest
from httpx import AsyncClient
from fastapi import status
from datetime import date, timedelta
import uuid

@pytest.mark.asyncio
async def test_notification_flow(client: AsyncClient, player_headers, test_team, test_field, create_auth_headers):
    """Test notification generation and marking as read."""
    # 1. Trigger Notification (e.g. Match Invite)
    # Host (player_headers/test_team) invites Guest
    
    # Guest
    guest_headers = await create_auth_headers("guest")
    g_team_res = await client.post("/api/teams", json={
        "teamName": f"Guest FC {str(uuid.uuid4())[:6]}",
        "description": "Guest team", "logoUrl": "U", "location": "L", "latitude": 0, "longitude": 0
    }, headers=guest_headers)
    g_team_id = g_team_res.json()["teamId"]
    
    # Match
    match_payload = {
        "hostTeamId": test_team["teamId"],
        "matchDate": (date.today() + timedelta(days=10)).isoformat(),
        "startTime": "16:00:00",
        "fieldId": test_field["fieldId"],
        "visibility": "Public", "description": "Notify me"
    }
    match_res = await client.post("/api/matches", json=match_payload, headers=player_headers)
    match_id = match_res.json()["matchId"]
    
    # Invite Guest -> Should notify Guest Leader
    inv_payload = {"invitedTeamId": g_team_id, "message": "Inviting you"}
    await client.post(f"/api/matches/{match_id}/invitations", json=inv_payload, headers=player_headers)
    
    # 2. Guest checks notifications
    n_res = await client.get("/api/notifications", headers=guest_headers)
    assert n_res.status_code == status.HTTP_200_OK
    notifications = n_res.json()
    assert len(notifications) >= 1
    # Check type
    assert any(n["type"] == "MatchInvite" for n in notifications)
    
    nid = notifications[0]["notificationId"]
    
    # 3. Mark as read
    read_res = await client.put(f"/api/notifications/{nid}/read", headers=guest_headers)
    assert read_res.status_code == status.HTTP_200_OK
    
    # 4. Verify read status
    # Get all
    n_res_2 = await client.get("/api/notifications", headers=guest_headers)
    notifications_2 = n_res_2.json()
    target = next(n for n in notifications_2 if n["notificationId"] == nid)
    assert target["isRead"] is True

@pytest.mark.asyncio
async def test_mark_all_read(client: AsyncClient, player_headers, test_team, test_field, create_auth_headers):
    """Test marking all notifications as read."""
    # Setup Guest to receive notifications
    guest_headers = await create_auth_headers("guest_notify")
    g_team_res = await client.post("/api/teams", json={
        "teamName": f"Notify FC {str(uuid.uuid4())[:6]}",
        "description": "Desc", "logoUrl": "U", "location": "L", "latitude": 0, "longitude": 0
    }, headers=guest_headers)
    g_team_id = g_team_res.json()["teamId"]
    
    # Create Match & Invite to trigger notification
    match_payload = {
        "hostTeamId": test_team["teamId"],
        "matchDate": (date.today() + timedelta(days=11)).isoformat(),
        "startTime": "17:00:00",
        "fieldId": test_field["fieldId"],
        "visibility": "Public", "description": "Notify me all"
    }
    match_res = await client.post("/api/matches", json=match_payload, headers=player_headers)
    match_id = match_res.json()["matchId"]
    
    await client.post(f"/api/matches/{match_id}/invitations", json={"invitedTeamId": g_team_id, "message": "1"}, headers=player_headers)
    
    # Check unread count or existence
    n_res = await client.get("/api/notifications?unread_only=true", headers=guest_headers)
    assert len(n_res.json()) >= 1
    
    # Mark All Read
    res = await client.put("/api/notifications/mark-all-read", headers=guest_headers)
    assert res.status_code == status.HTTP_200_OK
    
    # Check unread count is 0
    n_res_after = await client.get("/api/notifications?unread_only=true", headers=guest_headers)
    assert len(n_res_after.json()) == 0
