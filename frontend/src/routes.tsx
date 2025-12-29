import { createBrowserRouter } from "react-router-dom";
import {
    PublicLayout,
    AuthLayout,
    DashboardLayout,
} from "./layouts";
import * as Pages from "./pages";

export const router = createBrowserRouter([
    // Public Routes
    {
        path: "/",
        element: <PublicLayout />,
        children: [
            { index: true, element: <Pages.LandingPage /> },
            { path: "community", element: <Pages.CommunityFeedPage /> },
            { path: "community/posts/:id", element: <Pages.PostDetailsPage /> },
            { path: "teams", element: <Pages.SearchTeamsPage /> },
            { path: "teams/:id", element: <Pages.PublicTeamProfilePage /> },
            { path: "fields", element: <Pages.SearchFieldsPage /> },
            { path: "fields/:id", element: <Pages.PublicFieldProfilePage /> },
            { path: "players/:id", element: <Pages.PublicPlayerProfilePage /> },

            // Search Routes
            { path: "search/teams", element: <Pages.SearchTeamsPage /> },
            { path: "search/fields", element: <Pages.SearchFieldsPage /> },
            { path: "search/players", element: <Pages.SearchPlayersPage /> },
            { path: "search/owners", element: <Pages.SearchOwnersPage /> },
        ],
    },

    // Auth Routes
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            { path: "login", element: <Pages.LoginPage /> },
            { path: "register", element: <Pages.RegisterPage /> },
        ],
    },

    // Authenticated User Routes (Dashboard & Common)
    {
        path: "/",
        element: <DashboardLayout />,
        children: [
            { path: "dashboard", element: <Pages.DashboardPage /> },
            { path: "notifications", element: <Pages.NotificationsPage /> },
            { path: "settings/notifications", element: <Pages.NotificationSettingsPage /> },
            { path: "settings/account", element: <Pages.AccountSettingsPage /> },
            { path: "community/create", element: <Pages.CreatePostPage /> },

            // Player Role Routes
            { path: "profile", element: <Pages.PlayerProfilePage /> },
            { path: "my-teams", element: <Pages.MyTeamsPage /> },
            { path: "my-teams/:id", element: <Pages.TeamDetailsPage /> },
            { path: "schedule", element: <Pages.MySchedulePage /> },
            { path: "schedule/:matchId", element: <Pages.MatchDetailsPage /> },
        ],
    },

    // Team Leader Routes
    {
        path: "/leader",
        element: <DashboardLayout />, // Can use a specific LeaderLayout if needed
        children: [
            { path: "teams", element: <Pages.LeaderTeamsPage /> },
            { path: "teams/create", element: <Pages.CreateTeamPage /> },
            { path: "teams/:id", element: <Pages.TeamDashboardPage /> },
            { path: "teams/:id/edit", element: <Pages.EditTeamPage /> },
            { path: "teams/:id/roster", element: <Pages.TeamRosterPage /> },
            { path: "teams/:id/requests", element: <Pages.JoinRequestsPage /> },
            { path: "teams/:id/finance", element: <Pages.TeamFinancePage /> },
            { path: "teams/:id/finance/add", element: <Pages.AddTransactionPage /> },
            { path: "teams/:teamId/matches", element: <Pages.MatchListPage /> },
            { path: "teams/:teamId/matches/create", element: <Pages.CreateMatchPage /> },
            { path: "teams/:teamId/matches/invitations", element: <Pages.MatchInvitationsPage /> },
            { path: "teams/:teamId/matches/:matchId", element: <Pages.LeaderMatchDetailsPage /> },
            { path: "teams/:teamId/matches/:matchId/attendance", element: <Pages.MatchAttendancePage /> },
        ],
    },

    // Field Owner Routes
    {
        path: "/owner",
        element: <DashboardLayout />, // Can use a specific OwnerLayout if needed
        children: [
            { path: "fields", element: <Pages.OwnerFieldsPage /> },
            { path: "fields/create", element: <Pages.RegisterFieldPage /> },
            { path: "fields/:id", element: <Pages.FieldDashboardPage /> },
            { path: "fields/:id/edit", element: <Pages.EditFieldPage /> },
            { path: "fields/:id/photos", element: <Pages.FieldPhotosPage /> },
            { path: "fields/:id/pricing", element: <Pages.FieldPricingPage /> },
            { path: "fields/:id/calendar", element: <Pages.BookingCalendarPage /> },
            { path: "bookings", element: <Pages.BookingDashboardPage /> },
            { path: "bookings/requests", element: <Pages.BookingRequestsPage /> },
            { path: "bookings/:id", element: <Pages.BookingDetailsPage /> },
        ],
    },

    // Moderator Routes
    {
        path: "/mod",
        element: <DashboardLayout />, // Can use a specific ModLayout if needed
        children: [
            { index: true, element: <Pages.ModDashboardPage /> },
            { path: "teams", element: <Pages.PendingTeamsPage /> },
            { path: "teams/:id", element: <Pages.TeamReviewPage /> },
            { path: "fields", element: <Pages.PendingFieldsPage /> },
            { path: "fields/:id", element: <Pages.FieldReviewPage /> },
            { path: "reports", element: <Pages.ReportedContentPage /> },
            { path: "reports/:id", element: <Pages.ReportDetailsPage /> },
            { path: "history", element: <Pages.ModerationHistoryPage /> },
            { path: "users", element: <Pages.UserListPage /> },
            { path: "users/:id", element: <Pages.UserDetailsPage /> },
        ],
    },

    // Fallback
    { path: "*", element: <Pages.NotFoundPage /> },
]);
