# Batch 4: Team Leader Use Cases Part 2 - Sequence Diagrams

---

## Use Case: Create Match Events (UC-TL-06)

### Actors
- Primary: Team Leader
- Secondary: Stadium Owner (Receiver of booking request)

### Components
- UI/Boundary: MatchCreationForm
- Controllers: MatchController (`match_controller.create_match`)
- Services: MatchService (`MatchService.create_match`), TeamService
- Dependencies: `get_current_user`
- Displays: SuccessMessageDisplay, ErrorMessageDisplay
- Entities: MatchEvent

### Sequence Flow (Detailed)
1. The Team Leader initiates the interaction by opening `MatchCreationForm`.
2. The Team Leader enters match details (date, time, field, visibility) and submits.
3. The `get_current_user` dependency verifies the JWT.
4. The MatchController calls `TeamService.get_team_by_id(data.hostTeamId)` and verifies `team.leader_id == user.user_id`.
5. If not authorized:
   - The controller raises `HTTPException(status_code=403)`.
6. If authorized:
   - The controller calls `MatchService.create_match(host_team_id, match_date, start_time, field_id, visibility)`.
   - The service creates a `MatchEvent` entity using `<<create>>` with status `SCHEDULED`.
   - The system displays `SuccessMessageDisplay` and shows the match in the team's schedule.

---

## Use Case: Cancel Match Events (UC-TL-07)

### Actors
- Primary: Team Leader
- Secondary: Stadium Owner, Opponent Team Leader

### Components
- UI/Boundary: MatchDetailView
- Controllers: MatchController (`match_controller.cancel_match`)
- Services: MatchService (`MatchService.cancel_match`), TeamService
- Dependencies: `get_current_user`
- Displays: ConfirmationDialog, SuccessMessageDisplay
- Entities: MatchEvent, Notification

### Sequence Flow (Detailed)
1. The Team Leader initiates the interaction by clicking "Cancel Match" on MatchDetailView.
2. The system instantiates `ConfirmationDialog` using `<<create>>`.
3. The Team Leader confirms cancellation via `PUT /api/matches/{match_id}/cancel`.
4. The `get_current_user` dependency verifies the JWT.
5. The MatchController calls `MatchService.get_match_by_id()` and `TeamService.get_team_by_id()` to verify authorization.
6. If authorized:
   - The controller calls `MatchService.cancel_match(match)` which updates `MatchEvent.status` to `CANCELLED`.
   - The system displays `SuccessMessageDisplay` and updates the match status view.

---

## Use Case: Respond to Match Invitations (UC-TL-08)

### Actors
- Primary: Team Leader
- Secondary: Inviting Team Leader

### Components
- UI/Boundary: InvitationListView
- Controllers: MatchController (`match_controller.respond_to_invitation`)
- Services: MatchService (`MatchService.respond_to_invitation`)
- Repositories: InvitationRepository
- Dependencies: `get_current_user`
- Displays: SuccessMessageDisplay
- Entities: MatchInvitation, MatchEvent, Notification

### Sequence Flow (Detailed)
1. The Team Leader views pending invitations via `GET /api/matches/team/{team_id}/invitations`.
2. The controller calls `InvitationRepository.find_pending_by_team(team_id)`.
3. The Team Leader clicks "Accept" or "Decline" via `PUT /api/invitations/{invitation_id}/{action}`.
4. The controller retrieves the invitation via `InvitationRepository.find_by_id()`.
5. The controller verifies `invited_team.leader_id == user.user_id`.
6. The controller calls `MatchService.respond_to_invitation(invitation, accept=True/False)`.
7. If Accepted:
   - The service updates `MatchInvitation.status` to `ACCEPTED`.
   - The service updates `MatchEvent.opponent_team_id` with the accepting team.
8. If Declined:
   - The service updates `MatchInvitation.status` to `DECLINED`.
9. The system displays `SuccessMessageDisplay`.

---

## Use Case: Track Match Attendance (UC-TL-09)

### Actors
- Primary: Team Leader

### Components
- UI/Boundary: AttendanceView
- Controllers: MatchController (`match_controller.batch_update_attendance`)
- Services: MatchService
- Dependencies: `get_current_user`
- Displays: SuccessMessageDisplay
- Entities: MatchEvent, AttendanceRecord

### Sequence Flow (Detailed)
1. The Team Leader opens AttendanceView for a match via `GET /api/matches/{match_id}/attendance`.
2. The system displays the list of players with current attendance status.
3. The Team Leader toggles status (Present/Absent/Excused) for players.
4. The Team Leader clicks "Save" via `POST /api/matches/{match_id}/attendance/batch` with `BatchAttendanceRequest`.
5. The controller verifies `host_team.leader_id == user.user_id` or `opponent_team.leader_id == user.user_id`.
6. The controller iterates through `data.records` and updates/creates `AttendanceRecord` entities.
7. The system displays `SuccessMessageDisplay` and shows the attendance summary via `GET /api/matches/{match_id}/attendance/stats`.

---

## Use Case: Manage Team Funds (UC-TL-10)

### Actors
- Primary: Team Leader

### Components
- UI/Boundary: FinanceDashboard, TransactionForm
- Controllers: TeamController (`deposit_funds`, `withdraw_funds`, `record_expense`)
- Dependencies: `get_current_user`
- Displays: SuccessMessageDisplay
- Entities: TeamWallet, TransactionLog

### Sequence Flow (Detailed)
1. The Team Leader opens FinanceDashboard via `GET /api/teams/{team_id}/wallet`.
2. The controller verifies `team.leader_id == user.user_id`.
3. The system displays current balance and transaction history from `GET /api/teams/{team_id}/wallet/transactions`.
4. The Team Leader clicks "Add Transaction" and selects type (Deposit/Withdraw/Expense).
5. The system instantiates `TransactionForm` using `<<create>>`.
6. The Team Leader enters amount, description, category and submits.
7. The controller calls appropriate endpoint (`POST /deposit`, `/withdraw`, or `/expense`).
8. The controller updates `TeamWallet.balance` and creates a `TransactionLog` entry using `<<create>>`.
9. The system displays `SuccessMessageDisplay` and refreshes the dashboard.

---

## Summary Table

| Use Case | HTTP Endpoint | Controller | Service | Key Entities |
|----------|---------------|------------|---------|--------------|
| UC-TL-06 Create Match | `POST /api/matches` | `match_controller.create_match` | `MatchService.create_match` | MatchEvent |
| UC-TL-07 Cancel Match | `PUT /api/matches/{id}/cancel` | `match_controller.cancel_match` | `MatchService.cancel_match` | MatchEvent |
| UC-TL-08 Respond Invitation | `PUT /api/invitations/{id}/{action}` | `respond_to_invitation` | `MatchService.respond_to_invitation` | MatchInvitation, MatchEvent |
| UC-TL-09 Track Attendance | `POST /api/matches/{id}/attendance/batch` | `batch_update_attendance` | - | AttendanceRecord |
| UC-TL-10 Manage Funds | `POST /api/teams/{id}/wallet/deposit` | `deposit_funds`, etc. | - | TeamWallet, TransactionLog |
