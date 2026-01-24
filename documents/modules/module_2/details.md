## Module 2: Provider Onboarding & Profile

**Implementation Task Deep Dive**

---

## Module Goal (Execution Perspective)

Enable qualified users to apply as service providers, submit comprehensive professional profiles, and pass a controlled review process before gaining provider privileges—while ensuring data completeness, consistency, and trustworthiness.

---

## 1. Provider Application Initiation Tasks

### 1.1 Application Entry

* Allow any authenticated **Client** to start a provider application
* Prevent application if:

  * User already has an active or pending application
  * User is suspended or banned
* Clearly communicate:

  * Review process
  * Expected review duration
  * Approval criteria at a high level

---

### 1.2 Service Category Selection

* Require applicant to select **one primary service category**:

  * Engineering Projects
  * Teaching
  * Research Writing
* Lock selected category after submission (Phase 1)
* Inform applicant that category changes require reapplication

---

## 2. Provider Profile Core Information Tasks

### 2.1 Professional Identity

* Require provider to enter:

  * Professional title
  * Short bio (public-facing)
  * Detailed description (services, approach, strengths)
* Enforce minimum and maximum content lengths
* Prevent use of contact details inside descriptions

---

### 2.2 Skills Definition

* Allow provider to add multiple skills related to selected service category
* Enforce:

  * Skill relevance validation
  * No duplicates
* Allow skill reordering (priority-based)
* Prevent skill editing after approval (Phase 1)

---

## 3. Experience & Background Tasks

### 3.1 Work Experience Entries

* Allow multiple experience records
* Each record includes:

  * Role/title
  * Organization or project name
  * Description of work
  * Start and end dates
* Allow marking experiences as:

  * Professional
  * Freelance
  * Academic
* Validate date logic (no overlap errors)

---

### 3.2 Education Records

* Allow multiple education entries
* Each entry includes:

  * Degree level
  * Field of study
  * Institution
  * Graduation year
* Allow marking ongoing education
* Prevent implausible timelines

---

## 4. Language & Communication Tasks

### 4.1 Language Proficiency

* Allow provider to add multiple languages
* For each language:

  * Select proficiency level (standardized scale)
* Enforce one primary language
* Prevent duplicate language entries

---

## 5. Availability & Pricing Tasks

### 5.1 Time Availability Definition

* Allow provider to define:

  * Available days of week
  * Time ranges per day
* Support multiple time blocks per day
* Enforce logical time ranges (no overlaps)
* Clarify time zone handling (fixed per provider)

---

### 5.2 Pricing Configuration

* Require provider to define:

  * Hourly rate
* Allow optional:

  * Fixed-price preference indicator
* Enforce platform-defined minimum and maximum limits
* Lock pricing after approval (Phase 1)

---

## 6. Supporting Documents & Media Tasks

### 6.1 File Uploads

* Allow provider to upload:

  * Certifications
  * Portfolio samples
  * Academic documents (if applicable)
* Enforce:

  * Allowed file types
  * Maximum file size
  * Maximum number of files
* Make uploaded files visible to admins only

---

## 7. Profile Review & Submission Tasks

### 7.1 Pre-Submission Validation

* Ensure all required sections are completed
* Highlight missing or invalid fields
* Allow draft saving before submission

---

### 7.2 Application Submission

* Lock profile editing upon submission
* Change application status to **Under Review**
* Notify applicant of successful submission

---

## 8. Admin Review Process Tasks

### 8.1 Review Queue Management

* List all pending applications
* Display:

  * Full provider profile
  * Uploaded documents
* Allow admin to:

  * Approve
  * Reject with reason
  * Request resubmission (Phase 1 optional)

---

### 8.2 Decision Handling

* On approval:

  * Change role to **Approved Provider**
  * Unlock provider features
  * Notify provider
* On rejection:

  * Change status to **Rejected**
  * Display rejection reason
  * Block reapplication for defined cooldown period

---

### 8.3 Application Rejection & Reapplication Tasks

**Rejection Handling:**
* When admin rejects application:
  * Store rejection reason (required)
  * Set cooldown period (3 days from rejection date)
  * Revert user role to **CLIENT**
  * Send notification to user

* User visibility after rejection:
  * Display rejection reason prominently
  * Show cooldown countdown (days remaining)
  * Disable reapplication button during cooldown
  * Provide guidance on how to improve application

---

### 8.4 Reapplication Workflow

**Preconditions:**
* Previous application was rejected
* Cooldown period (3 days) has ended
* User has updated their profile (recommended)

**Flow:**
1. User views application status page
2. System checks cooldown period
3. If cooldown ended → Enable "Reapply" button
4. User clicks "Reapply"
5. System validates profile completeness
6. Create new application with status `PENDING`
7. Update user role to `PROVIDER_PENDING`
8. Notify user of successful submission

**Rules:**
* Each reapplication creates a new application record
* Previous rejection history is preserved for admin review
* No limit on number of reapplications (after each cooldown)
* Profile edits are allowed between applications

---

### 8.5 Application Status Monitoring (Frontend)

**Status Page Requirements:**
* Display current application status: `PENDING` / `APPROVED` / `REJECTED`
* Show application history (all past applications)
* For each application show:
  * Submission date
  * Review date (if reviewed)
  * Decision (if reviewed)
  * Rejection reason (if rejected)
  * Cooldown remaining (if rejected and in cooldown)

**Status-Specific UI:**

| Status | Display | Actions |
|--------|---------|---------|
| PENDING | "Under Review" + submission date | None (waiting) |
| APPROVED | Success message | Link to profile |
| REJECTED | Reason + cooldown countdown | Reapply (after cooldown) |

---

## 9. Provider Status Visibility Tasks

* Display provider status clearly in user profile
* Show:

  * Current state
  * Last update timestamp
  * Admin notes (if any)

---

## 10. Error & Edge Case Handling

* Incomplete submissions
* Invalid file uploads
* Admin conflict actions
* Provider attempting to act before approval
* Multiple browser sessions during application

---

## 11. Module Completion Criteria

Module 2 is complete when:

* Providers can submit complete applications
* Admins can review and decide reliably
* Status transitions are enforced and visible
* No provider access is granted before approval
* Provider data is consistent and auditable

---

## 12. Technical Realization & API Reference

### 12.1 Provider Application & Workflow
**Logic**:
1.  **Draft/Creation**: User creates a profile (Professional details, Experience, Education).
2.  **Submission**: User submits application (changes status to `PENDING`).
3.  **Review**: Admin views pending applications.
4.  **Decision**:
    *   *Approve*: Updates status to `APPROVED`, changes User Role to `PROVIDER_APPROVED`.
    *   *Reject*: Updates status to `REJECTED`, sets cooldown period (30 days).

**API Endpoints (Provider Application Module)**:
*   `POST /api/v1/provider-applications` (submitApplication) - Submit current profile for review.
*   `GET /api/v1/provider-applications/me` - Get my application status history.
*   `GET /api/v1/provider-applications` (Admin) - List pending applications.
*   `GET /api/v1/provider-applications/:id` (Admin) - View application details.
*   `PATCH /api/v1/provider-applications/:id/approve` (Admin) - Approve application.
*   `PATCH /api/v1/provider-applications/:id/reject` (Admin) - Reject application.

### 12.2 Provider Profile Management
**Logic**:
*   Profile consists of: Bio, Title, Hourly Rate, Service Category.
*   Associated entities: Skills, Languages, Experiences, Educations.
*   Profile management is restricted based on status (locked when Pending/Approved in some fields).

**API Endpoints (Profile Module)**:
*   `POST /api/v1/provider-profiles` - Create initial profile.
*   `PUT /api/v1/provider-profiles/:id` - Update profile details.
*   `GET /api/v1/provider-profiles/:id` - Get specific profile.
*   `GET /api/v1/provider-profiles/user/:userId` - Get profile by user ID.
*   `GET /api/v1/provider-profiles` - List all approved profiles (Public directory).
*   `GET /api/v1/provider-profiles/search` - Search profiles with filters.
*   `POST /api/v1/provider-profiles/:id/approve` (Admin) - Direct profile approval.
*   `POST /api/v1/provider-profiles/:id/reject` (Admin) - Direct profile rejection.
*   `DELETE /api/v1/provider-profiles/:id` (Admin) - Delete profile.

### 12.3 Professional History (Sub-modules)
**Education**:
*   `POST /api/v1/provider/education`
*   `GET /api/v1/provider/education/profile/:profileId`
*   `GET /api/v1/provider/education/:id`
*   `PUT /api/v1/provider/education/:id`
*   `DELETE /api/v1/provider/education/:id`

**Experience**:
*   `POST /api/v1/provider/experience`
*   `GET /api/v1/provider/experience/profile/:profileId`
*   `GET /api/v1/provider/experience/:id`
*   `PUT /api/v1/provider/experience/:id`
*   `DELETE /api/v1/provider/experience/:id`

**Skills & Languages**:
*   Managed via Profile update (nested or separate endpoints depending on precise implementation - currently via Profile service).

**Validation Status**:
*   **File Uploads**: Currently handled directly in controllers or missing service-level persistence metadata. Further verification needed for document storage logic.

