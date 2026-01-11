## Module Goal (Execution Perspective)

Enable **real-time, context-bound communication** between clients and providers during the engagement lifecycle while preserving **history, auditability, and boundaries**.

---

## 1. Message Entry Tasks

### 1.1 Contextual Messaging

* Allow messages to be sent **only within defined contexts**:

  * Request (pre-acceptance)
  * Project (post-acceptance)
* Prevent messages outside these contexts
* Include sender and timestamp automatically

---

### 1.2 Text Message Tasks

* Provide input for textual communication
* Enforce:

  * Maximum character limit
  * Prohibited content (Phase 1: basic keyword blocking optional)
* Prevent empty or invalid messages

---

### 1.3 Media Attachment Tasks (Phase 1)

* Allow attachment of files during messages (optional for Phase 1)
* Validate file type and size
* Associate attachment with correct message context
* Display attachment metadata (name, type, size)

---

## 2. Conversation Management Tasks

### 2.1 Message Ordering

* Maintain chronological order of messages
* Ensure correct alignment for sender/receiver view
* Provide last-message preview in conversation list

---

### 2.2 Conversation History

* Preserve full message history for the context
* Allow read-only viewing for past messages
* Prevent message editing after sending

---

### 2.3 Read Receipts & Status

* Optional Phase 1: Track message delivery and read status
* Notify sender upon message delivery (if implemented)
* Keep system-ready for future real-time enhancements

---

## 3. Real-Time Interaction Tasks

### 3.1 Message Delivery

* Deliver messages instantly within context
* Support multiple concurrent sessions per user
* Ensure that offline users receive pending messages when reconnecting

---

### 3.2 Notification Integration

* Trigger notifications for new messages
* Include context reference (request/project)
* Respect user notification preferences (Phase 1: basic delivery only)

---

## 4. Access & Permissions Tasks

* Only participants in the conversation can send or receive messages
* Ensure blocked or suspended users cannot participate
* Maintain admin visibility (Phase 2)

---

## 5. Error & Edge Case Handling

* Attempt to send messages in invalid contexts
* User offline / connection issues
* Message duplication (retry handling)
* Attempt to attach unsupported files
* Deleted project/request during active conversation

---

## 6. Module Completion Criteria

Module 5 is complete when:

* Users can send and receive messages in valid contexts
* Conversation history is preserved and ordered
* Participants are restricted to their relevant context
* Attachments, if present, are correctly associated
* Edge cases (invalid context, deleted entities) are handled gracefully
* Notifications trigger for new messages

