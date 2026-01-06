# Batch 2: Search & Discovery Use Cases - Sequence Diagrams

---

## Use Case: Search for Teams (UC-SD-01)

### Actors
- Primary: User (any logged-in user)

### Components
- UI/Boundary: SearchBar, SearchResultsView
- Controllers: SearchController (`search_controller.search_teams`)
- Displays: EmptyStateDisplay
- Entities: TeamProfile

### Sequence Flow (Detailed)
1. The User initiates the interaction by entering search criteria (name, location, skill level) in `SearchBar`.
2. The SearchController receives the query via `GET /api/search/teams` with query parameters.
3. The controller builds a SQL query filtering `TeamProfile` where `status == TeamStatus.VERIFIED`.
4. The controller applies filters: `team_name.ilike()`, `location.ilike()`, `skill_level` range checks.
5. If no matches found:
   - The system instantiates `EmptyStateDisplay` using `<<create>>` with "No results found" message.
6. If matches found:
   - The system instantiates `SearchResultsView` using `<<create>>` with list of `TeamProfileResponse`.
7. The User views the search results.

---

## Use Case: Search for Fields (UC-SD-02)

### Actors
- Primary: User (any logged-in user)

### Components
- UI/Boundary: SearchBar, SearchResultsView
- Controllers: SearchController (`search_controller.search_fields`)
- Displays: EmptyStateDisplay
- Entities: FieldProfile, FieldAmenity

### Sequence Flow (Detailed)
1. The User initiates the interaction by entering search criteria (location, price range, amenities) in `SearchBar`.
2. The SearchController receives the query via `GET /api/search/fields` with query parameters.
3. The controller builds a SQL query filtering `FieldProfile` where `status == FieldStatus.VERIFIED`.
4. The controller applies filters: `field_name.ilike()`, `location.ilike()`, `default_price_per_hour` range, and `FieldAmenity` subquery for amenity matching.
5. If no matches found:
   - The system instantiates `EmptyStateDisplay` using `<<create>>`.
6. If matches found:
   - The system instantiates `SearchResultsView` using `<<create>>` with list of `FieldProfileResponse`.
7. The User views the search results.

---

## Use Case: Search for Players (UC-SD-03)

### Actors
- Primary: User (any logged-in user)

### Components
- UI/Boundary: SearchBar, SearchResultsView
- Controllers: SearchController (`search_controller.search_players`)
- Displays: EmptyStateDisplay
- Entities: PlayerProfile

### Sequence Flow (Detailed)
1. The User initiates the interaction by entering search criteria (name, position, skill level) in `SearchBar`.
2. The SearchController receives the query via `GET /api/search/players` with query parameters.
3. The controller builds a SQL query on `PlayerProfile`.
4. The controller applies filters: `display_name.ilike()`, `position.ilike()`, `skill_level` range checks.
5. If no matches found:
   - The system instantiates `EmptyStateDisplay` using `<<create>>`.
6. If matches found:
   - The system instantiates `SearchResultsView` using `<<create>>` with list of `PlayerProfileResponse`.
7. The User views the search results.

---

## Use Case: Search for Field Owners (UC-SD-04)

### Actors
- Primary: User (any logged-in user)

### Components
- UI/Boundary: SearchBar, SearchResultsView
- Controllers: SearchController (`search_controller.search_owners`)
- Displays: EmptyStateDisplay
- Entities: UserAccount, FieldProfile

### Sequence Flow (Detailed)
1. The User initiates the interaction by entering search criteria (owner name, location) in `SearchBar`.
2. The SearchController receives the query via `GET /api/search/owners` with query parameters.
3. The controller builds a SQL query joining `UserAccount` with `FieldProfile` on `owner_id`, grouped by user with `COUNT(field_id) > 0`.
4. The controller applies filters: `username.ilike()`, `location.ilike()`.
5. If no matches found:
   - The system instantiates `EmptyStateDisplay` using `<<create>>`.
6. If matches found:
   - The system instantiates `SearchResultsView` using `<<create>>` with list of `OwnerSearchResponse` (includes `fieldCount`).
7. The User views the search results.

---

## Use Case: View Match Information (UC-SD-05)

### Actors
- Primary: User (Player, Team Leader, Moderator, Field Owner)

### Components
- UI/Boundary: MatchDetailView
- Controllers: MatchController (`match_controller.get_match`)
- Displays: ErrorMessageDisplay
- Entities: MatchEvent

### Sequence Flow (Detailed)
1. The User initiates the interaction by selecting a match from a team profile or schedule.
2. The MatchController receives the request via `GET /api/matches/{match_id}`.
3. The controller calls `MatchService.get_match_by_id(match_id)` to retrieve the `MatchEvent` entity.
4. If match not found:
   - The controller raises `HTTPException(status_code=404, detail="Match not found")`.
   - The system instantiates `ErrorMessageDisplay` using `<<create>>`.
5. If match found:
   - The controller converts to `MatchEventResponse` via `match_to_response()`.
   - The system instantiates `MatchDetailView` using `<<create>>` showing date, time, venue, teams, and status.
6. The User views the match details.

---

## Summary Table

| Use Case | HTTP Endpoint | Controller | Key Entities |
|----------|---------------|------------|--------------|
| UC-SD-01 Search Teams | `GET /api/search/teams` | `search_controller.search_teams` | TeamProfile |
| UC-SD-02 Search Fields | `GET /api/search/fields` | `search_controller.search_fields` | FieldProfile, FieldAmenity |
| UC-SD-03 Search Players | `GET /api/search/players` | `search_controller.search_players` | PlayerProfile |
| UC-SD-04 Search Owners | `GET /api/search/owners` | `search_controller.search_owners` | UserAccount, FieldProfile |
| UC-SD-05 View Match | `GET /api/matches/{match_id}` | `match_controller.get_match` | MatchEvent |
