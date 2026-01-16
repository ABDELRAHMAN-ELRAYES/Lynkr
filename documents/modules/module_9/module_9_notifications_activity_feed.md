## Module 9: Notifications & Activity Feed

**Implementation Task Deep Dive**

---

## 1. Notification System

### 1.1 Triggering & Delivery

*   **Service Layer Integration**: Dedicated `NotificationService` provides helper methods (`sendProposalNotification`, `sendProjectNotification`, etc.) used by other modules to trigger alerts.
*   **Real-time Delivery**: Integrated with `SocketService` to broadcast notifications immediately to online users via Socket.IO.
*   **Persistence**: All notifications are stored in the database for history/offline retrieval.

### 1.2 User Interaction

*   **Retrieval**: Endpoints to fetch user notifications with pagination.
*   **Read Status**: Tracking for `isRead` status, with endpoints to mark single or all notifications as read.
*   **Unread Count**: Dedicated method to fetch the badge count.

---

## 2. Activity Feed

*   **Feed Construction**: The current implementation treats the Notification list effectively as the Activity Feed. It tracks `type`, `category`, and `entityId`, allowing for filtered views if needed.
*   **Categorization**: Categories (Security, Requests, Payments, etc.) are derived from the notification type.

---

## 3. Implementation Status (Updated)

**Implemented:**

*   **Full Notification Lifecycle**: Create, Send (Socket), Store, Retrieve, Mark Read.
*   **Cross-Module Integration**: Helper methods are ready and used by Reports and other modules.
*   **Real-time**: Socket integration is verified.

**Missing Functionalities:**

*   **Email Redundancy**: The `NotificationService` currently *only* handles DB storage and Socket broadcast. It does not appear to trigger Email sending (unlike `AuthService` which uses `Email` class). Critical events (like "Account Banned" or "Payment Received") should likely trigger emails, which might be missing here if not handled at the controller/caller level.
