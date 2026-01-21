# Reviews Page

## Overview

The Reviews page provides moderation capabilities for platform reviews. Admins can view, filter, and remove inappropriate reviews.

**Required Privilege:** `MANAGE_REVIEWS`

---

## Page Layout

### Main Sections

1. **Header Area**
   - Page title: "Review Moderation"
   - Search and filters

2. **Statistics Cards**
   - Total Reviews
   - This Month
   - Flagged for Review
   - Average Rating

3. **Reviews Table/List**
   - Paginated review list
   - Actions per row

---

## Statistics Cards

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Total     │ │ This Month  │ │  Flagged    │ │  Platform   │
│  Reviews    │ │    Added    │ │ for Review  │ │   Avg ★     │
│   1,250     │ │     89      │ │      3      │ │    4.2      │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

---

## Reviews Table

### Filter Bar

| Filter | Options |
|--------|---------|
| Type | All, Project, Session |
| Rating | All, 1★, 2★, 3★, 4★, 5★ |
| Flagged | Show flagged only |
| Date Range | Review date |
| Search | Search by content/names |

### Table Columns

| Column | Sortable | Description |
|--------|----------|-------------|
| Reviewer | Yes | Who wrote the review |
| Provider | Yes | Provider being reviewed |
| Type | Yes | Project or Session |
| Rating | Yes | Star rating |
| Content | No | Review text (truncated) |
| Date | Yes | Review date |
| Flagged | No | Flag indicator |
| Actions | No | View, Delete |

---

## Review Detail Modal

```
┌─────────────────────────────────────────────────────────────────┐
│                    Review Details                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Rating: ★★★★☆ (4/5)                                             │
│ Type: Project Review                                            │
│ Date: Jan 20, 2024                                              │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ REVIEWER                         PROVIDER                       │
│ 👤 John Doe (Client)             👤 Jane Smith                   │
│ [View Profile]                   [View Profile]                  │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ Review Content:                                                 │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ Great work on the website redesign! Jane was professional │  │
│ │ and delivered on time. Would highly recommend for web     │  │
│ │ development projects. Communication was excellent.        │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│ Related:                                                        │
│ • Project: Website Redesign [View →]                            │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ Admin Actions:                                                  │
│ [Keep Review]                              [Delete Review]      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Flagging Criteria

Reviews may be flagged for:

| Criterion | Description | Auto-Flag |
|-----------|-------------|-----------|
| Inappropriate Language | Profanity, hate speech | Yes |
| Personal Attacks | Threats, harassment | Yes |
| Suspected Fake | Unusual patterns | Yes |
| Irrelevant Content | Off-topic reviews | No |
| Spam | Promotional content | Yes |
| Reported by User | User submitted report | No |

---

## Delete Review Confirmation

```
┌─────────────────────────────────────────────────────────────────┐
│               Delete Review                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ⚠️ Are you sure you want to delete this review?                 │
│                                                                 │
│ Review by: John Doe                                             │
│ For: Jane Smith                                                 │
│ Rating: 4 stars                                                 │
│                                                                 │
│ Reason for deletion*:                                           │
│ [__________________ ▼]                                          │
│ • Inappropriate language                                        │
│ • Personal attacks                                              │
│ • Fake/fraudulent review                                        │
│ • Spam/promotional                                              │
│ • Other                                                         │
│                                                                 │
│ Additional notes:                                               │
│ [________________________________________________]             │
│                                                                 │
│ Notify reviewer: [✓]                                            │
│                                                                 │
│ [Cancel]                              [Delete Review]           │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Endpoints Used

| Action | Method | Endpoint |
|--------|--------|----------|
| Get Reviews | GET | `/api/v1/reviews` |
| Get Review | GET | `/api/v1/reviews/:id` |
| Delete Review | DELETE | `/api/v1/reviews/:id` |

---

## Impact of Deletion

When a review is deleted:
- Provider's average rating is recalculated
- Provider's review count is decremented
- Reviewer is optionally notified
- Action is logged for audit

---

## State Management

```typescript
interface ReviewsPageState {
  reviews: Review[];
  total: number;
  page: number;
  filters: {
    type: 'PROJECT' | 'SESSION' | null;
    rating: number | null;
    flaggedOnly: boolean;
    dateRange: DateRange | null;
    search: string;
  };
  selectedReview: Review | null;
  isDetailModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isLoading: boolean;
}

interface Review {
  id: string;
  reviewer: User;
  provider: User;
  type: 'PROJECT' | 'SESSION';
  rating: number;
  content: string;
  isFlagged: boolean;
  flagReason?: string;
  relatedEntityId: string;
  createdAt: string;
}
```
