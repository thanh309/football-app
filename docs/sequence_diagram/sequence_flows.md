# Textual Sequence Diagram Flows

This document contains high-fidelity textual sequence diagram flows for all use cases defined in the SRS.

## Use Case: Verify Team Profiles (UC-AM-01)

### Actors
- Primary: Moderator
- Secondary: Team Leader (Receiver of notification)

### Components
- UI/Boundary: ModeratorDashboard, TeamVerificationView
- Controllers: TeamVerificationController
- Displays: SuccessMessageDisplay, ErrorMessageDisplay
- Entities: TeamProfile, Notification

### Sequence Flow (Detailed)
1. The Moderator initiates the interaction by selecting "Pending Team Profiles" from the ModeratorDashboard.
2. The ModeratorDashboard receives the event and calls the TeamVerificationController to fetch pending submissions.
3. The TeamVerificationController queries the TeamProfile entity for all records with status "Pending".
4. The system instantiates `TeamVerificationView` using `<<create>>` and populates it with the list of pending teams.
5. The Moderator selects a specific team to review details (name, logo, description).
6. The Moderator clicks "Approve" or "Reject" (optionally providing a reason).
7. The TeamVerificationController receives the decision and validates the request.
8. If the decision is "Approve":
   - The controller calls the TeamProfile entity to update status to "Verified".
   - The controller creates a `Notification` using `<<create>>` for the Team Leader.
   - The system displays `SuccessMessageDisplay` confirming approval.
9. If the decision is "Reject":
   - The controller calls the TeamProfile entity to update status to "Rejected" (or "Pending Revision").
   - The controller creates a `Notification` using `<<create>>` for the Team Leader with the rejection reason.
   - The system displays `SuccessMessageDisplay` confirming rejection.
10. The system finalizes by refreshing the list of pending profiles.

---
## Use Case: Verify Field Profiles (UC-AM-02)

### Actors
- Primary: Moderator
- Secondary: Field Owner (Receiver of notification)

### Components
- UI/Boundary: ModeratorDashboard, FieldVerificationView
- Controllers: FieldVerificationController
- Displays: SuccessMessageDisplay
- Entities: FieldProfile, Notification

### Sequence Flow (Detailed)
1. The Moderator initiates the interaction by opening the "Field Verification" panel on the ModeratorDashboard.
2. The ModeratorDashboard requests pending field profiles from the FieldVerificationController.
3. The FieldVerificationController retrieves FieldProfile entities marked as "Pending Verification".
4. The system instantiates `FieldVerificationView` using `<<create>>` to display the list.
5. The Moderator reviews the field details (location, images, owner info) and clicks "Approve" or "Reject".
6. The FieldVerificationController processes the decision.
7. If Approved:
   - The controller updates the FieldProfile entity status to "Verified".
   - The controller creates a `Notification` using `<<create>>` to inform the Field Owner.
8. If Rejected:
   - The controller updates the FieldProfile entity status to "Rejected".
   - The controller creates a `Notification` using `<<create>>` with the rejection reason.
9. The system displays `SuccessMessageDisplay` to the Moderator.
10. The system finalizes by removing the processed field from the pending list.

---
## Use Case: Suspend / Reactivate Users (UC-AM-03)

### Actors
- Primary: Moderator
- Secondary: User (Affected party)

### Components
- UI/Boundary: UserManagementDashboard, UserDetailView
- Controllers: UserModerationController
- Displays: ConfirmationDialog, SuccessMessageDisplay
- Entities: UserAccount, ModerationLog, Notification

### Sequence Flow (Detailed)
1. The Moderator initiates the interaction by searching for a user in the UserManagementDashboard.
2. The UserManagementDashboard calls UserModerationController to find the user.
3. The controller retrieves the `UserAccount` and its history.
4. The system instantiates `UserDetailView` using `<<create>>` showing violation history.
5. The Moderator selects an action: "Suspend", "Ban", or "Reactivate".
6. The system instantiates `ConfirmationDialog` using `<<create>>` to confirm the action.
7. The Moderator confirms the action.
8. The UserModerationController executes the state change:
   - It updates the `UserAccount` status (e.g., to "Suspended").
   - It creates a `ModerationLog` entry using `<<create>>` to record the action.
   - It creates a `Notification` using `<<create>>` to inform the User.
9. The system displays `SuccessMessageDisplay` confirming the update.
10. The system finalizes by refreshing the user's status on the view.

---
## Use Case: Moderate Reported Content (UC-AM-04)

### Actors
- Primary: Moderator
- Secondary: Reporter, Reported User

### Components
- UI/Boundary: ReportedContentDashboard, ReportDetailView
- Controllers: ModerationController
- Displays: SuccessMessageDisplay
- Entities: Report, Content (Post/Comment), UserAccount, Notification

### Sequence Flow (Detailed)
1. The Moderator initiates the interaction by opening the "Reported Content" dashboard.
2. The system displays a list of active `Report` entities.
3. The Moderator selects a report to view.
4. The system instantiates `ReportDetailView` using `<<create>>` showing the content and report reason.
5. The Moderator reviews and selects an action: "Keep", "Warn User", or "Remove Content".
6. The ModerationController processes the action.
7. If "Remove Content":
   - The controller calls the `Content` entity to set visibility to hidden or deleted.
   - The controller updates the `Report` status to "Resolved".
   - The controller creates a `Notification` using `<<create>>` for the Reported User (warning/deletion notice).
   - The controller creates a `Notification` using `<<create>>` for the Reporter (thanking them).
8. If "Keep" (Dismiss Report):
   - The controller updates the `Report` status to "Dismissed".
9. The system displays `SuccessMessageDisplay`.
10. The system finalizes by destroying the `ReportDetailView` using `<<destroy>>` and returning to the list.

---
## Use Case: Create Team Profile (UC-TL-01)

### Actors
- Primary: Team Leader
- Secondary: Moderator (Receiver of notification)

### Components
- UI/Boundary: TeamCreationForm
- Controllers: TeamController
- Displays: SuccessMessageDisplay, ErrorMessageDisplay
- Entities: TeamProfile, Notification

### Sequence Flow (Detailed)
1. The Team Leader initiates the interaction by clicking "Create Team" on the dashboard.
2. The system instantiates `TeamCreationForm` using `<<create>>` for data entry.
3. The Team Leader enters team details (name, logo, description) and submits.
4. The TeamController validates the input (checking name uniqueness).
5. If validation fails:
   - The controller creates `ErrorMessageDisplay` using `<<create>>`.
   - The system displays the error to the user.
6. If validation succeeds:
   - The controller creates a new `TeamProfile` entity using `<<create>>` with status "Pending".
   - The controller creates a `Notification` using `<<create>>` for the Moderator.
   - The system displays `SuccessMessageDisplay` confirming submission.
7. The system finalizes by redirecting the user to the new team dashboard.

---
## Use Case: Edit Team Profile (UC-TL-02)

### Actors
- Primary: Team Leader

### Components
- UI/Boundary: TeamProfileView, TeamEditForm
- Controllers: TeamController
- Displays: SuccessMessageDisplay
- Entities: TeamProfile

### Sequence Flow (Detailed)
1. The Team Leader initiates the interaction by clicking "Edit Team" on the TeamProfileView.
2. The system instantiates `TeamEditForm` using `<<create>>` pre-filled with current data.
3. The Team Leader updates the fields and clicks "Save".
4. The TeamController validates the new data.
5. The controller calls the `TeamProfile` entity to update its attributes.
6. The system displays `SuccessMessageDisplay`.
7. The system finalizes by refreshing the TeamProfileView.

---
## Use Case: Manage Team Roster (UC-TL-03)

### Actors
- Primary: Team Leader
- Secondary: Player (Receiver of notification)

### Components
- UI/Boundary: RosterManagementView
- Controllers: RosterController
- Displays: ConfirmationDialog, SuccessMessageDisplay
- Entities: TeamRoster, PlayerProfile, Notification

### Sequence Flow (Detailed)
1. The Team Leader initiates the interaction by opening the RosterManagementView.
2. The system displays the current list of players.
3. The Team Leader selects a player to remove.
4. The system instantiates `ConfirmationDialog` using `<<create>>`.
5. The Team Leader confirms removal.
6. The RosterController calls `TeamRoster` to remove the player association.
7. The controller creates a `Notification` using `<<create>>` for the removed Player.
8. The system displays `SuccessMessageDisplay`.
9. The system finalizes by updating the roster list.

---
## Use Case: Approve Player Requests (UC-TL-04)

### Actors
- Primary: Team Leader
- Secondary: Player (Requester)

### Components
- UI/Boundary: JoinRequestList
- Controllers: TeamController
- Displays: SuccessMessageDisplay
- Entities: JoinRequest, TeamRoster, Notification

### Sequence Flow (Detailed)
1. The Team Leader initiates the interaction by viewing pending requests in JoinRequestList.
2. The Team Leader clicks "Approve" or "Reject" for a specific player.
3. The TeamController processes the request.
4. If Approved:
   - The controller updates `JoinRequest` status to "Accepted".
   - The controller calls `TeamRoster` to add the player.
   - The controller creates a `Notification` using `<<create>>` for the Player welcoming them.
5. If Rejected:
   - The controller updates `JoinRequest` status to "Rejected".
   - The controller creates a `Notification` using `<<create>>` for the Player.
6. The system displays `SuccessMessageDisplay`.
7. The system finalizes by removing the request from the pending list.

---
## Use Case: Delete Team (UC-TL-05)

### Actors
- Primary: Team Leader
- Secondary: Team Members (Receiver of notification)

### Components
- UI/Boundary: TeamSettingsView
- Controllers: TeamController
- Displays: ConfirmationDialog, SuccessMessageDisplay
- Entities: TeamProfile, TeamRoster, Notification

### Sequence Flow (Detailed)
1. The Team Leader initiates the interaction by clicking "Delete Team" in TeamSettingsView.
2. The system instantiates `ConfirmationDialog` using `<<create>>` (critical warning).
3. The Team Leader confirms deletion.
4. The TeamController retrieves all members from `TeamRoster`.
5. The controller iterates through members and creates a `Notification` using `<<create>>` for each.
6. The controller calls `TeamProfile` to delete (or soft-delete) the record.
7. The system displays `SuccessMessageDisplay`.
8. The system finalizes by redirecting the Team Leader to the main dashboard.

---
## Use Case: Create Match Events (UC-TL-06)

### Actors
- Primary: Team Leader
- Secondary: Stadium Owner (Receiver of booking request)

### Components
- UI/Boundary: MatchCreationForm
- Controllers: MatchController
- Displays: ErrorMessageDisplay, SuccessMessageDisplay
- Entities: MatchEvent, Stadium, Notification

### Sequence Flow (Detailed)
1. The Team Leader initiates the interaction by opening `MatchCreationForm`.
2. The Team Leader selects date, time, and stadium.
3. The MatchController checks `Stadium` availability for the slot.
4. If unavailable:
   - The controller creates `ErrorMessageDisplay` using `<<create>>`.
5. If available:
   - The controller creates a new `MatchEvent` entity using `<<create>>` with status "Pending Approval".
   - The controller creates a `Notification` using `<<create>>` for the Stadium Owner.
   - The system displays `SuccessMessageDisplay`.
6. The system finalizes by showing the match in the "Pending" list.

---
## Use Case: Cancel Match Events (UC-TL-07)

### Actors
- Primary: Team Leader
- Secondary: Stadium Owner, Opponent Team Leader

### Components
- UI/Boundary: MatchDetailView
- Controllers: MatchController
- Displays: CancellationPolicyDisplay, ConfirmationDialog, SuccessMessageDisplay
- Entities: MatchEvent, Notification

### Sequence Flow (Detailed)
1. The Team Leader initiates the interaction by clicking "Cancel Match" on MatchDetailView.
2. The system instantiates `CancellationPolicyDisplay` using `<<create>>` showing penalties/refunds.
3. The Team Leader confirms cancellation.
4. The MatchController updates `MatchEvent` status to "Cancelled".
5. The controller creates `Notification` using `<<create>>` for the Stadium Owner (to release slot).
6. The controller creates `Notification` using `<<create>>` for the Opponent Team Leader (if assigned).
7. The system displays `SuccessMessageDisplay`.
8. The system finalizes by updating the match status view.

---
## Use Case: Respond to Match Invitations (UC-TL-08)

### Actors
- Primary: Team Leader
- Secondary: Inviting Team Leader

### Components
- UI/Boundary: InvitationListView
- Controllers: MatchController
- Displays: SuccessMessageDisplay
- Entities: MatchInvitation, MatchEvent, Notification

### Sequence Flow (Detailed)
1. The Team Leader initiates the interaction by viewing InvitationListView.
2. The Team Leader selects an invitation and clicks "Accept" or "Decline".
3. The MatchController processes the response.
4. If Accepted:
   - The controller updates `MatchInvitation` status to "Accepted".
   - The controller updates the linked `MatchEvent` with the opponent team ID.
   - The controller creates a `Notification` using `<<create>>` for the Inviting Team Leader.
5. If Declined:
   - The controller updates `MatchInvitation` status to "Declined".
   - The controller creates a `Notification` using `<<create>>` for the Inviting Team Leader.
6. The system displays `SuccessMessageDisplay`.

---
## Use Case: Track Match Attendance (UC-TL-09)

### Actors
- Primary: Team Leader

### Components
- UI/Boundary: AttendanceView
- Controllers: AttendanceController
- Displays: SuccessMessageDisplay
- Entities: MatchEvent, AttendanceRecord

### Sequence Flow (Detailed)
1. The Team Leader initiates the interaction by opening AttendanceView for a specific match.
2. The system displays the list of players.
3. The Team Leader toggles status (Present/Absent) for players.
4. The Team Leader clicks "Save".
5. The AttendanceController iterates through the list.
6. The controller updates or creates `AttendanceRecord` entities for each player.
7. The system displays `SuccessMessageDisplay`.
8. The system finalizes by showing the summary stats.

---
## Use Case: Manage Team Funds (UC-TL-10)

### Actors
- Primary: Team Leader

### Components
- UI/Boundary: FinanceDashboard, TransactionForm
- Controllers: FinanceController
- Displays: SuccessMessageDisplay
- Entities: TeamWallet, TransactionLog

### Sequence Flow (Detailed)
1. The Team Leader initiates the interaction by opening FinanceDashboard.
2. The system displays current balance and history.
3. The Team Leader clicks "Add Transaction".
4. The system instantiates `TransactionForm` using `<<create>>`.
5. The Team Leader enters amount, type (Income/Expense), and description.
6. The FinanceController validates the input.
7. The controller creates a new `TransactionLog` entry using `<<create>>`.
8. The controller calls `TeamWallet` to update the balance.
9. The system displays `SuccessMessageDisplay`.
10. The system finalizes by refreshing the dashboard with the new balance.

---
## Use Case: Edit Player Profile (UC-PL-01)

### Actors
- Primary: Player

### Components
- UI/Boundary: PlayerProfileView, PlayerEditForm
- Controllers: PlayerController
- Displays: SuccessMessageDisplay
- Entities: PlayerProfile

### Sequence Flow (Detailed)
1. The Player initiates the interaction by navigating to "My Profile".
2. The system instantiates `PlayerEditForm` using `<<create>>` with current data.
3. The Player updates fields (e.g., position, skill level) and submits.
4. The PlayerController validates the input.
5. The controller calls `PlayerProfile` entity to update the record.
6. The system displays `SuccessMessageDisplay`.
7. The system finalizes by showing the updated profile.

---
## Use Case: Request to Join Team (UC-PL-02)

### Actors
- Primary: Player
- Secondary: Team Leader (Receiver of notification)

### Components
- UI/Boundary: TeamSearchView, TeamDetailView
- Controllers: TeamController
- Displays: SuccessMessageDisplay
- Entities: JoinRequest, Notification

### Sequence Flow (Detailed)
1. The Player initiates the interaction by selecting a team from search results.
2. The Player clicks "Request to Join" on the TeamDetailView.
3. The TeamController checks if a request already exists.
4. The controller creates a new `JoinRequest` entity using `<<create>>` with status "Pending".
5. The controller creates a `Notification` using `<<create>>` for the Team Leader.
6. The system displays `SuccessMessageDisplay`.

---
## Use Case: Leave Team (UC-PL-03)

### Actors
- Primary: Player
- Secondary: Team Leader (Receiver of notification)

### Components
- UI/Boundary: MyTeamsView
- Controllers: TeamController
- Displays: ConfirmationDialog, SuccessMessageDisplay
- Entities: TeamRoster, Notification

### Sequence Flow (Detailed)
1. The Player initiates the interaction by selecting a team in MyTeamsView.
2. The Player clicks "Leave Team".
3. The system instantiates `ConfirmationDialog` using `<<create>>`.
4. The Player confirms the action.
5. The TeamController calls `TeamRoster` to remove the player.
6. The controller creates a `Notification` using `<<create>>` for the Team Leader.
7. The system displays `SuccessMessageDisplay`.
8. The system finalizes by removing the team from the player's list.

---
## Use Case: View Match Schedule (UC-PL-04)

### Actors
- Primary: Player

### Components
- UI/Boundary: ScheduleView
- Controllers: MatchController
- Displays: MatchListDisplay
- Entities: MatchEvent, TeamRoster

### Sequence Flow (Detailed)
1. The Player initiates the interaction by navigating to "My Schedule".
2. The MatchController retrieves the player's teams from `TeamRoster`.
3. The controller queries `MatchEvent` for matches involving those teams.
4. The system instantiates `MatchListDisplay` using `<<create>>` with the data.
5. The Player selects a match to view details.
6. The system displays the detailed view.

---
## Use Case: Confirm Match Attendance (UC-PL-05)

### Actors
- Primary: Player
- Secondary: Team Leader (Viewer of attendance)

### Components
- UI/Boundary: MatchDetailView
- Controllers: AttendanceController
- Displays: SuccessMessageDisplay
- Entities: AttendanceRecord

### Sequence Flow (Detailed)
1. The Player initiates the interaction by opening a specific match in MatchDetailView.
2. The Player clicks "Confirm Attendance".
3. The AttendanceController checks if an `AttendanceRecord` exists.
4. If not, it creates one using `<<create>>`.
5. The controller updates the record status to "Present".
6. The system displays `SuccessMessageDisplay`.
7. The system finalizes by updating the button state to "Confirmed".

---
## Use Case: Create Field Profile (UC-FO-01)

### Actors
- Primary: Field Owner
- Secondary: Moderator (Receiver of notification)

### Components
- UI/Boundary: FieldCreationForm
- Controllers: FieldController
- Displays: SuccessMessageDisplay, ErrorMessageDisplay
- Entities: FieldProfile, Notification

### Sequence Flow (Detailed)
1. The Field Owner initiates the interaction by selecting "Register New Field".
2. The system instantiates `FieldCreationForm` using `<<create>>`.
3. The Field Owner enters details (name, location, amenities, pricing) and uploads photos.
4. The FieldController validates the input.
5. If validation fails:
   - The controller creates `ErrorMessageDisplay` using `<<create>>`.
6. If validation succeeds:
   - The controller creates a new `FieldProfile` entity using `<<create>>` with status "Pending Verification".
   - The controller creates a `Notification` using `<<create>>` for the Moderator.
   - The system displays `SuccessMessageDisplay`.
7. The system finalizes by redirecting to the field management dashboard.

---
## Use Case: Edit Field Profile (UC-FO-02)

### Actors
- Primary: Field Owner
- Secondary: Moderator (If re-verification needed)

### Components
- UI/Boundary: FieldManagementView, FieldEditForm
- Controllers: FieldController
- Displays: SuccessMessageDisplay
- Entities: FieldProfile, Notification

### Sequence Flow (Detailed)
1. The Field Owner initiates the interaction by selecting a field in FieldManagementView.
2. The system instantiates `FieldEditForm` using `<<create>>` with current data.
3. The Field Owner modifies details and clicks "Save".
4. The FieldController checks if critical fields (e.g., location) were changed.
5. If critical changes:
   - The controller updates `FieldProfile` status to "Pending Verification".
   - The controller creates a `Notification` using `<<create>>` for the Moderator.
6. If minor changes:
   - The controller updates `FieldProfile` attributes directly.
7. The system displays `SuccessMessageDisplay`.

---
## Use Case: View Booking Requests (UC-FO-03)

### Actors
- Primary: Field Owner

### Components
- UI/Boundary: BookingRequestList
- Controllers: BookingController
- Displays: EmptyStateDisplay
- Entities: BookingRequest

### Sequence Flow (Detailed)
1. The Field Owner initiates the interaction by navigating to "Booking Management".
2. The BookingController retrieves all `BookingRequest` entities with status "Pending" for the owner's fields.
3. If no requests found:
   - The system instantiates `EmptyStateDisplay` using `<<create>>`.
4. If requests exist:
   - The system displays the list with summary details.
5. The Field Owner selects a request to view details.

---
## Use Case: Response Booking Requests (UC-FO-04)

### Actors
- Primary: Field Owner
- Secondary: Team Leader (Receiver of notification)

### Components
- UI/Boundary: BookingDetailView
- Controllers: BookingController
- Displays: SuccessMessageDisplay, ConflictWarningDisplay
- Entities: BookingRequest, FieldCalendar, Notification

### Sequence Flow (Detailed)
1. The Field Owner initiates the interaction by viewing a pending request.
2. The Field Owner clicks "Approve" or "Reject".
3. The BookingController processes the decision.
4. If Approve:
   - The controller checks `FieldCalendar` for conflicts.
   - If conflict exists, it creates `ConflictWarningDisplay` using `<<create>>`.
   - If no conflict, it updates `BookingRequest` status to "Confirmed".
   - It updates `FieldCalendar` to mark the slot as "Booked".
   - It creates a `Notification` using `<<create>>` for the Team Leader.
5. If Reject:
   - The controller updates `BookingRequest` status to "Rejected".
   - It creates a `Notification` using `<<create>>` for the Team Leader.
6. The system displays `SuccessMessageDisplay`.

---
## Use Case: Manage Booking Calendar (UC-FO-05)

### Actors
- Primary: Field Owner
- Secondary: Team Leader (If booking cancelled)

### Components
- UI/Boundary: CalendarView, SlotDetailView
- Controllers: BookingController
- Displays: ConfirmationDialog, SuccessMessageDisplay
- Entities: FieldCalendar, BookingRequest, Notification

### Sequence Flow (Detailed)
1. The Field Owner initiates the interaction by opening CalendarView.
2. The system displays the calendar with slots.
3. The Field Owner clicks on a slot.
4. The system instantiates `SlotDetailView` using `<<create>>`.
5. The Field Owner chooses an action (e.g., "Cancel Booking" or "Block Slot").
6. If Cancel Booking:
   - The system instantiates `ConfirmationDialog` using `<<create>>`.
   - The Field Owner confirms.
   - The BookingController updates `BookingRequest` status to "Cancelled".
   - The controller updates `FieldCalendar` to "Available".
   - The controller creates `Notification` using `<<create>>` for the Team Leader.
7. If Block Slot:
   - The controller updates `FieldCalendar` status to "Maintenance/Blocked".
8. The system displays `SuccessMessageDisplay`.
9. The system finalizes by refreshing the calendar.

---
## Use Case: Register (UC-AU-01)

### Actors
- Primary: User (Player, Team Leader, or Field Owner)

### Components
- UI/Boundary: RegistrationForm
- Controllers: AuthController
- Displays: SuccessMessageDisplay, ErrorMessageDisplay
- Entities: UserAccount, EmailService

### Sequence Flow (Detailed)
1. The User initiates the interaction by selecting "Register".
2. The system instantiates `RegistrationForm` using `<<create>>`.
3. The User enters credentials and profile info.
4. The AuthController validates the input (username uniqueness, password strength).
5. If validation fails:
   - The controller creates `ErrorMessageDisplay` using `<<create>>`.
6. If validation succeeds:
   - The controller creates a new `UserAccount` entity using `<<create>>`.
   - The controller calls `EmailService` to send a verification email.
   - The system displays `SuccessMessageDisplay`.
7. The system finalizes by redirecting to the Login page.

---
## Use Case: Login (UC-AU-02)

### Actors
- Primary: User

### Components
- UI/Boundary: LoginForm
- Controllers: AuthController
- Displays: ErrorMessageDisplay
- Entities: UserAccount, Session

### Sequence Flow (Detailed)
1. The User initiates the interaction by entering username and password in `LoginForm`.
2. The User clicks "Login".
3. The AuthController verifies credentials against `UserAccount`.
4. If invalid:
   - The controller creates `ErrorMessageDisplay` using `<<create>>`.
5. If valid:
   - The controller checks if account is active/verified.
   - The controller creates a new `Session` entity using `<<create>>`.
   - The system redirects the User to the role-specific dashboard.

---
## Use Case: Logout (UC-AU-03)

### Actors
- Primary: Authenticated User

### Components
- UI/Boundary: NavigationBar
- Controllers: AuthController
- Entities: Session

### Sequence Flow (Detailed)
1. The User initiates the interaction by clicking "Logout".
2. The AuthController receives the request.
3. The controller retrieves the current `Session`.
4. The controller destroys the `Session` using `<<destroy>>`.
5. The system redirects the User to the Login page.

---
## Use Case: Change Password (UC-AU-04)

### Actors
- Primary: Authenticated User

### Components
- UI/Boundary: PasswordChangeForm
- Controllers: AuthController
- Displays: SuccessMessageDisplay, ErrorMessageDisplay
- Entities: UserAccount

### Sequence Flow (Detailed)
1. The User initiates the interaction by opening `PasswordChangeForm`.
2. The User enters current password and new password.
3. The AuthController verifies the current password against `UserAccount`.
4. If incorrect:
   - The controller creates `ErrorMessageDisplay` using `<<create>>`.
5. If correct:
   - The controller updates the `UserAccount` with the new password hash.
   - The system displays `SuccessMessageDisplay`.
6. The system finalizes by clearing the form.

---
## Use Case: Search for Teams (UC-SD-01)

### Actors
- Primary: User

### Components
- UI/Boundary: SearchBar, SearchResultsView
- Controllers: SearchController
- Displays: EmptyStateDisplay
- Entities: TeamProfile

### Sequence Flow (Detailed)
1. The User initiates the interaction by entering a query (name, location) in `SearchBar`.
2. The SearchController receives the query.
3. The controller queries `TeamProfile` entities matching the criteria.
4. If no matches:
   - The system instantiates `EmptyStateDisplay` using `<<create>>`.
5. If matches found:
   - The system instantiates `SearchResultsView` using `<<create>>` with the list.
6. The User views the results.

---
## Use Case: Search for Fields (UC-SD-02)

### Actors
- Primary: User

### Components
- UI/Boundary: SearchBar, SearchResultsView
- Controllers: SearchController
- Displays: EmptyStateDisplay
- Entities: FieldProfile

### Sequence Flow (Detailed)
1. The User initiates the interaction by entering criteria (amenities, price) in `SearchBar`.
2. The SearchController receives the query.
3. The controller queries `FieldProfile` entities.
4. If no matches:
   - The system instantiates `EmptyStateDisplay` using `<<create>>`.
5. If matches found:
   - The system instantiates `SearchResultsView` using `<<create>>`.
6. The User views the list of fields.

---
## Use Case: Search for Players (UC-SD-03)

### Actors
- Primary: User

### Components
- UI/Boundary: SearchBar, SearchResultsView
- Controllers: SearchController
- Displays: EmptyStateDisplay
- Entities: PlayerProfile

### Sequence Flow (Detailed)
1. The User initiates the interaction by entering criteria (position, skill) in `SearchBar`.
2. The SearchController receives the query.
3. The controller queries `PlayerProfile` entities.
4. If no matches:
   - The system instantiates `EmptyStateDisplay` using `<<create>>`.
5. If matches found:
   - The system instantiates `SearchResultsView` using `<<create>>`.
6. The User views the list of players.

---
## Use Case: Search for Field Owners (UC-SD-04)

### Actors
- Primary: User

### Components
- UI/Boundary: SearchBar, SearchResultsView
- Controllers: SearchController
- Displays: EmptyStateDisplay
- Entities: UserAccount (Role: FieldOwner)

### Sequence Flow (Detailed)
1. The User initiates the interaction by entering criteria in `SearchBar`.
2. The SearchController receives the query.
3. The controller queries `UserAccount` entities with role "FieldOwner".
4. If no matches:
   - The system instantiates `EmptyStateDisplay` using `<<create>>`.
5. If matches found:
   - The system instantiates `SearchResultsView` using `<<create>>`.
6. The User views the list of owners.

---
## Use Case: View Match Information (UC-SD-05)

### Actors
- Primary: User

### Components
- UI/Boundary: MatchDetailView
- Controllers: MatchController
- Displays: ErrorMessageDisplay
- Entities: MatchEvent

### Sequence Flow (Detailed)
1. The User initiates the interaction by selecting a match link.
2. The MatchController retrieves the `MatchEvent`.
3. The controller checks permission (public vs private).
4. If unauthorized:
   - The controller creates `ErrorMessageDisplay` using `<<create>>`.
5. If authorized:
   - The system instantiates `MatchDetailView` using `<<create>>` with match data.
6. The User views the details.

---
## Use Case: Receive Notifications (UC-CM-01)

### Actors
- Primary: User

### Components
- UI/Boundary: NotificationCenter
- Controllers: NotificationController
- Entities: Notification

### Sequence Flow (Detailed)
1. A triggering event occurs (e.g., Match Invitation).
2. The system calls NotificationController to generate a notification.
3. The controller creates a new `Notification` entity using `<<create>>`.
4. The controller pushes the notification to the `NotificationCenter`.
5. The User sees the notification alert.
6. The User clicks the notification to view details.
7. The system marks the `Notification` as read.

---
## Use Case: Manage Notification Settings (UC-CM-02)

### Actors
- Primary: User

### Components
- UI/Boundary: NotificationSettingsView
- Controllers: NotificationController
- Displays: SuccessMessageDisplay
- Entities: UserProfile

### Sequence Flow (Detailed)
1. The User initiates the interaction by opening `NotificationSettingsView`.
2. The User toggles preferences (e.g., Email, Push, SMS) and clicks "Save".
3. The NotificationController validates the input.
4. The controller updates the `UserProfile` preferences.
5. The system displays `SuccessMessageDisplay`.

---
## Use Case: Browse Public Content (UC-CI-01)

### Actors
- Primary: User

### Components
- UI/Boundary: CommunityFeedView
- Controllers: ContentController
- Displays: EmptyStateDisplay
- Entities: Post

### Sequence Flow (Detailed)
1. The User initiates the interaction by opening the Community tab.
2. The ContentController retrieves public `Post` entities (sorted by date/popularity).
3. If no posts:
   - The system instantiates `EmptyStateDisplay` using `<<create>>`.
4. If posts exist:
   - The system instantiates `CommunityFeedView` using `<<create>>` with the content.
5. The User scrolls through the feed.

---
## Use Case: Create Community Posts (UC-CI-02)

### Actors
- Primary: User

### Components
- UI/Boundary: PostCreationForm
- Controllers: ContentController
- Displays: SuccessMessageDisplay
- Entities: Post

### Sequence Flow (Detailed)
1. The User initiates the interaction by clicking "Create Post".
2. The system instantiates `PostCreationForm` using `<<create>>`.
3. The User enters text, uploads images, and selects visibility.
4. The ContentController validates the content.
5. The controller creates a new `Post` entity using `<<create>>`.
6. The system displays `SuccessMessageDisplay`.
7. The system finalizes by adding the new post to the feed.

---
## Use Case: Comment on Posts (UC-CI-03)

### Actors
- Primary: User

### Components
- UI/Boundary: CommentSection
- Controllers: ContentController
- Entities: Comment, Post, Notification

### Sequence Flow (Detailed)
1. The User initiates the interaction by typing a comment on a post.
2. The User clicks "Post Comment".
3. The ContentController creates a new `Comment` entity using `<<create>>`.
4. The controller links the `Comment` to the `Post`.
5. The controller creates a `Notification` using `<<create>>` for the Post Author.
6. The system updates the `CommentSection` to show the new comment.

---
## Use Case: Like/React Content (UC-CI-04)

### Actors
- Primary: User

### Components
- UI/Boundary: ReactionButton
- Controllers: ContentController
- Entities: Reaction, Post, Notification

### Sequence Flow (Detailed)
1. The User initiates the interaction by clicking "Like" on a post.
2. The ContentController checks if a `Reaction` already exists.
3. If not, it creates a new `Reaction` entity using `<<create>>`.
4. The controller updates the `Post` reaction count.
5. The controller creates a `Notification` using `<<create>>` for the Post Author.
6. The system updates the `ReactionButton` state to "Liked".

---
## Use Case: Report Misconduct (UC-CI-05)

### Actors
- Primary: User
- Secondary: Moderator (Receiver of report)

### Components
- UI/Boundary: ReportForm
- Controllers: ModerationController
- Displays: SuccessMessageDisplay
- Entities: Report, Notification

### Sequence Flow (Detailed)
1. The User initiates the interaction by clicking "Report" on a piece of content.
2. The system instantiates `ReportForm` using `<<create>>`.
3. The User selects a reason and adds details.
4. The ModerationController creates a new `Report` entity using `<<create>>` with status "Pending".
5. The controller creates a `Notification` using `<<create>>` for the Moderator.
6. The system displays `SuccessMessageDisplay`.
7. The system finalizes by closing the form.

---
