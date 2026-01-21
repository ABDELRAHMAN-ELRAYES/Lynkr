# Payments Page

## Overview

The Payments page provides financial oversight including transaction history, escrow management, and provider withdrawal processing.

**Required Privilege:** `MANAGE_PAYMENTS`

---

## Page Layout

### Tabs (Within Single Page)

1. **Transactions** - All payment transactions
2. **Escrow** - Active escrow holdings
3. **Withdrawals** - Provider withdrawal requests

---

## Statistics Cards (Top Row)

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Revenue   │ │   Escrow    │ │  Pending    │ │  Refunds    │
│   $45,230   │ │  Holdings   │ │ Withdrawals │ │  This Month │
│  this month │ │   $12,500   │ │   $3,200    │ │    $890     │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

---

## Tab 1: Transactions

### Filter Bar

| Filter | Options |
|--------|---------|
| Status | All, PENDING, PAID, REFUNDED, FAILED |
| Type | All, PROJECT, SUBSCRIPTION, SESSION |
| Date Range | Transaction date |
| Amount | Min/Max amount |

### Transactions Table

| Column | Sortable | Description |
|--------|----------|-------------|
| ID | Yes | Transaction ID |
| Type | Yes | Payment type |
| Client | Yes | Who paid |
| Provider | Yes | Who receives (if applicable) |
| Amount | Yes | Transaction amount |
| Status | Yes | Payment status |
| Date | Yes | Transaction date |
| Actions | No | View, Refund |

### Transaction Detail Modal

```
┌─────────────────────────────────────────────────────────────────┐
│                    Transaction Details                           │
├─────────────────────────────────────────────────────────────────┤
│ Transaction ID: pay_1234567890                                  │
│ Stripe Payment ID: pi_3ABC123xyz                                │
│                                                                 │
│ Type: PROJECT                                                   │
│ Status: [PAID]                                                  │
│                                                                 │
│ Amount:          $2,500.00                                      │
│ Platform Fee:    $375.00 (15%)                                  │
│ Net to Provider: $2,125.00                                      │
│                                                                 │
│ Payer: John Doe (john@example.com)                              │
│ Recipient: Jane Smith (jane@example.com)                        │
│                                                                 │
│ Related Project: [View Project →]                               │
│                                                                 │
│ Created: Jan 16, 2024 at 9:00 AM                                │
│ Completed: Jan 16, 2024 at 9:02 AM                              │
│                                                                 │
│ [Issue Refund]                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tab 2: Escrow

### Active Escrows Table

| Column | Description |
|--------|-------------|
| Project | Project title (linked) |
| Client | Client name |
| Provider | Provider name |
| Deposit | Total deposit amount |
| Balance | Current escrow balance |
| Status | HOLDING, RELEASED, REFUNDED |
| Created | Escrow creation date |
| Actions | View Project, Release, Refund |

### Escrow Statuses

| Status | Badge Color | Description |
|--------|-------------|-------------|
| HOLDING | Yellow | Funds held, awaiting release |
| RELEASED | Green | Funds released to provider |
| REFUNDED | Red | Funds returned to client |

---

## Tab 3: Withdrawals

### Pending Withdrawals

| Column | Description |
|--------|-------------|
| Provider | Provider name |
| Amount | Withdrawal amount |
| Available Balance | Provider's current balance |
| Requested | Request date |
| Status | PENDING, APPROVED, REJECTED |
| Actions | Approve, Reject |

### Withdrawal Actions

**Approve Withdrawal:**
1. Verify provider has sufficient balance
2. Click Approve
3. System triggers Stripe payout
4. Provider notified

**Reject Withdrawal:**
1. Click Reject
2. Enter rejection reason
3. Provider notified

```
┌─────────────────────────────────────────────────────────────────┐
│              Approve Withdrawal                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Provider: Jane Smith                                            │
│ Requested Amount: $500.00                                       │
│ Available Balance: $2,125.00                                    │
│                                                                 │
│ ✓ Balance sufficient for withdrawal                            │
│                                                                 │
│ Stripe Payout Details:                                          │
│ • Destination: **** 4242 (Jane's bank account)                  │
│ • Estimated arrival: 2-3 business days                          │
│                                                                 │
│ [Cancel]                              [Confirm & Process]       │
└─────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────┐
│               Reject Withdrawal                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Provider: Jane Smith                                            │
│ Requested Amount: $500.00                                       │
│                                                                 │
│ Rejection Reason*:                                              │
│ [________________________________________________]             │
│ [________________________________________________]             │
│                                                                 │
│ [Cancel]                              [Reject Withdrawal]       │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Endpoints Used

| Action | Method | Endpoint |
|--------|--------|----------|
| Get Payments | GET | `/api/v1/payments` |
| Get Payment | GET | `/api/v1/payments/:id` |
| Process Refund | POST | `/api/v1/payments/:id/refund` |
| Get All Escrows | GET | `/api/v1/escrow` |
| Get Project Escrow | GET | `/api/v1/escrow/project/:projectId` |
| Get Withdrawals | GET | `/api/v1/escrow/withdrawals` |
| Approve Withdrawal | PATCH | `/api/v1/escrow/withdrawals/:id/approve` |
| Reject Withdrawal | PATCH | `/api/v1/escrow/withdrawals/:id/reject` |

---

## Refund Processing

### Full Refund

```
┌─────────────────────────────────────────────────────────────────┐
│                    Process Refund                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Transaction: pay_1234567890                                     │
│ Original Amount: $2,500.00                                      │
│                                                                 │
│ Refund Type:                                                    │
│ ● Full Refund ($2,500.00)                                       │
│ ○ Partial Refund                                                │
│                                                                 │
│ Refund Reason*:                                                 │
│ [________________________________________________]             │
│                                                                 │
│ ⚠️ Warning: This action cannot be undone.                       │
│                                                                 │
│ [Cancel]                              [Process Refund]          │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Management

```typescript
interface PaymentsPageState {
  activeTab: 'transactions' | 'escrow' | 'withdrawals';
  
  // Transactions
  payments: Payment[];
  paymentTotal: number;
  paymentFilters: {
    status: PaymentStatus | null;
    type: PaymentType | null;
    dateRange: DateRange | null;
  };
  
  // Escrow
  escrows: Escrow[];
  
  // Withdrawals
  withdrawals: Withdrawal[];
  pendingWithdrawalsCount: number;
  
  // UI
  selectedPayment: Payment | null;
  selectedWithdrawal: Withdrawal | null;
  isRefundModalOpen: boolean;
  isApproveModalOpen: boolean;
  isRejectModalOpen: boolean;
  isLoading: boolean;
}
```
