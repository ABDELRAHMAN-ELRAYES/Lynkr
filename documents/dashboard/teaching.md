# Teaching Page

## Overview

The Teaching page provides oversight of teaching sessions and provider availability slots.

**Required Privilege:** `VIEW_ANALYTICS`

---

## Page Layout

### Tabs (Within Single Page)

1. **Sessions** - All teaching sessions
2. **Slots** - Provider availability slots

---

## Tab 1: Sessions

### Statistics Cards

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Scheduled  │ │ In Progress │ │  Completed  │ │  Cancelled  │
│   Today     │ │    Now      │ │ This Month  │ │ This Month  │
│     15      │ │      3      │ │    120      │ │      8      │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

### Filter Bar

| Filter | Options |
|--------|---------|
| Status | All, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED |
| Type | All, 1-to-1, Group |
| Provider | Search/select provider |
| Date Range | Session date |

### Sessions Table

| Column | Sortable | Description |
|--------|----------|-------------|
| Session | Yes | Session title/subject |
| Provider | Yes | Instructor name |
| Type | Yes | 1-to-1 or Group |
| Students | No | Participant count |
| Date/Time | Yes | Scheduled time |
| Duration | Yes | Session length |
| Status | Yes | Current status |
| Actions | No | View Details |

### Session Statuses

| Status | Badge Color | Description |
|--------|-------------|-------------|
| SCHEDULED | Blue | Upcoming session |
| IN_PROGRESS | Green | Currently ongoing |
| COMPLETED | Gray | Finished session |
| CANCELLED | Red | Was cancelled |

---

## Session Detail Modal

```
┌─────────────────────────────────────────────────────────────────┐
│                    Session Details                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Subject: Advanced JavaScript Concepts                           │
│ Status: [COMPLETED]                                             │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ INSTRUCTOR                                                      │
│ 👤 Dr. Jane Smith                                               │
│ jane@example.com                                                │
│ Rating: 4.8 ★ (56 reviews)                                      │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ Session Info:                                                   │
│ • Type: Group Session (max 20)                                  │
│ • Date: Jan 20, 2024                                            │
│ • Time: 2:00 PM - 3:30 PM (90 min)                              │
│ • Price: $45 per participant                                    │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ Participants (8/20):                                            │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 👤 John Doe        Joined: 1:58 PM   Left: 3:30 PM          │ │
│ │ 👤 Alice Smith     Joined: 2:00 PM   Left: 3:30 PM          │ │
│ │ 👤 Bob Johnson     Joined: 2:05 PM   Left: 3:15 PM          │ │
│ │ ... 5 more participants                                     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Revenue: $360 (8 × $45)                                         │
│ Platform Fee: $54 (15%)                                         │
│ Instructor Earnings: $306                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tab 2: Slots

### Filter Bar

| Filter | Options |
|--------|---------|
| Provider | Search/select provider |
| Type | All, 1-to-1, Group |
| Status | All, Available, Booked |
| Date Range | Slot date |

### Slots Table

| Column | Description |
|--------|-------------|
| Provider | Instructor name |
| Date | Slot date |
| Time | Start - End time |
| Duration | Slot length |
| Type | 1-to-1 / Group |
| Capacity | Available / Total |
| Status | Available / Booked / Expired |

---

## API Endpoints Used

| Action | Method | Endpoint |
|--------|--------|----------|
| Get Sessions | GET | `/api/teaching/sessions` |
| Get Session | GET | `/api/teaching/sessions/:id` |
| Get Participants | GET | `/api/teaching/sessions/:id/participants` |
| Get Slots | GET | `/api/teaching/slots` |

---

## Admin Viewing Only

> Note: This page is read-only for admin oversight. Session management (creation, cancellation) is done by providers through their own dashboard.

---

## State Management

```typescript
interface TeachingPageState {
  activeTab: 'sessions' | 'slots';
  
  // Sessions
  sessions: TeachingSession[];
  sessionFilters: {
    status: SessionStatus | null;
    type: SessionType | null;
    providerId: string | null;
    dateRange: DateRange | null;
  };
  selectedSession: TeachingSession | null;
  
  // Slots
  slots: TimeSlot[];
  slotFilters: {
    providerId: string | null;
    type: SessionType | null;
    status: SlotStatus | null;
    dateRange: DateRange | null;
  };
  
  isDetailModalOpen: boolean;
  isLoading: boolean;
}
```
