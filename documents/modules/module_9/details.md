## Module Goal (Execution Perspective)

Ensure **timely, reliable, and context-aware notifications** for all user-facing events, keeping users informed of critical actions and status changes across the platform.

---

## 1. Notification Types Tasks

### 1.1 System Events

* Account-related:

  * Registration completed
  * Email verified
  * Password reset
  * Role/status changes
* Provider application updates:

  * Application submitted
  * Approved / Rejected
* Request-related:

  * New direct request received
  * Public request posted
  * Proposal received
  * Proposal accepted/rejected
  * Request expired or cancelled
* Project-related:

  * Project created
  * Milestone or deliverable updates (Phase 1 basic)
  * Project completion (Phase 1 basic)

---

### 1.2 Communication Messages

* Trigger notifications for:

  * New message in request/project context
  * Attachment uploads (if implemented)
* Ensure sender/recipient visibility context is enforced

---

## 2. Delivery Channels Tasks

### 2.1 Real-Time Notifications

* Display notifications within the platform interface
* Ensure visibility on login or active session
* Maintain read/unread status

### 2.2 Email Notifications

* Send email for critical events (Phase 1: registration, proposal acceptance, application decisions)
* Include essential context in the email
* Avoid sending redundant or excessive messages

---

## 3. Notification Lifecycle Tasks

### 3.1 Creation

* Generate notification automatically upon event trigger
* Attach:

  * Relevant entity (request, project, proposal)
  * Timestamp
  * Event type and description

### 3.2 Read/Unread Handling

* Track read/unread state per user
* Mark as read upon viewing notification
* Ensure read state does not affect delivery for other channels

### 3.3 Expiration & Archival

* Retain notifications for a configurable period (Phase 1: platform default)
* Remove expired or obsolete notifications from active list
* Allow historical review if needed (Phase 2 enhancement)

---

## 4. Context & Access Tasks

* Ensure only relevant users receive the notification:

  * Request notifications → associated client and approved providers
  * Project notifications → associated client and provider(s)
  * System notifications → intended recipients only
* Avoid leakage of sensitive or irrelevant data

---

## 5. Error & Edge Case Handling

* User offline during notification trigger
* Duplicate notifications due to repeated events
* Missing event context
* User unsubscribed from email notifications
* Expired entities (deleted request/project) triggering notifications

---

## 6. Technical Realization & API Reference

### 6.1 Notification Architecture
**Logic**:
*   **Trigger**: Event-driven (e.g., `ProposalCreated`, `MessageReceived`).
*   **Channels**:
    1.  **In-App/Database**: Persistent record `Notification` entity.
    2.  **Real-time**: Socket.IO event `notification:new` emitted to specific user ID room.
    3.  **Email**: Sent via `EmailService` (SendGrid/Nodemailer) for high-priority events.
*   **Grouping**: Notifications support grouping by entity (e.g., "5 new messages in Project X").

**API Endpoints (Notification Module)**:
*   `GET /api/notifications` - Get paginated list of notifications.
    *   *Query Params*: `page`, `limit`, `type` (optional).
*   `GET /api/notifications/unread-count` - Get count of unread items (for UI badges).
*   `PATCH /api/notifications/read-all` - Mark all visible notifications as read.
*   `PATCH /api/notifications/:id/read` - Mark specific notification as read.
*   `DELETE /api/notifications/:id` - Delete notification (Hide from view).

