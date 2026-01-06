import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import {
    PublicLayout,
    AuthLayout,
    DashboardLayout,
} from "./layouts";
import { LoadingSpinner } from "./components/common";

// Lazy load page components for code-splitting
// This creates separate chunks that are loaded on-demand

// Auth pages
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));

// Public pages
const LandingPage = lazy(() => import("./pages/public/LandingPage"));
const NotFoundPage = lazy(() => import("./pages/public/NotFoundPage"));
const PublicTeamProfilePage = lazy(() => import("./pages/public/PublicTeamProfilePage"));
const PublicFieldProfilePage = lazy(() => import("./pages/public/PublicFieldProfilePage"));
const PublicPlayerProfilePage = lazy(() => import("./pages/public/PublicPlayerProfilePage"));

// Dashboard pages
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const NotificationsPage = lazy(() => import("./pages/dashboard/NotificationsPage"));
const NotificationSettingsPage = lazy(() => import("./pages/dashboard/NotificationSettingsPage"));
const AccountSettingsPage = lazy(() => import("./pages/dashboard/AccountSettingsPage"));

// Community pages
const CommunityFeedPage = lazy(() => import("./pages/community/CommunityFeedPage"));
const CreatePostPage = lazy(() => import("./pages/community/CreatePostPage"));


// Search pages
const SearchTeamsPage = lazy(() => import("./pages/search/SearchTeamsPage"));
const SearchFieldsPage = lazy(() => import("./pages/search/SearchFieldsPage"));
const SearchPlayersPage = lazy(() => import("./pages/search/SearchPlayersPage"));
const SearchOwnersPage = lazy(() => import("./pages/search/SearchOwnersPage"));
const SearchOwnerProfilePage = lazy(() => import("./pages/search/SearchOwnerProfilePage"));

// Player pages
const PlayerProfilePage = lazy(() => import("./pages/player/PlayerProfilePage"));
const MyTeamsPage = lazy(() => import("./pages/player/MyTeamsPage"));
const TeamDetailsPage = lazy(() => import("./pages/player/TeamDetailsPage"));
const MySchedulePage = lazy(() => import("./pages/player/MySchedulePage"));
const MatchDetailsPage = lazy(() => import("./pages/player/MatchDetailsPage"));

// Leader pages
const LeaderTeamsPage = lazy(() => import("./pages/leader/LeaderTeamsPage"));
const CreateTeamPage = lazy(() => import("./pages/leader/CreateTeamPage"));
const TeamDashboardPage = lazy(() => import("./pages/leader/TeamDashboardPage"));
const EditTeamPage = lazy(() => import("./pages/leader/EditTeamPage"));
const TeamRosterPage = lazy(() => import("./pages/leader/TeamRosterPage"));
const JoinRequestsPage = lazy(() => import("./pages/leader/JoinRequestsPage"));
const TeamFinancePage = lazy(() => import("./pages/leader/TeamFinancePage"));
const AddTransactionPage = lazy(() => import("./pages/leader/AddTransactionPage"));
const MatchListPage = lazy(() => import("./pages/leader/MatchListPage"));
const CreateMatchPage = lazy(() => import("./pages/leader/CreateMatchPage"));
const MatchInvitationsPage = lazy(() => import("./pages/leader/MatchInvitationsPage"));
const LeaderMatchDetailsPage = lazy(() => import("./pages/leader/LeaderMatchDetailsPage"));
const MatchAttendancePage = lazy(() => import("./pages/leader/MatchAttendancePage"));

// Owner pages
const OwnerFieldsPage = lazy(() => import("./pages/owner/OwnerFieldsPage"));
const RegisterFieldPage = lazy(() => import("./pages/owner/RegisterFieldPage"));
const FieldDashboardPage = lazy(() => import("./pages/owner/FieldDashboardPage"));
const EditFieldPage = lazy(() => import("./pages/owner/EditFieldPage"));
const FieldPhotosPage = lazy(() => import("./pages/owner/FieldPhotosPage"));
const FieldPricingPage = lazy(() => import("./pages/owner/FieldPricingPage"));
const BookingCalendarPage = lazy(() => import("./pages/owner/BookingCalendarPage"));
const BookingDashboardPage = lazy(() => import("./pages/owner/BookingDashboardPage"));
const BookingRequestsPage = lazy(() => import("./pages/owner/BookingRequestsPage"));
const BookingDetailsPage = lazy(() => import("./pages/owner/BookingDetailsPage"));

// Moderator pages
const ModDashboardPage = lazy(() => import("./pages/moderator/ModDashboardPage"));
const PendingTeamsPage = lazy(() => import("./pages/moderator/PendingTeamsPage"));
const TeamReviewPage = lazy(() => import("./pages/moderator/TeamReviewPage"));
const PendingFieldsPage = lazy(() => import("./pages/moderator/PendingFieldsPage"));
const FieldReviewPage = lazy(() => import("./pages/moderator/FieldReviewPage"));
const ReportedContentPage = lazy(() => import("./pages/moderator/ReportedContentPage"));
const ReportDetailsPage = lazy(() => import("./pages/moderator/ReportDetailsPage"));
const ModerationHistoryPage = lazy(() => import("./pages/moderator/ModerationHistoryPage"));
const UserListPage = lazy(() => import("./pages/moderator/UserListPage"));
const UserDetailsPage = lazy(() => import("./pages/moderator/UserDetailsPage"));

// Suspense wrapper for lazy-loaded components
const LazyComponent = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner text="Loading..." /></div>}>
        {children}
    </Suspense>
);

export const router = createBrowserRouter([
    // Public Routes
    {
        path: "/",
        element: <PublicLayout />,
        children: [
            { index: true, element: <LazyComponent><LandingPage /></LazyComponent> },
            { path: "community", element: <LazyComponent><CommunityFeedPage /></LazyComponent> },


            // Search Routes (public pages)
            { path: "search/teams", element: <LazyComponent><SearchTeamsPage /></LazyComponent> },
            { path: "search/teams/:id", element: <LazyComponent><PublicTeamProfilePage /></LazyComponent> },
            { path: "search/fields", element: <LazyComponent><SearchFieldsPage /></LazyComponent> },
            { path: "search/fields/:id", element: <LazyComponent><PublicFieldProfilePage /></LazyComponent> },
            { path: "search/players", element: <LazyComponent><SearchPlayersPage /></LazyComponent> },
            { path: "search/players/:id", element: <LazyComponent><PublicPlayerProfilePage /></LazyComponent> },
            { path: "search/owners", element: <LazyComponent><SearchOwnersPage /></LazyComponent> },
            { path: "search/owners/:id", element: <LazyComponent><SearchOwnerProfilePage /></LazyComponent> },
        ],
    },

    // Auth Routes
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            { path: "login", element: <LazyComponent><LoginPage /></LazyComponent> },
            { path: "register", element: <LazyComponent><RegisterPage /></LazyComponent> },
        ],
    },

    // Authenticated User Routes (Dashboard & Common)
    {
        path: "/",
        element: <DashboardLayout />,
        children: [
            { path: "dashboard", element: <LazyComponent><DashboardPage /></LazyComponent> },
            { path: "notifications", element: <LazyComponent><NotificationsPage /></LazyComponent> },
            { path: "settings/notifications", element: <LazyComponent><NotificationSettingsPage /></LazyComponent> },
            { path: "settings/account", element: <LazyComponent><AccountSettingsPage /></LazyComponent> },
            { path: "community/create", element: <LazyComponent><CreatePostPage /></LazyComponent> },

            // Player Role Routes
            { path: "profile", element: <LazyComponent><PlayerProfilePage /></LazyComponent> },
            { path: "my-teams", element: <LazyComponent><MyTeamsPage /></LazyComponent> },
            { path: "my-teams/:id", element: <LazyComponent><TeamDetailsPage /></LazyComponent> },
            { path: "schedule", element: <LazyComponent><MySchedulePage /></LazyComponent> },
            { path: "schedule/:matchId", element: <LazyComponent><MatchDetailsPage /></LazyComponent> },
        ],
    },

    // Team Leader Routes
    {
        path: "/leader",
        element: <DashboardLayout />,
        children: [
            { path: "teams", element: <LazyComponent><LeaderTeamsPage /></LazyComponent> },
            { path: "teams/create", element: <LazyComponent><CreateTeamPage /></LazyComponent> },
            { path: "teams/:id", element: <LazyComponent><TeamDashboardPage /></LazyComponent> },
            { path: "teams/:id/edit", element: <LazyComponent><EditTeamPage /></LazyComponent> },
            { path: "teams/:id/roster", element: <LazyComponent><TeamRosterPage /></LazyComponent> },
            { path: "teams/:id/requests", element: <LazyComponent><JoinRequestsPage /></LazyComponent> },
            { path: "teams/:id/finance", element: <LazyComponent><TeamFinancePage /></LazyComponent> },
            { path: "teams/:id/finance/add", element: <LazyComponent><AddTransactionPage /></LazyComponent> },
            { path: "teams/:teamId/matches", element: <LazyComponent><MatchListPage /></LazyComponent> },
            { path: "teams/:teamId/matches/create", element: <LazyComponent><CreateMatchPage /></LazyComponent> },
            { path: "teams/:teamId/matches/invitations", element: <LazyComponent><MatchInvitationsPage /></LazyComponent> },
            { path: "teams/:teamId/matches/:matchId", element: <LazyComponent><LeaderMatchDetailsPage /></LazyComponent> },
            { path: "teams/:teamId/matches/:matchId/attendance", element: <LazyComponent><MatchAttendancePage /></LazyComponent> },
        ],
    },

    // Field Owner Routes
    {
        path: "/owner",
        element: <DashboardLayout />,
        children: [
            { path: "fields", element: <LazyComponent><OwnerFieldsPage /></LazyComponent> },
            { path: "fields/create", element: <LazyComponent><RegisterFieldPage /></LazyComponent> },
            { path: "fields/:id", element: <LazyComponent><FieldDashboardPage /></LazyComponent> },
            { path: "fields/:id/edit", element: <LazyComponent><EditFieldPage /></LazyComponent> },
            { path: "fields/:id/photos", element: <LazyComponent><FieldPhotosPage /></LazyComponent> },
            { path: "fields/:id/pricing", element: <LazyComponent><FieldPricingPage /></LazyComponent> },
            { path: "fields/:id/calendar", element: <LazyComponent><BookingCalendarPage /></LazyComponent> },
            { path: "bookings", element: <LazyComponent><BookingDashboardPage /></LazyComponent> },
            { path: "bookings/requests", element: <LazyComponent><BookingRequestsPage /></LazyComponent> },
            { path: "bookings/:id", element: <LazyComponent><BookingDetailsPage /></LazyComponent> },
        ],
    },

    // Moderator Routes
    {
        path: "/mod",
        element: <DashboardLayout />,
        children: [
            { index: true, element: <LazyComponent><ModDashboardPage /></LazyComponent> },
            { path: "teams", element: <LazyComponent><PendingTeamsPage /></LazyComponent> },
            { path: "teams/:id", element: <LazyComponent><TeamReviewPage /></LazyComponent> },
            { path: "fields", element: <LazyComponent><PendingFieldsPage /></LazyComponent> },
            { path: "fields/:id", element: <LazyComponent><FieldReviewPage /></LazyComponent> },
            { path: "reports", element: <LazyComponent><ReportedContentPage /></LazyComponent> },
            { path: "reports/:id", element: <LazyComponent><ReportDetailsPage /></LazyComponent> },
            { path: "history", element: <LazyComponent><ModerationHistoryPage /></LazyComponent> },
            { path: "users", element: <LazyComponent><UserListPage /></LazyComponent> },
            { path: "users/:id", element: <LazyComponent><UserDetailsPage /></LazyComponent> },
        ],
    },

    // Fallback
    { path: "*", element: <LazyComponent><NotFoundPage /></LazyComponent> },
]);
