import pytest
from httpx import AsyncClient
from fastapi import status

@pytest.mark.asyncio
async def test_create_field(client: AsyncClient, owner_headers):
    """Test creating a new field."""
    # Create Field
    payload = {
        "fieldName": "Test Field",
        "description": "A good field",
        "location": "Field City",
        "latitude": 10.5,
        "longitude": 20.5,
        "defaultPricePerHour": 100.0,
        "capacity": 14
    }
    response = await client.post("/api/fields", json=payload, headers=owner_headers)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["fieldName"] == payload["fieldName"]
    assert data["ownerId"] is not None

@pytest.mark.asyncio
async def test_get_my_fields(client: AsyncClient, owner_headers, test_field):
    """Test getting fields for current user."""
    # test_field fixture creates a field for owner_headers user
    
    # Get My Fields
    response = await client.get("/api/fields/my-fields", headers=owner_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 1
    assert data[0]["fieldName"] == test_field["fieldName"]
@pytest.mark.asyncio
async def test_get_field_by_id(client: AsyncClient, owner_headers, test_field):
    """Test retrieving field by ID."""
    response = await client.get(f"/api/fields/{test_field['fieldId']}", headers=owner_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["fieldId"] == test_field["fieldId"]
    assert data["fieldName"] == test_field["fieldName"]

@pytest.mark.asyncio
async def test_update_field(client: AsyncClient, owner_headers, test_field):
    """Test updating field details."""
    payload = {
        "description": "Updated Description",
        "defaultPricePerHour": 120.0
    }
    # Using PUT /api/fields/{field_id}
    # Schema check: FieldProfileUpdate usually allows partial? Or maybe all fields?
    # Based on `app/controllers/field_controller.py`:
    # @router.put("/{field_id}") async def update_field(..., data: FieldProfileUpdate)
    # FieldProfileUpdate typically Pydantic, if fields optional it's PATCH-like, but method is PUT.
    # Usually better to provide full relevant fields or strict partial if explicitly allowed.
    # For safety, let's assume partials are handled or providing keys is enough.
    # If not, we might get 422 for missing required fields.
    # Let's inspect app/schemas/field.py if fails. For now, try partial.
    response = await client.put(f"/api/fields/{test_field['fieldId']}", json=payload, headers=owner_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["description"] == "Updated Description"
    assert data["defaultPricePerHour"] == 120.0

@pytest.mark.asyncio
async def test_get_field_calendar(client: AsyncClient, owner_headers, test_field):
    """Test getting field calendar."""
    # Endpoint: GET /api/fields/{field_id}/calendar
    # Params: date (optional, defaults to today/week?)
    response = await client.get(f"/api/fields/{test_field['fieldId']}/calendar", headers=owner_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    # Might be empty slots or generated slots.
    # Assuming list of slots.
