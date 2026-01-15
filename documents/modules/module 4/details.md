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

## 8. Implementation Status (Updated)

**Implemented:**

*   **Request Lifecycle**: `RequestService` handles Direct and Public requests, including 3-day deadline logic and status transitions (`PENDING`, `PUBLIC`, `ACCEPTED`, `CANCELLED`).
*   **Proposal Management**: `ProposalService` enables providers to submit proposals, enforcing exclusivity (one per request) and checks request status.
*   **Approval Workflow**: `acceptProposal` updates the winning proposal status, auto-rejects all others, sets the Request to `ACCEPTED`, and sends socket notifications.
*   **Project Creation**: `acceptProposal` now automatically creates a **Project** record and initializes **Escrow** for seamless transition to execution.
*   **Auto-Publish Scheduler**: `startAutoPublishJob` cron job runs every 15 minutes to publish expired direct requests (opt-in).
*   **Notifications**: Socket events (`proposal:new`, `proposal:accepted`, `proposal:rejected`) are wired up.

**Missing Functionalities:**

*   None - All Module 4 features are implemented.


