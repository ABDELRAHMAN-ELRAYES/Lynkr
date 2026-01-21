# Providers Page

## Overview

The Providers page manages provider applications and profile reviews. Admins can approve/reject applications and review profile updates.

**Required Privilege:** `MANAGE_PROVIDERS`

---

## Page Layout

### Tabs (Within Single Page)

1. **Applications** - Pending provider applications
2. **Profiles** - All approved provider profiles
3. **Pending Updates** - Profile update requests

---

## Tab 1: Applications

### Filter Bar

| Filter | Options |
|--------|---------|
| Status | All, PENDING, APPROVED, REJECTED |
| Service | Service category dropdown |
| Date | Application date range |

### Applications Table

| Column | Description |
|--------|-------------|
| Applicant | User name + avatar |
| Email | Contact email |
| Service | Applied service category |
| Submitted | Application date |
| Status | Status badge |
| Actions | View, Approve, Reject |

### Application Detail Modal

**Sections:**

1. **Personal Information**
   - Name, email, phone, country
   - Profile photo

2. **Service Category**
   - Selected service
   - Skills declared

3. **Experience** (Expandable list)
   - Company name
   - Role/position
   - Duration
   - Description

4. **Education** (Expandable list)
   - Degree
   - Institution
   - Field of study
   - Graduation year

5. **Languages**
   - Language + proficiency level

6. **Pricing**
   - Hourly rate

7. **Bio**
   - Full bio text

8. **Documents** (if any)
   - Uploaded certifications

### Review Actions

```
┌─────────────────────────────────────────────────┐
│              Application Review                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Checklist of items to verify]                 │
│  ☐ Identity verified                            │
│  ☐ Service category appropriate                 │
│  ☐ Skills relevant                              │
│  ☐ Experience legitimate                        │
│  ☐ Education verified                           │
│  ☐ Pricing reasonable                           │
│  ☐ Bio professional                             │
│                                                 │
│  Admin Notes:                                   │
│  [_______________________________________]      │
│                                                 │
│  [Reject]              [Request Changes]        │
│                        [Approve]                │
└─────────────────────────────────────────────────┘
```

---

## Tab 2: Profiles

### All Provider Profiles

| Column | Description |
|--------|-------------|
| Provider | Name + avatar |
| Service | Service category |
| Rating | Average rating stars |
| Projects | Completed project count |
| Status | Active/Inactive |
| Actions | View, Edit, Suspend |

### Profile Quick View

- Service category
- Skills list
- Rating + review count
- Hourly rate
- Recent projects

---

## Tab 3: Pending Updates

When approved providers request profile changes:

| Column | Description |
|--------|-------------|
| Provider | Name |
| Change Type | What was modified |
| Submitted | Request date |
| Actions | View Changes, Approve, Reject |

### Update Diff View

Show before/after comparison:

```
┌─────────────────────────────────────────────────┐
│            Profile Update Request               │
├─────────────────────────────────────────────────┤
│ Field: Bio                                      │
│                                                 │
│ Current:                                        │
│ "I am a web developer with 5 years..."         │
│                                                 │
│ Requested:                                      │
│ "Senior full-stack developer with 7 years..."  │
│ ──────────────────────────────────              │
│ Field: Hourly Rate                              │
│                                                 │
│ Current: $50/hr                                 │
│ Requested: $75/hr                               │
│                                                 │
│  [Reject]                   [Approve Changes]   │
└─────────────────────────────────────────────────┘
```

---

## API Endpoints Used

| Action | Method | Endpoint |
|--------|--------|----------|
| Get Applications | GET | `/api/v1/provider-applications` |
| Get Application | GET | `/api/v1/provider-applications/:id` |
| Approve Application | PATCH | `/api/v1/provider-applications/:id/approve` |
| Reject Application | PATCH | `/api/v1/provider-applications/:id/reject` |
| Get All Profiles | GET | `/api/v1/profiles` |
| Get Profile | GET | `/api/v1/profiles/:id` |
| Approve Update | PATCH | `/api/v1/profiles/:id/approve` |
| Reject Update | PATCH | `/api/v1/profiles/:id/reject` |

---

## State Management

```typescript
interface ProvidersPageState {
  activeTab: 'applications' | 'profiles' | 'updates';
  applications: ProviderApplication[];
  profiles: ProviderProfile[];
  pendingUpdates: ProfileUpdate[];
  statusFilter: ApplicationStatus | null;
  serviceFilter: string | null;
  selectedApplication: ProviderApplication | null;
  selectedProfile: ProviderProfile | null;
  isDetailModalOpen: boolean;
  isLoading: boolean;
}
```

---

## Notifications Triggered

| Action | Notification To |
|--------|-----------------|
| Application Approved | Provider (email + in-app) |
| Application Rejected | Provider (email + in-app) |
| Profile Update Approved | Provider (in-app) |
| Profile Update Rejected | Provider (in-app) |
