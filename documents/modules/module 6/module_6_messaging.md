## Module Goal (Execution Perspective)

Enable **real-time, context-bound communication** between clients and providers during the project lifecycle while preserving **history, auditability, and boundaries**.

> **Status: IMPLEMENTED** - Full real-time WebSocket support via Socket.IO

---

## 1. Message Entry Tasks

### 1.1 Contextual Messaging ✅

* Messages sent **only within Project context** (post-deal approval)
* Conversation created when project starts (after proposal acceptance)
* Only project participants (client + provider) can message each other
* Sender and timestamp included automatically

---

### 1.2 Text Message Tasks ✅

* Text input for communication
* Maximum character limit (5000 chars)
* Empty/invalid message prevention

---

## 2. Conversation Management Tasks

### 2.1 Message Ordering ✅

* Chronological order maintained
* Last-message preview in conversation list

---

### 2.2 Conversation History ✅

* Full message history preserved
* Read-only viewing for past messages

---

### 2.3 Read Receipts & Status ✅

* Real-time read status tracking via `message:read` event
* Conversation-wide read status via `conversation:read` event

---

## 3. Real-Time Interaction Tasks

### 3.1 Message Delivery ✅ **REAL-TIME**

* **WebSocket real-time delivery** via Socket.IO
* `message:new` event broadcasts instantly to participants
* Offline users receive messages when reconnecting

---

### 3.2 Typing Indicators ✅

* `conversation:typing` event for real-time typing status

---

### 3.3 Notification Integration ✅

* Notifications trigger for new messages
* Project reference included in notification

---

## 4. Access & Permissions Tasks ✅

* Only project participants can send/receive messages
* Authorization verified at service layer

---

## 5. Socket Events

| Client → Server | Server → Client |
|-----------------|-----------------|
| `conversation:join` | `message:new` |
| `conversation:leave` | `message:read` |
| `conversation:typing` | `conversation:read` |
| `conversation:markRead` | `conversation:typing` |

---

## 6. Module Completion Criteria ✅

* ✅ Real-time message send/receive within project conversations
* ✅ Conversation history preserved and ordered
* ✅ Participants restricted to project members
* ✅ Real-time read receipts
* ✅ Typing indicators
* ✅ Notifications for new messages
