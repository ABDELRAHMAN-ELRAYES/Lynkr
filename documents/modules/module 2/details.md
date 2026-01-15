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

## 12. Implementation Status (Updated)

**Implemented:**

*   **Profile Creation**: `ProfileService.createProviderProfile` maps and aggregates Title, Bio, Hourly Rate, Skills, Services, Experience, Education, and Languages.
*   **Application Flow**: `ProviderApplicationService` handles submission, checking pending status, and enforcing a 30-day cooldown for rejections.
*   **Admin Review**: `approveApplication` and `rejectApplication` logic is implemented, including role updates (`PROVIDER_APPROVED` / `PROVIDER_REJECTED`) and logging review decisions.
*   **Sub-modules**: dedicated services for Experience, Education, etc., supporting CRUD.

**Missing Functionalities:**

*   **File Uploads**: The service layer (`profile.service.ts`) does not show explicit handling of file uploads (Certifications, Portfolio) in the creation payload. This logic is likely missing or handled entirely in the controller/middleware without service-level persistence of file metadata in the profile record (needs verification).

