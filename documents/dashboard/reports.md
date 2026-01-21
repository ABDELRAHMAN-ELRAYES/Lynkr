# Reports Page

## Overview

The Reports page handles user reports and moderation actions. Admins can review, investigate, and take action on reported content or users.

**Required Privilege:** `MANAGE_REPORTS`

---

## Page Layout

### Main Sections

1. **Header Area**
   - Page title: "Reports & Moderation"
   - Filter options

2. **Statistics Cards**
   - New Reports (today)
   - Under Review
   - Resolved This Month
   - Dismissed

3. **Reports Table**
   - Paginated report list
   - Actions per row

4. **Report Detail Panel/Modal**
   - Full report information
   - Investigation tools
   - Action options

---

## Statistics Cards

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│    New      │ │   Under     │ │  Resolved   │ │  Dismissed  │
│  Reports    │ │   Review    │ │ This Month  │ │ This Month  │
│     12      │ │      5      │ │     45      │ │     8       │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

---

## Reports Table

### Filter Bar

| Filter | Options |
|--------|---------|
| Status | All, SUBMITTED, UNDER_REVIEW, RESOLVED, DISMISSED |
| Category | All, Profile, Harassment, Payment, Fake Review, Service, Spam |
| Priority | All, High, Medium, Low |
| Date Range | Report date |

### Table Columns

| Column | Sortable | Description |
|--------|----------|-------------|
| ID | Yes | Report ID |
| Reporter | Yes | Who submitted |
| Target | Yes | Reported user/content |
| Category | Yes | Report category |
| Status | Yes | Current status |
| Submitted | Yes | Report date |
| Actions | No | View, Change Status |

---

## Report Status Workflow

```
SUBMITTED → UNDER_REVIEW → RESOLVED
                        ↘ DISMISSED
```

| Status | Description | Next Actions |
|--------|-------------|--------------|
| SUBMITTED | New report awaiting review | Start Review |
| UNDER_REVIEW | Admin actively investigating | Resolve, Dismiss |
| RESOLVED | Action taken, case closed | None |
| DISMISSED | Report invalid/unfounded | None |

---

## Report Detail View

```
┌─────────────────────────────────────────────────────────────────┐
│                    Report #RPT-2024-001                          │
│                    Status: [UNDER_REVIEW]                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Category: Harassment                                            │
│ Priority: High                                                  │
│ Submitted: Jan 25, 2024 at 2:30 PM                              │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ REPORTER                         TARGET                         │
│ 👤 John Doe                      👤 Jane Smith                   │
│ john@example.com                 jane@example.com                │
│ [View Profile]                   [View Profile]                  │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ Report Description:                                             │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ The provider sent threatening messages after I rejected   │  │
│ │ their proposal. They used inappropriate language and      │  │
│ │ made personal attacks. I have screenshots attached.       │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│ Evidence Submitted:                                             │
│ 📎 screenshot1.png  📎 screenshot2.png                          │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ Related Context:                                                │
│ • Request: Website Development Project [View →]                 │
│ • Proposal: Rejected on Jan 24 [View →]                         │
│ • Conversation: 12 messages [View →]                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Investigation Panel

```
┌─────────────────────────────────────────────────────────────────┐
│                    Investigation Tools                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Target User History:                                            │
│ • Previous Reports: 2 (1 resolved, 1 dismissed)                 │
│ • Account Status: Active                                        │
│ • Member Since: Mar 2023                                        │
│ • Projects Completed: 15                                        │
│ • Average Rating: 4.2 ★                                         │
│                                                                 │
│ Quick Actions:                                                  │
│ [View Target's Profile] [View Target's Projects]                │
│ [View Target's Reviews] [View Target's Messages]                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Moderation Actions Panel

```
┌─────────────────────────────────────────────────────────────────┐
│                    Take Action                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Action Type:                                                    │
│ ○ Warning - Send warning notification                           │
│ ○ Suspension - Temporarily disable account                      │
│ ○ Ban - Permanently disable account                             │
│ ○ No Action - Dismiss report                                    │
│                                                                 │
│ Admin Notes (required)*:                                        │
│ [________________________________________________]             │
│ [________________________________________________]             │
│ [________________________________________________]             │
│                                                                 │
│ Notify Reporter: [✓] Send outcome notification                  │
│ Notify Target:   [✓] Send action notification                   │
│                                                                 │
│ [Cancel]                              [Submit Action]           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Action History

Each report has an action log:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Action History                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ● Jan 25, 3:45 PM - Status changed to UNDER_REVIEW              │
│   By: Admin Mike                                                │
│   Note: "Reviewing messages between parties"                    │
│                                                                 │
│ ● Jan 25, 2:30 PM - Report SUBMITTED                            │
│   By: System (John Doe)                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Endpoints Used

| Action | Method | Endpoint |
|--------|--------|----------|
| Get Reports | GET | `/api/v1/reports` |
| Get Report | GET | `/api/v1/reports/:id` |
| Update Status | PATCH | `/api/v1/reports/:id/status` |
| Add Action | POST | `/api/v1/reports/:id/actions` |

---

## Report Categories

| Category | Description |
|----------|-------------|
| Profile Violations | Inappropriate content, fake info |
| Harassment/Abuse | Threats, discrimination, bullying |
| Payment Disputes | Non-delivery, quality issues |
| Fake Reviews | Fabricated positive/negative reviews |
| Service Quality | Provider not meeting expectations |
| Spam | Unsolicited promotions |

---

## State Management

```typescript
interface ReportsPageState {
  reports: Report[];
  total: number;
  page: number;
  filters: {
    status: ReportStatus | null;
    category: ReportCategory | null;
    priority: Priority | null;
    dateRange: DateRange | null;
  };
  selectedReport: Report | null;
  isDetailPanelOpen: boolean;
  isActionModalOpen: boolean;
  isLoading: boolean;
}

interface Report {
  id: string;
  reporter: User;
  target: User;
  category: ReportCategory;
  description: string;
  evidence: string[];
  status: ReportStatus;
  priority: Priority;
  relatedEntities: RelatedEntity[];
  actions: ReportAction[];
  createdAt: string;
}
```
