# Module 7: Teaching & Scheduling

## Technical Realization & API Reference

### 7.1 Instructor Availability (Slots)
**Logic**:
*   Instructors define `Slots` (Start Time, End Time, Date).
*   Slots are associated with the `ProviderProfile`.
*   Conflict detection prevents overlapping slots for the same instructor.

**API Endpoints (Slot Module)**:
*   `POST /api/v1/teaching/slots` - Create single availability slot.
*   `POST /api/v1/teaching/slots/bulk` - Create multiple slots (e.g., recurring logic).
*   `GET /api/v1/teaching/slots/my` - List instructor's own slots.
*   `GET /api/v1/teaching/slots/provider/:providerId` - Public view of an instructor's calendar.
*   `PATCH /api/v1/teaching/slots/:id` - Update slot details.
*   `DELETE /api/v1/teaching/slots/:id` - Delete/Cancel slot.

### 7.2 Booking & Session Management
**Logic**:
*   **Booking**: Student selects a Slot -> `Session` created -> Slot marked `BOOKED`.
*   **Confirmation**: Payment must be confirmed to finalize booking (currently simulated or linked to Payment Intent).
*   **Session Lifecycle**: `SCHEDULED` -> `IN_PROGRESS` -> `COMPLETED`.
*   **Capacity**: Slots can have max attendees (default 1 for private, >1 for group).

**API Endpoints (Session Module)**:
*   `POST /api/v1/teaching/sessions/book` - Book a slot.
    *   *Payload*: `slotId`, `studentNotes`.
*   `GET /api/v1/teaching/sessions/my` - List student's scheduled sessions.
*   `GET /api/v1/teaching/sessions/instructor` - List instructor's upcoming sessions.
*   `GET /api/v1/teaching/sessions/:id` - Session details.
*   `PATCH /api/v1/teaching/sessions/:id/start` - Instructor starts session.
*   `PATCH /api/v1/teaching/sessions/:id/complete` - Mark session completed.
*   `PATCH /api/v1/teaching/sessions/:id/cancel` - Cancel session (releases Slot).
*   `POST /api/v1/teaching/sessions/:id/join` - Join active session.
*   `POST /api/v1/teaching/sessions/:id/leave` - Leave session.
