# Module 2: Provider Onboarding & Profile

---

## 1. Module Objective

The objective of the Provider Onboarding & Profile module is to enable **service providers to create, manage, and submit complete professional profiles** that represent their expertise across Lynkr’s core services.

This module ensures that:

- Providers can register their skills, experiences, and education
- Profiles are structured and verified for admin approval
- Profiles support all subsequent service workflows (requests, proposals, teaching, research, etc.)
- Data consistency and completeness are enforced before approval

---

## 2. Module Scope Definition

### Included Capabilities

- service category selection
- Skills assignment (tag-based)
- Work experience entries (multiple)
- Education history (multiple)
- Languages and proficiency levels
- Hourly rate or pricing configuration
- Availability schedule(after approval from profile)
- Bio and detailed description
- File uploads for certifications, samples, or portfolio
- Profile submission for admin review
- Admin approval/rejection workflow

---

## 3. User Types Involved

- **Client**: Not directly involved but can view provider profiles after approval
- **Provider (Pending/Approved)**: Main user of this module
- **Admin**: Reviews and approves/rejects provider profiles

---

## 4. Provider Profile Lifecycle Scenarios

### 4.1 Profile Creation

**Scenario**

1. Provider logs in and selects the service category
2. Provider enters relevant skills
3. Provider adds work experience entries (company, role, duration, description)
4. Provider adds education entries (degree, university, field, graduation year)
5. Provider specifies languages and proficiency
6. Provider enters hourly rate or fixed price
7. Provider adds bio and detailed description
8. Provider uploads relevant files (portfolio, certificates)(after approval from his profile not in join application request)
9. Provider submits profile for admin review

**Acceptance Criteria**

- All mandatory fields must be completed
- Multiple entries are supported where applicable (experience, education, languages)
- File uploads must be validated for type and size

---

### 4.2 Admin Review and Approval

**Scenario**

1. Admin reviews all sections of the profile
2. Admin either approves or rejects the profile

**Rules**

- Approved profiles become searchable and can receive service requests
- Rejected profiles are returned with feedback
- Provider can resubmit after corrections

---

### 4.3 Profile Update

**Scenario**

1. Provider can edit their profile at any time while  Approved only and any update on the profile become a request the admins must approve this edit.

---

### 4.4 Availability Management (Teaching Module Integration)

**Scenario**

1. Provider adds weekly availability slots
2. System prevents overlaps or conflicts
3. Availability is used for teaching session bookings

**Acceptance Criteria**

- Slots are allowed to be set only after profile approval
- Max attendees enforced per session (Phase 1: 20)

---

## 5. Error & Edge Case Handling

### Covered Scenarios

- Missing mandatory fields
- Invalid file types or oversized uploads
- Duplicate experience or education entries
- Availability conflicts
- Profile submitted multiple times without changes

---

## 8. Module 2 Exit Criteria (Provider Profile)

The module is considered complete when:

- Providers can create, submit, and update profiles reliably
- Admins can review, approve, or reject profiles
- Provider profiles are only visible after approval
- Availability management supports teaching session bookings
- Mandatory validations and error handling are enforced

