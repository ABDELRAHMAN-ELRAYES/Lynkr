# Module 5: Payments & Escrow

## Technical Realization & API Reference

### 5.1 Project & Payment Workflow
**Logic**:
1.  **Project Creation**: Created automatically via Module 4 (Proposal Acceptance).
    *   *State*: `CREATED`.
    *   *Escrow*: Initialized with 0 balance, `HOLDING` status.
2.  **Payment Processing**:
    *   Client initiates payment -> Stripe PaymentIntent created (`PaymentService`).
    *   Client completes payment on Frontend -> Stripe Webhook fired.
    *   **Webhook**:
        *   Updates `Payment` record to `COMPLETED`.
        *   Updates `Escrow` balance (Add funds).
        *   Updates `Project` paid amount.
        *   If `paidAmount >= totalAmount` -> Project Status -> `IN_PROGRESS`.

**API Endpoints (Payment Module)**:
*   `POST /api/payments/intent` - Create Stripe PaymentIntent.
    *   *Payload*: `projectId`, `amount`.
*   `POST /api/payments/webhook` - Stripe Webhook Handler.
*   `GET /api/payments/project/:projectId` - Transaction history for project.
*   `GET /api/payments/me` - Global transaction history.

### 5.2 Completion & Fund Release
**Logic**:
1.  **Completion Request**: Provider marks project as `COMPLETED`.
2.  **Confirmation**: Client approves work (`confirmComplete`).
3.  **Release**:
    *   Escrow finds holding amount.
    *   Transfers amount to Provider's `availableBalance` in User Wallet/Profile.
    *   Escrow status -> `RELEASED`.

**API Endpoints (Project Module)**:
*   `PATCH /api/projects/:id/complete` (Provider) - Mark work as done.
*   `PATCH /api/projects/:id/confirm` (Client) - Release funds.
*   `PATCH /api/projects/:id/cancel` (Client) - Cancel & Refund (if rules allow).

### 5.3 Escrow & Withdrawals
**Logic**:
*   **Balance**: Calculated from completed projects (Escrow Released) minus Withdrawals.
*   **Withdrawal**:
    *   Provider requests withdrawal for specific amount.
    *   System checks `availableBalance`.
    *   (Future) Stripe Connect Payout logic.

**API Endpoints (Escrow Module)**:
*   `GET /api/escrow/project/:projectId` - View escrow status for project.
*   `GET /api/escrow/balance` - View provider's wallet balance.
*   `POST /api/escrow/withdraw` - Request funds withdrawal.

### 5.4 Missing / Future Logic
*   **Split Payments**: Database supports it, but UI/API currently optimized for full payment.
*   **Automated Payouts**: Withdrawal currently records request but does not trigger bank transfer.
