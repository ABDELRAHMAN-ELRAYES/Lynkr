# Module 1: Identity & Access Management (IAM)

---

## 1. Module Objective

The objective of the Identity & Access Management (IAM) module is to provide a **secure, reliable, and auditable identity foundation** for the Lynkr platform.

This module ensures that:

- Every user has a verified identity
- Access is controlled based on clearly defined roles
- Legal consent is explicitly recorded
- All subsequent platform actions can trust user authenticity

---

## 2. Module Scope Definition

### Included Capabilities

- User registration using email and password

- Email verification via OTP

- Authentication (login and logout)

- Google OAuth 2.0 authentication

- Role assignment and role transitions

- Provider role application request



---

## 3. User Types and Role Model

### User Types

- **Client**: Default user type upon registration
- **Service Provider (Pending)**: User who applied to become a provider and awaits approval
- **Service Provider (Approved)**: User approved to offer services
- **Admin**: Platform operator with elevated privileges

---

## 4. Account Lifecycle Scenarios

### 4.1 New User Registration

**Scenario**

1. User submits basic registration data (first name,last name, email, phone, country, password)
2. System doesn't create a user account until the OTP is correct(depending on the caching methodology to save user data)
3. System sends a one-time password (OTP) to the user’s email
4. User submits the OTP for verification
5. System creates user account with Client role

**Acceptance Criteria**

- User cannot authenticate before email verification
- OTP has a limited validity period (10 minutes)
- OTP attempts are rate-limited

---

### 4.2 Login Scenario

**Scenario**

1. User submits login credentials or authenticates via Google OAuth
2. System validates identity
3. System checks account status
4. User gains access according to assigned roles

---

## 5. Provider Role Application Flow

### 5.1 Apply as Service Provider

**Scenario**

1. Logged-in Client selects “Apply as Provider”
2. System assigns the Provider (Pending) role
3. User is redirected to complete provider profile information (handled in Provider Profile module)

**Rules**

- A user cannot receive service requests while in Pending status
- Only one provider application may exist at a time

---

### 5.2 Provider Approval Outcome

**Approved**

- Provider role is upgraded to Approved
- User becomes eligible for discovery and requests

**Rejected**

- Provider role is marked as Rejected
- User remains a Client
- Re-application is allowed only after a defined cooldown period

---

## 6. Error & Edge Case Handling

### Covered Scenarios

- Expired or invalid OTP submission
- Multiple failed login attempts
- OAuth email mismatch
- Duplicate role assignment attempts
- Provider re-application before cooldown expiry

System behavior must remain deterministic, secure, and user-friendly.

