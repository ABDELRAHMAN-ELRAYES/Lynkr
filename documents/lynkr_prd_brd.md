# Lynkr – Services Providing Platform

## Document Set

- **BRD (Business Requirements Document)**
- **PRD (Product Requirements Document)**

---

# 1. Business Requirements Document (BRD)

## 1.1 Business Overview

Lynkr is a multi-service digital marketplace platform that connects **clients** with **verified service providers** across three core service categories:

1. Engineering Projects
2. Teaching / Tutoring
3. Academic Research & Writing

The platform enables service discovery, secure contracting, communication, payments, evaluations, and dispute handling within a unified ecosystem.

---

## 1.2 Business Goals

- Create a trusted marketplace for professional services
- Enable verified service providers to monetize skills
- Provide clients with transparency, quality control, and flexibility
- Support scalable real-time interactions (chat, video, notifications)
- Generate revenue via commissions and subscription plans

---

## 1.3 Stakeholders

- Platform Owner / Admin
- Clients (Service Requesters)
- Service Providers
- Finance & Operations Team
- Support & Moderation Team

---

## 1.4 User Roles

### 1.4.1 Client

- Search and filter service providers
- Submit service requests
- Pay (full or installment-based)
- Communicate with providers
- Rate providers
- Submit reports or disputes

### 1.4.2 Service Provider (Pending / Approved)

- Apply to become a provider
- Complete professional profile
- Accept or reject requests
- Submit proposals
- Deliver services
- Rate clients
- Withdraw earnings

### 1.4.3 Admin

- Approve/reject provider applications
- Manage services, skills, pricing rules
- Moderate posts and reports
- Handle disputes
- Manage payments and subscriptions
- Monitor analytics

---

## 1.5 Business Rules

- All users start as **clients by default**
- Provider accounts require admin approval
- Requests unanswered for **3 days** may be auto-posted publicly
- Payments are escrow-based
- Ratings are allowed only after project completion
- Teaching sessions max capacity: **20 users**

---

## 1.6 Revenue Model

- Platform commission per transaction
- Subscription plans for priority listing
- Featured provider promotion

---

## 1.7 Compliance & Constraints

- Secure payment handling
- Email & OTP verification
- Audit logs for financial operations

---

# 2. Product Requirements Document (PRD)

## 2.1 Functional Requirements

### 2.1.1 Authentication & Registration

- Email/password registration
- Email OTP verification
- Google OAuth 2.0 (signup & login)
- Role selection after verification

---

### 2.1.2 Service Provider Onboarding

**Profile Data:**

- Selected service category (one of three)
- Skills (tag-based)
- Work experience (multiple entries)
- Education history
- Languages + proficiency level
- Hourly rate
- Availability schedule
- Bio & detailed description

**Status Flow:**

- Draft → Submitted → Under Review → Approved / Rejected

---

### 2.1.3 Search & Discovery

- Search by name
- Filters:
  - Service category
  - Rating
  - Price range
  - Availability
- Priority ranking for subscribed providers

---

### 2.1.4 Service Requests & Posts

**Direct Request:**

- Client selects provider and submits request
- Provider must respond within 3 days

**Public Post:**

- Auto-posted if no response(the client agree to this feature while adding a request for service  provider)
- Visible to providers in same category
- Providers submit proposals

---

### 2.1.5 Payments & Escrow

- Payment options:
  - Full payment
  - Installments (milestone-based)
- Escrow holding
- Release on project completion
- Refund handling

---

### 2.1.6 Ratings & Reviews

- Client → Provider rating
- Provider → Client rating
- Rating criteria:
  - Communication
  - Quality
  - Commitment

---

### 2.1.7 Communication

- Real-time 1:1 chat
- File sharing (project-related)
- Meeting scheduling

---

### 2.1.8 Teaching Module

- Weekly availability calendar
- Booking system
- Video sessions (max 20 attendees)
- In-platform video conferencing

---

### 2.1.9 Notifications

- Real-time in-app notifications
- Email notifications
- Events:
  - Request updates
  - Payments
  - Messages
  - Schedule reminders

---

### 2.1.10 Reporting & Disputes

- Client/provider reporting system
- Evidence attachments
- Admin moderation workflow

---

### 2.1.11 Wallet & Withdrawals

- User wallet
- Earnings tracking
- Withdrawal requests
- Admin approval & processing

---

### 2.1.12 Subscriptions

- Tiered subscription plans
- Priority search ranking
- Visibility boost

---

## 2.3 Data Entities (High-Level)

- User
- ProviderProfile
- Skill
- ServiceCategory
- Request
- Proposal
- Project
- Payment
- Wallet
- Rating
- Message
- Notification
- Subscription
- Report

---

## 2.4 User Flows (Summary)

1. User Registration → OTP Verification → Role Selection
2. Provider Application → Admin Approval
3. Client Search → Request → Acceptance
4. Payment → Escrow → Delivery → Rating

## Phase 1 – MVP (Launch-Critical Features)

### 4.1 Trust, Identity & Safety

- Email + OTP verification (mandatory)
- Provider manual approval by admin
- Provider profile review on first submission
- Basic provider verification badges (Approved Provider)
- Versioned Terms & Conditions acceptance tracking

### 4.2 Core Marketplace Lifecycle

- Explicit project state machine:
  - Draft → Requested → Accepted → In Progress → Delivered → Completed
  - Cancelled / Disputed (terminal or admin-handled states)
- Cancellation rules (pre-acceptance / post-acceptance)
- Admin manual override for project status

### 4.3 Payments & Escrow (MVP)

- Platform commission configuration (percentage-based)
- Escrow-based payment holding
- Full payment OR installment-based payment
- Payment release on completion
- Basic refund handling (admin-approved)
- Wallet balance tracking

### 4.4 Communication & Collaboration

- Real-time 1:1 chat
- File upload & sharing per project
- Message retention for dispute resolution
- Project activity timeline (status, payment, files)

### 4.5 Teaching Core

- Weekly availability scheduling
- Session booking
- In-platform video sessions (max 20 users)
- Session reminders

### 4.6 Search & Discovery (MVP)

- Search by name
- Filter by service category
- Filter by price range
- Rating-based sorting

### 4.7 Admin & Operations (MVP)

- Provider approval dashboard
- Project monitoring dashboard
- Basic dispute handling
- Manual payment release / refund
