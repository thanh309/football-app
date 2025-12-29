// Re-export hooks explicitly to avoid naming conflicts
export {
    useCurrentUser,
    useLogin,
    useRegister,
    useLogout,
    useChangePassword,
    useIsAuthenticated,
    authKeys
} from './useAuth';

export {
    useTeam,
    useLeaderTeams,
    usePlayerTeams,
    useSearchTeams,
    useTeamRoster,
    usePendingJoinRequests,
    useCreateTeam,
    useUpdateTeam,
    useDeleteTeam,
    useRequestJoinTeam,
    useLeaveTeam,
    useProcessJoinRequest,
    teamKeys
} from './useTeam';

export {
    usePlayerProfile,
    usePlayerByUserId,
    useMyPlayerProfile,
    useSearchPlayers,
    useUpdatePlayerProfile,
    playerKeys
} from './usePlayer';

export {
    useMatchDetails,
    useTeamMatches,
    usePlayerSchedule,
    usePendingInvitations,
    useMatchResult,
    useCreateMatch,
    useUpdateMatch,
    useCancelMatch,
    useSendInvitation,
    useRespondInvitation,
    useRecordMatchResult,
    matchKeys
} from './useMatch';

export {
    useField,
    useOwnerFields,
    useSearchFields,
    useAvailableSlots,
    useFieldPricing,
    useFieldAmenities,
    useAllAmenities,
    useCreateField,
    useUpdateField,
    useUpdateFieldPricing,
    useUpdateFieldAmenities,
    fieldKeys
} from './useField';

export {
    useBookingDetails,
    usePendingBookings,
    useOwnerPendingBookings,
    useFieldCalendar,
    useTeamBookings,
    useCreateBooking,
    useApproveBooking,
    useRejectBooking,
    useCancelBooking,
    useBlockSlot,
    useUnblockSlot,
    bookingKeys
} from './useBooking';

export {
    useMatchAttendance,
    useAttendanceStats,
    usePlayerAttendance,
    useConfirmAttendance,
    useUpdateAttendance,
    useSaveBatchAttendance,
    attendanceKeys
} from './useAttendance';

export {
    useTeamWallet,
    useTransactionHistory,
    useFinanceSummary,
    useTransactionCategories,
    useAddTransaction,
    financeKeys
} from './useFinance';

export {
    usePublicFeed,
    useInfiniteFeed,
    usePost,
    usePostComments,
    usePostReactions,
    useCreatePost,
    useUpdatePost,
    useDeletePost,
    useAddComment,
    useDeleteComment,
    useToggleReaction,
    useReportContent,
    communityKeys
} from './useCommunity';

export {
    usePendingTeams,
    useTeamForReview,
    useVerifyTeam,
    usePendingFields,
    useFieldForReview,
    useVerifyField,
    useSearchUsers,
    useUserDetails,
    useUserModerationHistory,
    useSuspendUser,
    useBanUser,
    useReactivateUser,
    usePendingReports,
    useReportDetails,
    useResolveReport,
    useDismissReport,
    useModerationHistory,
    moderationKeys
} from './useModeration';

export {
    useNotifications,
    useUnreadNotificationCount,
    useNotificationPreferences,
    useMarkAsRead,
    useMarkAllAsRead,
    useUpdateNotificationPreferences,
    notificationKeys
} from './useNotification';

// Note: Search hooks have similar names to domain-specific search hooks
// Use these for the dedicated search pages
export {
    useSearchTeams as useTeamSearch,
    useSearchFields as useFieldSearch,
    useSearchPlayers as usePlayerSearch,
    useSearchOwners,
    searchKeys
} from './useSearch';

export {
    useEntityMedia,
    useFieldPhotos,
    useUploadMedia,
    useUploadFieldPhoto,
    useDeleteMedia,
    mediaKeys
} from './useMedia';

// Note: useTeamRoster is also in useTeam, this is an alias from roster service
export {
    useTeamRoster as useRosterTeamRoster,
    usePlayerMembership,
    useAddPlayerToRoster,
    useRemovePlayerFromRoster,
    useUpdatePlayerRole,
    rosterKeys
} from './useRoster';
