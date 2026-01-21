# Module 6: Project Workspace & Collaboration

---

## 1. Module Objective

The objective of the Project Workspace & Collaboration module is to provide a **controlled execution environment** after payment initiation where clients and providers can collaborate, communicate, exchange files, and track progress until completion.

This module ensures that:

- Work starts only after a valid financial commitment exists
- All collaboration artifacts are centralized per project
- Communication is auditable and scoped
- Project completion is explicitly signaled
- Downstream modules (ratings, withdrawals) rely on a clear execution outcome

---

## 2. Module Scope Definition

### Included Capabilities

- Project workspace creation upon payment
- Project status tracking
- File uploads and downloads
- One-to-one real-time chat
- Activity timeline (events log)
- Project completion signaling
- Teaching session linkage (non-video)

### Explicitly Excluded (Phase 1)

- Video conferencing (handled in Teaching module)
- Multi-provider collaboration
- Task-level breakdowns
- Time tracking
- Version control for files

---

## 3. User Types Involved

- **Client**: Reviews progress, uploads files, confirms completion
- **Provider**: Delivers work, uploads outputs, requests completion
- **System**: Enforces access, logs events, maintains state

---

## 4. Project Lifecycle

### Project States

- Initialized
- In Progress
- Awaiting Client Review
- Completed
- Cancelled

---

## 5. Workspace Creation Rules

**Trigger Condition**

- A proposal has been accepted
- Required payment (full or first installment) is completed

**System Behavior**

- Create a unique workspace linked to:
  - Request
  - Accepted proposal
  - Payment record
- Grant access only to:
  - Client
  - Accepted provider

---

## 6. Core Scenarios

### 6.1 Project Start

**Scenario**

1. Payment enters escrow
2. Workspace is created automatically
3. Project status set to `In Progress`
4. Both parties are notified

---

### 6.2 File Exchange

**Scenario**

1. Client or provider uploads a file
2. File is attached to the project workspace
3. Counterparty is notified

**Rules**

- Files are immutable after upload
- Maximum file size enforced by system policy
- Supported file types defined globally

---

### 6.3 Real-Time Chat

**Scenario**

1. Client and provider exchange messages
2. Messages appear in real time
3. Messages are permanently stored

**Rules**

- Chat is restricted to project participants
- Messages cannot be deleted or edited
- System timestamps all messages

---

### 6.4 Activity Timeline

**Tracked Events**

- File uploads
- Messages sent
- Status changes
- Completion requests

**Purpose**

- Transparency
- Dispute reference (future phase)

---

### 6.5 Provider Completion Request

**Scenario**

1. Provider marks project as completed
2. Project state changes to `Awaiting Client Review`
3. Client is notified

---

### 6.6 Client Completion Confirmation

**Scenario**

1. Client reviews deliverables
2. Client confirms completion
3. Project state changes to `Completed`
4. Payment release is triggered

**Rules**

- Completion confirmation is mandatory
- No auto-completion in Phase 1

---

## 7. Status Tracking & Visibility

### Client View

- Current project status
- Uploaded and received files
- Chat history
- Activity timeline

### Provider View

- Project status
- Client messages
- Uploaded deliverables

---

## 8. Error & Edge Case Handling

### Covered Scenarios

- File upload failure
- Unauthorized access attempt
- Provider requests completion twice
- Client confirms completion twice
- Chat message delivery failure

---

## 9. Dependencies

- IAM module (access control)
- Requests & Proposals module
- Payments & Escrow module
- Notification system
- File storage subsystem

---

## 10. Module Exit Criteria

This module is considered complete when:

- Workspace is created only after valid payment
- Files and chat function reliably
- Project state transitions are enforced
- Completion triggers payment release
- Activity log captures all key actions

At this point, the platform supports **controlled project execution and collaboration**.

---

## 11. Technical Reference: Project Activity System

### 11.1 Purpose
The Project Activity system functions as an **Audit Log** and **Timeline**. It tracks every significant action taken within a project lifecycle to provide transparency and accountability to both the Client and Provider. It answers the question: *"Who did what, and when?"*

### 11.2 API Endpoints
**Base URL:** `/api/v1/projects`

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/:id/activities` | Retrieves the full timeline of activities for a specific project. | Project Participants |

### 11.3 Detailed Logic & Event Types

**Recorded Events (via `ProjectService.logActivity`):**

1.  **`FILE_UPLOADED`**
    *   **Trigger:** `ProjectService.uploadProjectFile`
    *   **Details:** "Uploaded file: [filename]"

2.  **`FILE_DELETED`**
    *   **Trigger:** `ProjectService.deleteProjectFile`
    *   **Details:** "Deleted file: [filename]"

3.  **`COMPLETION_REQUESTED`**
    *   **Trigger:** `ProjectService.markProjectComplete` (Provider Action)
    *   **Details:** "Provider marked project as completed"

4.  **`COMPLETION_CONFIRMED`**
    *   **Trigger:** `ProjectService.confirmProjectComplete` (Client Action)
    *   **Details:** "Client confirmed project completion. Funds released."

5.  **`PROJECT_CANCELLED`**
    *   **Trigger:** `ProjectService.cancelProject`
    *   **Details:** "Client cancelled the project"

### 11.4 Database Model: `ProjectActivity`
*   **Relation:** Many-to-One with `Project`.
*   **Fields:** `userId` (actor), `action` (enum/string), `details` (text), `createdAt`.
