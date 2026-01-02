// Re-export all page components from subdirectories

// Auth pages
export { LoginPage, RegisterPage } from './auth';

// Public pages
export {
    LandingPage,
    NotFoundPage,
    PublicTeamProfilePage,
    PublicFieldProfilePage,
    PublicPlayerProfilePage,
} from './public';

// Dashboard pages
export {
    DashboardPage,
    NotificationsPage,
    NotificationSettingsPage,
    AccountSettingsPage,
} from './dashboard';

// Community pages
export {
    CommunityFeedPage,
    CreatePostPage,
    PostDetailsPage,
} from './community';

// Search pages
export {
    SearchTeamsPage,
    SearchFieldsPage,
    SearchPlayersPage,
    SearchOwnersPage,
    SearchOwnerProfilePage,
} from './search';

// Player pages
export {
    PlayerProfilePage,
    MyTeamsPage,
    TeamDetailsPage,
    MySchedulePage,
    MatchDetailsPage,
} from './player';

// Leader pages
export {
    LeaderTeamsPage,
    CreateTeamPage,
    TeamDashboardPage,
    EditTeamPage,
    TeamRosterPage,
    JoinRequestsPage,
    TeamFinancePage,
    AddTransactionPage,
    MatchListPage,
    CreateMatchPage,
    MatchInvitationsPage,
    LeaderMatchDetailsPage,
    MatchAttendancePage,
} from './leader';

// Owner pages
export {
    OwnerFieldsPage,
    RegisterFieldPage,
    FieldDashboardPage,
    EditFieldPage,
    FieldPhotosPage,
    FieldPricingPage,
    BookingCalendarPage,
    BookingDashboardPage,
    BookingRequestsPage,
    BookingDetailsPage,
} from './owner';

// Moderator pages
export {
    ModDashboardPage,
    PendingTeamsPage,
    TeamReviewPage,
    PendingFieldsPage,
    FieldReviewPage,
    ReportedContentPage,
    ReportDetailsPage,
    ModerationHistoryPage,
    UserListPage,
    UserDetailsPage,
} from './moderator';
