# Batch 8: Community & Notification Use Cases - Sequence Diagrams

---

## Use Case: Receive Notifications (UC-CM-01)

### Actors
- Primary: User

### Components
- UI/Boundary: NotificationCenter, NotificationBell, NotificationListView
- Controllers: NotificationController (`notification_controller.get_notifications`, `notification_controller.mark_as_read`, `notification_controller.mark_all_read`)
- Services: NotificationService
- Dependencies: `get_current_user`
- Displays: NotificationBadge, SuccessMessageDisplay
- Entities: Notification

### Sequence Flow (Detailed)
1. The User clicks the notification bell icon to open `NotificationCenter`.
2. The system sends `GET /api/notifications?unreadOnly=false` to fetch all notifications.
3. The `get_current_user` dependency verifies the JWT and returns the UserAccount.
4. The NotificationController calls `NotificationService.get_notifications(user_id, unread_only)`.
5. The NotificationService queries `SELECT Notification WHERE user_id = ? ORDER BY created_at DESC`.
6. The system instantiates `NotificationListView` using `<<create>>` with the list of `NotificationResponse`.
7. The User clicks on a notification to mark it as read via `PUT /api/notifications/{notification_id}/read`.
8. The NotificationService updates `Notification.is_read = true`.
9. The User may click "Mark All Read" via `PUT /api/notifications/mark-all-read`.
10. The system displays `SuccessMessageDisplay` and updates the `NotificationBadge` count.

---

## Use Case: Manage Notification Settings (UC-CM-02)

### Actors
- Primary: User

### Components
- UI/Boundary: SettingsPage, NotificationPreferencesForm
- Controllers: NotificationController (`notification_controller.get_preferences`, `notification_controller.update_preferences`)
- Dependencies: `get_current_user`
- Displays: SuccessMessageDisplay
- Entities: NotificationPreference

### Sequence Flow (Detailed)
1. The User navigates to Settings and selects "Notification Settings".
2. The system sends `GET /api/notifications/preferences` to fetch current preferences.
3. The `get_current_user` dependency verifies the JWT and returns the UserAccount.
4. The NotificationController queries `SELECT NotificationPreference WHERE user_id = ?`.
5. If no preferences exist:
   - The controller creates a `NotificationPreference` entity using `<<create>>` with default values (all enabled).
6. The system instantiates `NotificationPreferencesForm` using `<<create>>` with current settings.
7. The User toggles preferences (emailNotifications, pushNotifications, matchReminders, teamUpdates, bookingUpdates, communityUpdates).
8. The User saves changes via `PUT /api/notifications/preferences` with `NotificationPreferencesUpdate`.
9. The controller updates the `NotificationPreference` entity with the new values.
10. The system displays `SuccessMessageDisplay` confirming the changes.

---

## Use Case: Browse Public Content (UC-CI-01)

### Actors
- Primary: User (or Guest)

### Components
- UI/Boundary: CommunityFeed, PostListView, PostDetailView
- Controllers: ContentController (`content_controller.get_posts`, `content_controller.get_post`)
- Services: ContentService
- Dependencies: None (public endpoint)
- Displays: PostCard
- Entities: Post

### Sequence Flow (Detailed)
1. The User navigates to the Community section to browse posts.
2. The system sends `GET /api/posts?limit=20&offset=0` to fetch the posts feed.
3. The ContentController queries `SELECT Post WHERE is_hidden = false ORDER BY created_at DESC`.
4. The system instantiates `PostListView` using `<<create>>` with `PostCard` components for each post.
5. The User scrolls and the system paginates via `GET /api/posts?limit=20&offset=20`.
6. The User clicks on a post to view details via `GET /api/posts/{post_id}`.
7. The ContentService calls `get_post_by_id(post_id)` to fetch the full post.
8. The system instantiates `PostDetailView` using `<<create>>` with the `PostResponse`.

---

## Use Case: Create Community Posts (UC-CI-02)

### Actors
- Primary: User

### Components
- UI/Boundary: PostCreator, ImageUploader
- Controllers: ContentController (`content_controller.create_post`)
- Services: ContentService
- Dependencies: `get_current_user`
- Displays: SuccessMessageDisplay, ErrorMessageDisplay
- Entities: Post, MediaAsset

### Sequence Flow (Detailed)
1. The User clicks "Create Post" to open the `PostCreator` form.
2. The User enters content, selects visibility (PUBLIC/PRIVATE/TEAM_ONLY), and optionally attaches an image.
3. The User submits via `POST /api/posts` with `PostCreate` payload.
4. The `get_current_user` dependency verifies the JWT and returns the UserAccount.
5. The ContentController calls `ContentService.create_post(author_id, content, team_id, visibility)`.
6. The ContentService creates a `Post` entity using `<<create>>`.
7. If `imageUrl` is provided:
   - The controller creates a `MediaAsset` entity using `<<create>>` and links it to the post.
8. The system displays `SuccessMessageDisplay` and returns the new `PostResponse`.

---

## Use Case: Comment on Posts (UC-CI-03)

### Actors
- Primary: User
- Secondary: Post Author (Receiver of notification)

### Components
- UI/Boundary: PostDetailView, CommentSection, CommentInput
- Controllers: ContentController (`content_controller.get_comments`, `content_controller.add_comment`)
- Services: ContentService
- Dependencies: `get_current_user`
- Displays: CommentList, SuccessMessageDisplay
- Entities: Comment, Post

### Sequence Flow (Detailed)
1. The User opens a post in `PostDetailView`.
2. The system fetches comments via `GET /api/posts/{post_id}/comments`.
3. The ContentService calls `get_comments_by_post(post_id)` to fetch all comments.
4. The system instantiates `CommentSection` using `<<create>>` with the list of `CommentResponse`.
5. The User enters a comment in `CommentInput` and submits via `POST /api/posts/{post_id}/comments`.
6. The `get_current_user` dependency verifies the JWT and returns the UserAccount.
7. The ContentService calls `create_comment(post_id, author_id, content, parent_comment_id)`.
8. The ContentService creates a `Comment` entity using `<<create>>` and increments `Post.comment_count`.
9. The system displays the new comment in `CommentSection` and returns `CommentResponse`.

---

## Use Case: Like/React Content (UC-CI-04)

### Actors
- Primary: User
- Secondary: Post Author (Receiver of notification)

### Components
- UI/Boundary: PostCard, ReactionButton
- Controllers: ContentController (`content_controller.toggle_reaction`)
- Dependencies: `get_current_user`
- Displays: ReactionCountDisplay
- Entities: Reaction, Post

### Sequence Flow (Detailed)
1. The User clicks the reaction button on a `PostCard`.
2. The system sends `POST /api/posts/{post_id}/reactions` with `ReactionRequest(type)`.
3. The `get_current_user` dependency verifies the JWT and returns the UserAccount.
4. The ContentController queries for existing reaction via `SELECT Reaction WHERE entity_id = ? AND user_id = ?`.
5. If reaction exists with same type (toggle off):
   - The controller deletes the `Reaction` entity and decrements `Post.reaction_count`.
6. If reaction exists with different type (update):
   - The controller updates `Reaction.type` (count unchanged).
7. If no reaction exists (new reaction):
   - The controller creates a `Reaction` entity using `<<create>>` and increments `Post.reaction_count`.
8. The system updates `ReactionCountDisplay` and returns `ReactionResponse`.

---

## Use Case: Report Misconduct (UC-CI-05)

### Actors
- Primary: User
- Secondary: Moderator (Reviewer of report)

### Components
- UI/Boundary: ReportDialog, ReportForm
- Controllers: ContentController (`content_controller.create_report`)
- Dependencies: `get_current_user`
- Displays: SuccessMessageDisplay, ErrorMessageDisplay
- Entities: Report

### Sequence Flow (Detailed)
1. The User clicks "Report" on a post, comment, or user profile.
2. The system instantiates `ReportDialog` using `<<create>>` with `ReportForm`.
3. The User selects content type, provides a reason, and optionally adds details.
4. The User submits via `POST /api/posts/report` with `CreateReportRequest`.
5. The `get_current_user` dependency verifies the JWT and returns the UserAccount.
6. The ContentController parses the `contentType` string to `ReportContentType` enum.
7. If invalid content type:
   - The controller raises `HTTPException(status_code=400)`.
8. The controller creates a `Report` entity using `<<create>>` with `status=ReportStatus.PENDING`.
9. The system displays `SuccessMessageDisplay` confirming the report was submitted.

---

## Summary Table

| Use Case | HTTP Endpoint | Controller | Service | Key Entities |
|----------|---------------|------------|---------|--------------|
| UC-CM-01 Receive Notifications | `GET /api/notifications` | `notification_controller.get_notifications` | NotificationService | Notification |
| UC-CM-02 Manage Settings | `PUT /api/notifications/preferences` | `notification_controller.update_preferences` | - | NotificationPreference |
| UC-CI-01 Browse Content | `GET /api/posts` | `content_controller.get_posts` | ContentService | Post |
| UC-CI-02 Create Posts | `POST /api/posts` | `content_controller.create_post` | ContentService | Post, MediaAsset |
| UC-CI-03 Comment on Posts | `POST /api/posts/{id}/comments` | `content_controller.add_comment` | ContentService | Comment |
| UC-CI-04 Like/React | `POST /api/posts/{id}/reactions` | `content_controller.toggle_reaction` | - | Reaction, Post |
| UC-CI-05 Report Misconduct | `POST /api/posts/report` | `content_controller.create_report` | - | Report |
