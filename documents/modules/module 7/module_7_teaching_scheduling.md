# Module 7: Teaching & Scheduling

---

## 1. Module Objective

The objective of the Teaching & Scheduling module is to enable **structured educational service delivery** for providers offering teaching services. This module defines how instructors publish availability, how students book sessions, and how teaching sessions are managed from booking to completion.

This module ensures that:

- Teaching services are scheduled, not ad-hoc
- Availability is provider-controlled and transparent
- Sessions are booked only after payment rules are satisfied
- Group session limits are enforced
- Session outcomes integrate with project completion and ratings

---

## 2. Module Scope Definition

### Included Capabilities

- Instructor availability management (weekly schedule)
- One-to-one session booking
- Group session booking (up to 20 participants)
- Session capacity enforcement
- Session lifecycle management
- Teaching session linkage to payments
- Attendance tracking

### Explicitly Excluded (Phase 1)

- In-platform video streaming implementation
- Automatic rescheduling
- Recorded session playback
- Multi-instructor sessions
- Course bundles or curricula

---

## 3. User Types Involved

- **Student (Client)**: Books sessions, attends, confirms completion
- **Instructor (Provider)**: Publishes availability, conducts sessions
- **System**: Enforces schedules, capacity, and state transitions

---

## 4. Teaching Service Eligibility Rules

- Only providers approved for the **Teaching** service category can access this module
- Teaching sessions must be linked to:
  - An accepted proposal, or
  - A public teaching offering

---

## 5. Availability Management

### 5.1 Weekly Availability Definition

**Instructor Capabilities**

- Define available time slots per week
- Specify:
  - Day of week
  - Start and end time
  - Session type (1-to-1 or group)

**Rules**

- Availability cannot overlap
- Changes do not affect already booked sessions

---

## 6. Session Booking

### 6.1 One-to-One Session Booking

**Scenario**

1. Student selects an instructor
2. Student views available slots
3. Student selects a time slot
4. Payment requirements are validated
5. Session is booked

**Acceptance Criteria**

- Slot becomes unavailable after booking
- Both parties receive confirmation

---

### 6.2 Group Session Booking

**Scenario**

1. Instructor creates a group session slot
2. Students book until capacity is reached
3. Booking closes automatically at capacity

**Rules**

- Maximum participants: **20**
- Instructor must be present for session start

---

## 7. Session Lifecycle

### Session States

- Scheduled
- In Progress
- Completed
- Cancelled
- No-Show

---

## 8. Core Scenarios

### 8.1 Session Start

**Scenario**

1. Session start time is reached
2. System marks session as `In Progress`
3. Session access is enabled

---

### 8.2 Session Completion

**Scenario**

1. Instructor ends session
2. Session marked as `Completed`
3. Completion is recorded

---

### 8.3 Cancellation Handling

**Rules**

- Instructor cancellations are logged
- Student cancellations before session start result in no penalties in Phase 1

---

## 9. Status Tracking & Visibility

### Student View

- Upcoming sessions
- Session status
- Instructor details

### Instructor View

- Teaching schedule
- Booked sessions
- Attendance records

---

## 10. Error & Edge Case Handling

### Covered Scenarios

- Double booking attempt
- Booking past availability cutoff
- Instructor no-show
- Student joins after session start
- Capacity overflow attempt

---

## 11. Dependencies

- IAM module (role and service enforcement)
- Provider Profile module
- Payments & Escrow module
- Project Workspace module (for session linkage)
- Notification system

---

## 12. Module Exit Criteria

This module is considered complete when:

- Instructors can manage availability
- Students can book sessions reliably
- Group capacity limits are enforced
- Session lifecycle transitions are consistent
- Attendance and completion are recorded

At this point, the platform supports **structured teaching service delivery** within Ph