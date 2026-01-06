# Batch 1: Authentication & Account Use Cases - Sequence Diagrams

---

## Use Case: Register (UC-AU-01)

### Actors
- Primary: User (Player, Team Leader, or Field Owner)

### Components
- UI/Boundary: RegistrationForm
- Controllers: AuthController (`auth_controller.register`)
- Services: AuthService (`AuthService.register`)
- Displays: SuccessMessageDisplay, ErrorMessageDisplay
- Entities: UserAccount, PlayerProfile

### Sequence Flow (Detailed)
1. The User initiates the interaction by selecting "Register" from the home screen.
2. The system instantiates `RegistrationForm` using `<<create>>`.
3. The User enters credentials (username, email, password) and selects role(s).
4. The AuthController validates input via `AuthService.register()` which calls `UserRepository.find_by_username()` and `UserRepository.find_by_email()` for uniqueness.
5. If validation fails (duplicate username/email):
   - The controller creates `ErrorMessageDisplay` using `<<create>>`.
6. If validation succeeds:
   - The service creates a new `UserAccount` entity using `<<create>>` with `hash_password(password)`.
   - If role includes "Player", a `PlayerProfile` is created using `<<create>>`.
   - JWT tokens are generated via `create_access_token()` and `create_refresh_token()`.
   - The system displays `SuccessMessageDisplay`.
7. The system finalizes by redirecting to the role-specific dashboard.

---

## Use Case: Login (UC-AU-02)

### Actors
- Primary: All registered users

### Components
- UI/Boundary: LoginForm
- Controllers: AuthController (`auth_controller.login`)
- Services: AuthService (`AuthService.login`)
- Displays: ErrorMessageDisplay
- Entities: UserAccount

### Sequence Flow (Detailed)
1. The User initiates the interaction by entering username and password in `LoginForm`.
2. The User clicks "Login".
3. The AuthController calls `AuthService.login()` which retrieves `UserAccount` via `UserRepository.find_by_username()`.
4. The service verifies password using `verify_password(password, user.password_hash)`.
5. If invalid credentials or account is not ACTIVE:
   - The controller creates `ErrorMessageDisplay` using `<<create>>`.
6. If valid:
   - JWT tokens are generated via `create_access_token()` and `create_refresh_token()`.
   - The system redirects the User to the role-specific dashboard.

---

## Use Case: Logout (UC-AU-03)

### Actors
- Primary: Authenticated User

### Components
- UI/Boundary: NavigationBar
- Controllers: AuthController (`auth_controller.logout`)
- Dependencies: `get_current_user` (JWT verification)
- Entities: UserAccount

### Sequence Flow (Detailed)
1. The User initiates the interaction by clicking "Logout".
2. The AuthController receives the request with JWT token in Authorization header.
3. The `get_current_user` dependency verifies the token via `verify_access_token()`.
4. The controller returns `MessageResponse(message="Logged out successfully")`.
5. Client-side clears stored tokens from storage.
6. The system redirects the User to the Login page.

---

## Use Case: Change Password (UC-AU-04)

### Actors
- Primary: Authenticated User

### Components
- UI/Boundary: PasswordChangeForm
- Controllers: AuthController (`auth_controller.change_password`)
- Services: AuthService (`AuthService.change_password`)
- Dependencies: `get_current_user` (JWT verification)
- Displays: SuccessMessageDisplay, ErrorMessageDisplay
- Entities: UserAccount

### Sequence Flow (Detailed)
1. The User initiates the interaction by opening `PasswordChangeForm`.
2. The User enters current password and new password.
3. The `get_current_user` dependency verifies the JWT and retrieves `UserAccount`.
4. The AuthController calls `AuthService.change_password()` which verifies current password via `verify_password()`.
5. If incorrect:
   - The controller creates `ErrorMessageDisplay` using `<<create>>`.
6. If correct:
   - The service updates `UserAccount.password_hash` using `hash_password(new_password)`.
   - The service commits via `UserRepository.update()` and `UserRepository.commit()`.
   - The system displays `SuccessMessageDisplay`.
7. The system finalizes by clearing the form.

---

## Summary Table

| Use Case | HTTP Endpoint | Controller | Service | Key Entities |
|----------|---------------|------------|---------|--------------|
| UC-AU-01 Register | `POST /api/auth/register` | `auth_controller.register` | `AuthService.register` | UserAccount, PlayerProfile |
| UC-AU-02 Login | `POST /api/auth/login` | `auth_controller.login` | `AuthService.login` | UserAccount |
| UC-AU-03 Logout | `POST /api/auth/logout` | `auth_controller.logout` | N/A | UserAccount |
| UC-AU-04 Change Password | `PUT /api/auth/password` | `auth_controller.change_password` | `AuthService.change_password` | UserAccount |
