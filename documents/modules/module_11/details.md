# Module 11: Subscriptions

## Technical Realization & API Reference

### 11.1 Subscription Plans
**Logic**:
*   **Plans**: Define tiers (e.g., Free, Premium, Enterprise). Properties: `price`, `duration` (month/year), `features` (JSON).
*   **Management**: Admin can create/update plans.

**API Endpoints (Subscription Module)**:
*   `GET /api/subscriptions/plans` - List available plans.
*   `GET /api/subscriptions/plans/:id` - Get plan details.
*   `POST /api/subscriptions/plans` (Admin) - Create new plan.
*   `PATCH /api/subscriptions/plans/:id` (Admin) - Update plan.

### 11.2 Purchase & Management
**Logic**:
*   **Purchase**:
    1.  Provider selects Plan.
    2.  Process Payment (via Payment Intent or saved method).
    3.  Create `Subscription` record (`ACTIVE`).
    4.  Set expiration date based on plan duration.
*   **Active Check**: System checks if user has active subscription for premium features (e.g., lower fees, priority listing).
*   **Cancellation**: User can cancel auto-renewal (if implemented) or terminate.

**API Endpoints**:
*   `POST /api/subscriptions/purchase` - Buy a subscription.
    *   *Payload*: `planId`, `paymentMethodId` (Stripe).
*   `GET /api/subscriptions/my` - Get current active subscription.
*   `GET /api/subscriptions/my/history` - View past subscriptions.
*   `PATCH /api/subscriptions/:id/cancel` - Cancel active subscription.
*   `GET /api/subscriptions/admin/all` (Admin) - View all user subscriptions.
