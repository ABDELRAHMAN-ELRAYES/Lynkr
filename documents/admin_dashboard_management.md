# Admin Dashboard Management - Complete Reference

## Overview

This document defines all administrative responsibilities across Lynkr's platform modules. Admins have elevated privileges to manage users, approve providers, moderate content, handle reports, manage platform master data, and oversee financial operations.

---

## 1. User Management (Module 1: IAM)

### 1.1 User Account Management

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View All Users | Paginated list with search, filter by role/status | `GET /api/users` |
| View Batch Users | Paginated with filters | `GET /api/users/batch` |
| View User Details | Complete user profile with activity | `GET /api/users/:id` |
| **Create User** | Add new user with role | `POST /api/users` |
| **Create Batch Users** | Bulk user creation | `POST /api/users/batch` |
| Update User Information | Modify user data | `PUT /api/users/:id` |
| Update User Profile | Modify profile details | `PUT /api/users/:id/profile` |
| Update User Status | Activate/Deactivate accounts | `PATCH /api/users/:id` |
| Update User Password | Admin-initiated password change | `PATCH /api/users/:id/password` |
| Delete User | Remove user from system | `DELETE /api/users/:id` |

### 1.2 Creating New Users (Admin-Initiated)

> **Important**: Admins can create users directly without going through the registration flow.

#### Single User Creation

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User email address |
| `password` | string | Yes | Initial password |
| `firstName` | string | Yes | First name |
| `lastName` | string | Yes | Last name |
| `role` | enum | Yes | CLIENT, PROVIDER, ADMIN, SUPER_ADMIN |
| `phone` | string | No | Phone number |
| `country` | string | No | Country code |

```json
// Example: Create Admin User
POST /api/users
{
  "email": "newadmin@lynkr.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Admin",
  "role": "ADMIN",
  "phone": "+1234567890",
  "country": "US"
}
```

#### Batch User Creation

For onboarding multiple users at once:

```json
// Example: Create Multiple Users
POST /api/users/batch
{
  "users": [
    {
      "email": "user1@example.com",
      "password": "Password1!",
      "firstName": "User",
      "lastName": "One",
      "role": "CLIENT"
    },
    {
      "email": "user2@example.com",
      "password": "Password2!",
      "firstName": "User",
      "lastName": "Two",
      "role": "PROVIDER"
    }
  ]
}
```

### 1.3 Admin & Super Admin Management

#### Creating Admin Users

| Role | Capabilities | Who Can Create |
|------|--------------|----------------|
| `ADMIN` | Limited access based on privileges | SUPER_ADMIN |
| `SUPER_ADMIN` | Full platform access | SUPER_ADMIN only |

#### Assigning Privileges to Admins

After creating an admin user, assign specific privileges:

| Privilege | Description | Allows Access To |
|-----------|-------------|------------------|
| `MANAGE_USERS` | User CRUD operations | Users tab |
| `MANAGE_PROVIDERS` | Provider applications | Providers tab |
| `MANAGE_SERVICES` | Service/Skill master data | Services tab |
| `MANAGE_REPORTS` | Report handling & moderation | Reports tab |
| `MANAGE_PAYMENTS` | Financial oversight | Payments tab |
| `MANAGE_SUBSCRIPTIONS` | Subscription plans | Subscriptions tab |
| `MANAGE_SETTINGS` | Platform configuration | Settings tab |
| `VIEW_ANALYTICS` | Reports and dashboards | Analytics tab |
| `MANAGE_REVIEWS` | Review moderation | Reviews tab |

#### Admin Privilege Assignment Workflow

1. Create admin user with `role: "ADMIN"`
2. Navigate to user management
3. Select admin user
4. Assign specific privileges
5. Admin dashboard shows only permitted tabs

```json
// Example: Assign Privileges
PATCH /api/users/:adminId/privileges
{
  "privileges": [
    "MANAGE_USERS",
    "MANAGE_PROVIDERS",
    "VIEW_ANALYTICS"
  ]
}
```

### 1.4 User Statistics Dashboard

| Metric | Description | API Endpoint |
|--------|-------------|--------------|
| Total Users | Count by role | `GET /api/users/statistics` |
| Active Users | Currently active accounts | Included in statistics |
| Inactive Users | Deactivated/banned accounts | Included in statistics |
| Users by Role | Breakdown: Clients, Providers, Admins | Included in statistics |
| Min Batch Users | Minimal user list by role | `GET /api/users/min-batch` |

### 1.5 Admin Actions on Users

- **Create User**: Add new users with any role
- **Activate/Deactivate**: Toggle account access
- **Role Change**: Promote/demote users (CLIENT ↔ PROVIDER ↔ ADMIN)
- **Password Reset**: Force password change for security
- **Assign Privileges**: Configure admin access levels
- **View Activity**: See user's requests, projects, transactions
- **Delete**: Remove user from system

## 2. Provider Application Management (Module 2: Provider Onboarding)

### 2.1 Application Review Queue

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View All Applications | List with status filter | `GET /api/provider-applications` |
| View Pending Applications | Filter by PENDING status | `GET /api/provider-applications?status=PENDING` |
| View Application Details | Full application data | `GET /api/provider-applications/:id` |
| Approve Application | Change user role to PROVIDER | `PATCH /api/provider-applications/:id/approve` |
| Reject Application | Reject with feedback message | `PATCH /api/provider-applications/:id/reject` |

### 2.2 Provider Profile Review

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View All Profiles | List provider profiles | `GET /api/profiles` |
| View Profile Details | Complete profile info | `GET /api/profiles/:id` |
| Approve Profile Update | Review and approve changes | `PATCH /api/profiles/:id/approve` |
| Reject Profile Update | Return with feedback | `PATCH /api/profiles/:id/reject` |

### 2.3 Application Review Checklist

When reviewing provider applications, admins should verify:

| Category | Items to Verify |
|----------|-----------------|
| **Identity** | Name matches, email verified |
| **Service Category** | Appropriate service selected |
| **Skills** | Relevant skills declared for service type |
| **Experience** | Work history entries (company, role, duration) |
| **Education** | Academic qualifications if relevant |
| **Languages** | Proficiency levels declared |
| **Pricing** | Reasonable hourly rate for market |
| **Bio** | Professional, appropriate content |
| **Certifications** | Valid documents uploaded (if applicable) |

### 2.4 Application Status Flow

```
PENDING → APPROVED → (User becomes PROVIDER)
       ↘ REJECTED → (User remains CLIENT, can reapply after cooldown)
```

---

## 3. Service & Skill Management (Master Data)

> **Important**: This is critical admin functionality for managing the platform's service taxonomy.

### 3.1 Service Category Management

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View All Services | List all service categories | `GET /api/services` |
| View Service Details | Single service with skills | `GET /api/services/:id` |
| Create Service | Add new service category | `POST /api/services` |
| Update Service | Modify service name/description | `PATCH /api/services/:id` |
| Delete Service | Remove service (if no providers) | `DELETE /api/services/:id` |

#### Service Data Model

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Service category name (e.g., "Web Development") |
| `description` | string | Detailed description |
| `isActive` | boolean | Whether service is available for selection |
| `skills` | Skill[] | Related skills under this service |

#### Example Services

- Web Development
- Mobile App Development
- UI/UX Design
- Data Science
- Digital Marketing
- Content Writing
- Academic Tutoring
- Research Assistance

### 3.2 Skill Management

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View Skills by Service | Skills under a service category | `GET /api/services/:id/skills` |
| Create Skill | Add skill to service | `POST /api/services/:id/skills` |
| Delete Skill | Remove skill from service | `DELETE /api/services/:id/skills/:skillId` |

#### Skill Data Model

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Skill name (e.g., "React", "Node.js") |
| `serviceId` | string | Parent service category |
| `isActive` | boolean | Whether skill is selectable |

#### Example Skills by Service

| Service | Skills |
|---------|--------|
| Web Development | React, Angular, Vue.js, Node.js, Python, PHP, Ruby |
| Mobile App Development | iOS, Android, React Native, Flutter, Swift, Kotlin |
| UI/UX Design | Figma, Sketch, Adobe XD, Wireframing, Prototyping |
| Data Science | Python, R, Machine Learning, TensorFlow, Data Visualization |

### 3.3 Admin Workflow for Service/Skill Management

1. **Adding a New Service**:
   - Create service with name and description
   - Add relevant skills under the service
   - Activate service for provider selection

2. **Managing Existing Services**:
   - Update service details as needed
   - Add new skills as technology evolves
   - Deactivate outdated skills (don't delete to preserve history)

3. **Impact Considerations**:
   - Deleting a service affects all providers using it
   - Skills are tied to provider profiles
   - Consider deactivation over deletion

---

## 4. Reporting & Moderation (Module 10)

### 4.1 Report Queue Management

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View All Reports | Paginated list with filters | `GET /api/reports` |
| View Report Details | Full report with context | `GET /api/reports/:id` |
| Update Report Status | Change status workflow | `PATCH /api/reports/:id/status` |
| Add Admin Action | Log action taken | `POST /api/reports/:id/actions` |

### 4.2 Report Status Workflow

| Status | Description | Next Actions |
|--------|-------------|--------------|
| `SUBMITTED` | New report awaiting review | Move to UNDER_REVIEW |
| `UNDER_REVIEW` | Admin actively investigating | RESOLVED, DISMISSED |
| `RESOLVED` | Action taken, case closed | - |
| `DISMISSED` | Report invalid/unfounded | - |

### 4.3 Moderation Actions

| Action | Effect | When to Use |
|--------|--------|-------------|
| **Warning** | Send warning notification | First offense, minor violation |
| **Suspension** | Temporarily disable account | Repeated violations, moderate offenses |
| **Ban** | Permanently disable account | Severe violations, fraud, harassment |

### 4.4 Report Categories

| Category | Examples |
|----------|----------|
| Profile Violations | Inappropriate content, fake information |
| Harassment/Abuse | Threatening messages, discrimination |
| Payment Disputes | Non-delivery, quality disagreements |
| Fake Reviews | Fabricated positive/negative reviews |
| Service Quality | Provider not meeting expectations |
| Spam | Unsolicited promotions |

### 4.5 Report Review Process

1. Review report details and evidence
2. Examine reported user's history
3. Check related transactions/messages
4. Determine appropriate action
5. Document decision with notes
6. Notify affected parties

---

## 5. Subscription Plan Management (Module 11)

### 5.1 Plan CRUD Operations

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View All Plans | List subscription tiers | `GET /api/subscriptions/plans` |
| Create Plan | Add new subscription tier | `POST /api/subscriptions/plans` |
| Update Plan | Modify plan details | `PATCH /api/subscriptions/plans/:id` |
| Toggle Plan Status | Activate/deactivate | `PATCH /api/subscriptions/plans/:id/status` |
| Delete Plan | Remove (if no subscribers) | `DELETE /api/subscriptions/plans/:id` |

### 5.2 Plan Data Model

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Plan name (Basic, Pro, Enterprise) |
| `price` | number | Monthly price in cents |
| `duration` | number | Billing period in days |
| `features` | string[] | List of included features |
| `isActive` | boolean | Visibility toggle |

### 5.3 Subscription Monitoring

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View Active Subscriptions | All active subs | `GET /api/subscriptions?status=ACTIVE` |
| View Expiring Soon | Expire within N days | `GET /api/subscriptions?expiringIn=7` |
| View Expired | Recently expired | `GET /api/subscriptions?status=EXPIRED` |
| Cancel Subscription | Admin-initiated cancel | `DELETE /api/subscriptions/:id` |

### 5.4 Subscription Lifecycle

```
PENDING → ACTIVE → EXPIRED
              ↘ CANCELLED
```

---

## 6. Payment & Financial Oversight (Module 5)

### 6.1 Payment Monitoring

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View All Payments | Transaction list | `GET /api/payments` |
| View Payment Details | Single transaction | `GET /api/payments/:id` |
| Process Refund | Refund to client | `POST /api/payments/:id/refund` |

### 6.2 Escrow Oversight

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View All Escrows | Active escrow holdings | `GET /api/escrow` |
| View Project Escrow | Specific project | `GET /api/escrow/project/:projectId` |

### 6.3 Provider Withdrawal Management

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View Withdrawal Requests | Pending withdrawals | `GET /api/escrow/withdrawals` |
| Approve Withdrawal | Process payout | `PATCH /api/escrow/withdrawals/:id/approve` |
| Reject Withdrawal | Deny with reason | `PATCH /api/escrow/withdrawals/:id/reject` |

### 6.4 Financial Dashboard Metrics

| Metric | Description |
|--------|-------------|
| Total Platform Revenue | Commissions collected |
| Active Escrow Holdings | Money currently in escrow |
| Pending Withdrawals | Awaiting admin approval |
| Monthly Transaction Volume | Gross transaction value |
| Average Transaction Value | Mean payment amount |
| Refund Rate | Percentage of refunded transactions |

---

## 7. Request & Project Oversight (Modules 4 & 6)

### 7.1 Request Monitoring

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View All Requests | All client requests | `GET /api/requests` |
| View Request Details | Single request with full info | `GET /api/requests/:id` |
| View Proposals | Proposals submitted for request | `GET /api/requests/:id/proposals` |

#### Request Details Include:
- Client information
- Service category
- Description and requirements
- Budget range
- Timeline expectations
- Status (Draft, Sent, Public, Accepted, Expired)
- Attached proposals

### 7.2 Project Monitoring - Complete View

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View All Projects | All platform projects | `GET /api/projects` |
| View Project Details | Complete project information | `GET /api/projects/:id` |
| View User's Projects | Projects for specific user | `GET /api/projects/me` |

#### Project Details Response Includes:

| Field | Description |
|-------|-------------|
| `id` | Project unique identifier |
| `title` | Project title from request |
| `description` | Full project description |
| `client` | Client user details |
| `provider` | Provider user details |
| `status` | Current project status |
| `totalPrice` | Agreed project price |
| `startDate` | Project start date |
| `expectedEndDate` | Expected completion |
| `completedAt` | Actual completion date |
| `escrow` | Associated escrow details |
| `proposal` | Linked accepted proposal |
| `request` | Original request |

#### Project Statuses

| Status | Description |
|--------|-------------|
| `PENDING_PAYMENT` | Awaiting client payment |
| `IN_PROGRESS` | Work actively ongoing |
| `COMPLETED` | Provider marked complete |
| `CONFIRMED` | Client confirmed & escrow released |
| `CANCELLED` | Project cancelled |
| `DISPUTED` | Under dispute resolution |

### 7.3 Project Files Management

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View Project Files | List all uploaded files | `GET /api/projects/:id/files` |
| File Details | Single file info | Included in file list |
| Delete File | Admin removal if inappropriate | `DELETE /api/projects/:id/files/:fileId` |

#### File Information:

| Field | Description |
|-------|-------------|
| `id` | File unique identifier |
| `filename` | Original file name |
| `fileType` | MIME type |
| `fileSize` | Size in bytes |
| `uploadedBy` | User who uploaded |
| `uploadedAt` | Upload timestamp |
| `url` | Download URL |

### 7.4 Project Activity Timeline

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View Activities | Full activity history | `GET /api/projects/:id/activities` |

#### Activity Types Logged:

| Activity Type | Description |
|---------------|-------------|
| `PROJECT_CREATED` | Project initialized from proposal |
| `PAYMENT_RECEIVED` | Client payment processed |
| `FILE_UPLOADED` | File added to project |
| `FILE_DELETED` | File removed |
| `MESSAGE_SENT` | Message in project conversation |
| `STATUS_CHANGED` | Project status transition |
| `COMPLETION_MARKED` | Provider marked complete |
| `COMPLETION_CONFIRMED` | Client confirmed completion |
| `ESCROW_RELEASED` | Funds released to provider |
| `PROJECT_CANCELLED` | Project was cancelled |
| `REFUND_ISSUED` | Refund processed |

#### Activity Record Structure:

```json
{
  "id": "activity-uuid",
  "projectId": "project-uuid",
  "type": "PAYMENT_RECEIVED",
  "description": "Client payment of $500 received",
  "performedBy": {
    "id": "user-uuid",
    "firstName": "John",
    "lastName": "Doe"
  },
  "metadata": {
    "amount": 50000,
    "paymentId": "pay-uuid"
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 7.5 Project Conversations & Messages

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View Project Conversation | Get conversation ID | `GET /api/projects/:id` (includes conversationId) |
| View Messages | All messages in conversation | `GET /api/conversations/:id/messages` |
| Message History | Paginated message list | `GET /api/conversations/:id/messages?page=1&limit=50` |

#### Message Information:

| Field | Description |
|-------|-------------|
| `id` | Message unique identifier |
| `content` | Message text |
| `sender` | User who sent |
| `attachments` | Any attached files |
| `createdAt` | Sent timestamp |
| `isRead` | Read status |

### 7.6 Project Escrow Details

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View Project Escrow | Escrow for specific project | `GET /api/escrow/project/:projectId` |

#### Escrow Information:

| Field | Description |
|-------|-------------|
| `id` | Escrow unique identifier |
| `projectId` | Associated project |
| `depositAmount` | Total amount to be held |
| `balance` | Current balance in escrow |
| `status` | HOLDING, RELEASED, REFUNDED |
| `releasedAt` | When funds were released |

#### Escrow Statuses:

| Status | Description |
|--------|-------------|
| `HOLDING` | Funds held awaiting release |
| `RELEASED` | Funds released to provider |
| `REFUNDED` | Funds returned to client |

### 7.7 Dispute Resolution Workflow

When a report or dispute is received:

1. **Review Report**: Access complaint details and evidence
2. **Project Investigation**:
   - View project details (`GET /api/projects/:id`)
   - Read message history (`GET /api/conversations/:id/messages`)
   - Check activity timeline (`GET /api/projects/:id/activities`)
   - Review uploaded files (`GET /api/projects/:id/files`)
3. **Financial Review**:
   - Check escrow status (`GET /api/escrow/project/:id`)
   - View payment history
4. **Resolution Actions**:
   - Mediate between parties via admin messaging
   - Issue full/partial refund if justified
   - Take moderation action (warning/suspension/ban)
5. **Documentation**:
   - Log resolution in report actions
   - Notify both parties of outcome

---

## 8. Review Moderation (Module 8)

### 8.1 Review Monitoring

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View All Reviews | Platform reviews | `GET /api/reviews` |
| View Review Details | Single review | `GET /api/reviews/:id` |
| Delete Review | Remove inappropriate | `DELETE /api/reviews/:id` |

### 8.2 Review Moderation Criteria

| Flag For | Description |
|----------|-------------|
| Inappropriate Language | Profanity, hate speech |
| Personal Attacks | Threats, harassment |
| Fake Reviews | Fabricated ratings |
| Irrelevant Content | Off-topic reviews |
| Spam | Promotional content |

---

## 9. Teaching Session Oversight (Module 7)

### 9.1 Session Monitoring

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View All Sessions | Scheduled/completed | `GET /api/teaching/sessions` |
| View Session Details | Single session | `GET /api/teaching/sessions/:id` |
| View Session Participants | Attendance | `GET /api/teaching/sessions/:id/participants` |

### 9.2 Slot Management View

| Action | Description | API Endpoint |
|--------|-------------|--------------|
| View Provider Slots | Provider availability | `GET /api/teaching/slots?providerId=:id` |

---

## 10. Platform Settings Management

### 10.1 System Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| Platform Commission Rate | % taken from transactions | 15% |
| OTP Expiration Time | Minutes before expiry | 10 min |
| Password Reset Validity | Hours for reset link | 15 min |
| Max File Upload Size | Maximum upload MB | 10 MB |
| Provider Cooldown Period | Days before reapplication | 30 days |
| Request Auto-Publish Delay | Days before public | 3 days |

### 10.2 Feature Toggles

| Feature | Description |
|---------|-------------|
| Maintenance Mode | Disable platform access |
| New Registrations | Enable/disable signups |
| Google OAuth | Toggle OAuth login |
| Email Notifications | Enable/disable emails |

---

## 11. Admin Privilege System

### 11.1 Role Hierarchy

| Role | Access Level |
|------|--------------|
| `SUPER_ADMIN` | Full system access, can manage other admins |
| `ADMIN` | Limited access based on assigned privileges |

### 11.2 Assignable Privileges

| Privilege | Capabilities |
|-----------|--------------|
| `MANAGE_USERS` | User CRUD, status changes |
| `MANAGE_PROVIDERS` | Application review, profile approval |
| `MANAGE_SERVICES` | Service/Skill master data |
| `MANAGE_REPORTS` | Report handling, moderation actions |
| `MANAGE_PAYMENTS` | Financial oversight, withdrawals |
| `MANAGE_SUBSCRIPTIONS` | Plan management |
| `MANAGE_SETTINGS` | Platform configuration |
| `VIEW_ANALYTICS` | Dashboard and reports access |
| `MANAGE_REVIEWS` | Review moderation |

### 11.3 Admin Tab Access

Based on privileges, admins see different dashboard tabs:

| Tab | Required Privilege |
|-----|-------------------|
| Users | `MANAGE_USERS` |
| Providers | `MANAGE_PROVIDERS` |
| Services | `MANAGE_SERVICES` |
| Reports | `MANAGE_REPORTS` |
| Subscriptions | `MANAGE_SUBSCRIPTIONS` |
| Payments | `MANAGE_PAYMENTS` |
| Settings | `MANAGE_SETTINGS` |
| Analytics | `VIEW_ANALYTICS` |

---

## Quick Reference: All Admin API Endpoints

### User Management
```
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id
PATCH  /api/users/:id/status
PATCH  /api/users/:id/role
DELETE /api/users/:id
```

### Provider Applications
```
GET    /api/provider-applications
GET    /api/provider-applications/:id
PATCH  /api/provider-applications/:id/approve
PATCH  /api/provider-applications/:id/reject
```

### Services & Skills
```
GET    /api/services
GET    /api/services/:id
POST   /api/services
PATCH  /api/services/:id
DELETE /api/services/:id
GET    /api/services/:id/skills
POST   /api/services/:id/skills
DELETE /api/services/:id/skills/:skillId
```

### Reports & Moderation
```
GET    /api/reports
GET    /api/reports/:id
PATCH  /api/reports/:id/status
POST   /api/reports/:id/actions
```

### Subscriptions
```
GET    /api/subscriptions/plans
POST   /api/subscriptions/plans
PATCH  /api/subscriptions/plans/:id
DELETE /api/subscriptions/plans/:id
GET    /api/subscriptions
```

### Payments & Escrow
```
GET    /api/payments
GET    /api/payments/:id
POST   /api/payments/:id/refund
GET    /api/escrow
GET    /api/escrow/project/:projectId
GET    /api/escrow/withdrawals
PATCH  /api/escrow/withdrawals/:id/approve
PATCH  /api/escrow/withdrawals/:id/reject
```

### Projects & Requests
```
GET    /api/requests
GET    /api/requests/:id
GET    /api/projects
GET    /api/projects/:id
GET    /api/projects/:id/activities
```

### Reviews
```
GET    /api/reviews
GET    /api/reviews/:id
DELETE /api/reviews/:id
```

### Teaching
```
GET    /api/teaching/sessions
GET    /api/teaching/sessions/:id
GET    /api/teaching/slots
```
