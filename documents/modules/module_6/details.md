## Module 6: Messaging, Meetings & Collaboration

**Implementation Task Deep Dive**

---

## 1. Project Creation & Setup (Cross-Module Integration)

### 1.1 Trigger Conditions

* Project creation occurs **only when a client accepts a provider proposal**
* Verify:

  * Proposal is valid and not expired
  * Provider is approved
  * Request status allows conversion to project

### 1.2 Data Capture & Term Locking

* Capture critical project information (price, scope, deadline)
* Lock proposal details to prevent retroactive changes
* Assign unique Project ID

### 1.3 Communication Context Setup

* **Auto-create Conversation**: A dedicated conversation channel must be created immediately upon project creation.
* **Participant Association**: Associate Client and Provider(s) with the conversation.

---

## 2. Messaging System (Module 6A)

### 2.1 Contextual Messaging

* Messages sent **only within active Project context**
* Sender/Receiver validation (must be project participants)
* Chronological ordering and history persistence

### 2.2 Real-Time Features

* **Real-time Delivery**: Instant message broadcasting via WebSocket (Socket.IO).
* **Typing Indicators**: Real-time status updates (`conversation:typing`).
* **Read Receipts**: Message read status events (`message:read`, `conversation:read`).

---

## 3. Video Meetings (Module 6B - Agora)

### 3.1 Meeting Management

* **Create/Schedule**: Host (Provider/Client) can schedule or start instant meetings.
* **Token Generation**: Secure Agora RtcToken generation on the server.
* **Signaling**: Socket events for Inviting (`meeting:invite`), Accepting (`meeting:accept`), and Declining (`meeting:decline`) calls.
* **Session Tracking**: Track start time, end time, and duration.

### 3.2 Access Control

* Only project participants can generate tokens for the specific meeting channel.
* Token expiration enforcement (1 hour).

---

## 4. Technical Realization & API Reference

### 4.1 Messaging Architecture
**Logic**:
*   **Initialization**: Conversation created automatically when Project is created (`ProposalService`).
*   **Real-time Layer**: Socket.IO events (`join`, `message:new`, `message:read`).
*   **Access Control**: Strictly limited to participants (Client & Provider of the project).
*   **Flow**:
    1.  User sends message (HTTP POST).
    2.  Server persists message.
    3.  Server emits socket event to room `conversation_{id}`.

**API Endpoints (Messaging Module)**:
*   `GET /api/conversations` - List all conversations.
*   `GET /api/conversations/:id` - Get conversation metadata.
*   `GET /api/conversations/project/:projectId` - Find conversation for a project.
*   `GET /api/messages/conversation/:conversationId` - Get message history (Paginated).
*   `POST /api/messages` - Send a message.
    *   *Payload*: `conversationId`, `content`, `type` (text/file).
*   `PATCH /api/messages/conversation/:conversationId/read` - Mark all as read.

### 4.2 Video Meetings (Agora)
**Logic**:
*   **Integration**: Uses Agora RTC for video/audio.
*   **Signaling**: Custom Socket.IO signaling for "Calling" UI (Ring/Accept/Decline).
*   **Flow**:
    1.  Host creates meeting -> `PENDING`.
    2.  Host starts meeting -> `ACTIVE` -> Token generated.
    3.  Participants join via Token.
    4.  End meeting -> `COMPLETED`.

**API Endpoints (Meeting Module)**:
*   `POST /api/meetings` - Schedule/Create meeting.
*   `GET /api/meetings/me` - List my meetings.
*   `GET /api/meetings/:id` - Get meeting details.
*   `GET /api/meetings/:id/token` - Generate Agora Token (RtcTokenBuilder).
*   `PATCH /api/meetings/:id/start` - Host starts meeting.
*   `PATCH /api/meetings/:id/end` - Host ends meeting.
*   `PATCH /api/meetings/:id/accept` - Participant accepts invite.
*   `PATCH /api/meetings/:id/decline` - Participant declines invite.

