# Module 7: Teaching & Scheduling - Implementation Specification

Enable teaching providers to define available time slots, allow students to book sessions, and manage the full session lifecycle.

---

## Design Decisions

### Payment Model
- **Pay-per-session**: Students pay individually when booking
- Uses existing `Payment` model via `SessionPayment` join table
- Price calculated: `hourlyRate × (durationMinutes / 60)`
- Examples: 30 min @ $60/hr = $30, 90 min @ $60/hr = $90

### Slot Model
- **Specific date slots**: Tutor adds "Jan 20, 10:00-11:00" (not patterns)
- **Week-by-week management**: Week 1 required, weeks 2-4 optional
- **Different per week**: Tutor can have different slots each week
- **Max 4 weeks ahead**: Cannot add slots beyond 4 weeks from today
- **Timezone**: Each slot stores tutor's timezone for conversion
- **Duration**: Stored as `durationMinutes` for pricing calculation
- **Cleanup**: Past unreserved slots deleted daily by background job

### Cancellation Policy
- **Tutor cancels**: All students get full refund immediately
- **Student cancels**: Student gets full refund immediately
- No cancellation deadline in Phase 1
- Payment status changes to `REFUNDED`

### Collaboration Rules
| Session Type | Chat | Files |
|--------------|------|-------|
| GROUP | ❌ No chat | Tutor-only upload |
| ONE_TO_ONE | ✅ Chat enabled | Both can upload |

### Reviews
- Deferred to next module
- Will integrate with teaching sessions after completion

---

## 1. Slot Management

### 1.1 Create Slots
- Tutor creates slots with:
  - Specific date (`slotDate`)
  - Start time (`startTime` in HH:mm format)
  - End time (`endTime` in HH:mm format)
  - Duration in minutes (`durationMinutes`)
  - Session type: `ONE_TO_ONE` or `GROUP`
  - Max participants (1 for 1-to-1, up to 20 for group)
  - Timezone (tutor's local timezone)
- Multiple slots per day allowed
- No overlapping times on same day
- Max 4 weeks ahead from current date

### 1.2 Weekly Organization
- Week 1 (current week): Required
- Weeks 2, 3, 4: Optional, can have different slots
- Tutor can add/modify/delete slots for future weeks anytime
- Past slots cannot be modified or deleted

### 1.3 Slot Cleanup Job
- Background job runs daily (recommended: 2 AM server time)
- Deletes slots where:
  - `slotDate` < today
  - No session created (not booked)
- Preserves:
  - Slots with booked sessions (for history)
  - Future slots

---

## 2. Booking

### 2.1 Slot Selection by Students
- Student views tutor's available slots
- Shows slots for next 4 weeks (based on tutor's availability)
- Time displayed in student's timezone (converted from slot timezone)
- Filters available:
  - Date range
  - Session type (1-to-1 or group)

### 2.2 Booking Flow (One-to-One)
1. Student selects available slot
2. System calculates price: `hourlyRate × (duration/60)`
3. Student proceeds to payment (Stripe)
4. On payment success:
   - Create `TeachingSession` linked to slot
   - Create `SessionParticipant` for student
   - Create `SessionPayment` linking participant to payment
   - Slot marked as unavailable
5. Notify tutor via Socket.IO + email

### 2.3 Booking Flow (Group Session)
1. Student selects group slot
2. System checks current participant count < maxParticipants
3. Price same as 1-to-1: `hourlyRate × (duration/60)`
4. On payment success:
   - Create or reuse `TeachingSession` for slot
   - Add `SessionParticipant` for student
   - Create `SessionPayment` linking participant to payment
5. Slot remains available until `maxParticipants` reached
6. Notify tutor of new participant

---

## 3. Cancellation & Refunds

### 3.1 Student Cancels
- Student can cancel anytime before session starts
- Full refund processed immediately
- `SessionParticipant.status` → `CANCELLED`
- `Payment.status` → `REFUNDED`
- For group sessions: spot opens for others
- For 1-to-1 sessions: slot becomes available again
- Notify tutor via Socket.IO

### 3.2 Tutor Cancels
- Tutor can cancel anytime before session starts
- All participants get full refund
- All `SessionParticipant.status` → `CANCELLED`
- All associated `Payment.status` → `REFUNDED`
- `TeachingSession.status` → `CANCELLED`
- Notify all participants via Socket.IO + email

---

## 4. Session Lifecycle

### 4.1 Session States
- `SCHEDULED`: Session booked, waiting for start time
- `IN_PROGRESS`: Session started by tutor
- `COMPLETED`: Session ended successfully
- `CANCELLED`: Session cancelled before start
- `NO_SHOW`: Tutor or all students didn't attend

### 4.2 Session Start
1. Session time arrives
2. Tutor clicks "Start Session"
3. System generates Agora channel name + tokens
4. `TeachingSession.status` → `IN_PROGRESS`
5. `TeachingSession.startedAt` → current time
6. Students receive notification and can join
7. `SessionAttendance` records join time for each participant

### 4.3 Session End
1. Tutor clicks "End Session"
2. `TeachingSession.status` → `COMPLETED`
3. `TeachingSession.completedAt` → current time
4. `SessionAttendance.leftAt` → recorded for all
5. Notify participants session has ended

---

## 5. Session Collaboration

### 5.1 Group Sessions
- **Chat**: Disabled - no messaging between participants
- **Files**: Tutor-only upload
  - Tutor can share materials (PDFs, slides, etc.)
  - Students can only view/download
- **Video**: All participants can join (up to 20)

### 5.2 One-to-One Sessions
- **Chat**: Enabled - student and tutor can message
  - Uses `SessionConversation` + `SessionMessage` models
  - Real-time via Socket.IO
- **Files**: Both can upload
  - Both tutor and student can share files
  - Uses `SessionFile` model
- **Video**: Standard 1-on-1 video call

---

## 6. Timezone Handling

### 6.1 Storage
- `TeachingSlot.timezone`: Stores tutor's timezone (e.g., "America/New_York")
- Times stored as-is in tutor's local time

### 6.2 Display Conversion
- Backend provides slot times in tutor's timezone
- Frontend converts to student's local timezone for display
- Booking confirmation shows both timezones for clarity

---

## 7. Database Models

### TeachingSlot
- `id`, `providerProfileId`
- `slotDate` (specific date)
- `startTime`, `endTime` (HH:mm)
- `durationMinutes`
- `sessionType` (ONE_TO_ONE, GROUP)
- `maxParticipants`
- `timezone`
- `createdAt`, `updatedAt`

### TeachingSession
- `id`, `slotId`, `instructorId`
- `status` (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW)
- `channelName` (for Agora video)
- `startedAt`, `completedAt`
- `createdAt`, `updatedAt`

### SessionParticipant
- `id`, `sessionId`, `userId`
- `status` (BOOKED, CANCELLED, REFUNDED)
- `bookedAt`

### SessionPayment
- `id`, `paymentId`, `participantId`
- Links to existing `Payment` model

### SessionAttendance
- `id`, `sessionId`, `userId`
- `joinedAt`, `leftAt`

### SessionFile
- `id`, `sessionId`, `fileId`, `uploaderId`
- Links to existing `File` model

### SessionConversation
- `id`, `sessionId`
- Only created for ONE_TO_ONE sessions

### SessionMessage
- `id`, `conversationId`, `senderId`
- `content`, `createdAt`

---

## 8. API Endpoints

### Slots
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/teaching/slots` | Create slot(s) |
| GET | `/api/teaching/slots/my` | Get tutor's slots |
| GET | `/api/teaching/slots/provider/:id` | Get provider's public slots |
| PATCH | `/api/teaching/slots/:id` | Update slot |
| DELETE | `/api/teaching/slots/:id` | Delete slot |

### Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/teaching/sessions/book` | Book slot & pay |
| GET | `/api/teaching/sessions/my` | Student's sessions |
| GET | `/api/teaching/sessions/instructor` | Tutor's sessions |
| GET | `/api/teaching/sessions/:id` | Session details |
| PATCH | `/api/teaching/sessions/:id/start` | Start session |
| PATCH | `/api/teaching/sessions/:id/complete` | End session |
| PATCH | `/api/teaching/sessions/:id/cancel` | Cancel session |

### Files (for sessions)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/teaching/sessions/:id/files` | Upload file |
| GET | `/api/teaching/sessions/:id/files` | List files |
| DELETE | `/api/teaching/sessions/:id/files/:fileId` | Delete file |

### Messages (1-to-1 only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/teaching/sessions/:id/messages` | Send message |
| GET | `/api/teaching/sessions/:id/messages` | Get messages |

---

## 9. Notifications

### Socket.IO Events
- `session:booked` - New booking notification
- `session:cancelled` - Cancellation notification
- `session:starting` - Session about to start
- `session:started` - Session has started
- `session:ended` - Session has ended
- `session:message` - New chat message (1-to-1)
- `session:file` - New file uploaded

### Email Notifications
- Booking confirmation
- Session reminder (24h, 1h before)
- Cancellation notice
- Session completion summary

---

## 10. Error & Edge Case Handling

- Student tries to book past slot → Reject
- Student tries to book beyond 4 weeks → Reject
- Student tries to book full group session → Reject with "Session full"
- Overlapping slot creation → Reject with specific error
- Tutor no-show → System marks as NO_SHOW after 15 min
- Network failure during session → Session state preserved, can rejoin

---

## 11. Module Completion Criteria

Module 7 is complete when:
- Tutors can add specific date slots for up to 4 weeks
- Different slots per week are supported
- Students can book and pay per session
- Price is calculated from hourly rate and duration
- Timezone conversion works correctly
- Full refund on cancellation (both parties)
- Session lifecycle works (start/complete/cancel)
- Chat works for 1-to-1 sessions only
- Files upload with correct permissions
- Past unreserved slots are cleaned up automatically
- Notifications sent for all events
