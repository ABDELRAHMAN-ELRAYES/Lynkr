# Module 1: Identity & Access Management (IAM)

**Implementation Task Deep Dive**

---

## Module Goal (Execution Perspective)

Enable secure user identity creation, authentication, role control, and lifecycle transitions between **Client**, **Pending Provider**, **Approved Provider**, and **Admin**, with full visibility and auditability.

---

## 1. User Registration Flow Tasks

### 1.1 Basic Account Creation

* Define required registration inputs:

  * First name
  * Last name
  * Email
  * Country
  * Phone number
  * Password
* Enforce uniqueness rules for email and phone
* Validate password strength rules
* Prevent account creation until email verification succeeds

---

### 1.2 Email Verification (OTP)

* Generate one-time verification code
* Send verification code to provided email
* Define OTP expiration window
* Allow limited retry attempts
* Block account activation if OTP expires
* Mark email as verified only after successful OTP validation

---

### 1.3 Registration Completion State

* After OTP success:

  * Create active user account
  * Assign default role: **Client**
  * Allow login immediately
* Handle partial registrations gracefully (abandoned flows)

---

## 2. Authentication Tasks

### 2.1 Email & Password Login

* Accept email + password
* Validate credentials
* Handle incorrect attempts with throttling
* Provide clear error feedback (generic, non-revealing)

---

### 2.2 Google OAuth Login / Signup

* Allow login via Google
* If first-time Google user:

  * Auto-create account
  * Require completion of missing mandatory fields (phone, country)
* Do **not** bypass provider onboarding if user selects provider path
* Ensure Google login users can later set platform password

---

### 2.3 Session Management

* Define login session lifecycle
* Handle logout from:

  * Single device
  * All devices
* Handle session expiration gracefully

---

## 3. Role & Access Control Tasks

### 3.1 Role Definitions

Define and enforce these roles:

* Client (default)
* Provider (Pending Approval)
* Provider (Approved)
* Admin (internal use)

---

### 3.2 Role Transition Rules

* Client → Pending Provider (on provider application submission)
* Pending Provider → Approved Provider (admin approval)
* Pending Provider → Rejected (admin rejection)
* Approved Provider → Suspended (admin action)
* Suspended → Approved (admin reinstatement)

---

### 3.3 Permission Enforcement

Ensure permissions are strictly role-based:

* Clients:

  * Can create requests
  * Cannot submit proposals
* Pending Providers:

  * Can edit provider profile
  * Cannot receive requests or submit proposals
* Approved Providers:

  * Full provider capabilities
* Suspended Providers:

  * Read-only access
  * No new engagements

---

## 4. Provider Application Entry Point

### 4.1 Provider Intent Selection

* Allow users to choose:

  * Continue as Client
  * Apply as Provider
* Make provider application optional, not mandatory

---

### 4.2 Application Status Visibility

* Display provider application status in user profile:

  * Not Applied
  * Under Review
  * Approved
  * Rejected
* Show clear messaging for each state
* Prevent duplicate applications

---

## 5. Account Recovery & Security Tasks

### 5.1 Password Reset

* Allow password reset via email
* Generate secure reset token
* Enforce expiration
* Invalidate old sessions after reset

---

### 5.2 Email Change Flow

* Require verification of new email
* Notify old email of change
* Prevent email reuse conflicts

---

### 5.3 Phone Number Update

* Validate phone format
* Optional OTP verification (Phase 1 recommendation)

---

## 6. User Profile Core Tasks (IAM-Scope Only)

> Note: This is **identity-level data only**, not provider profile data.

* View and edit:

  * Name
  * Email
  * Phone
  * Country
* View role and status (read-only)
* View account creation date
* View last login timestamp

---

## 7. Audit & Traceability Tasks

* Log critical identity events:

  * Account creation
  * Email verification
  * Login attempts
  * Password changes
  * Role changes
* Ensure logs are immutable
* Make logs accessible to admins only

---

## 8. Error Handling & Edge Cases

* Duplicate registration attempts
* OTP resend abuse
* Expired verification flows
* Login while suspended
* Provider attempting restricted actions
* Deleted vs deactivated accounts distinction

---

## 9. Module Completion Criteria

Module 1 is complete when:

* Users can register, verify, and log in reliably
* Role transitions are controlled and auditable
* Provider intent is captured but gated
* Security recovery flows work end-to-end
* No unauthorized role actions are possible

---

## 10. Implementation Status (Updated)

**Implemented:**

*   **Registration**: Full flow with OTP verification (`auth.service.ts` -> `register`, `registerVerification`).
*   **Login**: Email/Password login (`auth.service.ts` -> `login`).
*   **Password Reset**: Request link and reset flow (`forgetPassword`, `resetPassword`).
*   **User Management**: `UserService` handles creation, update (profile details), status updates, and role updates.
*   **Role Management**: Basic RBAC via `AuthMiddleware` and `getRolePrivileges`.
*   **Google OAuth**: Implemented via Passport.js (`passport.ts` -> Google Strategy, `auth.route.ts` -> `/google`, `/google/callback`).
*   **Provider Application Flow**: Complete flow in `provider-application` module with role transitions (CLIENT → PROVIDER_PENDING on submit, PROVIDER_PENDING → PROVIDER_APPROVED/CLIENT on admin decision).

**Missing Functionalities:**

*   None - All Module 1 features are implemented.

