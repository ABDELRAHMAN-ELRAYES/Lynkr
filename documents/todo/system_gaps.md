# System-Wide Gap & Dependency Analysis Report

This report details the findings from a comprehensive code analysis of the Lynkr backend, focusing on cross-module dependencies, workflow integrity, and infrastructure quality.

## 🚨 Critical Integrity Gaps (Must Fix)

These are "Showstoppers" where a user workflow literally breaks or stops functioning.

### 1. Proposal Acceptance $\nrightarrow$ Project Creation
*   **Module**: Requests & Proposals (Module 4) $\rightarrow$ Project Management (Module 5/7)
*   **Issue**: When a client accepts a proposal, the system updates the proposal status but **never calls `ProjectService.createProjectFromProposal`**.
*   **Impact**: No Project record is created. No Escrow is initialized. Commerce flow stops.
*   **Fix**: Inject `ProjectService` into `ProposalService` and call `createProjectFromProposal` within the acceptance flow.

### 2. Project Creation $\nrightarrow$ Conversation Initialization
*   **Module**: Project Management (Module 5/7) $\rightarrow$ Messaging (Module 6)
*   **Issue**: `ProjectService` creates the project but does not initialize a chat context.
*   **Impact**: Users are placed in a project with no way to communicate.
*   **Fix**: Call `ConversationService.createConversation` immediately after project creation.

### 3. Subscription Payment Simulation
*   **Module**: Subscription (Module 11)
*   **Issue**: `SubscriptionService.purchaseSubscription` simulates payment success immediately. It does not integrate with `PaymentService` or Stripe.
*   **Impact**: Subscriptions are free. Revenue loss.
*   **Fix**: Implement Stripe PaymentIntent creation and webhook verification.

---

## ⚠️ Missing Automation (Cron Jobs)

The following background maintenance tasks are logic-ready but not scheduled:

1.  **Request Auto-Publishing**: `RequestService` has logic to publish pending requests, but no Cron job calls it.
2.  **Subscription Expiration**: Logic to expire subscriptions exists but runs manually/never.

---

## 🏗️ Infrastructure & Technical Gaps

These are non-functional gaps that affect scalability, maintenance, and security.


### 3. Limited Observability (Debugging Risk)
*   **State**: Uses `console.log` and `morgan` (HTTP logs). No structured application logging (Winston/Bunyan) or error context.
*   **Risk**: Difficult to debug production issues or trace complex flows across modules.
*   **Recommendation**: Implement **Winston** logger and replace `console` calls.

---

## 📉 Feature Gaps by Module

### Module 3: Search & Discovery
*   **Gap**: **Rudimentary Search**. Missing Full-text search, filtering, sorting, and pagination.

### Module 5: Payments
*   **Gap**: **Manual Payouts**. Escrow withdrawal does not trigger automatic Stripe Connect payouts.

### Module 9: Notifications
*   **Gap**: **Missing Email Alerts**. Critical system events (Payment received, Account banning) trigger internal notifications but no emails.
