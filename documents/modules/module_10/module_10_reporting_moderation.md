## Module 10: Reporting & Moderation

**Implementation Task Deep Dive**

---

## 1. Reporting System

### 1.1 Submission

*   **Report Creation**: Users can submit reports with category, description, and target (User/Project/etc.).
*   **Validation**: Enforces description length and required fields.
*   **Feedback**: Automatically notifies the reporter via `NotificationService` that the report is received.

### 1.2 Admin Workflow

*   **Status Management**: Admins can transition reports through a defined workflow (`SUBMITTED` -> `UNDER_REVIEW` -> `RESOLVED` / `DISMISSED`).
*   **Action Logging**: Every status change or action is logged in `ReportAction` table for audit trails.

---

## 2. Moderation Actions

### 2.1 Enforcement Actions

*   **Warning**: Sends a system notification to the target user.
*   **Suspension**: Updates user status to `SUSPENDED` and notifies them.
*   **Ban**: Updates user status to `BANNED` (permanently suspended) and notifies them.
*   **Notification**: Both the reporter and the target (if punished) receive system notifications about the outcome.

---

## 3. Implementation Status (Updated)

**Implemented:**

*   **Full Reporting Lifecycle**: Submission, Admin View, Status Updates, Outcomes.
*   **Action Execution**: The service directly modifies User status (Suspend/Ban) and integrates with Notifications.
*   **Audit Logging**: All admin actions are recorded.
