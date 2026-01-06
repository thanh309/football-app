# Batch 5: Player Use Cases - Sequence Diagrams

---

## Use Case: Edit Player Profile (UC-PL-01)

### Actors
- Primary: Player

### Components
- UI/Boundary: PlayerProfileView, PlayerEditForm
- Controllers: PlayerController (`player_controller.update_profile`)
- Repositories: PlayerRepository
- Dependencies: `get_current_user`
- Displays: SuccessMessageDisplay
- Entities: PlayerProfile, MediaAsset

### Sequence Flow (Detailed)
1. The Player initiates the interaction by navigating to "My Profile" via `GET /api/players/profile`.
2. The system instantiates `PlayerEditForm` using `<<create>>` pre-filled with current data.
3. The Player updates fields (displayName, position, skillLevel, bio, profileImageUrl) and submits.
4. The `get_current_user` dependency verifies the JWT.
5. The PlayerController calls `PlayerRepository.find_by_user_id(user.user_id)`.
6. The controller updates `PlayerProfile` attributes via `setattr()`.
7. If `profileImageUrl` is provided, a new `MediaAsset` entity is created using `<<create>>`.
8. The controller calls `PlayerRepository.update()` and commits.
9. The system displays `SuccessMessageDisplay` and shows the updated profile.

---

## Use Case: Request to Join Team (UC-PL-02)

### Actors
- Primary: Player
- Secondary: Team Leader (Receiver of notification)

### Components
- UI/Boundary: TeamSearchView, TeamDetailView
- Controllers: TeamController (`team_controller.request_to_join`)
- Services: TeamService (`TeamService.create_join_request`)
- Repositories: PlayerRepository, RosterRepository
- Dependencies: `get_current_user`
- Displays: SuccessMessageDisplay, ErrorMessageDisplay
- Entities: JoinRequest, Notification

### Sequence Flow (Detailed)
1. The Player browses or searches for a team and views TeamDetailView.
2. The Player clicks "Request to Join" via `POST /api/teams/{team_id}/join-requests`.
3. The `get_current_user` dependency verifies the JWT.
4. The controller calls `PlayerRepository.find_by_user_id()` to get player profile.
5. The controller checks if already a member via `RosterRepository.find_by_team_and_player()`.
6. If already member or is team leader:
   - The controller raises `HTTPException(status_code=400)`.
7. If eligible:
   - The controller calls `TeamService.create_join_request(team_id, player_id, message)`.
   - The service creates a `JoinRequest` entity using `<<create>>` with status `PENDING`.
8. The system displays `SuccessMessageDisplay`.

---

## Use Case: Leave Team (UC-PL-03)

### Actors
- Primary: Player
- Secondary: Team Leader (Receiver of notification)

### Components
- UI/Boundary: MyTeamsView
- Controllers: TeamController (`team_controller.remove_player_from_roster`)
- Repositories: RosterRepository
- Dependencies: `get_current_user`
- Displays: ConfirmationDialog, SuccessMessageDisplay
- Entities: TeamRoster, Notification

### Sequence Flow (Detailed)
1. The Player navigates to "My Teams" via `GET /api/teams/user/{user_id}`.
2. The Player selects a team to leave and clicks "Leave Team".
3. The system instantiates `ConfirmationDialog` using `<<create>>`.
4. The Player confirms via `DELETE /api/teams/{team_id}/roster/{player_id}`.
5. The `get_current_user` dependency verifies the JWT.
6. The controller calls `RosterRepository.find_by_team_and_player()`.
7. The controller calls `RosterRepository.delete()` to remove the player association.
8. The system displays `SuccessMessageDisplay` and removes the team from the player's list.

---

## Use Case: View Match Schedule (UC-PL-04)

### Actors
- Primary: Player

### Components
- UI/Boundary: ScheduleView
- Controllers: PlayerController (`player_controller.get_player_schedule`)
- Repositories: RosterRepository, MatchRepository
- Displays: MatchListDisplay
- Entities: MatchEvent, TeamRoster

### Sequence Flow (Detailed)
1. The Player navigates to "My Schedule" via `GET /api/players/{player_id}/schedule`.
2. The controller calls `RosterRepository.find_by_player(player_id)` to get team memberships.
3. The controller extracts `team_ids` from active roster entries.
4. The controller calls `MatchRepository.find_by_team(team_id)` for each team.
5. The controller removes duplicates and sorts by `(match_date, start_time)`.
6. The system instantiates `MatchListDisplay` using `<<create>>` with the list of `MatchEventResponse`.
7. The Player views previous and upcoming matches.

---

## Use Case: Confirm Match Attendance (UC-PL-05)

### Actors
- Primary: Player
- Secondary: Team Leader (Viewer of attendance)

### Components
- UI/Boundary: MatchDetailView
- Controllers: MatchController (`match_controller.confirm_attendance`)
- Repositories: PlayerRepository, RosterRepository, AttendanceRepository
- Dependencies: `get_current_user`
- Displays: SuccessMessageDisplay
- Entities: AttendanceRecord

### Sequence Flow (Detailed)
1. The Player opens a specific match in MatchDetailView.
2. The Player clicks "Confirm Attendance" via `POST /api/matches/{match_id}/attendance/confirm`.
3. The `get_current_user` dependency verifies the JWT.
4. The controller calls `PlayerRepository.find_by_user_id()` to get player profile.
5. The controller calls `RosterRepository.find_by_player()` to verify player is in a match team.
6. If not a player in this match:
   - The controller raises `HTTPException(status_code=403)`.
7. If eligible:
   - The controller creates or updates `AttendanceRecord` entity with `status=PRESENT`.
   - The record includes `confirmed_at=datetime.utcnow()` and `confirmed_by=user.user_id`.
8. The system displays `SuccessMessageDisplay` and updates button state to "Confirmed".

---

## Summary Table

| Use Case | HTTP Endpoint | Controller | Key Entities |
|----------|---------------|------------|--------------|
| UC-PL-01 Edit Profile | `PUT /api/players/profile` | `player_controller.update_profile` | PlayerProfile, MediaAsset |
| UC-PL-02 Request to Join | `POST /api/teams/{id}/join-requests` | `team_controller.request_to_join` | JoinRequest |
| UC-PL-03 Leave Team | `DELETE /api/teams/{id}/roster/{pid}` | `remove_player_from_roster` | TeamRoster |
| UC-PL-04 View Schedule | `GET /api/players/{id}/schedule` | `get_player_schedule` | MatchEvent, TeamRoster |
| UC-PL-05 Confirm Attendance | `POST /api/matches/{id}/attendance/confirm` | `confirm_attendance` | AttendanceRecord |
