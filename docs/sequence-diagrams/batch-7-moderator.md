# Batch 7: Moderator Use Cases - Sequence Diagrams

---

## Use Case: Verify Team Profiles (UC-AM-01)

### Actors
- Primary: Moderator

### Components
- UI/Boundary: ModeratorDashboard, PendingTeamsListView, TeamReviewPanel
- Controllers: ModerationController (`moderation_controller.get_pending_teams`, `moderation_controller.verify_team`)
- Dependencies: `get_current_user`, `require_moderator`
- Displays: SuccessMessageDisplay, ErrorMessageDisplay
- Entities: TeamProfile

### Sequence Flow (Detailed)
1. The Moderator navigates to the Pending Teams list via `GET /api/moderation/teams/pending`.
2. The `get_current_user` dependency verifies the JWT and returns the UserAccount.
3. The `require_moderator` function checks if `UserRole.MODERATOR` is in `user.roles`.
4. The ModerationController queries `SELECT TeamProfile WHERE status = 'PENDING'`.
5. The system instantiates `PendingTeamsListView` using `<<create>>` with the pending teams data.
6. The Moderator selects a team and reviews details via `GET /api/moderation/teams/{team_id}`.
7. The Moderator makes a decision via `PUT /api/moderation/teams/{team_id}/verify` with `VerificationDecision`.
8. If approved:
   - The controller updates `TeamProfile.status = TeamStatus.VERIFIED`.
9. If rejected:
   - The controller updates `TeamProfile.status = TeamStatus.REJECTED` and sets `rejection_reason`.
10. The system displays `SuccessMessageDisplay` with the verification result.

---

## Use Case: Verify Field Profiles (UC-AM-02)

### Actors
- Primary: Moderator

### Components
- UI/Boundary: ModeratorDashboard, PendingFieldsListView, FieldReviewPanel
- Controllers: ModerationController (`moderation_controller.get_pending_fields`, `moderation_controller.verify_field`)
- Dependencies: `get_current_user`, `require_moderator`
- Displays: SuccessMessageDisplay, ErrorMessageDisplay
- Entities: FieldProfile

### Sequence Flow (Detailed)
1. The Moderator navigates to the Pending Fields list via `GET /api/moderation/fields/pending`.
2. The `get_current_user` dependency verifies the JWT and returns the UserAccount.
3. The `require_moderator` function checks if `UserRole.MODERATOR` is in `user.roles`.
4. The ModerationController queries `SELECT FieldProfile WHERE status = 'PENDING'`.
5. The system instantiates `PendingFieldsListView` using `<<create>>` with the pending fields data.
6. The Moderator selects a field and reviews details via `GET /api/moderation/fields/{field_id}`.
7. The Moderator makes a decision via `PUT /api/moderation/fields/{field_id}/verify` with `VerificationDecision`.
8. If approved:
   - The controller updates `FieldProfile.status = FieldStatus.VERIFIED`.
9. If rejected:
   - The controller updates `FieldProfile.status = FieldStatus.REJECTED` and sets `rejection_reason`.
10. The system displays `SuccessMessageDisplay` with the verification result.

---

## Use Case: Suspend / Reactivate Users (UC-AM-03)

### Actors
- Primary: Moderator

### Components
- UI/Boundary: UserManagementPanel, UserListView, UserDetailView
- Controllers: ModerationController (`moderation_controller.get_users`, `moderation_controller.suspend_user`, `moderation_controller.reactivate_user`)
- Dependencies: `get_current_user`, `require_moderator`
- Displays: ConfirmationDialog, SuccessMessageDisplay, ErrorMessageDisplay
- Entities: UserAccount, ModerationLog

### Sequence Flow (Detailed) - Suspend User
1. The Moderator navigates to User Management via `GET /api/moderation/users`.
2. The `get_current_user` dependency verifies the JWT and returns the UserAccount.
3. The `require_moderator` function checks if `UserRole.MODERATOR` is in `user.roles`.
4. The ModerationController queries `SELECT UserAccount` with optional query/status filters.
5. The system instantiates `UserListView` using `<<create>>` with the users list.
6. The Moderator selects a user and views details via `GET /api/moderation/users/{user_id}`.
7. The Moderator clicks "Suspend User" and provides a reason via `PUT /api/moderation/users/{user_id}/suspend`.
8. The controller updates `UserAccount.status = AccountStatus.SUSPENDED`.
9. The controller creates a `ModerationLog` entity using `<<create>>` with `action=ModerationAction.SUSPEND`.
10. The system displays `SuccessMessageDisplay` and returns `UserSummaryResponse`.

### Sequence Flow (Detailed) - Reactivate User
1. The Moderator views a suspended user via `GET /api/moderation/users/{user_id}`.
2. The Moderator clicks "Reactivate User" and provides a reason via `PUT /api/moderation/users/{user_id}/reactivate`.
3. The `get_current_user` dependency verifies the JWT and returns the UserAccount.
4. The `require_moderator` function checks authorization.
5. The controller updates `UserAccount.status = AccountStatus.ACTIVE`.
6. The controller creates a `ModerationLog` entity using `<<create>>` with `action=ModerationAction.REACTIVATE`.
7. The system displays `SuccessMessageDisplay` and returns `UserSummaryResponse`.

---

## Use Case: Moderate Reported Content (UC-AM-04)

### Actors
- Primary: Moderator

### Components
- UI/Boundary: ReportManagementPanel, ReportListView, ReportDetailView
- Controllers: ModerationController (`moderation_controller.get_reports`, `moderation_controller.get_report`, `moderation_controller.resolve_report`)
- Dependencies: `get_current_user`, `require_moderator`
- Displays: SuccessMessageDisplay, ErrorMessageDisplay
- Entities: Report

### Sequence Flow (Detailed)
1. The Moderator navigates to Reports via `GET /api/moderation/reports?status=PENDING`.
2. The `get_current_user` dependency verifies the JWT and returns the UserAccount.
3. The `require_moderator` function checks if `UserRole.MODERATOR` is in `user.roles`.
4. The ModerationController queries `SELECT Report ORDER BY created_at DESC` with optional status filter.
5. The system instantiates `ReportListView` using `<<create>>` with the reports list.
6. The Moderator selects a report to review via `GET /api/moderation/reports/{report_id}`.
7. The system displays `ReportDetailView` with full report details (reporter, content, reason).
8. The Moderator takes action via `PUT /api/moderation/reports/{report_id}/resolve?action=resolve`.
9. If action is "resolve":
   - The controller updates `Report.status = ReportStatus.RESOLVED` and sets `resolved_at`.
10. If action is "dismiss":
    - The controller updates `Report.status = ReportStatus.DISMISSED` and sets `resolved_at`.
11. The system displays `SuccessMessageDisplay` and returns the updated `ReportResponse`.

---

## Summary Table

| Use Case | HTTP Endpoint | Controller | Key Entities |
|----------|---------------|------------|--------------|
| UC-AM-01 Verify Teams | `PUT /api/moderation/teams/{id}/verify` | `moderation_controller.verify_team` | TeamProfile |
| UC-AM-02 Verify Fields | `PUT /api/moderation/fields/{id}/verify` | `moderation_controller.verify_field` | FieldProfile |
| UC-AM-03 Suspend User | `PUT /api/moderation/users/{id}/suspend` | `moderation_controller.suspend_user` | UserAccount, ModerationLog |
| UC-AM-03 Reactivate User | `PUT /api/moderation/users/{id}/reactivate` | `moderation_controller.reactivate_user` | UserAccount, ModerationLog |
| UC-AM-04 Moderate Reports | `PUT /api/moderation/reports/{id}/resolve` | `moderation_controller.resolve_report` | Report |
