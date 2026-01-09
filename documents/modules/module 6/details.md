## Module Goal (Execution Perspective)

Enable a **clean transition from accepted proposal to active project**, locking agreed terms and establishing a clear foundation for project execution and downstream workflows.

---

## 1. Project Creation Tasks

### 1.1 Trigger Conditions

* Project creation occurs **only when a client accepts a provider proposal**
* Verify:

  * Proposal is valid and not expired
  * Provider is approved
  * Request status allows conversion to project

---

### 1.2 Project Data Capture

* Capture critical project information from the accepted proposal:

  * Agreed price (hourly or fixed)
  * Estimated duration
  * Scope/description
  * Participants (client + provider)
* Assign project a unique identifier for tracking
* Record creation timestamp

---

### 1.3 Status Initialization

* Set initial project status to **Active**
* Track sub-statuses (Phase 1: minimal):

  * Pending first deliverable
  * Ongoing
  * Completed (Phase 2)

---

## 2. Term Locking & Validation Tasks

### 2.1 Term Freezing

* Once the project is created:

  * Lock proposal details (price, scope, estimated delivery)
  * Prevent retroactive changes unless admin intervenes
* Notify participants that terms are fixed

### 2.2 Conflict Checks

* Ensure no duplicate active projects exist for the same request
* Validate participants are still approved and active
* Prevent creation if provider is suspended

---

## 3. Project Participants Tasks

* Associate client and provider(s) with project
* Display roles and permissions clearly within the project context
* Provide participant list for messaging and engagement

---

## 4. Engagement Milestone Tasks (Phase 1)

* Basic milestone representation:

  * Start date
  * Estimated end date
* Optional Phase 1: placeholder for payment triggers and deliverables

---

## 5. Notifications & Communication Tasks

* Notify client and provider upon project creation
* Indicate project details, scope, and locked terms
* Trigger messaging context setup (Module 5 integration)

---

## 6. Error & Edge Case Handling

* Proposal accepted after request expiration
* Provider becomes inactive during project creation
* Duplicate project creation attempts
* Missing proposal details
* Network or session interruptions during creation

---

## 7. Module Completion Criteria

Module 6 is complete when:

* Accepted proposals reliably convert into active projects
* Project terms are locked and immutable
* Participants are clearly associated
* Basic project timeline is set
* Notifications are triggered for both parties
* Edge cases are gracefully handled

