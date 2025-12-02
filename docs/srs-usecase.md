# Software Requirements Specification (SRS) - Use Cases for Kick-off: Amateur Football Management and Connection Platform

## Moderator Use Cases

### UC-AM-01: Verify Team Profiles

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-AM-01 |
| **Use Case Name** | Verify Team Profiles |
| **Actor** | Moderator |
| **Usage** | Allows the Moderator to review and approve or reject team profile submissions before they appear publicly in the system. |
| **Activation Event** | The Moderator selects “Pending Team Profiles” from the Moderator Dashboard. |
| **Preconditions** | A team profile has been submitted and is awaiting verification. |
| **Postconditions** | The team profile is marked as Verified, Rejected, or Pending Revision. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | Moderator | Opens the “Pending Team Profiles” dashboard. |
| 2 | System | Displays a list of pending team submissions. |
| 3 | Moderator | Reviews team details (name, logo, description, members). |
| 4 | Moderator | Approves or rejects the team submission. |
| 5 | System | Updates the team’s verification status and notifies the team leader. |

---

### UC-AM-02: Verify Field Profiles

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-AM-02 |
| **Use Case Name** | Verify Field Profiles |
| **Actor** | Moderator |
| **Usage** | Allows the Moderator to review and validate football field owner submissions to ensure authenticity and accuracy before approval. |
| **Activation Event** | The Moderator selects “Pending Field Profiles” from the Moderator Dashboard. |
| **Preconditions** | A field owner has submitted a field profile for verification. |
| **Postconditions** | The field profile is marked as Verified or Rejected. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | Moderator | Opens the “Field Verification” panel. |
| 2 | System | Displays a list of pending field verification requests. |
| 3 | Moderator | Reviews field details (location, images, owner information). |
| 4 | Moderator | Approves or rejects the field submission. |
| 5 | System | Updates the field’s verification status and notifies the owner. |

---

### UC-AM-03: Suspend / Reactivate Users

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-AM-03 |
| **Use Case Name** | Suspend / Reactivate Users |
| **Actor** | Moderator |
| **Usage** | Allows the Moderator to suspend, permanently ban, or reactivate user accounts depending on violation records or system reports. |
| **Activation Event** | The Moderator selects “User Management” from the Moderator Dashboard or performs action during content moderation. |
| **Preconditions** | The user account exists and may have pending reports or confirmed violations. |
| **Postconditions** | The user’s account is updated as Active, Suspended, or Deleted, and restrictions are applied system-wide. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | Moderator | Searches for a user and views violation or report history. |
| 2 | Moderator | Chooses to suspend, delete, or reactivate the user account. |
| 3 | System | Applies the selected restriction (block posts, comments, or access). |
| 4 | System | Updates the user’s status and logs the Moderatoristrative action. |
| 5 | System | Notifies the user of their updated account status. |

---

### UC-AM-04: Moderate Reported Content

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-AM-04 |
| **Use Case Name** | Moderate Reported Content |
| **Actor** | Moderator |
| **Usage** | Allows the Moderator to review reported posts, comments, profiles, or fields and take appropriate actions such as keeping, removing, or warning the user. |
| **Activation Event** | The Moderator selects “Reported Content” in the moderation dashboard. |
| **Preconditions** | At least one report exists for content submitted by users. |
| **Postconditions** | Reported content is resolved; corresponding moderation actions and history are recorded in the system. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | Moderator | Opens the “Reported Content” dashboard. |
| 2 | System | Displays report details including content type, reporter, and reason for report. |
| 3 | Moderator | Reviews the reported content and determines appropriate action (Keep, Warn, Remove, Suspend User). |
| 4 | System | Executes the selected action and logs the decision in the moderation history. |
| 5 | System | Notifies affected users and marks the report as resolved. |

---

## Team Leader Use Cases

### UC-TL-01: Create Team Profile

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-TL-01 |
| **Use Case Name** | Create Team Profile |
| **Actor** | Team Leader |
| **Usage** | Allows the team leader to create and register a new team profile with name, logo, and details. |
| **Activation Event** | The team leader clicks “Create Team” on the dashboard or profile section. |
| **Preconditions** | The team leader must be logged in. The team name must be unique. |
| **Postconditions** | A new team profile is created and visible on the leader’s dashboard. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | Team Leader | Opens the “Create Team” page. |
| 2 | Team Leader | Fills in team details (name, description, logo, etc.). |
| 3 | System | Validates entered information. |
| 4 | System | Creates the new team record and stores it in the database. |
| 5 | System | Displays confirmation and redirects to the team profile page. |

---

### UC-TL-02: Edit Team Profile

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-TL-02 |
| **Use Case Name** | Edit Team Profile |
| **Actor** | Team Leader |
| **Usage** | Allows the leader to modify existing team details. |
| **Activation Event** | The leader clicks “Edit Team” on the team profile page. |
| **Preconditions** | Team must exist. The user must be the team leader. |
| **Postconditions** | Team profile information is updated successfully. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | Team Leader | Opens the team profile page. |
| 2 | Team Leader | Clicks “Edit” and updates the desired fields. |
| 3 | System | Validates the input data. |
| 4 | System | Saves changes and updates the database. |
| 5 | System | Displays a success message. |

---

### UC-TL-03: Manage Team Roster

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-TL-03 |
| **Use Case Name** | Manage Team Roster |
| **Actor** | Team Leader |
| **Usage** | Allows the team leader to manage the list of players by adding or removing members. |
| **Activation Event** | The leader clicks “Manage Roster” from the team management page. |
| **Preconditions** | The team profile must exist. |
| **Postconditions** | The roster is updated and synced in the database. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | Team Leader | Opens team roster page. |
| 2 | Team Leader | Adds or removes players from the list. |
| 3 | System | Updates player list in the database. |
| 4 | System | Sends notifications to added/removed players. |

---

### UC-TL-04: Approve Player Requests

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-TL-04 |
| **Use Case Name** | Approve Player Requests |
| **Actor** | Team Leader |
| **Usage** | Allows the leader to review, accept, or reject player requests to join the team. |
| **Activation Event** | A new join request appears in the team leader’s dashboard. |
| **Preconditions** | Player must have submitted a join request. |
| **Postconditions** | Approved players are added to the roster; rejected players are notified. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | System | Displays list of pending join requests. |
| 2 | Team Leader | Reviews player information. |
| 3 | Team Leader | Clicks “Approve” or “Reject”. |
| 4 | System | Updates request status and notifies the player. |

---

### UC-TL-05: Delete Team

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-TL-05 |
| **Use Case Name** | Delete Team |
| **Actor** | Team Leader |
| **Usage** | Allows the team leader to permanently delete a team profile. |
| **Activation Event** | The leader selects “Delete Team” from the settings page. |
| **Preconditions** | The user must be the team leader. Confirmation is required. |
| **Postconditions** | Team is deleted from the system and members are notified. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | Team Leader | Clicks “Delete Team”. |
| 2 | System | Prompts for confirmation. |
| 3 | Team Leader | Confirms deletion. |
| 4 | System | Removes the team record and related data. |
| 5 | System | Sends notifications to members. |

---

### UC-TL-06: Create Match Events

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-TL-06 |
| **Use Case Name** | Create Match Events |
| **Actor** | Team Leader |
| **Usage** | Allows the leader to schedule a new match, choose stadium, and send invitations. |
| **Activation Event** | Leader clicks “Create Match” from match management. |
| **Preconditions** | The team must be active. Date/time must not conflict with existing matches. |
| **Postconditions** | Match event recorded and stadium owner notified. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | Team Leader | Opens Create Match page. |
| 2 | Team Leader | Enters match details (date, time, location). |
| 3 | System | Displays available stadiums. |
| 4 | Team Leader | Selects stadium and confirms booking. |
| 5 | System | Contacts stadium owner for approval. |
| 6 | System | Updates match status (approved/rejected). |

---

### UC-TL-07: Cancel Match Events

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-TL-07 |
| **Use Case Name** | Cancel Match Events |
| **Actor** | Team Leader (primary), Stadium Owner, Opponent Team Leader |
| **Usage** | Allows an authorized party to cancel a scheduled match. The system updates match status, releases stadium booking, applies penalties/refunds, and notifies all parties. |
| **Activation Event** | The actor clicks “Cancel Match” from match details or the stadium panel. |
| **Preconditions** | The match exists and is cancellable; actor has permission; and the cancellation policy is retrievable. |
| **Postconditions** | Match status is updated; stadium booking is released; penalties/refunds are applied; and all parties are notified. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | Actor | Opens match details and clicks *Cancel Match*. |
| 2 | System | Shows policy summary (deadline, penalty/refund). |
| 3 | Actor | Selects a reason and confirms cancellation. |
| 4 | System | Validates state and permissions. |
| 5 | System | Updates match status accordingly. |
| 6 | System | Releases or updates stadium booking. |
| 7 | System | Logs audit record. |
| 8 | System | Sends notifications to all relevant parties. |

#### Alternative Flow

* **AF1 – Stadium Owner cancels:** Status → *Looking for Stadium*.
* **AF2 – Opponent Team cancels:** Status → *Cancelled*; remaining team may find new opponent.
* **EF1 – Non-cancellable state:** System blocks cancellation and displays message.
* **EF2 – Late cancellation:** System applies penalty and requires confirmation.

---

### UC-TL-08: Respond to Match Invitations

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-TL-08 |
| **Use Case Name** | Respond to Match Invitations |
| **Actor** | Team Leader |
| **Usage** | Allows the leader to accept or decline match invitations from other teams. |
| **Activation Event** | Leader receives match invitation notification. |
| **Preconditions** | Invitation must exist and be active. |
| **Postconditions** | Match status updated (Accepted/Declined). |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | System | Displays pending invitations. |
| 2 | Team Leader | Reviews invitation details. |
| 3 | Team Leader | Clicks “Accept” or “Decline”. |
| 4 | System | Updates match status and notifies both teams. |

---

### UC-TL-09: Track Match Attendance

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-TL-09 |
| **Use Case Name** | Track Match Attendance |
| **Actor** | Team Leader |
| **Usage** | Allows the leader to track player availability and attendance. |
| **Activation Event** | Leader opens match details to record attendance. |
| **Preconditions** | Match must be scheduled. |
| **Postconditions** | Attendance data saved and visible in match report. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | Team Leader | Opens attendance section. |
| 2 | Team Leader | Marks each player as available/unavailable. |
| 3 | System | Updates attendance record. |
| 4 | System | Generates summary for review. |

---

### UC-TL-10: Manage Team Funds

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-TL-10 |
| **Use Case Name** | Manage Team Funds |
| **Actor** | Team Leader |
| **Usage** | Allows the leader to track income, expenses, and team balance. |
| **Activation Event** | Leader clicks “Team Finance” on the dashboard. |
| **Preconditions** | Team must exist. Leader must have finance rights. |
| **Postconditions** | Team fund balance updated successfully. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | Team Leader | Opens finance dashboard. |
| 2 | Team Leader | Adds or updates income/expense records. |
| 3 | System | Calculates updated balance. |
| 4 | System | Displays updated financial summary. |

---

## Player Use Cases

### UC-PL-01: Edit Player Profile

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-PL-01 |
| **Use Case Name** | Edit Player Profile |
| **Actor** | Player |
| **Usage** | Allow players to view and update their profiles. |
| **Activation Event** | Player navigates to the *“My Profile”* page. |
| **Preconditions** | Player is logged into system. |
| **Postconditions** | Updated profile information is saved and reflected in system. |

#### Main Event Flow

| Index | Performed by | Action |
| :--- | :--- | :--- |
| 1 | Player | Navigates to “My Profile” page. |
| 2 | System | Displays current player information. |
| 3 | Player | Selects “Edit Profile” option. |
| 4 | Player | Updates one or more fields. |
| 5 | Player | Submits the changes. |
| 6 | System | Validates input and updates player profile in the database. |

---

### UC-PL-02: Request to Join Team

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-PL-02 |
| **Use Case Name** | Request to Join Team |
| **Actor** | Player |
| **Usage** | Allow players to join a team by sending a join request to a team leader. |
| **Activation Event** | Player browses or searches for a team. |
| **Preconditions** | Team is accepting new players. |
| **Postconditions** | A join request is created and sent to team leader. Player is notified of the decision. |

#### Main Event Flow

| Index | Performed by | Action |
| :--- | :--- | :--- |
| 1 | Player | Browses or searches for a team. |
| 2 | Player | Selects a team from list. |
| 3 | Player | Views team profile and selects “Request to Join.” |
| 4 | System | Records request and notifies team leader. |
| 5 | Team Leader | Reviews and accepts or rejects the request. |
| 6 | System | Notifies player of team leader’s decision. |

---

### UC-PL-03: Leave Team

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-PL-03 |
| **Use Case Name** | Leave Team |
| **Actor** | Player |
| **Usage** | Allow players to leave a team they have previously joined. |
| **Activation Event** | Player navigates to *“My Teams”* page. |
| **Preconditions** | Player is a current member of a team. |
| **Postconditions** | Player is removed from team, and team leader is notified. |

#### Main Event Flow

| Index | Performed by | Action |
| :--- | :--- | :--- |
| 1 | Player | Navigates to “My Teams” list. |
| 2 | Player | Selects a team to leave. |
| 3 | Player | Confirms the decision to leave. |
| 4 | System | Removes player from team roster and updates dashboard. |
| 5 | System | Notifies team leader of player’s departure. |

---

### UC-PL-04: View Match Schedule

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-PL-04 |
| **Use Case Name** | View Match Schedule |
| **Actor** | Player |
| **Usage** | Allow players to see previous and upcoming matches of their teams. |
| **Activation Event** | Player navigates to *“My Schedule”* page. |
| **Preconditions** | Player is logged into system. |
| **Postconditions** | *(Blank)* |

#### Main Event Flow

| Index | Performed by | Action |
| :--- | :--- | :--- |
| 1 | Player | Navigates to “My Schedule” page. |
| 2 | System | Displays list of previous matches and upcoming matches of player’s teams. |
| 3 | Player | Selects a match from list to view details. |
| 4 | System | Displays match details including date, time, venue and opponent. |

---

### UC-PL-05: Confirm Match Attendance

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-PL-05 |
| **Use Case Name** | Confirm Match Attendance |
| **Actor** | Player |
| **Usage** | Allow players to confirm attendance for an upcoming match. |
| **Activation Event** | Player navigates to *“My Schedule”* page. |
| **Preconditions** | A match event involving player’s team has been created. |
| **Postconditions** | Player’s attendance status is updated and visible to team leader. |

#### Main Event Flow

| Index | Performed by | Action |
| :--- | :--- | :--- |
| 1 | Player | Navigates to “My Schedule” page. |
| 2 | System | Displays list of previous and upcoming matches. |
| 3 | Player | Selects an upcoming match and chooses “Confirm Attendance.” |
| 4 | System | Updates player’s attendance status. |

---

## Field Owner Use Cases

### UC-FO-01: Create Field Profile

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-FO-01 |
| **Use Case Name** | Create Field Profile |
| **Actor** | Field Owner |
| **Usage** | Allows a field owner to register a new football field profile with details, photos, pricing, and amenities. |
| **Activation Event** | Field Owner selects *“Register New Field”* in the field management section. |
| **Preconditions** | The user must be logged in as a Field Owner. |
| **Postconditions** | A new field profile is created and saved with a “Pending Verification” status. |

#### Main Event Flow

| Index | Performed by | Action |
| :--- | :--- | :--- |
| 1 | Field Owner | Navigate to “Register New Field”. |
| 2 | System | Display a form for entering field details. |
| 3 | Field Owner | Input field information (name, address, description, amenities like lights, water, parking). |
| 4 | Field Owner | Upload photos of the field. |
| 5 | Field Owner | Set pricing structure for different time slots (peak, off-peak, weekends). |
| 6 | Field Owner | Submit the field profile for verification. |
| 7 | System | Save the profile with “Pending Verification” status and notify the Moderator. |

#### Alternate Flow

* **AF1 – Required information is missing or invalid:** System displays an error message and prompts the user to correct it.

---

### UC-FO-02: Edit Field Profile

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-FO-02 |
| **Use Case Name** | Edit Field Profile |
| **Actor** | Field Owner |
| **Usage** | Allows a field owner to update information for a registered field (details, photos, pricing, amenities, and time slots). |
| **Activation Event** | Field Owner selects *“Manage My Fields”* and chooses a field to edit. |
| **Preconditions** | The Field Owner is logged in and has at least one existing field profile. |
| **Postconditions** | The field profile information is successfully updated and saved in the system. |

#### Main Event Flow

| Index | Performed by | Action |
| :--- | :--- | :--- |
| 1 | Field Owner | Navigate to “Manage My Fields”. |
| 2 | Field Owner | Select the field they wish to edit. |
| 3 | System | Display the current field profile details. |
| 4 | Field Owner | Click “Edit” and modify desired fields (e.g., pricing, photos, amenities, time slots). |
| 5 | Field Owner | Save the changes. |
| 6 | System | Validate and update the field profile information. |
| 7 | System | Confirm successful update. |

#### Alternate Flow

* **AF1 – Profile already verified:** Major edits (e.g., location or ownership changes) require re-verification $\rightarrow$ System flags the profile as “Pending Re-verification” and notifies the Moderator.

---

### UC-FO-03: View Booking Requests

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-FO-03 |
| **Use Case Name** | View Booking Requests |
| **Actor** | Field Owner |
| **Usage** | Allows the field owner to see all incoming booking requests from teams. |
| **Activation Event** | Field Owner navigates to the *“Booking Management”* page or Dashboard. |
| **Preconditions** | Field Owner is logged in. At least one team has submitted a booking request. |
| **Postconditions** | The Field Owner has reviewed the list of pending booking requests. |

#### Main Event Flow

| Index | Performed by | Action |
| :--- | :--- | :--- |
| 1 | Field Owner | Navigate to the “Booking Management” page or Dashboard. |
| 2 | System | Display a list of all new (pending) booking requests, typically sorted by date. |
| 3 | System | Show summary details for each request (Team Name, Date, Time Slot). |
| 4 | Field Owner | Select a specific request to view its full details. |

#### Alternate Flow

* **AF1 – No pending booking requests exist:** System displays a message: “No new booking requests.”

---

### UC-FO-04: Response Booking Requests

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-FO-04 |
| **Use Case Name** | Response Booking Requests |
| **Actor** | Field Owner |
| **Usage** | Allows the field owner to accept or decline a specific booking request submitted by a team. |
| **Activation Event** | The Field Owner opens a pending booking request from the *“Booking Management”* page (UC-FO-05). |
| **Preconditions** | The Field Owner is viewing a specific pending booking request. The request is valid and the time slot is available. |
| **Postconditions** | The booking request status is updated to “Confirmed” or “Rejected”. The field calendar reflects the change, and the team is notified accordingly. |

#### Main Event Flow

| Index | Performed by | Action |
| :--- | :--- | :--- |
| 1 | System | Display the booking request details and check the field calendar for availability. |
| 2 | Field Owner | Select “Approve” or “Reject”. |
| 3 | System | If “Approve” $\rightarrow$ Confirm booking, update the field’s calendar, and mark the time slot as “Booked”. |
| 4 | System | If “Reject” $\rightarrow$ Cancel the request and keep the time slot “Available”. |
| 5 | System | Send notification (approval or rejection) to the Team Leader who submitted the request. |

#### Alternate Flow

* **AF1 – Requested time slot already booked or blocked:** System displays a conflict warning and disables the “Approve” option.

---

### UC-FO-05: Manage Booking Calendar

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-FO-05 |
| **Use Case Name** | Manage Booking Calendar |
| **Actor** | Field Owner |
| **Usage** | Provides a visual calendar that allows the Field Owner to view, manage, and modify all field bookings (cancel, change time, or view booking details). |
| **Activation Event** | Field Owner navigates to the *“Booking Calendar”* page from the dashboard or field management section. |
| **Preconditions** | Field Owner is logged in and has at least one registered field with existing or potential bookings. |
| **Postconditions** | The booking calendar is viewed and updated. Bookings can be canceled, rescheduled, or time slots manually blocked by the owner. |

#### Main Event Flow

| Index | Performed by | Action |
| :--- | :--- | :--- |
| 1 | Field Owner | Navigate to the “Booking Calendar” page. |
| 2 | System | Display a calendar (day/week/month view) showing “Booked” and “Available” time slots. |
| 3 | Field Owner | Click on a “Booked” time slot to view details. |
| 4 | System | Display a “Details” pop-up with booking information (Team Name, contact info). |
| 5 | Field Owner | Choose an action: “Cancel Booking” or “Change Time (Reschedule)”. |
| 6 | System | If “Cancel Booking” $\rightarrow$ Ask for confirmation, then cancel the booking and mark the slot as “Available”. |
| 7 | System | Notify the Team Leader about the cancellation. |
| 8 | System | If “Change Time” $\rightarrow$ Allow rescheduling to a new available time slot and update the calendar. |

#### Alternate Flow

* **AF1 – Field Owner wants to block a time slot (e.g., for maintenance):** Select an “Available” slot and choose “Mark as Unavailable”. The slot becomes blocked from future bookings.

---

## Other Use Cases

### UC-AU-01: Register

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-AU-01 |
| **Use Case Name** | Register |
| **Actor** | Player, Team Leader, Field Owner |
| **Usage** | Create a new account to access the system’s features. |
| **Activation Event** | User selects **“Register”** from the app’s home screen. |
| **Preconditions** | User does not already have an existing account with the same username. |
| **Postconditions** | New user account is created and stored in the database. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | User | Opens the registration form. |
| 2 | User | Inputs credentials and required profile information. |
| 3 | System | Validates inputs (username format and uniqueness, password strength, uniqueness). |
| 4 | System | Creates a new user record and assigns the selected role. |
| 5 | System | Upon verification, user gains access to login. |

#### Alternative Flow

* **EF1 – Username already registered:** System notifies the user and requests different credentials.
* **EF2 – Invalid input or missing required fields:** System prompts correction.

---

### UC-AU-02: Login

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-AU-02 |
| **Use Case Name** | Login |
| **Actor** | All registered users |
| **Usage** | Authenticate and gain access to the platform using valid credentials. |
| **Activation Event** | User selects **“Login”** on the home screen. |
| **Preconditions** | The user has a valid registered account; account is active (not suspended or pending verification). |
| **Postconditions** | User is authenticated and has access to authorized features. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | User | Enters username and password. |
| 2 | System | Verifies credentials against stored records. |
| 3 | System | Upon success, user is redirected to their personalized dashboard (depending on role). |

#### Alternative Flow

* **EF1 – Invalid credentials:** System displays error and prompts retry.
* **AF1 – Suspended or unverified account:** System denies login and displays appropriate message.

---

### UC-AU-03: Logout

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-AU-03 |
| **Use Case Name** | Logout |
| **Actor** | All authenticated users |
| **Usage** | Securely end the user’s current session. |
| **Activation Event** | User selects **“Logout”** from the main menu or account options. |
| **Preconditions** | User is currently logged in. |
| **Postconditions** | User session is terminated; cached credentials or session data are cleared. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | User | Initiates logout. |
| 2 | System | User is redirected to the login screen. |

---

### UC-AU-04: Change Password

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-AU-04 |
| **Use Case Name** | Change Password |
| **Actor** | All authenticated users |
| **Usage** | Update password to improve security or recover access. |
| **Activation Event** | User selects **“Change Password”** in account settings. |
| **Preconditions** | User is logged in; user provides the correct current password. |
| **Postconditions** | Password is successfully updated in the user’s account; future logins require the new password. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | User | Enters current and new password. |
| 2 | System | Validates the current password. |
| 3 | System | Checks new password strength. |
| 4 | System | Updates stored password hash and confirms success. |

#### Alternative Flow

* **EF1 – Incorrect current password:** System denies change and prompts retry.
* **EF2 – Weak or invalid new password:** System requests revision.

---

### UC-SD-01: Search for Teams

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-SD-01 |
| **Use Case Name** | Search for Teams |
| **Actor** | All users |
| **Usage** | Allow users to find football teams based on specific criteria. |
| **Activation Event** | User navigates to the **“Teams”** section or opens the search bar. |
| **Preconditions** | User is logged in; team profiles exist in the system. |
| **Postconditions** | Search results are displayed on the user’s screen. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | User | Enters search criteria (e.g., team name, location, skill level). |
| 2 | System | Validates the input and performs a search in the team database. |
| 3 | System | Displays a list of teams matching the criteria. |
| 4 | User | Views basic team information from the search results. |

#### Alternative Flow

* **AF1 – No teams match the search:** System displays a “No results found” message.

---

### UC-SD-02: Search for Fields

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-SD-02 |
| **Use Case Name** | Search for Fields |
| **Actor** | All users |
| **Usage** | Allow users to find football fields based on desired attributes. |
| **Activation Event** | User navigates to the **“Fields”** section or uses the search function. |
| **Preconditions** | User is logged in; field profiles exist in the system. |
| **Postconditions** | Search results are displayed on the user’s screen. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | User | Enters search criteria (e.g., location, amenities, price range). |
| 2 | System | Validates the input and performs a search in the field database. |
| 3 | System | Displays a list of fields matching the criteria. |
| 4 | User | Views basic field information from the search results. |

#### Alternative Flow

* **AF1 – No fields match the search:** System displays a “No results found” message.

---

### UC-SD-03: Search for Players

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-SD-03 |
| **Use Case Name** | Search for Players |
| **Actor** | All users |
| **Usage** | Allow users to find player profiles using specific filters. |
| **Activation Event** | User navigates to the **“Players”** section or uses the search function. |
| **Preconditions** | User is logged in; player profiles exist in the system. |
| **Postconditions** | Search results are displayed on the user’s screen. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | User | Enters search criteria (e.g., name, position, skill level). |
| 2 | System | Validates the input and performs a search in the player database. |
| 3 | System | Displays a list of players matching the criteria. |
| 4 | User | Views basic player information from the search results. |

#### Alternative Flow

* **AF1 – No players match the search:** System displays a “No results found” message.

---

### UC-SD-04: Search for Field Owners

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-SD-04 |
| **Use Case Name** | Search for Field Owners |
| **Actor** | All users |
| **Usage** | Allow users to search for field owners registered in the system. |
| **Activation Event** | User navigates to the **“Field Owners”** section or uses the search function. |
| **Preconditions** | User is logged in; field owner profiles exist in the system. |
| **Postconditions** | Search results are displayed on the user’s screen. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | User | Enters search criteria (e.g., name, area, number of fields). |
| 2 | System | Validates the input and performs a search in the field owner database. |
| 3 | System | Displays a list of field owners matching the criteria. |
| 4 | User | Views basic field owner information from the search results. |

#### Alternative Flow

* **AF1 – No field owners match the search:** System displays a “No results found” message.

---

### UC-SD-05: View Match Information

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-SD-05 |
| **Use Case Name** | View Match Information |
| **Actor** | Player, Team Leader, Moderator, Field Owner |
| **Usage** | View match details (public or team-level). |
| **Activation Event** | User navigates to a team profile or personal match tab. |
| **Preconditions** | Match events exist and are linked to teams or fields. |
| **Postconditions** | Match details are shown to the permitted user. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | User | Selects a team or match entry. |
| 2 | System | Displays match date, time, location, and status. |

#### Alternative Flow

* **AF1 – Unauthorized view (private match):** Access denied or limited info shown.

---

### UC-CM-01: Receive Notifications

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-CM-01 |
| **Use Case Name** | Receive Notifications |
| **Actor** | All users |
| **Usage** | Notify users of match invitations, updates, or administrative actions. |
| **Activation Event** | System triggers event (e.g., booking approved, match canceled). |
| **Preconditions** | User account is active with notifications enabled. |
| **Postconditions** | User is informed of relevant events. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | System | Triggering event occurs. |
| 2 | System | Generates notification and pushes it |
| 3 | User | Click the notification button. |
| 4 | User | Views or dismisses the notification. |
| 5 | User | Close the notification view. |

---

### UC-CM-02: Manage Notification Settings

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-CM-02 |
| **Use Case Name** | Manage Notification Settings |
| **Actor** | All users |
| **Usage** | Customize which types of notifications to receive. |
| **Activation Event** | User navigates to **“Notification Settings”**. |
| **Preconditions** | User is logged in. |
| **Postconditions** | Notification preferences are updated in the user profile. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | User | Views available notification categories (matches, messages, reports, etc.). |
| 2 | User | Enables/disables chosen categories. |
| 3 | System | Saves preferences. |

---

### UC-CI-01: Browse Public Content

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-CI-01 |
| **Use Case Name** | Browse Public Content |
| **Actor** | All users |
| **Usage** | Explore publicly available posts, discussions, and team updates. |
| **Activation Event** | User opens the community feed tab. |
| **Preconditions** | Public posts exist. |
| **Postconditions** | User has viewed available community content. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | System | Displays public posts sorted by time or popularity. |
| 2 | User | Can scroll, view details, and interact (if logged in). |

---

### UC-CI-02: Create Community Posts

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-CI-02 |
| **Use Case Name** | Create Community Posts |
| **Actor** | All authenticated users |
| **Usage** | Share content (text/images) on the community feed. |
| **Activation Event** | User selects **“Create Post”**. |
| **Preconditions** | User account is active. |
| **Postconditions** | Post is published and visible to the selected audience. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | User | Writes text, optionally uploads images, and selects visibility (public/team). |
| 2 | System | Validates and stores the post. |
| 3 | System | Post appears in the feed. |

---

### UC-CI-03: Comment on Posts

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-CI-03 |
| **Use Case Name** | Comment on Posts |
| **Actor** | All authenticated users |
| **Usage** | Engage with existing posts through comments. |
| **Activation Event** | User selects a post and enters a comment. |
| **Preconditions** | Post exists and allows comments. |
| **Postconditions** | Comment is visible and linked to user account. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | User | Writes comment. |
| 2 | System | Stores and displays it under the post. |

---

### UC-CI-04: Like/React Content

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-CI-04 |
| **Use Case Name** | Like/React Content |
| **Actor** | All authenticated users |
| **Usage** | Express appreciation or reaction to posts/comments. |
| **Activation Event** | User taps **“Like”** or reaction icon. |
| **Preconditions** | Target content exists. |
| **Postconditions** | Reaction is stored; post’s engagement count updated. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | User | Reacts to content. |
| 2 | System | Updates like count and displays reaction. |

---

### UC-CI-05: Report Misconduct

| Field | Value |
| :--- | :--- |
| **Use Case Code** | UC-CI-05 |
| **Use Case Name** | Report Misconduct |
| **Actor** | All authenticated users |
| **Usage** | Report inappropriate posts, comments, or profiles to moderators. |
| **Activation Event** | User selects **“Report”** on a content item. |
| **Preconditions** | User is logged in; reportable content exists. |
| **Postconditions** | Report is logged and pending moderator action. |

#### Main Event Flow

| Index | Done by | Action |
| :--- | :--- | :--- |
| 1 | User | Selects a reason (spam, abuse, misinformation, etc.). |
| 2 | System | Records the report and notifies moderators. |