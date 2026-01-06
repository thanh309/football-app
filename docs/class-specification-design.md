# Class Specification Design Document

**Football Application - Layered Architecture (Controller-Service-Repository-Entity)**

---

## Table of Contents

1. [Entity Layer](#1-entity-layer)
2. [Repository Layer](#2-repository-layer)
3. [Service Layer](#3-service-layer)
4. [Controller Layer](#4-controller-layer)
5. [Supporting Classes](#5-supporting-classes)

---

## 1. Entity Layer

The Entity layer contains SQLAlchemy ORM models that map directly to database tables.

---

### 1.1 UserAccount

**Description:** Core user entity for authentication and role management. Stores credentials, profile information, and manages relationships with other entities like player profiles, teams, fields, and posts.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| user_id | Integer | Public | Primary key, auto-incremented identifier |
| username | String(255) | Public | Unique username for login |
| email | String(255) | Public | Unique email address |
| password_hash | String(255) | Private | Bcrypt-hashed password |
| roles | List[String] (JSON) | Public | List of UserRole values (Player, TeamLeader, FieldOwner, Moderator) |
| status | AccountStatus (Enum) | Public | Account status: Active, Suspended, Banned, Pending, Deleted |
| is_verified | Boolean | Public | Email verification status |
| created_at | DateTime | Public | Account creation timestamp |
| updated_at | DateTime | Public | Last update timestamp |
| contact_info | Text | Public | Optional contact information |
| location | String(255) | Public | Optional user location |
| latitude | Float | Public | Optional GPS latitude |
| longitude | Float | Public | Optional GPS longitude |

#### Method

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `__repr__` | None | String | Public | Returns string representation of the user |

---

### 1.2 Session

**Description:** Stores user session information for authentication state tracking.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| session_id | String(255) | Public | Primary key, unique session identifier |
| user_id | Integer (FK) | Public | Foreign key to UserAccount |
| created_at | DateTime | Public | Session creation timestamp |
| expires_at | DateTime | Public | Session expiration timestamp |
| ip_address | String(45) | Public | Client IP address |
| user_agent | Text | Public | Client user agent string |

---

### 1.3 PlayerProfile

**Description:** Player-specific profile extending UserAccount with football-related attributes like position, skill level, and physical characteristics.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| player_id | Integer | Public | Primary key, auto-incremented |
| user_id | Integer (FK) | Public | Foreign key to UserAccount (unique) |
| display_name | String(255) | Public | Public display name |
| position | String(100) | Public | Playing position (e.g., Forward, Midfielder) |
| skill_level | Integer | Public | Skill rating 1-10 |
| bio | Text | Public | Player biography |
| profile_image_id | Integer (FK) | Public | Foreign key to MediaAsset |
| date_of_birth | Date | Public | Player's birth date |
| height | Float | Public | Height in centimeters |
| weight | Float | Public | Weight in kilograms |
| preferred_foot | PreferredFoot (Enum) | Public | Left, Right, or Both |
| created_at | DateTime | Public | Profile creation timestamp |
| updated_at | DateTime | Public | Last update timestamp |

---

### 1.4 TeamProfile

**Description:** Represents a football team with profile information, verification status, and relationships to roster, matches, and bookings.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| team_id | Integer | Public | Primary key, auto-incremented |
| team_name | String(255) | Public | Unique team name |
| description | Text | Public | Team description |
| logo_id | Integer (FK) | Public | Foreign key to MediaAsset |
| leader_id | Integer (FK) | Public | Foreign key to UserAccount (team leader) |
| status | TeamStatus (Enum) | Public | Pending, Verified, Rejected, PendingRevision |
| rejection_reason | Text | Public | Reason if rejected by moderator |
| location | String(255) | Public | Team location |
| latitude | Float | Public | GPS latitude |
| longitude | Float | Public | GPS longitude |
| skill_level | Integer | Public | Team skill rating |
| created_at | DateTime | Public | Creation timestamp |
| updated_at | DateTime | Public | Last update timestamp |

---

### 1.5 TeamRoster

**Description:** Junction table representing team-player membership with role assignment.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| roster_id | Integer | Public | Primary key |
| team_id | Integer (FK) | Public | Foreign key to TeamProfile |
| player_id | Integer (FK) | Public | Foreign key to PlayerProfile |
| role | RosterRole (Enum) | Public | Member, Captain, ViceCaptain |
| joined_at | DateTime | Public | Join date |
| is_active | Boolean | Public | Active membership status |

---

### 1.6 JoinRequest

**Description:** Represents a player's request to join a team, with approval workflow.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| request_id | Integer | Public | Primary key |
| team_id | Integer (FK) | Public | Foreign key to TeamProfile |
| player_id | Integer (FK) | Public | Foreign key to PlayerProfile |
| status | JoinRequestStatus (Enum) | Public | Pending, Accepted, Rejected |
| message | Text | Public | Optional message from player |
| created_at | DateTime | Public | Request timestamp |
| processed_at | DateTime | Public | Processing timestamp |

---

### 1.7 TeamWallet

**Description:** Financial balance tracking for team funds management.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| wallet_id | Integer | Public | Primary key |
| team_id | Integer (FK) | Public | Foreign key to TeamProfile (unique) |
| balance | Decimal(15,2) | Public | Current balance |
| created_at | DateTime | Public | Creation timestamp |
| updated_at | DateTime | Public | Last update timestamp |

---

### 1.8 TransactionLog

**Description:** Financial transaction record for team wallet operations.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| transaction_id | Integer | Public | Primary key |
| wallet_id | Integer (FK) | Public | Foreign key to TeamWallet |
| type | TransactionType (Enum) | Public | Income or Expense |
| amount | Decimal(15,2) | Public | Transaction amount |
| description | Text | Public | Transaction description |
| category | String(100) | Public | Transaction category |
| created_by | Integer (FK) | Public | Foreign key to UserAccount |
| created_at | DateTime | Public | Transaction timestamp |

---

### 1.9 FieldProfile

**Description:** Football field/stadium entity with pricing, availability, and amenities.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| field_id | Integer | Public | Primary key |
| owner_id | Integer (FK) | Public | Foreign key to UserAccount |
| field_name | String(255) | Public | Field name |
| description | Text | Public | Field description |
| location | String(500) | Public | Address |
| latitude | Float | Public | GPS latitude |
| longitude | Float | Public | GPS longitude |
| default_price_per_hour | Decimal(10,2) | Public | Base hourly rate |
| capacity | Integer | Public | Maximum capacity |
| status | FieldStatus (Enum) | Public | Pending, Verified, Rejected, PendingRevision |
| rejection_reason | Text | Public | Rejection reason if applicable |
| cover_image_id | Integer (FK) | Public | Foreign key to MediaAsset |
| created_at | DateTime | Public | Creation timestamp |
| updated_at | DateTime | Public | Last update timestamp |

---

### 1.10 FieldCalendar

**Description:** Field availability time slots with booking status.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| calendar_id | Integer | Public | Primary key |
| field_id | Integer (FK) | Public | Foreign key to FieldProfile |
| date | Date | Public | Slot date |
| start_time | Time | Public | Start time |
| end_time | Time | Public | End time |
| status | CalendarStatus (Enum) | Public | Available, Booked, Maintenance, Blocked |
| booking_id | Integer (FK) | Public | Foreign key to BookingRequest |

---

### 1.11 FieldPricingRule

**Description:** Time-based pricing rules for dynamic field pricing.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| pricing_rule_id | Integer | Public | Primary key |
| field_id | Integer (FK) | Public | Foreign key to FieldProfile |
| name | String(100) | Public | Rule name |
| day_of_week | List[String] (JSON) | Public | Applicable days |
| start_time | Time | Public | Rule start time |
| end_time | Time | Public | Rule end time |
| price_per_hour | Decimal(10,2) | Public | Special hourly rate |
| priority | Integer | Public | Rule priority |
| is_active | Boolean | Public | Rule active status |
| created_at | DateTime | Public | Creation timestamp |
| updated_at | DateTime | Public | Last update timestamp |

---

### 1.12 CancellationPolicy

**Description:** Cancellation rules and penalties for field bookings.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| policy_id | Integer | Public | Primary key |
| field_id | Integer (FK) | Public | Foreign key to FieldProfile |
| free_cancellation_hours | Integer | Public | Hours before for free cancellation |
| late_cancellation_penalty_percent | Decimal(5,2) | Public | Late cancellation penalty % |
| no_show_penalty_percent | Decimal(5,2) | Public | No-show penalty % |
| refund_processing_days | Integer | Public | Days to process refund |
| policy_description | Text | Public | Policy description |
| is_active | Boolean | Public | Policy active status |
| created_at | DateTime | Public | Creation timestamp |
| updated_at | DateTime | Public | Last update timestamp |

---

### 1.13 Amenity

**Description:** Lookup table for field amenity types.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| amenity_id | Integer | Public | Primary key |
| name | String(100) | Public | Amenity name (unique) |
| description | Text | Public | Amenity description |
| icon | String(100) | Public | Icon identifier |
| is_active | Boolean | Public | Active status |

---

### 1.14 FieldAmenity

**Description:** Junction table linking fields to their amenities.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| field_amenity_id | Integer | Public | Primary key |
| field_id | Integer (FK) | Public | Foreign key to FieldProfile |
| amenity_id | Integer (FK) | Public | Foreign key to Amenity |
| quantity | Integer | Public | Quantity of amenity |
| notes | Text | Public | Additional notes |

---

### 1.15 BookingRequest

**Description:** Booking request linking teams to fields for specific time slots.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| booking_id | Integer | Public | Primary key |
| field_id | Integer (FK) | Public | Foreign key to FieldProfile |
| team_id | Integer (FK) | Public | Foreign key to TeamProfile |
| requester_id | Integer (FK) | Public | Foreign key to UserAccount |
| date | Date | Public | Booking date |
| start_time | Time | Public | Start time |
| end_time | Time | Public | End time |
| status | BookingStatus (Enum) | Public | Pending, Confirmed, Rejected, Cancelled |
| notes | Text | Public | Booking notes |
| created_at | DateTime | Public | Creation timestamp |
| processed_at | DateTime | Public | Processing timestamp |

---

### 1.16 MatchEvent

**Description:** Scheduled match event between teams at a field.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| match_id | Integer | Public | Primary key |
| host_team_id | Integer (FK) | Public | Foreign key to TeamProfile (host) |
| opponent_team_id | Integer (FK) | Public | Foreign key to TeamProfile (opponent) |
| field_id | Integer (FK) | Public | Foreign key to FieldProfile |
| booking_id | Integer (FK) | Public | Foreign key to BookingRequest |
| match_date | Date | Public | Match date |
| start_time | Time | Public | Start time |
| end_time | Time | Public | End time |
| status | MatchStatus (Enum) | Public | PendingApproval, Scheduled, InProgress, Completed, Cancelled, LookingForField |
| visibility | Visibility (Enum) | Public | Public, Private, TeamOnly |
| description | Text | Public | Match description |
| created_at | DateTime | Public | Creation timestamp |
| updated_at | DateTime | Public | Last update timestamp |

---

### 1.17 MatchInvitation

**Description:** Match invitation sent between teams.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| invitation_id | Integer | Public | Primary key |
| match_id | Integer (FK) | Public | Foreign key to MatchEvent |
| inviting_team_id | Integer (FK) | Public | Foreign key to TeamProfile (sender) |
| invited_team_id | Integer (FK) | Public | Foreign key to TeamProfile (receiver) |
| status | InvitationStatus (Enum) | Public | Pending, Accepted, Declined, Expired |
| message | Text | Public | Invitation message |
| created_at | DateTime | Public | Creation timestamp |
| responded_at | DateTime | Public | Response timestamp |

---

### 1.18 AttendanceRecord

**Description:** Player attendance tracking for match events.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| attendance_id | Integer | Public | Primary key |
| match_id | Integer (FK) | Public | Foreign key to MatchEvent |
| player_id | Integer (FK) | Public | Foreign key to PlayerProfile |
| team_id | Integer (FK) | Public | Foreign key to TeamProfile |
| status | AttendanceStatus (Enum) | Public | Pending, Present, Absent, Excused |
| confirmed_at | DateTime | Public | Confirmation timestamp |
| confirmed_by | Integer (FK) | Public | Foreign key to UserAccount |

---

### 1.19 MatchResult

**Description:** Final outcome of a completed match.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| result_id | Integer | Public | Primary key |
| match_id | Integer (FK) | Public | Foreign key to MatchEvent (unique) |
| home_score | Integer | Public | Host team score |
| away_score | Integer | Public | Opponent team score |
| winner_id | Integer (FK) | Public | Foreign key to TeamProfile (winner) |
| notes | Text | Public | Result notes |
| recorded_by | Integer (FK) | Public | Foreign key to UserAccount |
| created_at | DateTime | Public | Recording timestamp |

---

### 1.20 Post

**Description:** Community post created by users with optional team association.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| post_id | Integer | Public | Primary key |
| author_id | Integer (FK) | Public | Foreign key to UserAccount |
| team_id | Integer (FK) | Public | Optional foreign key to TeamProfile |
| image_id | Integer (FK) | Public | Foreign key to MediaAsset |
| content | Text | Public | Post content |
| visibility | Visibility (Enum) | Public | Public, Private, TeamOnly |
| reaction_count | Integer | Public | Total reaction count |
| comment_count | Integer | Public | Total comment count |
| is_hidden | Boolean | Public | Hidden by moderator |
| created_at | DateTime | Public | Creation timestamp |
| updated_at | DateTime | Public | Last update timestamp |

---

### 1.21 Comment

**Description:** Comment on posts with support for nested replies.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| comment_id | Integer | Public | Primary key |
| post_id | Integer (FK) | Public | Foreign key to Post |
| author_id | Integer (FK) | Public | Foreign key to UserAccount |
| content | Text | Public | Comment content |
| parent_comment_id | Integer (FK) | Public | Foreign key to Comment (self-referential) |
| is_hidden | Boolean | Public | Hidden by moderator |
| created_at | DateTime | Public | Creation timestamp |
| updated_at | DateTime | Public | Last update timestamp |

---

### 1.22 Reaction

**Description:** User reaction on posts or comments (polymorphic).

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| reaction_id | Integer | Public | Primary key |
| entity_type | ReactionEntityType (Enum) | Public | Post or Comment |
| entity_id | Integer | Public | ID of the target entity |
| user_id | Integer (FK) | Public | Foreign key to UserAccount |
| type | ReactionType (Enum) | Public | Like, Love, Celebrate |
| created_at | DateTime | Public | Creation timestamp |

---

### 1.23 Notification

**Description:** User notification for system events.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| notification_id | Integer | Public | Primary key |
| user_id | Integer (FK) | Public | Foreign key to UserAccount |
| type | NotificationType (Enum) | Public | Notification category |
| title | String(255) | Public | Notification title |
| message | Text | Public | Notification message |
| related_entity_id | Integer | Public | Related entity ID |
| related_entity_type | String(100) | Public | Related entity type |
| is_read | Boolean | Public | Read status |
| created_at | DateTime | Public | Creation timestamp |

---

### 1.24 NotificationPreference

**Description:** User preferences for notification settings.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| preference_id | Integer | Public | Primary key |
| user_id | Integer (FK) | Public | Foreign key to UserAccount (unique) |
| email_notifications | Boolean | Public | Email notification toggle |
| push_notifications | Boolean | Public | Push notification toggle |
| match_reminders | Boolean | Public | Match reminder toggle |
| team_updates | Boolean | Public | Team update toggle |
| booking_updates | Boolean | Public | Booking update toggle |
| community_updates | Boolean | Public | Community update toggle |
| created_at | DateTime | Public | Creation timestamp |
| updated_at | DateTime | Public | Last update timestamp |

---

### 1.25 MediaAsset

**Description:** Uploaded media file (images, videos) with storage information.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| asset_id | Integer | Public | Primary key |
| owner_id | Integer (FK) | Public | Foreign key to UserAccount |
| owner_type | MediaOwnerType (Enum) | Public | Team, Field, Post, Player |
| entity_id | Integer | Public | Associated entity ID |
| file_name | String(255) | Public | Original file name |
| storage_path | String(500) | Public | File storage path |
| file_type | MediaType (Enum) | Public | Image, Video, Document |
| file_size | Integer | Public | File size in bytes |
| mime_type | String(100) | Public | MIME type |
| created_at | DateTime | Public | Upload timestamp |

---

### 1.26 Report

**Description:** Misconduct report submitted by users.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| report_id | Integer | Public | Primary key |
| reporter_id | Integer (FK) | Public | Foreign key to UserAccount (reporter) |
| reported_user_id | Integer (FK) | Public | Foreign key to UserAccount (target) |
| content_id | Integer | Public | Reported content ID |
| content_type | ReportContentType (Enum) | Public | Post, Comment, User |
| reason | String(255) | Public | Report reason |
| details | Text | Public | Additional details |
| status | ReportStatus (Enum) | Public | Pending, Resolved, Dismissed |
| created_at | DateTime | Public | Creation timestamp |
| resolved_at | DateTime | Public | Resolution timestamp |

---

### 1.27 ModerationLog

**Description:** Audit trail for moderation actions.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| log_id | Integer | Public | Primary key |
| moderator_id | Integer (FK) | Public | Foreign key to UserAccount (moderator) |
| target_user_id | Integer (FK) | Public | Foreign key to UserAccount (target) |
| action | ModerationAction (Enum) | Public | Suspend, Ban, Reactivate, ContentRemoval, Warning, RoleChange, Activate |
| reason | Text | Public | Action reason |
| details | Text | Public | Additional details |
| created_at | DateTime | Public | Action timestamp |

---

## 2. Repository Layer

The Repository layer implements the Data Access Object (DAO) pattern, providing an abstraction over database operations.

---

### 2.1 BaseRepository[T]

**Description:** Generic base repository providing common CRUD operations. All entity repositories extend this class.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| model | Type[T] | Protected | The SQLAlchemy model class |
| db | AsyncSession | Protected | Database session |

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `__init__` | model: Type[T], db: AsyncSession | None | Public | Initialize repository with model and session |
| `find_by_id` | id: int | Optional[T] | Public | Find entity by primary key |
| `find_all` | limit: int, offset: int | List[T] | Public | Find all entities with pagination |
| `save` | entity: T | T | Public | Save a new entity |
| `update` | entity: T | T | Public | Update an existing entity |
| `delete` | entity: T | bool | Public | Delete an entity |
| `delete_by_id` | id: int | bool | Public | Delete entity by ID |
| `commit` | None | None | Public | Commit current transaction |
| `_get_pk_name` | None | str | Private | Get primary key column name |

---

### 2.2 UserRepository

**Description:** Repository for UserAccount operations with username/email lookups.

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `find_by_username` | username: str | Optional[UserAccount] | Public | Find user by username |
| `find_by_email` | email: str | Optional[UserAccount] | Public | Find user by email |
| `find_by_id` | user_id: int | Optional[UserAccount] | Public | Find user by ID |

---

### 2.3 SessionRepository

**Description:** Repository for Session operations.

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `find_by_user_id` | user_id: int | Optional[Session] | Public | Find session by user ID |
| `find_by_session_id` | session_id: str | Optional[Session] | Public | Find session by session ID |

---

### 2.4 PlayerRepository

**Description:** Repository for PlayerProfile operations with search capabilities.

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `find_by_id` | player_id: int | Optional[PlayerProfile] | Public | Find player by ID |
| `find_by_user_id` | user_id: int | Optional[PlayerProfile] | Public | Find player by user ID |
| `search_by_position` | position: str, limit: int, offset: int | List[PlayerProfile] | Public | Search players by position |
| `search_by_skill_level` | min_skill: int, max_skill: int, limit: int | List[PlayerProfile] | Public | Search players by skill range |

---

### 2.5 TeamRepository

**Description:** Repository for TeamProfile operations.

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `find_by_id` | team_id: int | Optional[TeamProfile] | Public | Find team by ID |
| `find_by_name` | team_name: str | Optional[TeamProfile] | Public | Find team by name |
| `find_by_leader_id` | leader_id: int | List[TeamProfile] | Public | Find teams by leader |
| `find_pending` | None | List[TeamProfile] | Public | Find teams pending verification |
| `search_by_name` | name: str, limit: int | List[TeamProfile] | Public | Search teams by name pattern |

---

### 2.6 RosterRepository

**Description:** Repository for TeamRoster operations.

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `find_by_team` | team_id: int | List[TeamRoster] | Public | Find roster entries by team |
| `find_by_player` | player_id: int | List[TeamRoster] | Public | Find roster entries by player |
| `find_by_team_and_player` | team_id: int, player_id: int | Optional[TeamRoster] | Public | Find specific roster entry |
| `find_by_id` | roster_id: int | Optional[TeamRoster] | Public | Find roster entry by ID |

---

### 2.7 JoinRequestRepository

**Description:** Repository for JoinRequest operations.

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `find_by_id` | request_id: int | Optional[JoinRequest] | Public | Find join request by ID |
| `find_pending_by_team` | team_id: int | List[JoinRequest] | Public | Find pending requests for team |
| `find_pending_by_player` | player_id: int, team_id: int | Optional[JoinRequest] | Public | Find pending request for player to team |

---

### 2.8 FieldRepository

**Description:** Repository for FieldProfile operations.

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `find_by_id` | field_id: int | Optional[FieldProfile] | Public | Find field by ID |
| `find_by_owner` | owner_id: int | List[FieldProfile] | Public | Find fields by owner |
| `find_pending` | None | List[FieldProfile] | Public | Find fields pending verification |
| `search` | query: str, location: str, limit: int | List[FieldProfile] | Public | Search verified fields |

---

### 2.9 CalendarRepository

**Description:** Repository for FieldCalendar operations.

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `find_by_field` | field_id: int, start_date: date, end_date: date | List[FieldCalendar] | Public | Find calendar slots for field with optional date range |

---

### 2.10 BookingRepository

**Description:** Repository for BookingRequest operations.

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `find_by_id` | booking_id: int | Optional[BookingRequest] | Public | Find booking by ID |
| `find_by_field` | field_id: int, status: BookingStatus | List[BookingRequest] | Public | Find bookings by field |
| `find_by_team` | team_id: int | List[BookingRequest] | Public | Find bookings by team |
| `find_pending_by_field` | field_id: int | List[BookingRequest] | Public | Find pending bookings for field |

---

### 2.11 MatchRepository

**Description:** Repository for MatchEvent operations.

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `find_by_id` | match_id: int | Optional[MatchEvent] | Public | Find match by ID |
| `find_by_team` | team_id: int | List[MatchEvent] | Public | Find matches where team is host or opponent |

---

### 2.12 InvitationRepository

**Description:** Repository for MatchInvitation operations.

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `find_by_id` | invitation_id: int | Optional[MatchInvitation] | Public | Find invitation by ID |
| `find_pending_by_team` | team_id: int | List[MatchInvitation] | Public | Find pending invitations for team |

---

### 2.13 AttendanceRepository

**Description:** Repository for AttendanceRecord operations.

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `find_by_match` | match_id: int | List[AttendanceRecord] | Public | Find attendance for match |
| `find_by_player` | player_id: int | List[AttendanceRecord] | Public | Find attendance for player |

---

### 2.14 PostRepository

**Description:** Repository for Post operations.

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `find_by_id` | post_id: int | Optional[Post] | Public | Find post by ID |
| `find_public_feed` | limit: int, offset: int | List[Post] | Public | Find public posts for feed |
| `find_by_author` | author_id: int | List[Post] | Public | Find posts by author |

---

### 2.15 CommentRepository

**Description:** Repository for Comment operations.

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `find_by_post` | post_id: int | List[Comment] | Public | Find comments for post |
| `find_replies` | comment_id: int | List[Comment] | Public | Find replies to comment |

---

### 2.16 NotificationRepository

**Description:** Repository for Notification operations.

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `find_by_user` | user_id: int, unread_only: bool | List[Notification] | Public | Find notifications for user |
| `mark_as_read` | notification_id: int | bool | Public | Mark notification as read |
| `mark_all_read` | user_id: int | int | Public | Mark all as read, returns count |

---

## 3. Service Layer

The Service layer contains business logic and orchestrates operations between controllers and repositories.

---

### 3.1 AuthService

**Description:** Handles authentication business logic including registration, login, and password management.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| db | AsyncSession | Private | Database session |
| user_repo | UserRepository | Private | User repository instance |
| session_repo | SessionRepository | Private | Session repository instance |

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `__init__` | db: AsyncSession | None | Public | Initialize with database session |
| `register` | username: str, email: str, password: str, roles: List[str] | UserAccount | Public | Register new user, creates PlayerProfile if role includes Player |
| `login` | username: str, password: str | Tuple[UserAccount, str, str] | Public | Authenticate user, returns (user, access_token, refresh_token) |
| `get_user_by_id` | user_id: int | Optional[UserAccount] | Public | Get user by ID |
| `change_password` | user: UserAccount, current_password: str, new_password: str | bool | Public | Change user password after verification |

---

### 3.2 TeamService

**Description:** Handles team management business logic including creation, roster management, and join request processing.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| db | AsyncSession | Private | Database session |
| team_repo | TeamRepository | Private | Team repository instance |
| roster_repo | RosterRepository | Private | Roster repository instance |
| join_request_repo | JoinRequestRepository | Private | Join request repository instance |
| player_repo | PlayerRepository | Private | Player repository instance |

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `__init__` | db: AsyncSession | None | Public | Initialize with database session |
| `create_team` | leader_id: int, team_name: str, description: str, location: str, latitude: float, longitude: float | TeamProfile | Public | Create team with leader as captain |
| `get_team_by_id` | team_id: int | Optional[TeamProfile] | Public | Get team by ID |
| `get_teams_by_leader` | leader_id: int | List[TeamProfile] | Public | Get teams led by user |
| `update_team` | team: TeamProfile, **kwargs | TeamProfile | Public | Update team profile |
| `delete_team` | team: TeamProfile | bool | Public | Delete team |
| `create_join_request` | team_id: int, player_id: int, message: str | JoinRequest | Public | Create join request |
| `get_pending_requests` | team_id: int | List[JoinRequest] | Public | Get pending join requests for team |
| `process_join_request` | request: JoinRequest, approve: bool | bool | Public | Accept or reject join request |

---

### 3.3 FieldService

**Description:** Handles field management business logic including creation, calendar management, and search.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| db | AsyncSession | Private | Database session |
| field_repo | FieldRepository | Private | Field repository instance |
| calendar_repo | CalendarRepository | Private | Calendar repository instance |

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `__init__` | db: AsyncSession | None | Public | Initialize with database session |
| `create_field` | owner_id: int, field_name: str, description: str, location: str, latitude: float, longitude: float, default_price_per_hour: float, capacity: int | FieldProfile | Public | Create new field |
| `get_field_by_id` | field_id: int | Optional[FieldProfile] | Public | Get field by ID |
| `get_fields_by_owner` | owner_id: int | List[FieldProfile] | Public | Get fields owned by user |
| `update_field` | field: FieldProfile, **kwargs | FieldProfile | Public | Update field profile |
| `get_calendar` | field_id: int, start_date: date, end_date: date | List[FieldCalendar] | Public | Get calendar slots with auto-generated available slots |
| `search_fields` | query: str, location: str, limit: int | List[FieldProfile] | Public | Search verified fields |

---

### 3.4 BookingService

**Description:** Handles booking request business logic including creation, approval, rejection, and cancellation.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| db | AsyncSession | Private | Database session |
| booking_repo | BookingRepository | Private | Booking repository instance |
| calendar_repo | CalendarRepository | Private | Calendar repository instance |

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `__init__` | db: AsyncSession | None | Public | Initialize with database session |
| `create_booking` | field_id: int, team_id: int, requester_id: int, booking_date: date, start_time: time, end_time: time, notes: str | BookingRequest | Public | Create booking request |
| `get_booking_by_id` | booking_id: int | Optional[BookingRequest] | Public | Get booking by ID |
| `get_bookings_by_field` | field_id: int, status: BookingStatus | List[BookingRequest] | Public | Get bookings for field |
| `get_bookings_by_team` | team_id: int | List[BookingRequest] | Public | Get bookings for team |
| `approve_booking` | booking: BookingRequest | bool | Public | Approve booking, creates/updates calendar slot |
| `reject_booking` | booking: BookingRequest | bool | Public | Reject booking request |
| `cancel_booking` | booking: BookingRequest | bool | Public | Cancel booking |

---

### 3.5 MatchService

**Description:** Handles match event business logic including creation, invitations, and attendance.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| db | AsyncSession | Private | Database session |
| match_repo | MatchRepository | Private | Match repository instance |
| invitation_repo | InvitationRepository | Private | Invitation repository instance |
| attendance_repo | AttendanceRepository | Private | Attendance repository instance |
| team_repo | TeamRepository | Private | Team repository instance |
| notification_service | NotificationService | Private | Notification service instance |

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `__init__` | db: AsyncSession | None | Public | Initialize with database session |
| `create_match` | host_team_id: int, match_date: date, start_time: time, end_time: time, field_id: int, visibility: Visibility, description: str | MatchEvent | Public | Create match event |
| `get_match_by_id` | match_id: int | Optional[MatchEvent] | Public | Get match by ID |
| `get_matches_by_team` | team_id: int | List[MatchEvent] | Public | Get matches for team |
| `update_match` | match: MatchEvent, **kwargs | MatchEvent | Public | Update match details |
| `cancel_match` | match: MatchEvent | bool | Public | Cancel match |
| `send_invitation` | match: MatchEvent, invited_team_id: int, message: str | MatchInvitation | Public | Send match invitation, creates notification |
| `respond_to_invitation` | invitation: MatchInvitation, accept: bool | bool | Public | Accept or decline invitation |
| `get_match_attendance` | match_id: int | List[AttendanceRecord] | Public | Get match attendance |

---

### 3.6 ContentService

**Description:** Handles posts and comments business logic.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| db | AsyncSession | Private | Database session |
| post_repo | PostRepository | Private | Post repository instance |
| comment_repo | CommentRepository | Private | Comment repository instance |

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `__init__` | db: AsyncSession | None | Public | Initialize with database session |
| `create_post` | author_id: int, content: str, team_id: int, visibility: Visibility | Post | Public | Create new post |
| `get_post_by_id` | post_id: int | Optional[Post] | Public | Get post by ID |
| `get_public_feed` | limit: int, offset: int | List[Post] | Public | Get public posts feed |
| `get_posts_by_author` | author_id: int | List[Post] | Public | Get posts by author |
| `delete_post` | post: Post | bool | Public | Delete post |
| `create_comment` | post_id: int, author_id: int, content: str, parent_comment_id: int | Comment | Public | Create comment, increments post comment count |
| `get_comments_by_post` | post_id: int | List[Comment] | Public | Get comments for post |

---

### 3.7 NotificationService

**Description:** Handles notification business logic.

#### Attributes

| Attribute | Data Type | Accessibility | Description |
|-----------|-----------|---------------|-------------|
| db | AsyncSession | Private | Database session |
| notification_repo | NotificationRepository | Private | Notification repository instance |

#### Methods

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `__init__` | db: AsyncSession | None | Public | Initialize with database session |
| `get_notifications` | user_id: int, unread_only: bool | List[Notification] | Public | Get user notifications |
| `mark_as_read` | notification_id: int | bool | Public | Mark notification as read |
| `mark_all_read` | user_id: int | int | Public | Mark all as read, returns count |
| `create_notification` | user_id: int, notification_type: NotificationType, title: str, message: str, related_entity_id: int, related_entity_type: str | Notification | Public | Create notification |

---

## 4. Controller Layer

The Controller layer handles HTTP requests and responses, delegating business logic to services.

---

### 4.1 AuthController

**Description:** Authentication HTTP endpoints for login, registration, and password management.

#### Endpoints

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `POST /login` | LoginRequest | AuthResponse | Public | Authenticate user |
| `POST /register` | RegisterRequest | AuthResponse | Public | Register new user |
| `POST /logout` | JWT Token | MessageResponse | Authenticated | Logout user |
| `POST /refresh` | RefreshTokenRequest | AuthResponse | Public | Refresh access token |
| `GET /me` | JWT Token | UserAccountResponse | Authenticated | Get current user profile |
| `PUT /password` | ChangePasswordRequest | MessageResponse | Authenticated | Change password |
| `DELETE /account` | JWT Token | MessageResponse | Authenticated | Delete account (soft delete) |

---

### 4.2 TeamController

**Description:** Team management HTTP endpoints.

#### Endpoints

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `POST /` | TeamProfileCreate | TeamProfileResponse | Authenticated | Create team |
| `GET /my-teams` | None | List[TeamProfileResponse] | Authenticated | Get user's led teams |
| `GET /user/{user_id}` | user_id | List[TeamProfileResponse] | Public | Get teams where user is member |
| `GET /player/{player_id}` | player_id | List[TeamProfileResponse] | Public | Get teams where player is member |
| `GET /{team_id}` | team_id | TeamProfileResponse | Public | Get team by ID |
| `PUT /{team_id}` | TeamProfileUpdate | TeamProfileResponse | Leader Only | Update team |
| `DELETE /{team_id}` | team_id | MessageResponse | Leader Only | Delete team |
| `GET /{team_id}/join-requests` | team_id | List[JoinRequestResponse] | Leader Only | Get pending requests |
| `POST /{team_id}/join-requests` | JoinRequestCreate | JoinRequestResponse | Authenticated | Request to join |
| `PUT /join-requests/{id}/{action}` | request_id, action | MessageResponse | Leader Only | Accept/reject request |
| `GET /{team_id}/roster` | team_id | List[TeamRosterResponse] | Public | Get roster |
| `POST /{team_id}/roster` | RosterAddPlayerRequest | TeamRosterResponse | Leader Only | Add player |
| `DELETE /{team_id}/roster/{player_id}` | team_id, player_id | MessageResponse | Leader Only | Remove player |
| `PUT /roster/{roster_id}` | RosterUpdateRoleRequest | TeamRosterResponse | Leader Only | Update role |
| `GET /{team_id}/wallet` | team_id | WalletResponse | Leader Only | Get wallet |
| `GET /{team_id}/wallet/transactions` | team_id | List[TransactionResponse] | Leader Only | Get transactions |
| `POST /{team_id}/wallet/deposit` | TransactionCreate | TransactionResponse | Leader Only | Deposit funds |
| `POST /{team_id}/wallet/withdraw` | TransactionCreate | TransactionResponse | Leader Only | Withdraw funds |
| `POST /{team_id}/wallet/expense` | TransactionCreate | TransactionResponse | Leader Only | Record expense |

---

### 4.3 FieldController

**Description:** Field management HTTP endpoints.

#### Endpoints

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `POST /` | FieldProfileCreate | FieldProfileResponse | Authenticated | Create field |
| `GET /my-fields` | None | List[FieldProfileResponse] | Authenticated | Get owned fields |
| `GET /owner/{owner_id}` | owner_id | List[FieldProfileResponse] | Public | Get fields by owner |
| `GET /amenities` | None | List[AmenityResponse] | Public | Get all amenities |
| `GET /{field_id}` | field_id | FieldProfileResponse | Public | Get field by ID |
| `PUT /{field_id}` | FieldProfileUpdate | FieldProfileResponse | Owner Only | Update field |
| `DELETE /{field_id}` | field_id | MessageResponse | Owner Only | Delete field |
| `PUT /{field_id}/cover-image` | SetCoverImageRequest | FieldProfileResponse | Owner Only | Set cover image |
| `GET /{field_id}/calendar` | field_id, startDate, endDate | List[FieldCalendarResponse] | Public | Get calendar |
| `POST /{field_id}/calendar/block` | CalendarBlockRequest | MessageResponse | Owner Only | Block slot |
| `DELETE /calendar/{calendar_id}` | calendar_id | MessageResponse | Owner Only | Unblock slot |
| `GET /{field_id}/pricing` | field_id | List[FieldPricingRuleResponse] | Public | Get pricing rules |
| `PUT /{field_id}/pricing` | List[FieldPricingRuleCreate] | List[FieldPricingRuleResponse] | Owner Only | Update pricing |
| `GET /{field_id}/amenities` | field_id | List[AmenityResponse] | Public | Get field amenities |
| `PUT /{field_id}/amenities` | FieldAmenityUpdateRequest | List[AmenityResponse] | Owner Only | Update amenities |

---

### 4.4 BookingController

**Description:** Booking request HTTP endpoints.

#### Endpoints

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `POST /` | BookingRequestCreate | BookingRequestResponse | Authenticated | Create booking |
| `GET /{booking_id}` | booking_id | BookingRequestResponse | Authenticated | Get booking by ID |
| `GET /field/{field_id}` | field_id, status | List[BookingRequestResponse] | Authenticated | Get field bookings |
| `GET /team/{team_id}` | team_id | List[BookingRequestResponse] | Authenticated | Get team bookings |
| `GET /owner/pending` | None | List[BookingRequestResponse] | Owner Only | Get pending bookings |
| `PUT /{booking_id}/approve` | booking_id | MessageResponse | Owner Only | Approve booking |
| `PUT /{booking_id}/reject` | booking_id | MessageResponse | Owner Only | Reject booking |
| `PUT /{booking_id}/cancel` | booking_id | MessageResponse | Requester Only | Cancel booking |

---

### 4.5 MatchController

**Description:** Match event HTTP endpoints.

#### Endpoints

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `POST /` | MatchEventCreate | MatchEventResponse | Team Leader | Create match |
| `GET /{match_id}` | match_id | MatchEventResponse | Public | Get match by ID |
| `PUT /{match_id}` | MatchEventUpdate | MatchEventResponse | Host Leader | Update match |
| `GET /team/{team_id}` | team_id | List[MatchEventResponse] | Public | Get team matches |
| `GET /team/{team_id}/invitations` | team_id | List[MatchInvitationResponse] | Team Leader | Get invitations |
| `DELETE /{match_id}` | match_id | MessageResponse | Host Leader | Cancel match |
| `POST /{match_id}/invitations` | MatchInvitationCreate | MatchInvitationResponse | Host Leader | Send invitation |
| `PUT /invitations/{id}/{action}` | invitation_id, action | MessageResponse | Invited Leader | Accept/decline |
| `GET /{match_id}/attendance` | match_id | List[AttendanceRecordResponse] | Authenticated | Get attendance |
| `POST /{match_id}/attendance` | None | MessageResponse | Player | Confirm attendance |
| `PUT /{match_id}/attendance/{player_id}` | AttendanceUpdateRequest | MessageResponse | Team Leader | Update attendance |
| `POST /{match_id}/attendance/batch` | BatchAttendanceRequest | MessageResponse | Team Leader | Batch update |
| `GET /{match_id}/attendance/stats` | match_id | AttendanceStatsResponse | Authenticated | Get stats |
| `POST /{match_id}/result` | MatchResultCreate | MatchResultResponse | Host Leader | Record result |
| `GET /{match_id}/result` | match_id | MatchResultResponse | Public | Get result |

---

### 4.6 PlayerController

**Description:** Player profile HTTP endpoints.

#### Endpoints

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `GET /me` | None | PlayerProfileResponse | Authenticated | Get own profile |
| `PUT /me` | PlayerProfileUpdate | PlayerProfileResponse | Authenticated | Update profile |
| `GET /{player_id}` | player_id | PlayerProfileResponse | Public | Get player by ID |
| `GET /{player_id}/roster` | player_id | List[TeamRosterResponse] | Public | Get team memberships |
| `GET /user/{user_id}` | user_id | PlayerProfileResponse | Public | Get player by user ID |
| `GET /user/{user_id}/schedule` | user_id | List[MatchEventResponse] | Public | Get schedule by user ID |
| `GET /{player_id}/schedule` | player_id | List[MatchEventResponse] | Public | Get schedule |

---

### 4.7 SearchController

**Description:** Search HTTP endpoints for teams, fields, players, and owners.

#### Endpoints

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `GET /teams` | query, location, minSkillLevel, maxSkillLevel, limit | List[TeamProfileResponse] | Public | Search verified teams |
| `GET /fields` | query, location, minPrice, maxPrice, amenityIds, limit | List[FieldProfileResponse] | Public | Search verified fields |
| `GET /players` | query, position, minSkillLevel, maxSkillLevel, limit | List[PlayerProfileResponse] | Public | Search players |
| `GET /owners` | query, location, limit | List[OwnerSearchResponse] | Public | Search field owners |

---

### 4.8 ContentController

**Description:** Posts and comments HTTP endpoints.

#### Endpoints

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `POST /posts` | PostCreate | PostResponse | Authenticated | Create post |
| `GET /posts` | teamId, limit, offset | List[PostResponse] | Public | Get posts feed |
| `GET /posts/reactions/mine` | postIds | List[UserReactionResponse] | Authenticated | Get own reactions |
| `GET /posts/{post_id}` | post_id | PostResponse | Public | Get post by ID |
| `DELETE /posts/{post_id}` | post_id | MessageResponse | Author Only | Delete post |
| `GET /posts/{post_id}/comments` | post_id | List[CommentResponse] | Public | Get comments |
| `POST /posts/{post_id}/comments` | CommentCreate | CommentResponse | Authenticated | Add comment |
| `POST /posts/{post_id}/like` | post_id | MessageResponse | Authenticated | Like post |
| `DELETE /posts/{post_id}/like` | post_id | MessageResponse | Authenticated | Unlike post |
| `GET /posts/user/{user_id}` | user_id | List[PostResponse] | Public | Get user's posts |
| `GET /posts/team/{team_id}` | team_id | List[PostResponse] | Public | Get team's posts |
| `GET /posts/{post_id}/comments/{comment_id}/replies` | post_id, comment_id | List[CommentResponse] | Public | Get replies |
| `POST /posts/{post_id}/reactions` | ReactionRequest | ReactionResponse | Authenticated | Toggle reaction |
| `GET /posts/{post_id}/reactions` | post_id | List[ReactionResponse] | Public | Get reactions |
| `POST /reports` | CreateReportRequest | ReportResponse | Authenticated | Create report |

---

### 4.9 NotificationController

**Description:** Notification HTTP endpoints.

#### Endpoints

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `GET /` | unreadOnly | List[NotificationResponse] | Authenticated | Get notifications |
| `GET /unread-count` | None | UnreadCountResponse | Authenticated | Get unread count |
| `PUT /{notification_id}/read` | notification_id | MessageResponse | Authenticated | Mark as read |
| `PUT /mark-all-read` | None | MessageResponse | Authenticated | Mark all as read |
| `GET /preferences` | None | NotificationPreferencesResponse | Authenticated | Get preferences |
| `PUT /preferences` | NotificationPreferencesUpdate | NotificationPreferencesResponse | Authenticated | Update preferences |

---

### 4.10 ModerationController

**Description:** Moderation and admin HTTP endpoints for reports, verification, and user management.

#### Endpoints

| Method | Input | Output | Accessibility | Description |
|--------|-------|--------|---------------|-------------|
| `POST /reports` | ReportCreate | ReportResponse | Authenticated | Create report |
| `GET /reports` | status, limit | List[ReportResponse] | Moderator | Get reports |
| `GET /reports/{report_id}` | report_id | ReportResponse | Moderator | Get report |
| `PUT /reports/{report_id}/resolve` | report_id, action | ReportResponse | Moderator | Resolve report |
| `GET /teams/pending` | None | List[TeamProfileResponse] | Moderator | Get pending teams |
| `GET /teams/{team_id}` | team_id | TeamProfileResponse | Moderator | Get team for review |
| `PUT /teams/{team_id}/verify` | VerificationDecision | MessageResponse | Moderator | Verify/reject team |
| `GET /fields/pending` | None | List[FieldProfileResponse] | Moderator | Get pending fields |
| `GET /fields/{field_id}` | field_id | FieldProfileResponse | Moderator | Get field for review |
| `PUT /fields/{field_id}/verify` | VerificationDecision | MessageResponse | Moderator | Verify/reject field |
| `GET /users` | query, role, status, limit | List[UserSummaryResponse] | Moderator | Get users |
| `GET /users/{user_id}` | user_id | UserSummaryResponse | Moderator | Get user details |
| `PUT /users/{user_id}/role` | UserRoleUpdate | UserSummaryResponse | Moderator | Update role |
| `PUT /users/{user_id}/suspend` | UserReasonRequest | UserSummaryResponse | Moderator | Suspend user |
| `PUT /users/{user_id}/reactivate` | UserReasonRequest | UserSummaryResponse | Moderator | Reactivate user |
| `PUT /users/{user_id}/ban` | UserReasonRequest | UserSummaryResponse | Moderator | Ban user |

---

## 5. Supporting Classes

### 5.1 Enumerations

| Enum | Values | Description |
|------|--------|-------------|
| UserRole | Player, TeamLeader, FieldOwner, Moderator | User role types |
| AccountStatus | Active, Suspended, Banned, Pending, Deleted | Account status |
| TeamStatus | Pending, Verified, Rejected, PendingRevision | Team verification status |
| RosterRole | Member, Captain, ViceCaptain | Player role in team |
| JoinRequestStatus | Pending, Accepted, Rejected | Join request status |
| FieldStatus | Pending, Verified, Rejected, PendingRevision | Field verification status |
| CalendarStatus | Available, Booked, Maintenance, Blocked | Calendar slot status |
| BookingStatus | Pending, Confirmed, Rejected, Cancelled | Booking status |
| MatchStatus | PendingApproval, Scheduled, InProgress, Completed, Cancelled, LookingForField | Match event status |
| Visibility | Public, Private, TeamOnly | Content visibility |
| InvitationStatus | Pending, Accepted, Declined, Expired | Match invitation status |
| AttendanceStatus | Pending, Present, Absent, Excused | Attendance status |
| TransactionType | Income, Expense | Financial transaction type |
| ReactionType | Like, Love, Celebrate | Reaction types |
| ReactionEntityType | Post, Comment | Reaction target type |
| ReportContentType | Post, Comment, User | Report target type |
| ReportStatus | Pending, Resolved, Dismissed | Report status |
| NotificationType | TeamVerified, JoinRequest, MatchInvite, BookingUpdate, AccountStatusUpdate, etc. | Notification categories |
| PreferredFoot | Left, Right, Both | Player foot preference |
| MediaType | Image, Video, Document | Media file type |
| MediaOwnerType | Team, Field, Post, Player | Media owner entity type |
| ModerationAction | Suspend, Ban, Reactivate, ContentRemoval, Warning, RoleChange, Activate | Moderation action types |
| DayOfWeek | Monday-Sunday | Days of week |

---

## Class Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Controller Layer                              │
│  AuthController | TeamController | FieldController | MatchController │
│  BookingController | PlayerController | SearchController            │
│  ContentController | NotificationController | ModerationController  │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Service Layer                                │
│  AuthService | TeamService | FieldService | MatchService            │
│  BookingService | ContentService | NotificationService              │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Repository Layer                              │
│  BaseRepository[T] ← UserRepository, PlayerRepository, TeamRepository│
│  RosterRepository, JoinRequestRepository, FieldRepository           │
│  CalendarRepository, BookingRepository, MatchRepository             │
│  InvitationRepository, AttendanceRepository, PostRepository         │
│  CommentRepository, ReactionRepository, NotificationRepository      │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          Entity Layer                                │
│  UserAccount | Session | PlayerProfile | TeamProfile | TeamRoster   │
│  JoinRequest | TeamWallet | TransactionLog | FieldProfile           │
│  FieldCalendar | FieldPricingRule | CancellationPolicy | Amenity    │
│  FieldAmenity | BookingRequest | MatchEvent | MatchInvitation       │
│  AttendanceRecord | MatchResult | Post | Comment | Reaction         │
│  Notification | NotificationPreference | MediaAsset | Report        │
│  ModerationLog                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

*Generated from Football Application codebase analysis - January 2026*
