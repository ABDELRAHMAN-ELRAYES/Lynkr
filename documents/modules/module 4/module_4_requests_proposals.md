# Module 4: Requests & Proposals

---

## 1. Module Objective

The objective of the Requests & Proposals module is to enable **structured service engagement between clients and providers**. This module defines how service needs are requested, how providers respond, and how an agreement is reached before payments and project execution.

This module ensures that:

- Clients can submit service requests to specific providers or broadcast them
- Providers can review, accept, reject, or propose terms
- Time-bound decision rules are enforced
- Engagements are traceable, auditable, and state-driven
- Downstream modules (payments, chat, project execution) have a clear contract

---

## 2. Module Scope Definition

### Included Capabilities

- Direct service request to a specific provider
- Public request posting to providers of the same service category
- Proposal submission by providers
- Accept / reject / counter-offer workflows
- Request expiration and auto-publishing rules
- Request and proposal status tracking
- Client selection from multiple proposals
- Notifications for all state changes

### Explicitly Excluded (Phase 1)

- Automated provider matching
- AI-assisted proposal ranking
- Milestone-level breakdowns (handled in payments/projects)
- Dispute resolution (Phase 2)

---

## 3. User Types Involved

- **Client**: Creates requests, reviews proposals, selects providers
- **Provider (Approved)**: Receives requests, submits proposals
- **System**: Enforces deadlines, publishing rules, and state transitions

---

## 4. Request Lifecycle

### Request States

- Draft
- Sent (Direct)
- Pending Provider Response
- Public (Posted)
- Proposal Accepted
- Proposal Rejected
- Expired
- Cancelled

---

## 5. Core Scenarios

### 5.1 Direct Request to Provider

**Scenario**

1. Client selects an approved provider
2. Client submits a request including:
   - Service type
   - Description of need
   - Expected duration or scope
   - Budget range (optional)
   - Deadline for response
3. Request is sent directly to the provider
4. Provider has up to **3 days** to respond

**Rules**

- Only one provider receives the request
- Provider can accept, reject, or submit a proposal
- No payment occurs at this stage

---

### 5.2 Auto-Publish to Public Post

**Scenario**

1. Provider does not respond within 3 days
2. System automatically converts the request to a public post
3. Request becomes visible to all approved providers of the same service category

**Acceptance Criteria**

- Client is notified before and after publishing
- Original provider loses exclusivity
- Request status changes to `Public`

---

### 5.3 Provider Proposal Submission

**Scenario**

1. Provider views a direct or public request
2. Provider submits a proposal including:
   - Price (hourly or fixed)
   - Estimated delivery time
   - Optional notes or clarifications
3. Proposal is attached to the request

**Rules**

- A provider can submit only one proposal per request
- Proposals cannot be edited after submission
- Client can receive multiple proposals

---

### 5.4 Client Proposal Review & Selection

**Scenario**

1. Client reviews received proposals
2. Client can:
   - Accept one proposal
   - Reject individual proposals
   - Cancel the request entirely
3. Once a proposal is accepted, all other proposals are auto-rejected

**Acceptance Criteria**

- Only one proposal can be accepted
- Accepted proposal locks the request
- Accepted provider moves to project execution flow

---

### 5.5 Request Cancellation

**Scenario**

1. Client cancels the request before accepting a proposal
2. All providers are notified

**Rules**

- Cancelled requests cannot be reopened
- No penalties applied in Phase 1

---

## 6. Status Tracking & Visibility

### Client View

- Current request status
- Number of proposals received
- Selected provider details

### Provider View

- List of received requests
- Proposal status (pending / accepted / rejected)

---

## 7. Error & Edge Case Handling

### Covered Scenarios

- Provider submits proposal after expiration
- Client accepts proposal after request expiry
- Duplicate proposals from same provider
- Request cancellation during active proposals
- Provider attempts to accept own proposal

---

## 8. Dependencies

- IAM module (role enforcement)
- Provider Profile module (approval status)
- Search & Discovery module (entry point)
- Notification system (real-time + email)

---

## 9. Module Exit Criteria

This module is considered complete when:

- Clients can create direct and public requests
- Providers can submit proposals reliably
- Time-based auto-publishing rules function correctly
- Proposal acceptance enforces exclusivity
- All state transitions are tracked and visible
- Error cases are handled gracefully

At this point, the system has a **complete pre-payment engagement flow**.

