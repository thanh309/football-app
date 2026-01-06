# Batch 3: Team Leader Use Cases Part 1 - Sequence Diagrams

---

## Use Case: Create Team Profile (UC-TL-01)

### Actors
- Primary: Team Leader

### Components
- UI/Boundary: TeamCreationForm
- Controllers: TeamController (`team_controller.create_team`)
- Services: TeamService (`TeamService.create_team`)
- Dependencies: `get_current_user`
- Displays: SuccessMessageDisplay, ErrorMessageDisplay
- Entities: TeamProfile

### Sequence Flow (Detailed)
1. The Team Leader initiates the interaction by clicking "Create Team" on the dashboard.
2. The system instantiates `TeamCreationForm` using `<<create>>`.
3. The Team Leader enters team details (name, description, location) and submits.
4. The `get_current_user` dependency verifies the JWT and retrieves `UserAccount`.
5. The TeamController calls `TeamService.create_team(leader_id, team_name, description, location)`.
6. If validation fails (e.g., duplicate name):
   - The service raises `ValueError`, controller returns `HTTPException(status_code=400)`.
   - The system creates `ErrorMessageDisplay` using `<<create>>`.
7. If validation succeeds:
   - The service creates a new `TeamProfile` entity using `<<create>>` with status `PENDING`.
   - The system displays `SuccessMessageDisplay` and redirects to the team dashboard.

---

## Use Case: Edit Team Profile (UC-TL-02)

### Actors
- Primary: Team Leader

### Components
- UI/Boundary: TeamProfileView, TeamEditForm
- Controllers: TeamController (`team_controller.update_team`)
- Services: TeamService (`TeamService.update_team`)
- Dependencies: `get_current_user`
- Displays: SuccessMessageDisplay
- Entities: TeamProfile

### Sequence Flow (Detailed)
1. The Team Leader initiates the interaction by clicking "Edit Team" on TeamProfileView.
2. The system instantiates `TeamEditForm` using `<<create>>` pre-filled with current data.
3. The Team Leader updates fields and clicks "Save".
4. The `get_current_user` dependency verifies the JWT.
5. The TeamController calls `TeamService.get_team_by_id(team_id)` and verifies `team.leader_id == user.user_id`.
6. If not authorized:
   - The controller raises `HTTPException(status_code=403, detail="Not authorized")`.
7. If authorized:
   - The controller calls `TeamService.update_team(team, **data)` to update `TeamProfile` entity.
   - The system displays `SuccessMessageDisplay` and refreshes the view.

---

## Use Case: Manage Team Roster (UC-TL-03)

### Actors
- Primary: Team Leader
- Secondary: Player (Receiver of notification)

### Components
- UI/Boundary: RosterManagementView
- Controllers: TeamController (`team_controller.add_player_to_roster`, `team_controller.remove_player_from_roster`)
- Repositories: RosterRepository
- Dependencies: `get_current_user`
- Displays: SuccessMessageDisplay
- Entities: TeamRoster, Notification

### Sequence Flow (Detailed)
1. The Team Leader initiates the interaction by opening RosterManagementView via `GET /api/teams/{team_id}/roster`.
2. The system displays the current list of players from `RosterRepository.find_by_team()`.
3. To add a player: Team Leader calls `POST /api/teams/{team_id}/roster` with `RosterAddPlayerRequest`.
   - The controller verifies `team.leader_id == user.user_id`.
   - The controller creates a `TeamRoster` entity using `<<create>>` via `RosterRepository.save()`.
4. To remove a player: Team Leader calls `DELETE /api/teams/{team_id}/roster/{player_id}`.
   - The controller calls `RosterRepository.delete()` to remove the player association.
5. The system displays `SuccessMessageDisplay` and updates the roster list.

---

## Use Case: Approve Player Requests (UC-TL-04)

### Actors
- Primary: Team Leader
- Secondary: Player (Requester)

### Components
- UI/Boundary: JoinRequestList
- Controllers: TeamController (`team_controller.get_join_requests`, `team_controller.process_join_request`)
- Services: TeamService (`TeamService.process_join_request`)
- Repositories: JoinRequestRepository
- Dependencies: `get_current_user`
- Displays: SuccessMessageDisplay
- Entities: JoinRequest, TeamRoster, Notification

### Sequence Flow (Detailed)
1. The Team Leader initiates the interaction by viewing pending requests via `GET /api/teams/{team_id}/join-requests`.
2. The controller calls `TeamService.get_pending_requests(team_id)` after verifying leader authorization.
3. The Team Leader clicks "Accept" or "Reject" for a specific player via `PUT /api/join-requests/{request_id}/{action}`.
4. The controller retrieves the `JoinRequest` via `JoinRequestRepository.find_by_id()`.
5. The controller calls `TeamService.process_join_request(request, accept=True/False)`.
6. If Accepted:
   - The service updates `JoinRequest.status` to `ACCEPTED`.
   - The service creates a `TeamRoster` entry using `<<create>>`.
7. If Rejected:
   - The service updates `JoinRequest.status` to `REJECTED`.
8. The system displays `SuccessMessageDisplay` and removes the request from the pending list.

---

## Use Case: Delete Team (UC-TL-05)

### Actors
- Primary: Team Leader
- Secondary: Team Members (Receiver of notification)

### Components
- UI/Boundary: TeamSettingsView
- Controllers: TeamController (`team_controller.delete_team`)
- Services: TeamService (`TeamService.delete_team`)
- Dependencies: `get_current_user`
- Displays: ConfirmationDialog, SuccessMessageDisplay
- Entities: TeamProfile, TeamRoster, Notification

### Sequence Flow (Detailed)
1. The Team Leader initiates the interaction by clicking "Delete Team" in TeamSettingsView.
2. The system instantiates `ConfirmationDialog` using `<<create>>` with critical warning.
3. The Team Leader confirms deletion.
4. The `get_current_user` dependency verifies the JWT.
5. The TeamController calls `TeamService.get_team_by_id(team_id)` and verifies `team.leader_id == user.user_id`.
6. If not authorized:
   - The controller raises `HTTPException(status_code=403)`.
7. If authorized:
   - The controller calls `TeamService.delete_team(team)` to delete or soft-delete the `TeamProfile`.
   - The system displays `SuccessMessageDisplay` and redirects to the main dashboard.

---

## Summary Table

| Use Case | HTTP Endpoint | Controller | Service | Key Entities |
|----------|---------------|------------|---------|--------------|
| UC-TL-01 Create Team | `POST /api/teams` | `team_controller.create_team` | `TeamService.create_team` | TeamProfile |
| UC-TL-02 Edit Team | `PUT /api/teams/{team_id}` | `team_controller.update_team` | `TeamService.update_team` | TeamProfile |
| UC-TL-03 Manage Roster | `POST/DELETE /api/teams/{team_id}/roster` | `add/remove_player_from_roster` | RosterRepository | TeamRoster |
| UC-TL-04 Approve Requests | `PUT /api/join-requests/{id}/{action}` | `process_join_request` | `TeamService.process_join_request` | JoinRequest, TeamRoster |
| UC-TL-05 Delete Team | `DELETE /api/teams/{team_id}` | `team_controller.delete_team` | `TeamService.delete_team` | TeamProfile |
