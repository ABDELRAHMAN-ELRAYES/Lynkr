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

## 7. Implementation Status (Detailed Technical Reference)

### 7.1 Escrow System Overview

The Escrow System is a financial safety mechanism acting as a neutral third party between the **Client** and the **Provider**.
- **For Clients:** It ensures money is safe and only released upon satisfaction.
- **For Providers:** It proves the client's commitment and ability to pay.

### 7.2 API Endpoints
**Base URL:** `/api/escrow`

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/project/:projectId` | Retrieves escrow details for a specific project. | Authenticated Users |
| `GET` | `/balance` | Gets the authenticated provider's currently available balance. | Providers |
| `POST` | `/withdraw` | Requests a withdrawal of funds from the provider's balance. | Providers |

### 7.3 Detailed Workflows & Logic

#### A. Creating the Escrow (Agreement Phase)
*   **Trigger:** Client accepts a proposal.
*   **Code Location:** `ProjectService.createProjectFromProposal`
*   **Logic:**
    1.  New `Project` created.
    2.  `EscrowRepository.createEscrow` called immediately.
    3.  `depositAmount` set to project total price; `balance` starts at 0.

#### B. Depositing Funds (Payment Phase)
*   **Trigger:** Client completes Stripe payment.
*   **Code Location:** `PaymentService.handlePaymentSuccess` (Webhook)
*   **Logic:**
    1.  Stripe 'succeeded' event received.
    2.  System identifies linked Project.
    3.  `EscrowRepository.addToEscrow` adds payment amount to `balance`.
    4.  Project status updates to `IN_PROGRESS`.

#### C. Releasing Funds (Completion Phase)
*   **Trigger:** Client confirms project completion.
*   **Code Location:** `ProjectService.confirmProjectComplete` (Route: `PATCH /api/projects/:id/confirm`)
*   **Logic:**
    1.  Project must be in `COMPLETED` status (marked by provider).
    2.  `EscrowRepository.releaseEscrow` executes a **Database Transaction**:
        *   Sets Escrow status to `RELEASED`.
        *   Sets Escrow `balance` to 0.
        *   **Increments** `ProviderProfile.availableBalance` by escrow amount.
    3.  Logs `COMPLETION_CONFIRMED` activity.

#### D. Withdrawing Funds (Payout Phase)
*   **Trigger:** Provider requests withdrawal.
*   **Code Location:** `EscrowService.requestWithdrawal` (Route: `POST /api/escrow/withdraw`)
*   **Logic:**
    1.  Validates amount (>0, >=$10 min, <= availableBalance).
    2.  `EscrowRepository.createWithdrawal` executes:
        *   **Decrements** `ProviderProfile.availableBalance`.
        *   *(Pending)* Triggers Stripe Connect payout.

### 7.4 Database Model: `Escrow`
*   **Relation:** One-to-One with `Project`.
*   **Fields:** `depositAmount`, `balance`, `status` (HOLDING, RELEASED, REFUNDED), `releasedAt`.
