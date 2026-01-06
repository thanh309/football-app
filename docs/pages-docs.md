# Kick-off Football App - Page Documentation

This document provides comprehensive documentation for all pages in the Kick-off football application, mapping wireframes to their React implementations.

---

## Table of Contents

1. [Authentication Pages](#1-authentication-pages)
2. [Dashboard Pages](#2-dashboard-pages)
3. [Public Pages](#3-public-pages)
4. [Community Pages](#4-community-pages)
5. [Player Pages](#5-player-pages)
6. [Team Leader Pages](#6-team-leader-pages)
7. [Field Owner Pages](#7-field-owner-pages)
8. [Moderator Pages](#8-moderator-pages)
9. [Search Pages](#9-search-pages)
10. [Page Navigation Flow](#10-page-navigation-flow)

---

## 10. Page Navigation Flow

This section documents how pages connect to each other through navigation links, buttons, and actions.

### Navigation Flow Diagrams

#### Authentication Flow
```
┌─────────────┐     Sign Up Link      ┌──────────────┐
│  LoginPage  │ ───────────────────► │ RegisterPage │
│   /login    │ ◄─────────────────── │  /register   │
└─────────────┘     Sign In Link      └──────────────┘
       │                                     │
       │ Success                             │ Success
       ▼                                     ▼
┌─────────────────────────────────────────────────────┐
│                   DashboardPage                     │
│                    /dashboard                       │
└─────────────────────────────────────────────────────┘
```

#### Main User Flow (Authenticated)
```
┌─────────────┐
│ LandingPage │──► Go to Dashboard (if authenticated)
│      /      │──► Get Started ──► /register
└─────────────┘──► Sign In ──► /login

┌───────────────────────────────────────────────────────────────────────┐
│                         DashboardPage /dashboard                       │
├───────────────────────────────────────────────────────────────────────┤
│  Stats Cards:                    │  Quick Actions:                    │
│  • Upcoming Matches → /schedule  │  • Find Teams → /search/teams      │
│  • My Teams → /my-teams          │  • Find Fields → /search/fields    │
│  • Notifications → /notifications│  • Community → /community          │
│                                  │  • Settings → /settings/account    │
└───────────────────────────────────────────────────────────────────────┘
```

### Detailed Page Connections

#### Authentication Pages

| From Page | Link/Action | To Page |
|-----------|-------------|---------|
| LoginPage | "Sign up" link | RegisterPage `/register` |
| LoginPage | Successful login | DashboardPage `/dashboard` |
| RegisterPage | "Sign in" link | LoginPage `/login` |
| RegisterPage | Successful registration | DashboardPage `/dashboard` |

#### Public Pages

| From Page | Link/Action | To Page |
|-----------|-------------|---------|
| LandingPage | "Get Started" button | RegisterPage `/register` |
| LandingPage | "Sign In" button | LoginPage `/login` |
| LandingPage | "Go to Dashboard" (auth) | DashboardPage `/dashboard` |
| LandingPage | "Browse Teams" CTA | SearchTeamsPage `/search/teams` |
| LandingPage | "Find Fields" CTA | SearchFieldsPage `/search/fields` |
| NotFoundPage | "Back to Home" | LandingPage `/` |

#### Dashboard Pages

| From Page | Link/Action | To Page |
|-----------|-------------|---------|
| DashboardPage | Upcoming Matches card | MySchedulePage `/schedule` |
| DashboardPage | My Teams card | MyTeamsPage `/my-teams` |
| DashboardPage | Notifications card | NotificationsPage `/notifications` |
| DashboardPage | "Find Teams" action | SearchTeamsPage `/search/teams` |
| DashboardPage | "Find Fields" action | SearchFieldsPage `/search/fields` |
| DashboardPage | "Community" action | CommunityFeedPage `/community` |
| DashboardPage | "Settings" action | AccountSettingsPage `/settings/account` |
| AccountSettingsPage | Notification settings | NotificationSettingsPage `/settings/notifications` |

#### Community Pages

| From Page | Link/Action | To Page |
|-----------|-------------|---------|
| CommunityFeedPage | "New Post" button | CreatePostPage `/community/create` |
| CommunityFeedPage | User avatar click | PublicPlayerProfilePage `/search/players/:id` |
| CreatePostPage | Cancel/Success | CommunityFeedPage `/community` |

#### Player Pages

| From Page | Link/Action | To Page |
|-----------|-------------|---------|
| MyTeamsPage | Team card click | TeamDetailsPage `/my-teams/:id` |
| TeamDetailsPage | "Back to My Teams" | MyTeamsPage `/my-teams` |
| MySchedulePage | Match item click | MatchDetailsPage `/schedule/:matchId` |
| MatchDetailsPage | Back button | MySchedulePage `/schedule` |

#### Team Leader Pages

| From Page | Link/Action | To Page |
|-----------|-------------|---------|
| LeaderTeamsPage | "Create Team" button | CreateTeamPage `/leader/teams/create` |
| LeaderTeamsPage | Team card click | TeamDashboardPage `/leader/teams/:id` |
| CreateTeamPage | Success/Cancel | LeaderTeamsPage `/leader/teams` |
| TeamDashboardPage | "Edit" button | EditTeamPage `/leader/teams/:id/edit` |
| TeamDashboardPage | Members stat card | TeamRosterPage `/leader/teams/:id/roster` |
| TeamDashboardPage | Pending Requests card | JoinRequestsPage `/leader/teams/:id/requests` |
| TeamDashboardPage | Upcoming Matches card | MatchListPage `/leader/teams/:id/matches` |
| TeamDashboardPage | Wallet Balance card | TeamFinancePage `/leader/teams/:id/finance` |
| TeamDashboardPage | "Manage Roster" action | TeamRosterPage `/leader/teams/:id/roster` |
| TeamDashboardPage | "Schedule Match" action | CreateMatchPage `/leader/teams/:id/matches/create` |
| TeamDashboardPage | "Match Invites" action | MatchInvitationsPage `/leader/teams/:id/matches/invitations` |
| TeamDashboardPage | "Add Transaction" action | AddTransactionPage `/leader/teams/:id/finance/add` |
| EditTeamPage | Back/Save | TeamDashboardPage `/leader/teams/:id` |
| TeamRosterPage | Back button | TeamDashboardPage `/leader/teams/:id` |
| JoinRequestsPage | Back button | TeamDashboardPage `/leader/teams/:id` |
| MatchListPage | "Create Match" button | CreateMatchPage `/leader/teams/:id/matches/create` |
| MatchListPage | Match item click | LeaderMatchDetailsPage `/leader/teams/:teamId/matches/:matchId` |
| CreateMatchPage | Success/Cancel | MatchListPage `/leader/teams/:id/matches` |
| LeaderMatchDetailsPage | "Manage Attendance" | MatchAttendancePage `/leader/teams/:teamId/matches/:matchId/attendance` |
| LeaderMatchDetailsPage | Back button | MatchListPage `/leader/teams/:id/matches` |
| MatchAttendancePage | Back button | LeaderMatchDetailsPage `/leader/teams/:teamId/matches/:matchId` |
| MatchInvitationsPage | Back button | TeamDashboardPage `/leader/teams/:id` |
| TeamFinancePage | "Add Transaction" | AddTransactionPage `/leader/teams/:id/finance/add` |
| TeamFinancePage | Back button | TeamDashboardPage `/leader/teams/:id` |
| AddTransactionPage | Success/Cancel | TeamFinancePage `/leader/teams/:id/finance` |

#### Field Owner Pages

| From Page | Link/Action | To Page |
|-----------|-------------|---------|
| OwnerFieldsPage | "Register New Field" | RegisterFieldPage `/owner/fields/create` |
| OwnerFieldsPage | Field card click | FieldDashboardPage `/owner/fields/:id` |
| RegisterFieldPage | Success/Cancel | OwnerFieldsPage `/owner/fields` |
| FieldDashboardPage | "Back to My Fields" | OwnerFieldsPage `/owner/fields` |
| FieldDashboardPage | "Edit Field" action | EditFieldPage `/owner/fields/:id/edit` |
| FieldDashboardPage | "Manage Photos" action | FieldPhotosPage `/owner/fields/:id/photos` |
| FieldDashboardPage | "Set Pricing" action | FieldPricingPage `/owner/fields/:id/pricing` |
| FieldDashboardPage | "View Calendar" action | BookingCalendarPage `/owner/fields/:id/calendar` |
| EditFieldPage | Back/Save | FieldDashboardPage `/owner/fields/:id` |
| FieldPhotosPage | Back button | FieldDashboardPage `/owner/fields/:id` |
| FieldPricingPage | Back button | FieldDashboardPage `/owner/fields/:id` |
| BookingCalendarPage | Back button | FieldDashboardPage `/owner/fields/:id` |
| BookingDashboardPage | Booking item click | BookingDetailsPage `/owner/bookings/:id` |
| BookingDashboardPage | "View Requests" | BookingRequestsPage `/owner/bookings/requests` |
| BookingRequestsPage | Back button | BookingDashboardPage `/owner/bookings` |
| BookingDetailsPage | Back button | BookingDashboardPage `/owner/bookings` |

#### Moderator Pages

| From Page | Link/Action | To Page |
|-----------|-------------|---------|
| ModDashboardPage | Pending Teams stat | PendingTeamsPage `/mod/teams` |
| ModDashboardPage | Pending Fields stat | PendingFieldsPage `/mod/fields` |
| ModDashboardPage | Reported Content stat | ReportedContentPage `/mod/reports` |
| ModDashboardPage | "Review Teams" action | PendingTeamsPage `/mod/teams` |
| ModDashboardPage | "Review Fields" action | PendingFieldsPage `/mod/fields` |
| ModDashboardPage | "Handle Reports" action | ReportedContentPage `/mod/reports` |
| ModDashboardPage | "Manage Users" action | UserListPage `/mod/users` |
| ModDashboardPage | "View All" (Recent Activity) | ModerationHistoryPage `/mod/history` |
| PendingTeamsPage | Team item click | TeamReviewPage `/mod/teams/:id` |
| TeamReviewPage | Back/Action complete | PendingTeamsPage `/mod/teams` |
| PendingFieldsPage | Field item click | FieldReviewPage `/mod/fields/:id` |
| FieldReviewPage | Back/Action complete | PendingFieldsPage `/mod/fields` |
| ReportedContentPage | Report item click | ReportDetailsPage `/mod/reports/:id` |
| ReportDetailsPage | Back/Action complete | ReportedContentPage `/mod/reports` |
| UserListPage | User item click | UserDetailsPage `/mod/users/:id` |
| UserDetailsPage | Back button | UserListPage `/mod/users` |
| ModerationHistoryPage | Back button | ModDashboardPage `/mod` |

#### Search Pages

| From Page | Link/Action | To Page |
|-----------|-------------|---------|
| SearchTeamsPage | Team result click | PublicTeamProfilePage `/search/teams/:id` |
| SearchFieldsPage | Field result click | PublicFieldProfilePage `/search/fields/:id` |
| SearchPlayersPage | Player result click | PublicPlayerProfilePage `/search/players/:id` |
| SearchOwnersPage | Owner result click | SearchOwnerProfilePage `/search/owners/:id` |
| PublicTeamProfilePage | Back button | SearchTeamsPage `/search/teams` |
| PublicFieldProfilePage | Back button | SearchFieldsPage `/search/fields` |
| PublicPlayerProfilePage | Back button | SearchPlayersPage `/search/players` |
| SearchOwnerProfilePage | Back button | SearchOwnersPage `/search/owners` |
| SearchOwnerProfilePage | Field card click | PublicFieldProfilePage `/search/fields/:id` |

### Global Navigation (Header/Sidebar)

All authenticated pages have access to the global navigation which includes:

| Navigation Item | Target Route | Available To |
|-----------------|--------------|--------------|
| Dashboard | `/dashboard` | All authenticated users |
| Community | `/community` | All authenticated users |
| Find Teams | `/search/teams` | All users |
| Find Fields | `/search/fields` | All users |
| Find Players | `/search/players` | All users |
| Find Owners | `/search/owners` | All users |
| My Teams | `/my-teams` | Players |
| My Schedule | `/schedule` | Players |
| Profile | `/profile` | Players |
| Leader Teams | `/leader/teams` | Team Leaders |
| My Fields | `/owner/fields` | Field Owners |
| Bookings | `/owner/bookings` | Field Owners |
| Mod Dashboard | `/mod` | Moderators |
| Notifications | `/notifications` | All authenticated users |
| Settings | `/settings/account` | All authenticated users |
| Logout | `/login` (redirect) | All authenticated users |

---

## 1. Authentication Pages

### LoginPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/auth/LoginPage.html` |
| **Source** | `frontend/src/pages/auth/LoginPage.tsx` |
| **Route** | `/login` |
| **Description** | User login page with username and password authentication. |
| **Features** | - Username input field<br>- Password input with visibility toggle<br>- Sign In button<br>- Link to Registration page<br>- Gradient background styling |
| **Components Used** | `LoginForm` |
| **Access** | Public (unauthenticated users only) |

### RegisterPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/auth/RegisterPage.html` |
| **Source** | `frontend/src/pages/auth/RegisterPage.tsx` |
| **Route** | `/register` |
| **Description** | User registration page with role selection. |
| **Features** | - Username input<br>- Email input<br>- Password with confirmation<br>- Role selection (Player, Team Leader, Field Owner)<br>- Create Account button<br>- Link to Login page |
| **Components Used** | `RegistrationForm` |
| **Access** | Public (unauthenticated users only) |

---

## 2. Dashboard Pages

### DashboardPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/dashboard/DashboardPage.html` |
| **Source** | `frontend/src/pages/dashboard/DashboardPage.tsx` |
| **Route** | `/dashboard` |
| **Description** | Main user dashboard showing activity overview and quick actions. |
| **Features** | - Welcome message with username<br>- Stats cards (Upcoming Matches, My Teams, Notifications)<br>- Quick Actions grid (Find Teams, Find Fields, Community, Settings) |
| **Components Used** | `PageContainer`, `PageHeader`, `ContentCard`, `LoadingSpinner` |
| **API Hooks** | `useAuth`, `usePlayerTeams`, `usePlayerSchedule`, `useUnreadNotificationCount` |
| **Access** | Authenticated users |

### AccountSettingsPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/dashboard/AccountSettingsPage.html` |
| **Source** | `frontend/src/pages/dashboard/AccountSettingsPage.tsx` |
| **Route** | `/settings/account` |
| **Description** | User account settings and profile management. |
| **Features** | - Profile information editing<br>- Avatar management<br>- Contact details<br>- Password change |
| **Access** | Authenticated users |

### NotificationsPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/dashboard/NotificationsPage.html` |
| **Source** | `frontend/src/pages/dashboard/NotificationsPage.tsx` |
| **Route** | `/notifications` |
| **Description** | View and manage user notifications. |
| **Features** | - Notification list<br>- Read/unread status<br>- Notification actions |
| **Access** | Authenticated users |

### NotificationSettingsPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/dashboard/NotificationSettingsPage.html` |
| **Source** | `frontend/src/pages/dashboard/NotificationSettingsPage.tsx` |
| **Route** | `/settings/notifications` |
| **Description** | Configure notification preferences. |
| **Features** | - Email notification toggles<br>- Push notification settings<br>- Category-based preferences |
| **Access** | Authenticated users |

---

## 3. Public Pages

### LandingPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/public/LandingPage.html` |
| **Source** | `frontend/src/pages/public/LandingPage.tsx` |
| **Route** | `/` |
| **Description** | Main landing page for the application with hero section and features overview. |
| **Features** | - Hero section with platform branding<br>- CTA buttons (Get Started, Sign In, or Go to Dashboard)<br>- Features grid (Team Management, Find Fields, Match Scheduling, Player Profiles, Community, Field Owners)<br>- Final CTA section |
| **Components Used** | `Link` (react-router-dom) |
| **API Hooks** | `useAuth` (for auth state) |
| **Access** | Public |

### NotFoundPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/public/NotFoundPage.html` |
| **Source** | `frontend/src/pages/public/NotFoundPage.tsx` |
| **Route** | `*` (catch-all) |
| **Description** | 404 page displayed when a route is not found. |
| **Features** | - Error message<br>- Navigation back to home |
| **Access** | Public |

### PublicFieldProfilePage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/public/PublicFieldProfilePage.html` |
| **Source** | `frontend/src/pages/public/PublicFieldProfilePage.tsx` |
| **Route** | `/fields/:id` |
| **Description** | Public view of a football field profile. |
| **Features** | - Field images gallery<br>- Field information (name, location, capacity)<br>- Pricing information<br>- Availability check<br>- Booking button |
| **Access** | Public |

### PublicPlayerProfilePage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/public/PublicPlayerProfilePage.html` |
| **Source** | `frontend/src/pages/public/PublicPlayerProfilePage.tsx` |
| **Route** | `/players/:id` |
| **Description** | Public view of a player profile. |
| **Features** | - Player avatar and basic info<br>- Playing position<br>- Team affiliations<br>- Match statistics |
| **Access** | Public |

### PublicTeamProfilePage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/public/PublicTeamProfilePage.html` |
| **Source** | `frontend/src/pages/public/PublicTeamProfilePage.tsx` |
| **Route** | `/teams/:id` |
| **Description** | Public view of a team profile. |
| **Features** | - Team logo and name<br>- Location and description<br>- Team roster<br>- Match history<br>- Join request button |
| **Access** | Public |

---

## 4. Community Pages

### CommunityFeedPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/community/CommunityFeedPage.html` |
| **Source** | `frontend/src/pages/community/CommunityFeedPage.tsx` |
| **Route** | `/community` |
| **Description** | Social feed for the football community. |
| **Features** | - Post feed with user avatars<br>- Post creation input<br>- New Post button<br>- Post interactions (reactions, comments)<br>- Image placeholders for posts |
| **Access** | Authenticated users |

### CreatePostPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/community/CreatePostPage.html` |
| **Source** | `frontend/src/pages/community/CreatePostPage.tsx` |
| **Route** | `/community/create` |
| **Description** | Create a new community post. |
| **Features** | - Post content editor<br>- Image upload<br>- Submit button |
| **Access** | Authenticated users |

---

## 5. Player Pages

### MyTeamsPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/player/MyTeamsPage.html` |
| **Source** | `frontend/src/pages/player/MyTeamsPage.tsx` |
| **Route** | `/my-teams` |
| **Description** | List of teams the current player belongs to. |
| **Features** | - Team cards with logos<br>- Team status indicators<br>- Link to team details |
| **Access** | Authenticated players |

### TeamDetailsPage (Player View)
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/player/TeamDetailsPage.html` |
| **Source** | `frontend/src/pages/player/TeamDetailsPage.tsx` |
| **Route** | `/my-teams/:id` |
| **Description** | Detailed view of a team from a player's perspective. |
| **Features** | - Team header with logo and info<br>- Stats cards (Members, Matches Played, Wins, Skill Level)<br>- Leave Team button<br>- Recent activity list |
| **Components Used** | `PageContainer`, `PageHeader`, `ContentCard`, `LoadingSpinner`, `LeaveTeamButton` |
| **API Hooks** | `useTeam`, `useTeamRoster`, `useTeamMatches`, `useMatchResultsForMatches` |
| **Access** | Authenticated players (team members only) |

### PlayerProfilePage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/player/PlayerProfilePage.html` |
| **Source** | `frontend/src/pages/player/PlayerProfilePage.tsx` |
| **Route** | `/profile` |
| **Description** | Current player's own profile page. |
| **Features** | - Profile editing<br>- Position preferences<br>- Skills showcase |
| **Access** | Authenticated players |

### MySchedulePage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/player/MySchedulePage.html` |
| **Source** | `frontend/src/pages/player/MySchedulePage.tsx` |
| **Route** | `/schedule` |
| **Description** | Player's upcoming match schedule. |
| **Features** | - Calendar view<br>- Match list<br>- Match details links |
| **Access** | Authenticated players |

### MatchDetailsPage (Player View)
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/player/MatchDetailsPage.html` |
| **Source** | `frontend/src/pages/player/MatchDetailsPage.tsx` |
| **Route** | `/matches/:id` |
| **Description** | Detailed view of a specific match. |
| **Features** | - Teams information<br>- Match date and location<br>- Attendance status<br>- Match result (if completed) |
| **Access** | Authenticated players |

---

## 6. Team Leader Pages

### LeaderTeamsPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/leader/LeaderTeamsPage.html` |
| **Source** | `frontend/src/pages/leader/LeaderTeamsPage.tsx` |
| **Route** | `/leader/teams` |
| **Description** | List of teams managed by the current team leader. |
| **Features** | - Team cards grid<br>- Create Team button<br>- Team status indicators |
| **Access** | Authenticated team leaders |

### TeamDashboardPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/leader/TeamDashboardPage.html` |
| **Source** | `frontend/src/pages/leader/TeamDashboardPage.tsx` |
| **Route** | `/leader/teams/:id` |
| **Description** | Main dashboard for managing a specific team. |
| **Features** | - Team header with logo, name, and location<br>- Edit and Delete buttons<br>- Stats cards (Members, Pending Requests, Upcoming Matches, Wallet Balance)<br>- Quick Actions (Manage Roster, Schedule Match, Match Invites, Add Transaction)<br>- Recent Activity feed |
| **Components Used** | `LoadingSpinner`, `DeleteTeamButton` |
| **API Hooks** | `useTeam`, `useTeamRoster`, `usePendingJoinRequests`, `useTeamMatches`, `useTeamWallet` |
| **Access** | Authenticated team leaders (team owner only) |

### CreateTeamPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/leader/CreateTeamPage.html` |
| **Source** | `frontend/src/pages/leader/CreateTeamPage.tsx` |
| **Route** | `/leader/teams/create` |
| **Description** | Form to create a new team. |
| **Features** | - Team name input<br>- Location selection<br>- Description textarea<br>- Logo upload |
| **Access** | Authenticated team leaders |

### EditTeamPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/leader/EditTeamPage.html` |
| **Source** | `frontend/src/pages/leader/EditTeamPage.tsx` |
| **Route** | `/leader/teams/:id/edit` |
| **Description** | Edit existing team information. |
| **Features** | - Pre-filled team details<br>- Update button<br>- Cancel option |
| **Access** | Authenticated team leaders (team owner only) |

### TeamRosterPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/leader/TeamRosterPage.html` |
| **Source** | `frontend/src/pages/leader/TeamRosterPage.tsx` |
| **Route** | `/leader/teams/:id/roster` |
| **Description** | Manage team roster and member roles. |
| **Features** | - Member list with roles<br>- Remove member functionality<br>- Role assignment |
| **Access** | Authenticated team leaders (team owner only) |

### JoinRequestsPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/leader/JoinRequestsPage.html` |
| **Source** | `frontend/src/pages/leader/JoinRequestsPage.tsx` |
| **Route** | `/leader/teams/:id/requests` |
| **Description** | Review and manage join requests for a team. |
| **Features** | - Pending requests list<br>- Accept/Reject buttons<br>- Request details |
| **Access** | Authenticated team leaders (team owner only) |

### MatchListPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/leader/MatchListPage.html` |
| **Source** | `frontend/src/pages/leader/MatchListPage.tsx` |
| **Route** | `/leader/teams/:id/matches` |
| **Description** | List of all matches for a team. |
| **Features** | - Match cards with status<br>- Filter by status<br>- Create Match button |
| **Access** | Authenticated team leaders (team owner only) |

### CreateMatchPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/leader/CreateMatchPage.html` |
| **Source** | `frontend/src/pages/leader/CreateMatchPage.tsx` |
| **Route** | `/leader/teams/:id/matches/create` |
| **Description** | Schedule a new match. |
| **Features** | - Date/time picker<br>- Field selection<br>- Opponent invitation |
| **Access** | Authenticated team leaders (team owner only) |

### LeaderMatchDetailsPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/leader/LeaderMatchDetailsPage.html` |
| **Source** | `frontend/src/pages/leader/LeaderMatchDetailsPage.tsx` |
| **Route** | `/leader/teams/:teamId/matches/:matchId` |
| **Description** | Detailed match view with management options. |
| **Features** | - Match information<br>- Opponent team details<br>- Field information<br>- Attendance management link |
| **Access** | Authenticated team leaders (team owner only) |

### MatchAttendancePage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/leader/MatchAttendancePage.html` |
| **Source** | `frontend/src/pages/leader/MatchAttendancePage.tsx` |
| **Route** | `/leader/teams/:teamId/matches/:matchId/attendance` |
| **Description** | Track and manage player attendance for a match. |
| **Features** | - Player list with attendance status<br>- Mark attendance buttons<br>- Summary statistics |
| **Access** | Authenticated team leaders (team owner only) |

### MatchInvitationsPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/leader/MatchInvitationsPage.html` |
| **Source** | `frontend/src/pages/leader/MatchInvitationsPage.tsx` |
| **Route** | `/leader/teams/:id/matches/invitations` |
| **Description** | View and respond to match invitations from other teams. |
| **Features** | - Incoming invitations list<br>- Accept/Decline buttons<br>- Match details preview |
| **Access** | Authenticated team leaders (team owner only) |

### TeamFinancePage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/leader/TeamFinancePage.html` |
| **Source** | `frontend/src/pages/leader/TeamFinancePage.tsx` |
| **Route** | `/leader/teams/:id/finance` |
| **Description** | Team financial management and transaction history. |
| **Features** | - Wallet balance display<br>- Transaction history<br>- Add Transaction button |
| **Access** | Authenticated team leaders (team owner only) |

### AddTransactionPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/leader/AddTransactionPage.html` |
| **Source** | `frontend/src/pages/leader/AddTransactionPage.tsx` |
| **Route** | `/leader/teams/:id/finance/add` |
| **Description** | Add a new financial transaction to the team wallet. |
| **Features** | - Transaction type selection<br>- Amount input<br>- Description<br>- Member association |
| **Access** | Authenticated team leaders (team owner only) |

---

## 7. Field Owner Pages

### OwnerFieldsPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/owner/OwnerFieldsPage.html` |
| **Source** | `frontend/src/pages/owner/OwnerFieldsPage.tsx` |
| **Route** | `/owner/fields` |
| **Description** | List of fields owned by the current user. |
| **Features** | - Field cards with status<br>- Register New Field button<br>- Quick stats per field |
| **Access** | Authenticated field owners |

### FieldDashboardPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/owner/FieldDashboardPage.html` |
| **Source** | `frontend/src/pages/owner/FieldDashboardPage.tsx` |
| **Route** | `/owner/fields/:id` |
| **Description** | Main dashboard for managing a specific field. |
| **Features** | - Field header with name, location, and status badge<br>- Field info grid (Price/Hour, Capacity, Status, Owner ID)<br>- Quick Actions (Edit Field, Manage Photos, Set Pricing, View Calendar)<br>- Stats Overview (Today's Bookings, Pending Requests, This Month's Bookings) |
| **Components Used** | `LoadingSpinner`, `PageContainer`, `PageHeader`, `ContentCard` |
| **API Hooks** | `useField`, `useOwnerPendingBookings`, `useFieldCalendar` |
| **Access** | Authenticated field owners (field owner only) |

### RegisterFieldPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/owner/RegisterFieldPage.html` |
| **Source** | `frontend/src/pages/owner/RegisterFieldPage.tsx` |
| **Route** | `/owner/fields/register` |
| **Description** | Register a new football field. |
| **Features** | - Field name and location<br>- Capacity settings<br>- Default pricing<br>- Description |
| **Access** | Authenticated field owners |

### EditFieldPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/owner/EditFieldPage.html` |
| **Source** | `frontend/src/pages/owner/EditFieldPage.tsx` |
| **Route** | `/owner/fields/:id/edit` |
| **Description** | Edit field information. |
| **Features** | - Pre-filled field details<br>- Update button |
| **Access** | Authenticated field owners (field owner only) |

### FieldPhotosPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/owner/FieldPhotosPage.html` |
| **Source** | `frontend/src/pages/owner/FieldPhotosPage.tsx` |
| **Route** | `/owner/fields/:id/photos` |
| **Description** | Manage field photo gallery. |
| **Features** | - Photo grid<br>- Upload new photos<br>- Delete photos<br>- Set primary photo |
| **Access** | Authenticated field owners (field owner only) |

### FieldPricingPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/owner/FieldPricingPage.html` |
| **Source** | `frontend/src/pages/owner/FieldPricingPage.tsx` |
| **Route** | `/owner/fields/:id/pricing` |
| **Description** | Configure field pricing rules. |
| **Features** | - Default price setting<br>- Time-based pricing rules<br>- Weekend/holiday pricing |
| **Access** | Authenticated field owners (field owner only) |

### BookingCalendarPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/owner/BookingCalendarPage.html` |
| **Source** | `frontend/src/pages/owner/BookingCalendarPage.tsx` |
| **Route** | `/owner/fields/:id/calendar` |
| **Description** | Calendar view of field bookings. |
| **Features** | - Monthly calendar<br>- Booking slots with status<br>- Date navigation |
| **Access** | Authenticated field owners (field owner only) |

### BookingDashboardPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/owner/BookingDashboardPage.html` |
| **Source** | `frontend/src/pages/owner/BookingDashboardPage.tsx` |
| **Route** | `/owner/bookings` |
| **Description** | Overview of all bookings across owner's fields. |
| **Features** | - Booking statistics<br>- Recent bookings list<br>- Quick filters |
| **Access** | Authenticated field owners |

### BookingRequestsPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/owner/BookingRequestsPage.html` |
| **Source** | `frontend/src/pages/owner/BookingRequestsPage.tsx` |
| **Route** | `/owner/bookings/requests` |
| **Description** | Manage pending booking requests. |
| **Features** | - Pending requests list<br>- Accept/Reject buttons<br>- Request details |
| **Access** | Authenticated field owners |

### BookingDetailsPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/owner/BookingDetailsPage.html` |
| **Source** | `frontend/src/pages/owner/BookingDetailsPage.tsx` |
| **Route** | `/owner/bookings/:id` |
| **Description** | Detailed view of a specific booking. |
| **Features** | - Booking information<br>- Customer details<br>- Cancel booking option |
| **Access** | Authenticated field owners (booking owner only) |

---

## 8. Moderator Pages

### ModDashboardPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/moderator/ModDashboardPage.html` |
| **Source** | `frontend/src/pages/moderator/ModDashboardPage.tsx` |
| **Route** | `/mod` |
| **Description** | Main moderator dashboard with pending tasks overview. |
| **Features** | - Pending items stats (Teams, Fields, Reported Content)<br>- Quick Actions (Review Teams, Review Fields, Handle Reports, Manage Users)<br>- Recent Activity with action badges (BAN, SUSPEND, WARNING, ACTIVATE, ROLE_CHANGE) |
| **Components Used** | `PageContainer`, `PageHeader`, `ContentCard` |
| **API Hooks** | `useModerationStats`, `useModerationHistory` |
| **Access** | Authenticated moderators |

### PendingTeamsPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/moderator/PendingTeamsPage.html` |
| **Source** | `frontend/src/pages/moderator/PendingTeamsPage.tsx` |
| **Route** | `/mod/teams` |
| **Description** | List of teams pending verification. |
| **Features** | - Pending teams list<br>- Team details preview<br>- Quick action buttons |
| **Access** | Authenticated moderators |

### TeamReviewPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/moderator/TeamReviewPage.html` |
| **Source** | `frontend/src/pages/moderator/TeamReviewPage.tsx` |
| **Route** | `/mod/teams/:id` |
| **Description** | Review and verify a specific team. |
| **Features** | - Full team details<br>- Leader information<br>- Approve/Reject buttons<br>- Rejection reason input |
| **Access** | Authenticated moderators |

### PendingFieldsPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/moderator/PendingFieldsPage.html` |
| **Source** | `frontend/src/pages/moderator/PendingFieldsPage.tsx` |
| **Route** | `/mod/fields` |
| **Description** | List of fields pending verification. |
| **Features** | - Pending fields list<br>- Field details preview<br>- Quick action buttons |
| **Access** | Authenticated moderators |

### FieldReviewPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/moderator/FieldReviewPage.html` |
| **Source** | `frontend/src/pages/moderator/FieldReviewPage.tsx` |
| **Route** | `/mod/fields/:id` |
| **Description** | Review and verify a specific field. |
| **Features** | - Full field details with photos<br>- Owner information<br>- Approve/Reject buttons<br>- Rejection reason input |
| **Access** | Authenticated moderators |

### ReportedContentPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/moderator/ReportedContentPage.html` |
| **Source** | `frontend/src/pages/moderator/ReportedContentPage.tsx` |
| **Route** | `/mod/reports` |
| **Description** | List of reported content to review. |
| **Features** | - Reports list with type indicators<br>- Report status badges<br>- Quick action buttons |
| **Access** | Authenticated moderators |

### ReportDetailsPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/moderator/ReportDetailsPage.html` |
| **Source** | `frontend/src/pages/moderator/ReportDetailsPage.tsx` |
| **Route** | `/mod/reports/:id` |
| **Description** | Detailed view of a specific report. |
| **Features** | - Reported content preview<br>- Reporter information<br>- Report reason<br>- Action buttons (Dismiss, Warn, Ban) |
| **Access** | Authenticated moderators |

### UserListPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/moderator/UserListPage.html` |
| **Source** | `frontend/src/pages/moderator/UserListPage.tsx` |
| **Route** | `/mod/users` |
| **Description** | Search and browse platform users. |
| **Features** | - User search<br>- Filter by role/status<br>- User list with status indicators |
| **Access** | Authenticated moderators |

### UserDetailsPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/moderator/UserDetailsPage.html` |
| **Source** | `frontend/src/pages/moderator/UserDetailsPage.tsx` |
| **Route** | `/mod/users/:id` |
| **Description** | Detailed user profile for moderation. |
| **Features** | - User information<br>- Account status<br>- Role management<br>- Moderation actions (Warn, Suspend, Ban) |
| **Access** | Authenticated moderators |

### ModerationHistoryPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/moderator/ModerationHistoryPage.html` |
| **Source** | `frontend/src/pages/moderator/ModerationHistoryPage.tsx` |
| **Route** | `/mod/history` |
| **Description** | History of all moderation actions. |
| **Features** | - Action log with timestamps<br>- Filter by action type<br>- Moderator attribution |
| **Access** | Authenticated moderators |

---

## 9. Search Pages

### SearchTeamsPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/search/SearchTeamsPage.html` |
| **Source** | `frontend/src/pages/search/SearchTeamsPage.tsx` |
| **Route** | `/search/teams` |
| **Description** | Search and discover football teams. |
| **Features** | - Search input<br>- Filter by location/skill level<br>- Results grid<br>- Join request buttons |
| **Access** | Public (some features require authentication) |

### SearchFieldsPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/search/SearchFieldsPage.html` |
| **Source** | `frontend/src/pages/search/SearchFieldsPage.tsx` |
| **Route** | `/search/fields` |
| **Description** | Search and discover football fields. |
| **Features** | - Search input<br>- Filter by location/price/capacity<br>- Results grid<br>- Book now buttons |
| **Access** | Public (some features require authentication) |

### SearchPlayersPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/search/SearchPlayersPage.html` |
| **Source** | `frontend/src/pages/search/SearchPlayersPage.tsx` |
| **Route** | `/search/players` |
| **Description** | Search and discover players. |
| **Features** | - Search input<br>- Filter by position/skill level<br>- Results grid<br>- Profile view links |
| **Access** | Authenticated users |

### SearchOwnersPage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/search/SearchOwnersPage.html` |
| **Source** | `frontend/src/pages/search/SearchOwnersPage.tsx` |
| **Route** | `/search/owners` |
| **Description** | Search and discover field owners. |
| **Features** | - Search input<br>- Results list<br>- Owner profile links |
| **Access** | Authenticated users |

### SearchOwnerProfilePage
| Attribute | Details |
|-----------|---------|
| **Wireframe** | `docs/wireframe/search/SearchOwnerProfilePage.html` |
| **Source** | `frontend/src/pages/search/SearchOwnerProfilePage.tsx` |
| **Route** | `/search/owners/:id` |
| **Description** | View a field owner's profile and their fields. |
| **Features** | - Owner information<br>- List of owned fields<br>- Contact information |
| **Access** | Authenticated users |

---

## File Structure Summary

```
docs/wireframe/
├── auth/
│   ├── LoginPage.html
│   └── RegisterPage.html
├── community/
│   ├── CommunityFeedPage.html
│   └── CreatePostPage.html
├── dashboard/
│   ├── AccountSettingsPage.html
│   ├── DashboardPage.html
│   ├── NotificationSettingsPage.html
│   └── NotificationsPage.html
├── leader/
│   ├── AddTransactionPage.html
│   ├── CreateMatchPage.html
│   ├── CreateTeamPage.html
│   ├── EditTeamPage.html
│   ├── JoinRequestsPage.html
│   ├── LeaderMatchDetailsPage.html
│   ├── LeaderTeamsPage.html
│   ├── MatchAttendancePage.html
│   ├── MatchInvitationsPage.html
│   ├── MatchListPage.html
│   ├── TeamDashboardPage.html
│   ├── TeamFinancePage.html
│   └── TeamRosterPage.html
├── moderator/
│   ├── FieldReviewPage.html
│   ├── ModDashboardPage.html
│   ├── ModerationHistoryPage.html
│   ├── PendingFieldsPage.html
│   ├── PendingTeamsPage.html
│   ├── ReportDetailsPage.html
│   ├── ReportedContentPage.html
│   ├── TeamReviewPage.html
│   ├── UserDetailsPage.html
│   └── UserListPage.html
├── owner/
│   ├── BookingCalendarPage.html
│   ├── BookingDashboardPage.html
│   ├── BookingDetailsPage.html
│   ├── BookingRequestsPage.html
│   ├── EditFieldPage.html
│   ├── FieldDashboardPage.html
│   ├── FieldPhotosPage.html
│   ├── FieldPricingPage.html
│   ├── OwnerFieldsPage.html
│   └── RegisterFieldPage.html
├── player/
│   ├── MatchDetailsPage.html
│   ├── MySchedulePage.html
│   ├── MyTeamsPage.html
│   ├── PlayerProfilePage.html
│   └── TeamDetailsPage.html
├── public/
│   ├── LandingPage.html
│   ├── NotFoundPage.html
│   ├── PublicFieldProfilePage.html
│   ├── PublicPlayerProfilePage.html
│   └── PublicTeamProfilePage.html
└── search/
    ├── SearchFieldsPage.html
    ├── SearchOwnerProfilePage.html
    ├── SearchOwnersPage.html
    ├── SearchPlayersPage.html
    └── SearchTeamsPage.html

frontend/src/pages/
├── index.tsx
├── auth/
│   ├── index.ts
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── community/
│   ├── index.ts
│   ├── CommunityFeedPage.tsx
│   └── CreatePostPage.tsx
├── dashboard/
│   ├── index.ts
│   ├── AccountSettingsPage.tsx
│   ├── DashboardPage.tsx
│   ├── NotificationSettingsPage.tsx
│   └── NotificationsPage.tsx
├── leader/
│   ├── index.ts
│   ├── AddTransactionPage.tsx
│   ├── CreateMatchPage.tsx
│   ├── CreateTeamPage.tsx
│   ├── EditTeamPage.tsx
│   ├── JoinRequestsPage.tsx
│   ├── LeaderMatchDetailsPage.tsx
│   ├── LeaderTeamsPage.tsx
│   ├── MatchAttendancePage.tsx
│   ├── MatchInvitationsPage.tsx
│   ├── MatchListPage.tsx
│   ├── TeamDashboardPage.tsx
│   ├── TeamFinancePage.tsx
│   └── TeamRosterPage.tsx
├── moderator/
│   ├── index.ts
│   ├── FieldReviewPage.tsx
│   ├── ModDashboardPage.tsx
│   ├── ModerationHistoryPage.tsx
│   ├── PendingFieldsPage.tsx
│   ├── PendingTeamsPage.tsx
│   ├── ReportDetailsPage.tsx
│   ├── ReportedContentPage.tsx
│   ├── TeamReviewPage.tsx
│   ├── UserDetailsPage.tsx
│   └── UserListPage.tsx
├── owner/
│   ├── index.ts
│   ├── BookingCalendarPage.tsx
│   ├── BookingDashboardPage.tsx
│   ├── BookingDetailsPage.tsx
│   ├── BookingRequestsPage.tsx
│   ├── EditFieldPage.tsx
│   ├── FieldDashboardPage.tsx
│   ├── FieldPhotosPage.tsx
│   ├── FieldPricingPage.tsx
│   ├── OwnerFieldsPage.tsx
│   └── RegisterFieldPage.tsx
├── player/
│   ├── index.ts
│   ├── MatchDetailsPage.tsx
│   ├── MySchedulePage.tsx
│   ├── MyTeamsPage.tsx
│   ├── PlayerProfilePage.tsx
│   └── TeamDetailsPage.tsx
├── public/
│   ├── index.ts
│   ├── LandingPage.tsx
│   ├── NotFoundPage.tsx
│   ├── PublicFieldProfilePage.tsx
│   ├── PublicPlayerProfilePage.tsx
│   └── PublicTeamProfilePage.tsx
└── search/
    ├── index.ts
    ├── SearchFieldsPage.tsx
    ├── SearchOwnerProfilePage.tsx
    ├── SearchOwnersPage.tsx
    ├── SearchPlayersPage.tsx
    └── SearchTeamsPage.tsx
```

---

## Design System Notes

### Wireframe Style
The wireframes use a consistent low-fidelity design language:
- **Font**: Courier New (monospace) for wireframe aesthetic
- **Colors**: Black (#000) and White (#fff) with gray accents
- **Borders**: 2px solid black for all interactive elements
- **Box Shadow**: 8px 8px offset for depth
- **Window Frame**: Browser-like window controls for context

### React Implementation Style
The React pages use a modern, polished design system:
- **Typography**: System fonts with Tailwind CSS utilities
- **Colors**: Primary emerald/green gradient theme with slate grays
- **Components**: Reusable `PageContainer`, `PageHeader`, `ContentCard`, `LoadingSpinner`
- **Icons**: Lucide React icons
- **Responsive**: Mobile-first with lg/md breakpoints
- **Shadows**: Soft shadows with border-slate-100

---

*Last Updated: January 7, 2026*
