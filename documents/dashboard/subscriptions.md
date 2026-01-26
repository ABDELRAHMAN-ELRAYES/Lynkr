# Subscriptions Page

## Overview

The Subscriptions page manages subscription plans and monitors active provider subscriptions.

**Required Privilege:** `MANAGE_SUBSCRIPTIONS`

---

## Page Layout

### Tabs (Within Single Page)

1. **Plans** - Subscription plan management
2. **Subscribers** - Active subscriptions list

---

## Tab 1: Plans

### Header

- Title: "Subscription Plans"
- Action: "Create Plan" button

### Plans Display (Cards)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Subscription Plans                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│ │     BASIC       │ │      PRO        │ │   ENTERPRISE    │    │
│ │    [Active]     │ │    [Active]     │ │   [Inactive]    │    │
│ ├─────────────────┤ ├─────────────────┤ ├─────────────────┤    │
│ │                 │ │                 │ │                 │    │
│ │   $29/month     │ │   $79/month     │ │  $199/month     │    │
│ │                 │ │                 │ │                 │    │
│ │ ✓ 10 proposals  │ │ ✓ Unlimited     │ │ ✓ Unlimited     │    │
│ │ ✓ Basic support │ │   proposals     │ │   proposals     │    │
│ │                 │ │ ✓ Priority      │ │ ✓ Premium       │    │
│ │                 │ │   support       │ │   support       │    │
│ │                 │ │ ✓ Analytics     │ │ ✓ Analytics     │    │
│ │                 │ │                 │ │ ✓ API Access    │    │
│ │                 │ │                 │ │ ✓ White-label   │    │
│ │                 │ │                 │ │                 │    │
│ │ Subscribers: 45 │ │ Subscribers: 23 │ │ Subscribers: 0  │    │
│ ├─────────────────┤ ├─────────────────┤ ├─────────────────┤    │
│ │ [Edit] [Toggle] │ │ [Edit] [Toggle] │ │ [Edit] [Toggle] │    │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Create/Edit Plan Modal

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Name | Text | Yes | Plan name |
| Price | Number | Yes | Monthly price in cents |
| Duration | Number | Yes | Billing period in days |
| Features | Array | Yes | List of features |
| Description | Textarea | No | Plan description |
| Is Active | Toggle | Yes | Visibility |

```
┌────────────────────────────────────────────────────────────────┐
│                    Create Subscription Plan                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ Plan Name*                                                     │
│ [____________________________________]                         │
│                                                                │
│ Price (USD)*                   Duration (days)*                │
│ [$___________]                 [____] (default: 30)            │
│                                                                │
│ Description                                                    │
│ [____________________________________]                         │
│ [____________________________________]                         │
│                                                                │
│ Features*                                                      │
│ [____________________________________] [+ Add]                 │
│                                                                │
│ Added Features:                                                │
│ • Unlimited proposals                              [X]         │
│ • Priority support                                 [X]         │
│ • Analytics dashboard                              [X]         │
│                                                                │
│ Status: [●] Active  [ ] Inactive                               │
│                                                                │
│ [Cancel]                              [Create Plan]            │
└────────────────────────────────────────────────────────────────┘
```

---

## Tab 2: Subscribers

### Filter Bar

| Filter | Options |
|--------|---------|
| Status | All, PENDING, ACTIVE, EXPIRED, CANCELLED |
| Plan | Dropdown of all plans |
| Expiring Soon | Toggle (within 7 days) |

### Subscribers Table

| Column | Sortable | Description |
|--------|----------|-------------|
| Provider | Yes | Provider name + avatar |
| Plan | Yes | Subscription plan name |
| Status | Yes | Subscription status |
| Started | Yes | Subscription start date |
| Expires | Yes | Expiration date |
| Actions | No | View, Cancel |

### Subscription Statuses

| Status | Badge Color | Description |
|--------|-------------|-------------|
| PENDING | Gray | Payment pending |
| ACTIVE | Green | Currently active |
| EXPIRED | Red | Past expiration |
| CANCELLED | Orange | User cancelled |

### Expiring Soon Alert

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️ 5 subscriptions expiring in the next 7 days                  │
│ [View Expiring →]                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Endpoints Used

| Action | Method | Endpoint |
|--------|--------|----------|
| Get All Plans | GET | `/api/subscriptions/plans` |
| Create Plan | POST | `/api/subscriptions/plans` |
| Update Plan | PATCH | `/api/subscriptions/plans/:id` |
| Toggle Plan Status | PATCH | `/api/subscriptions/plans/:id/status` |
| Delete Plan | DELETE | `/api/subscriptions/plans/:id` |
| Get Subscriptions | GET | `/api/subscriptions` |
| Get Expiring | GET | `/api/subscriptions?expiringIn=7` |
| Cancel Subscription | DELETE | `/api/subscriptions/:id` |

---

## Business Rules

### Deleting a Plan

⚠️ Cannot delete plans with active subscribers. Options:
1. Wait for all subscriptions to expire
2. Migrate subscribers to another plan
3. Deactivate the plan instead

### Subscription Lifecycle

```
PENDING → ACTIVE → EXPIRED
              ↘ CANCELLED
```

---

## State Management

```typescript
interface SubscriptionsPageState {
  activeTab: 'plans' | 'subscribers';
  
  // Plans
  plans: SubscriptionPlan[];
  selectedPlan: SubscriptionPlan | null;
  isCreatePlanModalOpen: boolean;
  isEditPlanModalOpen: boolean;
  
  // Subscribers
  subscriptions: Subscription[];
  subscriptionFilters: {
    status: SubscriptionStatus | null;
    planId: string | null;
    expiringSoon: boolean;
  };
  
  isLoading: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  description?: string;
  isActive: boolean;
  subscriberCount: number;
}
```
