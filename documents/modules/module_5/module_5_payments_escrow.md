# Module 5: Payments & Escrow

**Implementation Task Deep Dive**

---

## Module Goal (Execution Perspective)

Enable secure, controlled financial transactions between clients and service providers after proposal acceptance. This module establishes trust by holding funds safely, enforcing payment rules, and defining clear release conditions.

---

## 1. Module Scope Definition

### Included Capabilities

- Payment initiation after proposal acceptance
- Full payment or split (installment) payment option
- Escrow holding of funds
- Release of funds upon project completion
- Client refund handling before fund release
- Provider withdrawal requests
- Payment and escrow status tracking
- Transaction history for clients and providers

---

## 2. Payment Models

### 2.1 Full Payment Model

- Client pays 100% of agreed amount upfront
- Funds are held in escrow
- Funds are released after client confirms completion

### 2.2 Split Payment Model

- Client pays an initial percentage upfront
- Remaining amount is paid upon completion
- Both payments are held in escrow until release conditions are met

---

## 3. Payment Lifecycle

### Payment States

- Pending Payment
- Partially Paid
- Fully Paid (In Escrow)
- Released to Provider
- Refunded to Client
- Cancelled

---

## 4. Core Scenarios

### 4.1 Payment Initiation

- Payment cannot be initiated before proposal acceptance
- Payment amount matches accepted proposal

### 4.2 Project Completion & Fund Release

- Provider marks project as completed
- Client reviews delivered work
- Client confirms completion
- System releases funds to provider balance

### 4.3 Client Refund Before Completion

- Refund is allowed only if funds are still in escrow
- No partial penalties in Phase 1

### 4.4 Provider Withdrawal

- Provider can withdraw only released funds
- Withdrawal history is visible

---

## 5. Status Tracking & Visibility

### Client View

- Payment status per project
- Escrow balance per request
- Transaction history

### Provider View

- Available balance
- Pending escrow amounts
- Withdrawal status

---

## 6. Error & Edge Case Handling

- Client attempts payment with expired request
- Duplicate payment attempts
- Provider requests withdrawal with zero balance
- Client confirms completion twice
- System failure during payment processing

---

## 7. Implementation Status (Updated)

**Implemented:**

*   **Project & Escrow Integration**: `ProjectService.createProjectFromProposal` creates the project and initializes the `Escrow` record with `HOLDING` status.
*   **Stripe Integration**: `PaymentService` is fully integrated with Stripe SDK to create `PaymentIntents` and handle webhooks (`payment_intent.succeeded`).
*   **Transaction Logic**:
    *   **Payment**: Webhook updates `Payment` status, adds funds to `Escrow`, updates `Project.paidAmount`.
    *   **Project Activation**: Automatically transitions Project to `IN_PROGRESS` when fully paid.
    *   **Completion**: `markProjectComplete` (Provider) -> `confirmProjectComplete` (Client) workflow is implemented.
    *   **Release**: `confirmProjectComplete` triggers `EscrowRepo.releaseEscrow`, moving funds to Provider's `availableBalance`.
    *   **Cancellation**: `cancelProject` triggers `EscrowRepo.refundEscrow`.

**Missing Functionalities:**

*   **Payout Execution**: `EscrowService.requestWithdrawal` verifies balance but lacks the actual Stripe Connect integration to transfer funds to the provider's bank account (marked with TODO).
*   **Split Payments**: The database schema supports partial payments (`paidAmount` vs `totalPrice`), but the `createProjectFromProposal` sets `depositAmount` to `totalPrice` initially. Logic for explicit "Milestone" or "Split" scheduling via UI flow is not explicitly enforced in the service layer yet, although `PaymentService` handles multiple payments accumulating.