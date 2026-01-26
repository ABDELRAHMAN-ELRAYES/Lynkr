## Module 4: Requests & Proposals

**Implementation Task Deep Dive**

---

## Module Goal (Execution Perspective)

Provide a **structured pre-contract engagement system** where clients submit requests, providers respond with proposals, and agreements are finalized before project execution or payments.

---

## 1. Request Creation Tasks

### 1.1 Direct Request Submission

* Allow clients to select a specific **approved provider**
* Collect request details:

  * Service type
  * Description of need
  * Expected duration or scope
  * Budget range (optional)
  * Deadline for provider response
* Ensure request is only sent to the selected provider
* Prevent request submission if required fields are missing

---

### 1.2 Public Request Posting

* Allow clients to broadcast requests if:

  * Selected provider does not respond in **3 days**
  * Client opts to make it public immediately (optional)
* Only approved providers of the same service category are notified
* Track original provider exclusivity and status

---

### 1.3 Request Drafts

* Allow clients to save incomplete requests as drafts
* Prevent sending drafts until required fields are complete

---

## 2. Proposal Submission Tasks

### 2.1 Provider Proposal Entry

* Allow providers to submit proposals for:

  * Direct requests
  * Public requests
* Proposal includes:

  * Price (hourly or fixed)
  * Estimated delivery time
  * Optional notes or clarifications
* Enforce one proposal per provider per request
* Lock proposal after submission

---

## 2.2 Proposal Validity & Constraints

* Proposals cannot be edited post-submission
* Proposals expire if request expires
* System tracks proposal timestamps for auditing

---

## 3. Proposal Review & Selection Tasks

### 3.1 Client Review

* Display all received proposals clearly
* Allow client actions:

  * Accept one proposal
  * Reject individual proposals
  * Cancel request entirely
* Enforce single acceptance:

  * Accepting one proposal auto-rejects others
  * Locks the request for provider engagement

---

### 3.2 Acceptance Feedback

* Notify accepted provider
* Notify rejected providers
* Update request status to **Proposal Accepted**

---

## 4. Request Lifecycle Management

### 4.1 Status Transitions

* Draft → Sent (Direct) → Pending Provider Response → Proposal Accepted/Rejected → Expired → Cancelled
* Public posting triggers status change to **Public**
* Automatic expiration handled after defined duration (e.g., 3 days)

---

### 4.2 Cancellation Handling

* Allow client to cancel before proposal acceptance
* Notify all providers
* Mark request as **Cancelled**
* Ensure cancelled requests cannot be reopened

---

## 5. Notifications Tasks

* Notify providers on:

  * New direct requests
  * Public posts in their category
* Notify clients on:

  * Received proposals
  * Proposal acceptance/rejection
* Send reminders for expiring requests or pending responses (Phase 1 optional)

---

## 6. Error & Edge Case Handling

* Provider submits proposal after request expiration
* Client accepts proposal after request expiry
* Duplicate proposals from same provider
* Request cancellation during active proposals
* Provider attempts to accept own proposal

---

## 7. Module Completion Criteria

Module 4 is complete when:

* Clients can submit direct and public requests reliably
* Providers can submit and view proposals according to rules
* Single-proposal acceptance enforces exclusivity
* Automatic expiration and public posting rules function
* All state transitions are traceable and auditable
* Notifications are consistently triggered
* Edge cases are gracefully handled

---

## 8. Technical Realization & API Reference

### 8.1 Request Management
**Logic**:
*   **Direct Request**: Targeted at specific Provider. Status `PENDING`.
*   **Public Request**: Broadcast to all providers in Category. Status `PUBLIC`.
*   **Transitions**:
    *   3-day expiry on Direct Request -> Auto-converts to Public (Cron Job).
    *   Client can Cancel at any time before Acceptance.

**API Endpoints (Request Module)**:
*   `POST /api/requests` - Create request (Direct or Public).
    *   *Payload*: `title`, `description`, `serviceId`, `features`, `priceMax`, `deadline`, `providerId` (optional).
    *   *Files*: Multipart upload support.
*   `GET /api/requests` - List my requests (Client) or available requests (Provider).
*   `GET /api/requests/:id` - Get request details.
*   `PUT /api/requests/:id` - Update request (Draft/Pending only).
*   `POST /api/requests/:id/cancel` - Cancel request.

### 8.2 Proposal Workflow
**Logic**:
*   Provider views Request -> Submits Proposal (Price, Time, Notes).
*   One proposal per provider per request.
*   **Acceptance**:
    1.  Client invokes `accept`.
    2.  Proposal status -> `ACCEPTED`.
    3.  All other proposals for request -> `REJECTED`.
    4.  Request status -> `ACCEPTED`.
    5.  **Project Created**: System automatically instantiates a `Project` and `Escrow` bucket from the accepted proposal.

**API Endpoints (Proposal Module)**:
*   `POST /api/proposals` - Submit proposal.
    *   *Payload*: `requestId`, `price`, `deliveryTime`, `coverLetter`.
*   `GET /api/proposals/request/:requestId` - Get all proposals for a specific request (Client only).
*   `GET /api/proposals/:id` - Get proposal details.
*   `PUT /api/proposals/:id` - Update proposal (before action).
*   `PATCH /api/proposals/:id/accept` - Client accepts proposal. Triggers Project creation.
*   `PATCH /api/proposals/:id/reject` - Client rejects proposal.
*   `DELETE /api/proposals/:id` - Withdraw proposal.

### 8.3 Automation
*   **Cron Job**: `startAutoPublishJob` runs every 15 minutes. Checks for `PENDING` requests older than 3 days where `autoPublish=true`. Updates status to `PUBLIC`.


