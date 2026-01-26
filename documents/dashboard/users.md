# Users Page

## Overview

The Users page provides complete user management capabilities including viewing, creating, editing, and managing all platform users.

**Required Privilege:** `MANAGE_USERS`

---

## Page Layout

### Main Sections

1. **Header Area**
   - Page title: "User Management"
   - Primary action button: "Add User"
   - Search input field
   - Filter dropdowns

2. **Statistics Cards** (Top row)
   - Total Users
   - Active Users
   - Inactive Users
   - New This Month

3. **User Table** (Main content)
   - Paginated user list
   - Sortable columns
   - Action buttons per row

4. **Modals**
   - Create User Modal
   - Edit User Modal
   - View User Details Modal
   - Assign Privileges Modal (for admins)

---

## API Endpoints Used

| Action | Method | Endpoint |
|--------|--------|----------|
| Fetch Users | GET | `/api/users/batch` |
| Get Statistics | GET | `/api/users/statistics` |
| Get Single User | GET | `/api/users/:id` |
| Create User | POST | `/api/users` |
| Create Batch Users | POST | `/api/users/batch` |
| Update User | PUT | `/api/users/:id` |
| Update Status | PATCH | `/api/users/:id` |
| Update Password | PATCH | `/api/users/:id/password` |
| Delete User | DELETE | `/api/users/:id` |

---

## Components

### 1. Statistics Cards

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Total Users │ │   Active    │ │  Inactive   │ │ New This    │
│    1,234    │ │   1,100     │ │     134     │ │ Month: 45   │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

### 2. Filter Bar

| Filter | Type | Options |
|--------|------|---------|
| Search | Text Input | Search by name/email |
| Role | Dropdown | All, CLIENT, PROVIDER, ADMIN, SUPER_ADMIN |
| Status | Dropdown | All, Active, Inactive |
| Date Range | Date Picker | Registration date range |

### 3. User Table Columns

| Column | Sortable | Description |
|--------|----------|-------------|
| Avatar | No | User profile image |
| Name | Yes | First + Last name |
| Email | Yes | Email address |
| Role | Yes | User role badge |
| Status | Yes | Active/Inactive toggle |
| Created | Yes | Registration date |
| Actions | No | Edit, View, Delete buttons |

### 4. Row Actions

| Action | Icon | Description |
|--------|------|-------------|
| View | 👁️ | Open user details modal |
| Edit | ✏️ | Open edit user form |
| Change Password | 🔑 | Reset user password |
| Toggle Status | 🔄 | Activate/Deactivate |
| Assign Privileges | 🛡️ | For admin users only |
| Delete | 🗑️ | Remove user (with confirmation) |

---

## Modals

### Create User Modal

**Fields:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| First Name | Text | Yes | Min 2 chars |
| Last Name | Text | Yes | Min 2 chars |
| Email | Email | Yes | Valid email format |
| Password | Password | Yes | Min 8 chars, complexity rules |
| Phone | Tel | No | Valid phone format |
| Country | Select | No | Country list |
| Role | Select | Yes | CLIENT, PROVIDER, ADMIN, SUPER_ADMIN |

**Form Layout:**
```
┌────────────────────────────────────────┐
│           Create New User              │
├────────────────────────────────────────┤
│ First Name*        Last Name*          │
│ [____________]     [_____________]     │
│                                        │
│ Email*                                 │
│ [____________________________________] │
│                                        │
│ Password*                              │
│ [____________________________________] │
│                                        │
│ Phone              Country             │
│ [____________]     [Select ▼]          │
│                                        │
│ Role*                                  │
│ [Select Role ▼]                        │
│                                        │
│ [Cancel]                    [Create]   │
└────────────────────────────────────────┘
```

### Assign Privileges Modal (Admin Users Only)

**Checkboxes:**

| Privilege | Description |
|-----------|-------------|
| ☐ MANAGE_USERS | User CRUD operations |
| ☐ MANAGE_PROVIDERS | Provider applications |
| ☐ MANAGE_SERVICES | Service/Skill data |
| ☐ MANAGE_REPORTS | Report handling |
| ☐ MANAGE_PAYMENTS | Financial oversight |
| ☐ MANAGE_SUBSCRIPTIONS | Subscription plans |
| ☐ MANAGE_SETTINGS | Platform config |
| ☐ VIEW_ANALYTICS | Dashboard access |
| ☐ MANAGE_REVIEWS | Review moderation |

---

## User Details View

When clicking "View" on a user:

### Tabs in Detail Modal:

1. **Profile**
   - Basic info (name, email, phone, country)
   - Account status
   - Role & privileges
   - Registration date

2. **Activity**
   - Recent login history
   - Role changes
   - Status changes

3. **Projects** (if CLIENT or PROVIDER)
   - List of associated projects
   - Quick link to project details

4. **Transactions** (if applies)
   - Payment history
   - Escrow involvement

---

## Batch User Creation

For bulk onboarding:

1. Click "Add User" → "Batch Import"
2. Upload CSV or enter JSON
3. Preview users to be created
4. Confirm and create

**CSV Format:**
```csv
email,firstName,lastName,password,role
user1@example.com,John,Doe,Password1!,CLIENT
user2@example.com,Jane,Smith,Password2!,PROVIDER
```

---

## State Management

```typescript
interface UsersPageState {
  users: User[];
  total: number;
  page: number;
  limit: number;
  search: string;
  roleFilter: UserRole | null;
  statusFilter: boolean | null;
  isLoading: boolean;
  selectedUser: User | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isViewModalOpen: boolean;
  isPrivilegesModalOpen: boolean;
}
```

---

## Error Handling

| Error | User Message |
|-------|--------------|
| 400 - Email exists | "A user with this email already exists" |
| 403 - No permission | "You don't have permission to perform this action" |
| 404 - User not found | "User not found or has been deleted" |
| 500 - Server error | "Something went wrong. Please try again." |
