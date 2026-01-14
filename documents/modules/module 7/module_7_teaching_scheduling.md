## Module 7: Teaching & Scheduling

**Implementation Task Deep Dive**

---

## 1. Slot Management System

### 1.1 Availability Definition

* **Time Slot Creation**: Providers create specific date/time slots with duration and session type (1-to-1 / Group).
* **Validation Rules**:
    * No past dates allowed.
    * Max 4 weeks ahead scheduling window.
    * No overlapping slots for the same provider.
    * Max participants enforcement for Group sessions (limit 20).

### 1.2 Slot Lifecycle

* **Cleanup**: Expired, unbooked slots are automatically removable (method exists).
* **Updates**: Modification allowed only if no bookings exist.

---

## 2. Booking & Payment Integration

### 2.1 Booking Flow

* **Instant Booking**: Students book directly by paying.
* **Pricing**: Dynamic calculation based on `hourlyRate * durationMinutes`.
* **Stripe Integration**: `SessionService.bookSession` creates a Stripe PaymentIntent for the exact amount.
* **Concurrency Control**: prevents double-booking of 1-to-1 slots and enforces capacity for group slots.

### 2.2 Payment State

* Booking remains tentative until Payment confirmation.
* `confirmBooking` finalizes the `TeachingSession` and `SessionParticipant` records upon successful payment.

---

## 3. Session Lifecycle Management

### 3.1 Session Execution

* **Start**: Instructor starts session -> Status `IN_PROGRESS` -> Agora Channel creation.
* **End**: Instructor ends session -> Status `COMPLETED` -> Attendance logs sealed.
* **Attendance**: `SessionService.joinSession` and `leaveSession` track participant join/leave times.

### 3.2 Cancellation & Refunds

* **Instructor Cancel**: Triggers full refund for ALL participants via `stripe.refunds.create`.
* **Student Cancel**: Triggers refund for the individual student via `stripe.refunds.create`.
* **State Updates**: Updates `Payment` status to `REFUNDED` and Session/Participant status to `CANCELLED`.

---

## 4. Collaboration Tools

* **Conversation**: 1-to-1 sessions automatically generate a `Conversation` for chat.
* **Video**: Agora token generation integrated for secure video access.

---

## 5. Implementation Status (Updated)

**Implemented:**

*   **Full Booking System**: `SessionService` and `SlotService` provide a complete flow from availability to booking.
*   **Stripe Payments & Refunds**: This is one of the most complete payment implementations, with direct calls to `stripe.paymentIntents` and `stripe.refunds`.
*   **Agora Video Integration**: `TeachingSession` creates unique Agora channels and generates secure tokens for participants.
*   **Capacity Management**: Group limits and 1-to-1 exclusivity are enforced strictly.
*   **Automatic Chat**: 1-to-1 bookings automatically initialize a chat conversation.

**Missing Functionalities:**

*   **Recurring Availability**: The "Weekly" concept mentioned in high-level docs is implemented as "Specific Date Slots". There is no "Pattern" (e.g., "Every Monday") logic visible; providers must create slots for specific dates.
*   **Notifications**: While Socket events are present (`session:booked`), email notifications (reminder emails) mentioned in the docs are likely handled by a generic notification service not fully inspected here or marked as TODO in other modules.