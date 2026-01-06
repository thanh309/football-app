# Batch 6: Field Owner Use Cases - Sequence Diagrams

---

## Use Case: Create Field Profile (UC-FO-01)

### Actors
- Primary: Field Owner
- Secondary: Moderator (Receiver of notification)

### Components
- UI/Boundary: FieldCreationForm
- Controllers: FieldController (`field_controller.create_field`)
- Services: FieldService (`FieldService.create_field`)
- Dependencies: `get_current_user`
- Displays: SuccessMessageDisplay, ErrorMessageDisplay
- Entities: FieldProfile, Notification

### Sequence Flow (Detailed)
1. The Field Owner initiates the interaction by selecting "Register New Field".
2. The system instantiates `FieldCreationForm` using `<<create>>`.
3. The Field Owner enters details (name, location, amenities, pricing) and uploads photos.
4. The `get_current_user` dependency verifies the JWT.
5. The FieldController calls `FieldService.create_field(owner_id, field_name, location, default_price_per_hour, capacity)`.
6. The service creates a new `FieldProfile` entity using `<<create>>` with status `PENDING`.
7. The system displays `SuccessMessageDisplay` and redirects to the field management dashboard.

---

## Use Case: Edit Field Profile (UC-FO-02)

### Actors
- Primary: Field Owner
- Secondary: Moderator (If re-verification needed)

### Components
- UI/Boundary: FieldManagementView, FieldEditForm
- Controllers: FieldController (`field_controller.update_field`)
- Services: FieldService (`FieldService.update_field`)
- Dependencies: `get_current_user`
- Displays: SuccessMessageDisplay
- Entities: FieldProfile, Notification

### Sequence Flow (Detailed)
1. The Field Owner selects a field in FieldManagementView via `GET /api/fields/{field_id}`.
2. The system instantiates `FieldEditForm` using `<<create>>` with current data.
3. The Field Owner modifies details and clicks "Save".
4. The `get_current_user` dependency verifies the JWT.
5. The FieldController calls `FieldService.get_field_by_id()` and verifies `field.owner_id == user.user_id`.
6. The controller calls `FieldService.update_field(field, **update_data)` to update `FieldProfile` entity.
7. The system displays `SuccessMessageDisplay`.

---

## Use Case: View Booking Requests (UC-FO-03)

### Actors
- Primary: Field Owner

### Components
- UI/Boundary: BookingRequestList
- Controllers: BookingController (`booking_controller.get_owner_pending_bookings`)
- Services: BookingService, FieldService
- Displays: EmptyStateDisplay
- Entities: BookingRequest

### Sequence Flow (Detailed)
1. The Field Owner navigates to "Booking Management" via `GET /api/bookings/owner/pending`.
2. The `get_current_user` dependency verifies the JWT.
3. The controller calls `FieldService.get_fields_by_owner(user.user_id)` to get all owner's fields.
4. For each field, the controller calls `BookingService.get_bookings_by_field(field_id, status=PENDING)`.
5. If no pending requests:
   - The system instantiates `EmptyStateDisplay` using `<<create>>` with "No new booking requests".
6. If requests exist:
   - The system displays the list with summary details (Team Name, Date, Time Slot).
7. The Field Owner selects a request to view details.

---

## Use Case: Response Booking Requests (UC-FO-04)

### Actors
- Primary: Field Owner
- Secondary: Team Leader (Receiver of notification)

### Components
- UI/Boundary: BookingDetailView
- Controllers: BookingController (`booking_controller.approve_booking`, `booking_controller.reject_booking`)
- Services: BookingService, FieldService
- Dependencies: `get_current_user`
- Displays: SuccessMessageDisplay, ConflictWarningDisplay
- Entities: BookingRequest, FieldCalendar, Notification

### Sequence Flow (Detailed)
1. The Field Owner views a pending request via `GET /api/bookings/{booking_id}`.
2. The Field Owner clicks "Approve" or "Reject".
3. For Approve: `PUT /api/bookings/{booking_id}/approve`
   - The controller calls `BookingService.get_booking_by_id()` and `FieldService.get_field_by_id()`.
   - The controller verifies `field.owner_id == user.user_id`.
   - The controller calls `BookingService.approve_booking(booking)` which updates `BookingRequest.status` to `CONFIRMED`.
4. For Reject: `PUT /api/bookings/{booking_id}/reject`
   - The controller calls `BookingService.reject_booking(booking)` which updates `BookingRequest.status` to `REJECTED`.
5. The system displays `SuccessMessageDisplay`.

---

## Use Case: Manage Booking Calendar (UC-FO-05)

### Actors
- Primary: Field Owner
- Secondary: Team Leader (If booking cancelled)

### Components
- UI/Boundary: CalendarView, SlotDetailView
- Controllers: FieldController (`get_calendar`, `block_calendar_slot`, `unblock_calendar_slot`)
- Services: FieldService
- Dependencies: `get_current_user`
- Displays: ConfirmationDialog, SuccessMessageDisplay
- Entities: FieldCalendar, BookingRequest, Notification

### Sequence Flow (Detailed)
1. The Field Owner opens CalendarView via `GET /api/fields/{field_id}/calendar?startDate=X&endDate=Y`.
2. The system displays the calendar with "Booked", "Available", and "Blocked" slots.
3. To block a slot: `POST /api/fields/{field_id}/calendar/block` with `CalendarBlockRequest`.
   - The controller verifies `field.owner_id == user.user_id`.
   - The controller creates a `FieldCalendar` entity using `<<create>>` with status `BLOCKED`.
4. To unblock a slot: `PUT /api/fields/calendar/{calendar_id}/unblock`.
   - The controller verifies ownership and `slot.status == BLOCKED`.
   - The controller deletes the `FieldCalendar` entity.
5. The system displays `SuccessMessageDisplay` and refreshes the calendar.

---

## Summary Table

| Use Case | HTTP Endpoint | Controller | Service | Key Entities |
|----------|---------------|------------|---------|--------------|
| UC-FO-01 Create Field | `POST /api/fields` | `field_controller.create_field` | `FieldService.create_field` | FieldProfile |
| UC-FO-02 Edit Field | `PUT /api/fields/{id}` | `field_controller.update_field` | `FieldService.update_field` | FieldProfile |
| UC-FO-03 View Bookings | `GET /api/bookings/owner/pending` | `get_owner_pending_bookings` | BookingService, FieldService | BookingRequest |
| UC-FO-04 Response Bookings | `PUT /api/bookings/{id}/approve` | `approve_booking`, `reject_booking` | BookingService | BookingRequest |
| UC-FO-05 Manage Calendar | `GET/POST /api/fields/{id}/calendar` | `get_calendar`, `block_calendar_slot` | FieldService | FieldCalendar |
