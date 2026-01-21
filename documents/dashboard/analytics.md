# Analytics Page

## Overview

The Analytics page provides comprehensive platform statistics, metrics, and insights through various dashboards and charts.

**Required Privilege:** `VIEW_ANALYTICS`

---

## Page Layout

### Dashboard Sections

1. **Overview Cards** - Key metrics at a glance
2. **User Analytics** - User growth and activity
3. **Financial Analytics** - Revenue and transactions
4. **Service Analytics** - Popular services and providers
5. **Engagement Analytics** - Requests, projects, reviews

---

## Section 1: Overview Cards

```
┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│  Total Users  │ │   Providers   │ │   Projects    │ │   Revenue     │
│    12,450     │ │     856       │ │   Active: 234 │ │ This Month    │
│   ↑ 12.5%     │ │   ↑ 8.3%      │ │ Completed: 89 │ │   $45,230     │
│  vs last mo.  │ │  vs last mo.  │ │  this month   │ │   ↑ 15.2%     │
└───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘

┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│   Sessions    │ │ Subscriptions │ │    Reviews    │ │ Avg Response  │
│   Booked      │ │    Active     │ │  This Month   │ │    Time       │
│     320       │ │      68       │ │      112      │ │    2.3 hrs    │
│  this month   │ │   providers   │ │   Avg: 4.3★   │ │   ↓ 0.5 hrs   │
└───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘
```

---

## Section 2: User Analytics

### User Growth Chart

Line chart showing user registrations over time:
- X-axis: Date (configurable: daily/weekly/monthly)
- Y-axis: New user count
- Lines: Total, Clients, Providers

### User Demographics

Pie charts showing:
- Users by Role (Client, Provider, Admin)
- Users by Country (top 10)
- Active vs Inactive ratio

### User Activity Table

| Metric | Value | Change |
|--------|-------|--------|
| Daily Active Users | 2,340 | ↑ 5.2% |
| Weekly Active Users | 8,120 | ↑ 3.1% |
| Monthly Active Users | 10,450 | ↑ 8.7% |
| New Signups (today) | 45 | - |
| Returning Users | 78% | ↑ 2% |

---

## Section 3: Financial Analytics

### Revenue Chart

Bar/Line chart showing:
- X-axis: Time period
- Y-axis: Revenue amount
- Bars: Project payments, Session payments, Subscriptions
- Line: Platform commission

### Financial Summary Cards

```
┌─────────────────────────────────────────────────────────────────┐
│                    Financial Summary (This Month)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Gross Transaction Volume:      $301,533                         │
│ Platform Commission (15%):     $45,230                          │
│                                                                 │
│ Breakdown:                                                      │
│ • Project Payments:            $245,000 (81.3%)                 │
│ • Teaching Sessions:           $48,533 (16.1%)                  │
│ • Subscriptions:               $8,000 (2.6%)                    │
│                                                                 │
│ Escrow Holdings:               $67,500 (active)                 │
│ Pending Withdrawals:           $12,300                          │
│ Processed Withdrawals:         $189,200                         │
│ Refunds Issued:                $3,420                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Transaction Trends

| Metric | This Month | Last Month | Change |
|--------|------------|------------|--------|
| Total Transactions | 456 | 398 | ↑ 14.6% |
| Average Transaction | $661 | $623 | ↑ 6.1% |
| Refund Rate | 1.1% | 1.4% | ↓ 0.3% |
| Payment Success Rate | 98.2% | 97.8% | ↑ 0.4% |

---

## Section 4: Service Analytics

### Popular Services

Bar chart showing project count by service category.

| Rank | Service | Projects | Providers | Avg Rating |
|------|---------|----------|-----------|------------|
| 1 | Web Development | 234 | 156 | 4.5★ |
| 2 | Mobile Development | 189 | 98 | 4.4★ |
| 3 | UI/UX Design | 145 | 87 | 4.6★ |
| 4 | Data Science | 98 | 45 | 4.3★ |
| 5 | Digital Marketing | 78 | 52 | 4.2★ |

### Top Skills in Demand

| Skill | Requests | Growth |
|-------|----------|--------|
| React | 156 | ↑ 23% |
| Node.js | 134 | ↑ 18% |
| Python | 112 | ↑ 15% |
| Flutter | 89 | ↑ 32% |
| Figma | 78 | ↑ 12% |

### Top Providers

| Provider | Service | Projects | Rating | Revenue |
|----------|---------|----------|--------|---------|
| Jane Smith | Web Dev | 45 | 4.9★ | $67,500 |
| John Doe | Mobile | 38 | 4.8★ | $52,200 |
| Alice Wong | UI/UX | 32 | 4.9★ | $41,600 |

---

## Section 5: Engagement Analytics

### Request Funnel

```
Requests Created:     456  (100%)
        ↓
Proposals Received:   892  (avg 1.95 per request)
        ↓
Proposals Accepted:   234  (51.3% of requests)
        ↓  
Projects Started:     230  (98.3% of accepted)
        ↓
Projects Completed:   189  (82.2% completion rate)
```

### Response Time Distribution

Histogram showing provider response times:
- < 1 hour: 23%
- 1-4 hours: 35%
- 4-12 hours: 28%
- 12-24 hours: 10%
- > 24 hours: 4%

### Review Analytics

| Metric | Value |
|--------|-------|
| Total Reviews | 1,250 |
| Average Rating | 4.3★ |
| 5-Star Reviews | 45% |
| 4-Star Reviews | 32% |
| 3-Star Reviews | 15% |
| 2-Star Reviews | 5% |
| 1-Star Reviews | 3% |

---

## Date Range Selector

All analytics support date filtering:

| Preset | Description |
|--------|-------------|
| Today | Current day |
| Yesterday | Previous day |
| Last 7 Days | Past week |
| Last 30 Days | Past month |
| This Month | Current month |
| Last Month | Previous month |
| This Quarter | Current quarter |
| This Year | Year to date |
| Custom | Custom date range |

---

## Export Options

All analytics can be exported:

| Format | Description |
|--------|-------------|
| CSV | Spreadsheet data |
| PDF | Formatted report |
| PNG/SVG | Chart images |

---

## Report Scheduling

Automated report delivery:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Schedule Reports                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Report Type: [Monthly Summary ▼]                                │
│                                                                 │
│ Frequency: [Monthly ▼]                                          │
│                                                                 │
│ Send To:                                                        │
│ [admin@lynkr.com, ceo@lynkr.com_______________]                 │
│                                                                 │
│ Include Sections:                                               │
│ [✓] User Analytics                                              │
│ [✓] Financial Summary                                           │
│ [✓] Service Performance                                         │
│ [✓] Engagement Metrics                                          │
│                                                                 │
│ [Cancel]                              [Schedule Report]         │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Management

```typescript
interface AnalyticsPageState {
  dateRange: DateRange;
  
  // Overview
  overviewMetrics: OverviewMetrics;
  
  // User Analytics
  userGrowthData: TimeSeriesData;
  userDemographics: DemographicsData;
  userActivityMetrics: ActivityMetrics;
  
  // Financial
  revenueData: TimeSeriesData;
  financialSummary: FinancialSummary;
  transactionTrends: TransactionTrends;
  
  // Services
  popularServices: ServiceMetric[];
  topSkills: SkillMetric[];
  topProviders: ProviderMetric[];
  
  // Engagement
  requestFunnel: FunnelData;
  responseDistribution: DistributionData;
  reviewAnalytics: ReviewMetrics;
  
  isLoading: boolean;
}
```
