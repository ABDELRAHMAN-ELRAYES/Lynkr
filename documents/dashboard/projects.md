# Projects Page

## Overview

The Projects page provides comprehensive oversight of all platform projects including details, files, activities, conversations, and escrow status.

**Required Privilege:** `VIEW_ANALYTICS` (read) / `MANAGE_PAYMENTS` (actions)

---

## Page Layout

### Main Sections

1. **Header Area**
   - Page title: "Project Management"
   - Search bar
   - Filters

2. **Statistics Cards**
   - Active Projects
   - Completed This Month
   - In Dispute
   - Total Value

3. **Projects Table**
   - Paginated project list
   - Actions per row

4. **Project Detail Modal/Page**
   - Full project information with tabs

---

## Projects Table

### Filter Bar

| Filter | Options |
|--------|---------|
| Status | All, PENDING_PAYMENT, IN_PROGRESS, COMPLETED, CONFIRMED, CANCELLED, DISPUTED |
| Service | Service category dropdown |
| Date Range | Created date range |
| Search | Search by title, client, provider |

### Table Columns

| Column | Sortable | Description |
|--------|----------|-------------|
| Title | Yes | Project title |
| Client | Yes | Client name + avatar |
| Provider | Yes | Provider name + avatar |
| Status | Yes | Status badge |
| Value | Yes | Total price |
| Created | Yes | Creation date |
| Actions | No | View Details |

---

## Project Detail View

### Tabs

1. **Overview**
2. **Files**
3. **Activities**
4. **Messages**
5. **Escrow**

---

### Tab 1: Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Project Overview                              │
├─────────────────────────────────────────────────────────────────┤
│ Title: Website Redesign for Tech Startup                        │
│ Status: [IN_PROGRESS]                                           │
│                                                                 │
│ ┌───────────────────────┐  ┌───────────────────────┐           │
│ │ CLIENT                │  │ PROVIDER              │           │
│ │ 👤 John Doe           │  │ 👤 Jane Smith         │           │
│ │ john@example.com      │  │ jane@example.com      │           │
│ └───────────────────────┘  └───────────────────────┘           │
│                                                                 │
│ Service: Web Development                                        │
│ Created: Jan 15, 2024                                           │
│ Expected End: Feb 15, 2024                                      │
│                                                                 │
│ Description:                                                    │
│ Complete redesign of company website including homepage,        │
│ about page, services page, and contact form integration.        │
│                                                                 │
│ Price: $2,500.00                                                │
│                                                                 │
│ Original Request: [View Request →]                              │
│ Accepted Proposal: [View Proposal →]                            │
└─────────────────────────────────────────────────────────────────┘
```

### Tab 2: Files

| Column | Description |
|--------|-------------|
| Filename | File name with icon |
| Type | File type (PDF, Image, etc.) |
| Size | File size |
| Uploaded By | User who uploaded |
| Date | Upload date |
| Actions | Download, Delete |

```
┌─────────────────────────────────────────────────────────────────┐
│                    Project Files                                 │
├─────────────────────────────────────────────────────────────────┤
│ 📄 project-requirements.pdf       1.2 MB    Client    Jan 15   │
│ 🖼️ wireframe-v1.png              450 KB    Provider  Jan 18   │
│ 🖼️ homepage-design.fig           2.3 MB    Provider  Jan 22   │
│ 📄 feedback-round1.pdf           320 KB    Client    Jan 25   │
│                                                                 │
│ Total: 4 files, 4.27 MB                                         │
└─────────────────────────────────────────────────────────────────┘
```

### Tab 3: Activities

Timeline view of all project activities:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Activity Timeline                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ● Jan 25, 10:30 AM                                              │
│   FILE_UPLOADED - Client uploaded feedback-round1.pdf           │
│   By: John Doe                                                  │
│                                                                 │
│ ● Jan 22, 2:15 PM                                               │
│   FILE_UPLOADED - Provider uploaded homepage-design.fig         │
│   By: Jane Smith                                                │
│                                                                 │
│ ● Jan 18, 11:00 AM                                              │
│   MESSAGE_SENT - Provider sent a message                        │
│   By: Jane Smith                                                │
│                                                                 │
│ ● Jan 16, 9:00 AM                                               │
│   PAYMENT_RECEIVED - Payment of $2,500 received                 │
│   By: System                                                    │
│                                                                 │
│ ● Jan 15, 3:00 PM                                               │
│   PROJECT_CREATED - Project initialized from accepted proposal  │
│   By: System                                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Activity Types:**
- PROJECT_CREATED
- PAYMENT_RECEIVED
- FILE_UPLOADED
- FILE_DELETED
- MESSAGE_SENT
- STATUS_CHANGED
- COMPLETION_MARKED
- COMPLETION_CONFIRMED
- ESCROW_RELEASED
- PROJECT_CANCELLED
- REFUND_ISSUED

### Tab 4: Messages (Conversation)

Read-only view of project conversation:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Project Conversation                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 👤 Jane Smith (Provider)                           Jan 18, 11:00│
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ Hi John! I've completed the initial wireframes. Please   │  │
│ │ review them and let me know if you have any feedback.    │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│ 👤 John Doe (Client)                               Jan 18, 14:30│
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ Thanks Jane! The wireframes look great. I have a few     │  │
│ │ minor suggestions - can we make the header more compact? │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│ 📎 Attachment: wireframe-v1.png                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Tab 5: Escrow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Escrow Details                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Status: [HOLDING]                                               │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Deposit Amount:     $2,500.00                               │ │
│ │ Current Balance:    $2,500.00                               │ │
│ │ Released:           $0.00                                   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Timeline:                                                       │
│ • Created: Jan 15, 2024 (Project start)                         │
│ • Funded: Jan 16, 2024 (Payment received)                       │
│ • Release: Pending (awaiting completion confirmation)           │
│                                                                 │
│ Admin Actions:                                                  │
│ [Issue Refund]  [Release to Provider]                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Escrow Statuses:**
- HOLDING - Funds held awaiting release
- RELEASED - Funds released to provider
- REFUNDED - Funds returned to client

---

## API Endpoints Used

| Action | Method | Endpoint |
|--------|--------|----------|
| Get All Projects | GET | `/api/v1/projects` |
| Get Project | GET | `/api/v1/projects/:id` |
| Get Project Files | GET | `/api/v1/projects/:id/files` |
| Delete File | DELETE | `/api/v1/projects/:id/files/:fileId` |
| Get Activities | GET | `/api/v1/projects/:id/activities` |
| Get Messages | GET | `/api/v1/conversations/:id/messages` |
| Get Escrow | GET | `/api/v1/escrow/project/:projectId` |
| Issue Refund | POST | `/api/v1/payments/:id/refund` |

---

## Admin Actions

### Dispute Resolution

When project is in DISPUTED status:

1. Review all tabs (overview, files, activities, messages, escrow)
2. Determine resolution
3. Take action:
   - Issue full/partial refund
   - Release escrow to provider
   - Apply moderation action (warning/suspension)
4. Document resolution

---

## State Management

```typescript
interface ProjectsPageState {
  projects: Project[];
  total: number;
  page: number;
  statusFilter: ProjectStatus | null;
  serviceFilter: string | null;
  searchQuery: string;
  selectedProject: Project | null;
  activeTab: 'overview' | 'files' | 'activities' | 'messages' | 'escrow';
  projectFiles: ProjectFile[];
  projectActivities: Activity[];
  projectMessages: Message[];
  projectEscrow: Escrow | null;
  isLoading: boolean;
}
```
