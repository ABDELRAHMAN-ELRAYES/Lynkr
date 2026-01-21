# Services Page

## Overview

The Services page manages the platform's service taxonomy - the master data for service categories and their associated skills.

**Required Privilege:** `MANAGE_SERVICES`

---

## Page Layout

### Main Sections

1. **Header Area**
   - Page title: "Services & Skills"
   - Primary action: "Add Service"

2. **Service Cards/List**
   - All service categories
   - Expandable to show skills

3. **Modals**
   - Create/Edit Service Modal
   - Add Skill Modal

---

## Service List View

### Display Options

Toggle between:
- **Card View**: Visual cards per service
- **List View**: Table format

### Service Card

```
┌─────────────────────────────────────────────────┐
│ 🌐 Web Development                    [Active]  │
├─────────────────────────────────────────────────┤
│ Build modern web applications and websites.    │
│                                                 │
│ Skills (8):                                     │
│ [React] [Angular] [Vue.js] [Node.js]           │
│ [Python] [PHP] [Ruby] [+1 more]                │
│                                                 │
│ Providers: 45                                   │
│ ─────────────────────────────────────────────── │
│ [Edit]  [Add Skill]  [Deactivate]              │
└─────────────────────────────────────────────────┘
```

### Service Table (List View)

| Column | Description |
|--------|-------------|
| Service | Service name |
| Description | Short description |
| Skills | Skill count |
| Providers | Provider count using this |
| Status | Active/Inactive badge |
| Actions | Edit, Add Skill, Toggle Status, Delete |

---

## Modals

### Create/Edit Service Modal

**Fields:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Name | Text | Yes | Unique, 3-50 chars |
| Description | Textarea | Yes | 10-500 chars |
| Icon | Icon Picker | No | Optional icon |
| Status | Toggle | Yes | Active/Inactive |

```
┌────────────────────────────────────────┐
│           Create New Service           │
├────────────────────────────────────────┤
│ Service Name*                          │
│ [____________________________________] │
│                                        │
│ Description*                           │
│ [____________________________________] │
│ [____________________________________] │
│ [____________________________________] │
│                                        │
│ Icon (optional)                        │
│ [Select Icon ▼]                        │
│                                        │
│ Status: [●] Active  [ ] Inactive       │
│                                        │
│ [Cancel]                    [Create]   │
└────────────────────────────────────────┘
```

### Add Skill Modal

**Fields:**

| Field | Type | Required |
|-------|------|----------|
| Skill Name | Text | Yes |
| Parent Service | Select (pre-filled) | Yes |

---

## Skill Management

### Within Service Expanded View

```
┌─────────────────────────────────────────────────┐
│ 🌐 Web Development                              │
├─────────────────────────────────────────────────┤
│ Skills:                                         │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ React              [Active]   [X] Delete   │ │
│ │ Used by: 23 providers                       │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────┐ │
│ │ Angular            [Active]   [X] Delete   │ │
│ │ Used by: 15 providers                       │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────┐ │
│ │ Vue.js             [Active]   [X] Delete   │ │
│ │ Used by: 12 providers                       │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ [+ Add New Skill]                               │
└─────────────────────────────────────────────────┘
```

---

## API Endpoints Used

| Action | Method | Endpoint |
|--------|--------|----------|
| Get All Services | GET | `/api/v1/services` |
| Get Service | GET | `/api/v1/services/:id` |
| Create Service | POST | `/api/v1/services` |
| Update Service | PATCH | `/api/v1/services/:id` |
| Delete Service | DELETE | `/api/v1/services/:id` |
| Get Skills | GET | `/api/v1/services/:id/skills` |
| Create Skill | POST | `/api/v1/services/:id/skills` |
| Delete Skill | DELETE | `/api/v1/services/:id/skills/:skillId` |

---

## Business Rules

### Deleting a Service

⚠️ **Warning displayed:**
> "This service has X providers associated with it. Deleting will affect their profiles. Consider deactivating instead."

- Cannot delete if providers are actively using it
- Alternative: Deactivate (soft delete)

### Deleting a Skill

⚠️ **Confirmation required:**
> "X providers have this skill listed. Removing it will update their profiles."

---

## State Management

```typescript
interface ServicesPageState {
  services: Service[];
  selectedService: Service | null;
  skills: Skill[];
  viewMode: 'card' | 'list';
  isCreateServiceModalOpen: boolean;
  isEditServiceModalOpen: boolean;
  isAddSkillModalOpen: boolean;
  isLoading: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  icon?: string;
  isActive: boolean;
  skills: Skill[];
  providerCount: number;
}

interface Skill {
  id: string;
  name: string;
  serviceId: string;
  isActive: boolean;
  providerCount: number;
}
```

---

## Example Services & Skills

| Service | Skills |
|---------|--------|
| Web Development | React, Angular, Vue.js, Node.js, Python, PHP, Ruby, TypeScript |
| Mobile Development | iOS, Android, React Native, Flutter, Swift, Kotlin |
| UI/UX Design | Figma, Sketch, Adobe XD, Wireframing, Prototyping, User Research |
| Data Science | Python, R, Machine Learning, TensorFlow, Data Visualization, SQL |
| Digital Marketing | SEO, SEM, Social Media, Content Marketing, Email Marketing |
| Content Writing | Blog Writing, Copywriting, Technical Writing, SEO Writing |
| Academic Tutoring | Mathematics, Physics, Chemistry, Biology, English, History |
| Research Assistance | Literature Review, Data Analysis, Academic Writing, Citation |
