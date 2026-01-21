# Dashboard Documentation

This directory contains detailed implementation specifications for each admin dashboard page.

## Navbar Structure

The admin dashboard has the following main navigation items:

| Tab | Page File | Description |
|-----|-----------|-------------|
| Users | [users.md](./users.md) | User management, creation, roles |
| Providers | [providers.md](./providers.md) | Provider applications & profiles |
| Services | [services.md](./services.md) | Services & skills master data |
| Projects | [projects.md](./projects.md) | Project oversight & management |
| Payments | [payments.md](./payments.md) | Financial oversight & escrow |
| Subscriptions | [subscriptions.md](./subscriptions.md) | Subscription plan management |
| Reports | [reports.md](./reports.md) | Reporting & moderation |
| Reviews | [reviews.md](./reviews.md) | Review moderation |
| Teaching | [teaching.md](./teaching.md) | Teaching session oversight |
| Settings | [settings.md](./settings.md) | Platform configuration |
| Analytics | [analytics.md](./analytics.md) | Statistics & dashboards |

## Navigation Hierarchy

```
Admin Dashboard
├── Users (single nav item)
├── Providers (single nav item)
├── Services (single nav item)
├── Projects (single nav item)
├── Payments (single nav item)
├── Subscriptions (single nav item)
├── Reports (single nav item)
├── Reviews (single nav item)
├── Teaching (single nav item)
├── Settings (single nav item)
└── Analytics (single nav item)
```

## Required Privilege for Each Tab

| Tab | Required Privilege |
|-----|-------------------|
| Users | `MANAGE_USERS` |
| Providers | `MANAGE_PROVIDERS` |
| Services | `MANAGE_SERVICES` |
| Projects | `VIEW_ANALYTICS` (read) / `MANAGE_PAYMENTS` (actions) |
| Payments | `MANAGE_PAYMENTS` |
| Subscriptions | `MANAGE_SUBSCRIPTIONS` |
| Reports | `MANAGE_REPORTS` |
| Reviews | `MANAGE_REVIEWS` |
| Teaching | `VIEW_ANALYTICS` |
| Settings | `MANAGE_SETTINGS` |
| Analytics | `VIEW_ANALYTICS` |
