# Implementation Plan: Page Components

## Overview
Create real page implementations for all 59 components used in `routes.tsx`, moving away from placeholder components. Each page will use existing components from `src/components/` and follow the established patterns.

---

## Component Mapping

Based on analysis of available components:

| Page | Available Components |
|------|---------------------|
| LandingPage | Custom layout |
| CommunityFeedPage | `CommunityFeedView` |
| PostDetailsPage | `PostCard`, `CommentSection` |
| CreatePostPage | `CreatePostForm` |
| SearchTeamsPage | `TeamSearchFilter`, `TeamResultCard`, `EmptySearchState` |
| SearchFieldsPage | `FieldSearchFilter`, `FieldResultCard`, `EmptySearchState` |
| SearchPlayersPage | `PlayerSearchFilter`, `PlayerResultCard`, `EmptySearchState` |
| SearchOwnersPage | `OwnerSearchFilter`, `EmptySearchState` |
| PlayerProfilePage | `PlayerProfileView`, `PlayerProfileForm` |
| MyTeamsPage | `MyTeamsList` |
| MySchedulePage | `MatchScheduleList` |
| MatchDetailsPage | `MatchDetailsCard` |
| TeamRosterPage | `TeamRosterView` |
| JoinRequestsPage | `JoinRequestsList` |
| TeamFinancePage | `FinanceDashboardView` |
| AddTransactionPage | `AddTransactionForm` |
| CreateMatchPage | `CreateMatchForm` |
| MatchInvitationsPage | `MatchInvitationsList` |
| MatchAttendancePage | `AttendanceTrackingView` |
| RegisterFieldPage | `CreateFieldForm` |
| EditFieldPage | `EditFieldForm` |
| FieldPricingPage | `FieldPricingEditor` |
| BookingCalendarPage | `BookingCalendarView` |
| BookingRequestsPage | `BookingRequestsList` |
| BookingDetailsPage | `BookingDetailsCard` |
| ModDashboardPage | Stats cards |
| PendingTeamsPage | `PendingTeamsListView` |
| TeamReviewPage | `TeamReviewView` |
| PendingFieldsPage | `PendingFieldsListView` |
| FieldReviewPage | `FieldReviewView` |
| ReportedContentPage | `ReportedContentListView` |
| ReportDetailsPage | `ReportDetailsView` |
| ModerationHistoryPage | `ModerationHistoryView` |
| UserListPage | `UserSearchView` |
| UserDetailsPage | `UserDetailsView` |
| NotificationsPage | `NotificationCenter` |
| NotificationSettingsPage | `NotificationSettingsForm` |
| AccountSettingsPage | `ChangePasswordForm` |
| CreateTeamPage | `CreateTeamForm` |
| EditTeamPage | `EditTeamForm` |

---

## Proposed Changes

### 1. Public Pages (`src/pages/public/`)

#### [NEW] [LandingPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/public/LandingPage.tsx)
Hero section with app features, call-to-action buttons for login/register.

#### [NEW] [NotFoundPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/public/NotFoundPage.tsx)
404 page with navigation back to home.

#### [NEW] [PublicTeamProfilePage.tsx](file:///home/thanh309/football-app/frontend/src/pages/public/PublicTeamProfilePage.tsx)
Read-only view of team profile, uses `useParams` to get team ID.

#### [NEW] [PublicFieldProfilePage.tsx](file:///home/thanh309/football-app/frontend/src/pages/public/PublicFieldProfilePage.tsx)
Read-only view of field profile with booking info.

#### [NEW] [PublicPlayerProfilePage.tsx](file:///home/thanh309/football-app/frontend/src/pages/public/PublicPlayerProfilePage.tsx)
Read-only view of player profile.

#### [NEW] [index.ts](file:///home/thanh309/football-app/frontend/src/pages/public/index.ts)
Re-exports all public pages.

---

### 2. Dashboard Pages (`src/pages/dashboard/`)

#### [NEW] [DashboardPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/dashboard/DashboardPage.tsx)
Overview dashboard with quick stats and recent activity.

#### [NEW] [NotificationsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/dashboard/NotificationsPage.tsx)
Uses `NotificationCenter` component.

#### [NEW] [NotificationSettingsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/dashboard/NotificationSettingsPage.tsx)
Uses `NotificationSettingsForm` component.

#### [NEW] [AccountSettingsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/dashboard/AccountSettingsPage.tsx)
Account settings with `ChangePasswordForm`.

#### [NEW] [index.ts](file:///home/thanh309/football-app/frontend/src/pages/dashboard/index.ts)
Re-exports all dashboard pages.

---

### 3. Community Pages (`src/pages/community/`)

#### [NEW] [CommunityFeedPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/community/CommunityFeedPage.tsx)
Uses `CommunityFeedView` component.

#### [NEW] [CreatePostPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/community/CreatePostPage.tsx)
Uses `CreatePostForm` component.

#### [NEW] [PostDetailsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/community/PostDetailsPage.tsx)
Uses `PostCard` and `CommentSection` components.

#### [NEW] [index.ts](file:///home/thanh309/football-app/frontend/src/pages/community/index.ts)
Re-exports all community pages.

---

### 4. Search Pages (`src/pages/search/`)

#### [NEW] [SearchTeamsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/search/SearchTeamsPage.tsx)
Uses `TeamSearchFilter`, `TeamResultCard`, `EmptySearchState`.

#### [NEW] [SearchFieldsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/search/SearchFieldsPage.tsx)
Uses `FieldSearchFilter`, `FieldResultCard`, `EmptySearchState`.

#### [NEW] [SearchPlayersPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/search/SearchPlayersPage.tsx)
Uses `PlayerSearchFilter`, `PlayerResultCard`, `EmptySearchState`.

#### [NEW] [SearchOwnersPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/search/SearchOwnersPage.tsx)
Uses `OwnerSearchFilter`, `EmptySearchState`.

#### [NEW] [index.ts](file:///home/thanh309/football-app/frontend/src/pages/search/index.ts)
Re-exports all search pages.

---

### 5. Player Pages (`src/pages/player/`)

#### [NEW] [PlayerProfilePage.tsx](file:///home/thanh309/football-app/frontend/src/pages/player/PlayerProfilePage.tsx)
Uses `PlayerProfileView` and `PlayerProfileForm`.

#### [NEW] [MyTeamsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/player/MyTeamsPage.tsx)
Uses `MyTeamsList` component.

#### [NEW] [TeamDetailsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/player/TeamDetailsPage.tsx)
Player view of a specific team they belong to.

#### [NEW] [MySchedulePage.tsx](file:///home/thanh309/football-app/frontend/src/pages/player/MySchedulePage.tsx)
Uses `MatchScheduleList` component.

#### [NEW] [MatchDetailsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/player/MatchDetailsPage.tsx)
Uses `MatchDetailsCard` component.

#### [NEW] [index.ts](file:///home/thanh309/football-app/frontend/src/pages/player/index.ts)
Re-exports all player pages.

---

### 6. Leader Pages (`src/pages/leader/`)

#### [NEW] [LeaderTeamsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/leader/LeaderTeamsPage.tsx)
List of teams the leader manages.

#### [NEW] [CreateTeamPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/leader/CreateTeamPage.tsx)
Uses `CreateTeamForm` component.

#### [NEW] [TeamDashboardPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/leader/TeamDashboardPage.tsx)
Team overview with stats and quick actions.

#### [NEW] [EditTeamPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/leader/EditTeamPage.tsx)
Uses `EditTeamForm` component.

#### [NEW] [TeamRosterPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/leader/TeamRosterPage.tsx)
Uses `TeamRosterView` component.

#### [NEW] [JoinRequestsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/leader/JoinRequestsPage.tsx)
Uses `JoinRequestsList` component.

#### [NEW] [TeamFinancePage.tsx](file:///home/thanh309/football-app/frontend/src/pages/leader/TeamFinancePage.tsx)
Uses `FinanceDashboardView` component.

#### [NEW] [AddTransactionPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/leader/AddTransactionPage.tsx)
Uses `AddTransactionForm` component.

#### [NEW] [MatchListPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/leader/MatchListPage.tsx)
List of matches for a team.

#### [NEW] [CreateMatchPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/leader/CreateMatchPage.tsx)
Uses `CreateMatchForm` component.

#### [NEW] [MatchInvitationsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/leader/MatchInvitationsPage.tsx)
Uses `MatchInvitationsList` component.

#### [NEW] [LeaderMatchDetailsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/leader/LeaderMatchDetailsPage.tsx)
Match details with leader actions.

#### [NEW] [MatchAttendancePage.tsx](file:///home/thanh309/football-app/frontend/src/pages/leader/MatchAttendancePage.tsx)
Uses `AttendanceTrackingView` component.

#### [NEW] [index.ts](file:///home/thanh309/football-app/frontend/src/pages/leader/index.ts)
Re-exports all leader pages.

---

### 7. Owner Pages (`src/pages/owner/`)

#### [NEW] [OwnerFieldsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/owner/OwnerFieldsPage.tsx)
List of owned fields.

#### [NEW] [RegisterFieldPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/owner/RegisterFieldPage.tsx)
Uses `CreateFieldForm` component.

#### [NEW] [FieldDashboardPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/owner/FieldDashboardPage.tsx)
Field overview with stats and quick actions.

#### [NEW] [EditFieldPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/owner/EditFieldPage.tsx)
Uses `EditFieldForm` component.

#### [NEW] [FieldPhotosPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/owner/FieldPhotosPage.tsx)
Uses `ImageUploader` component for managing field photos.

#### [NEW] [FieldPricingPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/owner/FieldPricingPage.tsx)
Uses `FieldPricingEditor` component.

#### [NEW] [BookingCalendarPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/owner/BookingCalendarPage.tsx)
Uses `BookingCalendarView` component.

#### [NEW] [BookingDashboardPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/owner/BookingDashboardPage.tsx)
Overview of all bookings across fields.

#### [NEW] [BookingRequestsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/owner/BookingRequestsPage.tsx)
Uses `BookingRequestsList` component.

#### [NEW] [BookingDetailsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/owner/BookingDetailsPage.tsx)
Uses `BookingDetailsCard` component.

#### [NEW] [index.ts](file:///home/thanh309/football-app/frontend/src/pages/owner/index.ts)
Re-exports all owner pages.

---

### 8. Moderator Pages (`src/pages/moderator/`)

#### [NEW] [ModDashboardPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/moderator/ModDashboardPage.tsx)
Moderator dashboard with pending items counts.

#### [NEW] [PendingTeamsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/moderator/PendingTeamsPage.tsx)
Uses `PendingTeamsListView` component.

#### [NEW] [TeamReviewPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/moderator/TeamReviewPage.tsx)
Uses `TeamReviewView` component.

#### [NEW] [PendingFieldsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/moderator/PendingFieldsPage.tsx)
Uses `PendingFieldsListView` component.

#### [NEW] [FieldReviewPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/moderator/FieldReviewPage.tsx)
Uses `FieldReviewView` component.

#### [NEW] [ReportedContentPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/moderator/ReportedContentPage.tsx)
Uses `ReportedContentListView` component.

#### [NEW] [ReportDetailsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/moderator/ReportDetailsPage.tsx)
Uses `ReportDetailsView` component.

#### [NEW] [ModerationHistoryPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/moderator/ModerationHistoryPage.tsx)
Uses `ModerationHistoryView` component.

#### [NEW] [UserListPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/moderator/UserListPage.tsx)
Uses `UserSearchView` component.

#### [NEW] [UserDetailsPage.tsx](file:///home/thanh309/football-app/frontend/src/pages/moderator/UserDetailsPage.tsx)
Uses `UserDetailsView` component.

#### [NEW] [index.ts](file:///home/thanh309/football-app/frontend/src/pages/moderator/index.ts)
Re-exports all moderator pages.

---

### 9. Update Main Index

#### [MODIFY] [index.tsx](file:///home/thanh309/football-app/frontend/src/pages/index.tsx)
Replace all inline placeholder exports with re-exports from subdirectories.

---

## Verification Plan

### Automated Tests
```bash
cd /home/thanh309/football-app/frontend && npm run build
```
Verify no TypeScript errors and successful build.

### Manual Verification
- Navigate to each route in the browser
- Verify each page renders with its components
