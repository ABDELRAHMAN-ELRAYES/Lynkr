# Module 5: Payments & Escrow

---

## 1. Module Objective

The objective of the Payments & Escrow module is to enable **secure, controlled financial transactions** between clients and service providers after proposal acceptance. This module establishes trust by holding funds safely, enforcing payment rules, and defining clear release conditions.

This module ensures that:

- Payments occur only after proposal acceptance
- Funds are protected for both client and provider
- Partial and full payment options are supported
- Financial state transitions are explicit and traceable
- Withdrawals are controlled and auditable

---

## 2. Module Scope Definition

### Included Capabilities

- Payment initiation after proposal acceptance
- Full payment or split (installment) payment option
- Escrow holding of funds
- Release of funds upon project completion
- Client refund handling before fund release
- Provider withdrawal requests
- Payment and escrow status tracking
- Transaction history for clients and providers

### Explicitly Excluded (Phase 1)

- Milestone-based payments
- Automatic dispute resolution
- Chargeback arbitration
- Multi-currency conversion logic
- Provider subscription billing (handled separately)

---

## 3. User Types Involved

- **Client**: Initiates payments, approves completion
- **Provider**: Receives funds, requests withdrawals
- **System**: Holds escrow, enforces rules, records transactions
- **Admin**: Oversees transactions (read-only in Phase 1)

---

## 4. Payment Models

### 4.1 Full Payment Model

- Client pays 100% of agreed amount upfront
- Funds are held in escrow
- Funds are released after client confirms completion

### 4.2 Split Payment Model

- Client pays an initial percentage upfront
- Remaining amount is paid upon completion
- Both payments are held in escrow until release conditions are met

**Rules**

- Split percentages are predefined by system policy
- Provider cannot access any funds before completion

---

## 5. Payment Lifecycle

### Payment States

- Pending Payment
- Partially Paid
- Fully Paid (In Escrow)
- Released to Provider
- Refunded to Client
- Cancelled

---

## 6. Core Scenarios

### 6.1 Payment Initiation

**Scenario**

1. Client accepts a provider proposal
2. System prompts client to choose payment model
3. Client completes payment
4. Funds move into escrow

**Acceptance Criteria**

- Payment cannot be initiated before proposal acceptance
- Payment amount matches accepted proposal

---

### 6.2 Project Completion & Fund Release

**Scenario**

1. Provider marks project as completed
2. Client reviews delivered work
3. Client confirms completion
4. System releases funds to provider balance

**Rules**

- Client confirmation is mandatory in Phase 1
- No auto-release timers are applied

---

### 6.3 Client Refund Before Completion

**Scenario**

1. Client cancels project before completion
2. Funds are returned from escrow

**Rules**

- Refund is allowed only if funds are still in escrow
- No partial penalties in Phase 1

---

### 6.4 Provider Withdrawal

**Scenario**

1. Provider requests withdrawal from available balance
2. System processes withdrawal
3. Transaction is logged

**Acceptance Criteria**

- Provider can withdraw only released funds
- Withdrawal history is visible

---

## 7. Status Tracking & Visibility

### Client View

- Payment status per project
- Escrow balance per request
- Transaction history

### Provider View

- Available balance
- Pending escrow amounts
- Withdrawal status

---

## 8. Error & Edge Case Handling

### Covered Scenarios

- Client attempts payment with expired request
- Duplicate payment attempts
- Provider requests withdrawal with zero balance
- Client confirms completion twice
- System failure during payment processing

---

## 9. Dependencies

- IAM module (identity verification)
- Requests & Proposals module (accepted proposal)
- Notification system (payment events)
- Reporting & audit logs

---

## 10. Module Exit Criteria

This module is considered complete when:

- Payments can be initiated only after proposal acceptance
- Escrow correctly holds and releases funds
- Full and split payments function as defined
- Refunds are handled safely
- Providers can withdraw released funds
- All transactions are logged and visible

At this point, the platform supports **secure monetary exchange** between clients and providers.

---

## 11. Escrow System Flow - Technical Implementation

### 11.1 System Overview

The Escrow system acts as a **trusted intermediary** that holds client funds until project completion is confirmed. This protects both parties:

- **Client Protection**: Funds are only released when work is satisfactory
- **Provider Protection**: Funds are guaranteed and cannot be withdrawn by client after work begins

### 11.2 Escrow State Machine

```
┌─────────────────┐
│  HOLDING        │ ◄── Initial state when escrow is created
│  (Funds held)   │
└────────┬────────┘
         │
         ├────────────────────────────────────┐
         │                                    │
         ▼                                    ▼
┌─────────────────┐                 ┌─────────────────┐
│  RELEASED       │                 │  REFUNDED       │
│  (To Provider)  │                 │  (To Client)    │
└─────────────────┘                 └─────────────────┘
```

**State Transitions:**

| From | To | Trigger | Who |
|------|-----|---------|-----|
| HOLDING | RELEASED | Client confirms completion | Client |
| HOLDING | REFUNDED | Project cancelled | Client |

### 11.3 Complete Payment & Escrow Flow

```
Step 1: PROPOSAL ACCEPTANCE
┌─────────────────────────────────────────────────────────────┐
│  Client accepts Provider's proposal                         │
│  ├── System creates PROJECT with status PENDING_PAYMENT     │
│  └── System creates ESCROW with depositAmount = totalPrice  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
Step 2: PAYMENT INITIATION
┌─────────────────────────────────────────────────────────────┐
│  Client initiates payment via Stripe                        │
│  ├── System creates PaymentIntent                          │
│  ├── System creates PAYMENT record (status: PENDING)       │
│  └── Client completes payment in frontend                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
Step 3: PAYMENT CONFIRMATION (Webhook)
┌─────────────────────────────────────────────────────────────┐
│  Stripe webhook: payment_intent.succeeded                   │
│  ├── Update PAYMENT status → COMPLETED                     │
│  ├── Add funds to ESCROW balance                           │
│  ├── Update PROJECT.paidAmount                             │
│  └── If fully paid → PROJECT status → IN_PROGRESS          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
Step 4: PROJECT WORK
┌─────────────────────────────────────────────────────────────┐
│  Provider works on project                                  │
│  └── Funds remain in ESCROW (status: HOLDING)              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
Step 5: PROJECT COMPLETION
┌─────────────────────────────────────────────────────────────┐
│  Provider marks project as COMPLETED                        │
│  └── Client reviews and confirms completion                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
Step 6: ESCROW RELEASE
┌─────────────────────────────────────────────────────────────┐
│  Client confirms completion                                 │
│  ├── ESCROW status → RELEASED                              │
│  ├── ESCROW balance transferred to Provider.availableBalance│
│  └── ESCROW balance set to 0                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
Step 7: PROVIDER WITHDRAWAL
┌─────────────────────────────────────────────────────────────┐
│  Provider requests withdrawal from availableBalance         │
│  └── Funds transferred via Stripe Connect (Phase 2)        │
└─────────────────────────────────────────────────────────────┘
```

### 11.4 Database Schema

```prisma
model Project {
    id                 String    @id @default(uuid())
    clientId           String    @map("client_id")
    providerProfileId  String    @map("provider_profile_id")
    acceptedProposalId String    @unique @map("accepted_proposal_id")
    status             String    @default("PENDING_PAYMENT")
    totalPrice         Decimal   @map("total_price")
    paidAmount         Decimal   @default(0) @map("paid_amount")
    startedAt          DateTime? @map("started_at")
    completedAt        DateTime? @map("completed_at")
    
    // Relations
    escrow    Escrow?
    payments  Payment[]
}

model Escrow {
    id            String    @id @default(uuid())
    projectId     String    @unique @map("project_id")
    depositAmount Decimal   @map("deposit_amount")
    balance       Decimal   @default(0)
    status        String    @default("HOLDING") // HOLDING, RELEASED, REFUNDED
    releasedAt    DateTime? @map("released_at")
    
    // Relations
    project Project @relation(...)
}

model Payment {
    id              String    @id @default(uuid())
    projectId       String    @map("project_id")
    payerId         String    @map("payer_id")
    amount          Decimal
    paymentType     String    @map("payment_type") // FULL, INITIAL, FINAL
    status          String    @default("PENDING") // PENDING, COMPLETED, REFUNDED
    stripePaymentId String?   @map("stripe_payment_id")
    paidAt          DateTime? @map("paid_at")
}

model ProviderProfile {
    // ... other fields
    availableBalance Decimal @default(0) @map("available_balance")
}
```

### 11.5 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/projects` | Create project from accepted proposal |
| `POST` | `/api/v1/payments/intent` | Create Stripe payment intent |
| `POST` | `/api/v1/payments/webhook` | Handle Stripe webhooks |
| `PATCH` | `/api/v1/projects/:id/complete` | Provider marks complete |
| `PATCH` | `/api/v1/projects/:id/confirm` | Client confirms → releases escrow |
| `PATCH` | `/api/v1/projects/:id/cancel` | Client cancels → refunds escrow |
| `GET` | `/api/v1/escrows/project/:id` | Get escrow status |
| `GET` | `/api/v1/escrows/balance` | Get provider's available balance |
| `POST` | `/api/v1/escrows/withdraw` | Request withdrawal |

### 11.6 Security Considerations

1. **Payment Validation**: All payments are validated against project total price
2. **Authorization Checks**: Only project client can confirm/cancel, only provider can mark complete
3. **Atomic Transactions**: Escrow release and balance update happen atomically
4. **Webhook Verification**: Stripe webhook signatures are verified before processing
5. **Double-Spend Prevention**: Escrow can only be released OR refunded, never both

### 11.7 Error Handling

| Error Case | Handling |
|------------|----------|
| Payment fails | Payment status set to CANCELLED, project remains PENDING_PAYMENT |
| Double confirmation | Second attempt rejected with error |
| Cancel after release | Rejected - cannot cancel completed project |
| Withdrawal > balance | Rejected with "Insufficient balance" error |
| Webhook signature invalid | Request rejected with 400 status |