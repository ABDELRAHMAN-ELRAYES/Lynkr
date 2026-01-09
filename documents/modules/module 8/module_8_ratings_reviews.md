# Module 8: Ratings & Reviews

---

## 1. Module Objective

The objective of the Ratings & Reviews module is to establish a **bi-directional trust mechanism** after service completion. This module allows clients and providers to evaluate each other based on completed engagements, improving marketplace transparency and decision quality.

This module ensures that:

- Only completed engagements can be reviewed
- Reviews are authentic, contextual, and immutable
- Ratings directly influence search visibility
- Both parties are accountable for their behavior

---

## 2. Module Scope Definition

### Included Capabilities

- Client-to-provider ratings and reviews
- Provider-to-client ratings and reviews
- Rating aggregation and score calculation
- Review visibility rules
- Review submission deadlines
- Review status tracking

### Explicitly Excluded (Phase 1)

- Review replies or public comments
- Review edits or deletions
- Dispute handling for reviews
- AI sentiment analysis
- Review moderation workflows (Phase 2)

---

## 3. User Types Involved

- **Client**: Rates and reviews providers
- **Provider**: Rates and reviews clients
- **System**: Enforces eligibility, aggregates scores

---

## 4. Review Eligibility Rules

- Reviews can be submitted **only after completion** of:
  - A project workspace, or
  - A teaching session
- Each party can submit **one review per engagement**
- Reviews are optional but encouraged

---

## 5. Rating Model

### 5.1 Rating Scale

- Numerical scale: **1 to 5 stars**
- Half-star ratings are not supported in Phase 1

### 5.2 Review Content

- Optional textual feedback
- Maximum character limit enforced
- Offensive content filtering applied at submission

---

## 6. Review Lifecycle

### Review States

- Eligible
- Submitted
- Expired

---

## 7. Core Scenarios

### 7.1 Client Reviews Provider

**Scenario**

1. Project or session is marked as completed
2. Client is prompted to submit a review
3. Client submits rating and optional feedback
4. Review is saved and locked

**Acceptance Criteria**

- Provider rating is updated immediately
- Review becomes visible on provider profile

---

### 7.2 Provider Reviews Client

**Scenario**

1. Engagement is completed
2. Provider submits a rating for the client
3. Review is saved and locked

**Rules**

- Client ratings are visible only to providers in Phase 1

---

### 7.3 Review Expiration

**Scenario**

1. Review window expires without submission
2. Review state changes to `Expired`

**Rules**

- No late submissions allowed

---

## 8. Rating Aggregation

### Provider Rating Calculation

- Average rating across all completed engagements
- Displayed with total number of reviews

### Client Rating Usage

- Used internally for trust signals
- Not publicly visible in Phase 1

---

## 9. Visibility Rules

### Provider Profile

- Overall rating score
- Total review count
- Most recent reviews

### Client Profile

- Aggregate rating (private)

---

## 10. Error & Edge Case Handling

### Covered Scenarios

- Duplicate review submission
- Review submission before completion
- Review submission after expiration
- Rating outside allowed range

---

## 11. Dependencies

- IAM module
- Project Workspace & Teaching modules
- Search & Discovery module (rating impact)
- Notification system

---

## 12. Module Exit Criteria

This module is considered complete when:

- Only eligible engagements can be reviewed
- Reviews are immutable and correctly linked
- Ratings are aggregated accurately
- Visibility rules are enforced
- Search ranking reflects rating scores

At this point, the platform has a **closed trust feedback loop** for Phase 1.

