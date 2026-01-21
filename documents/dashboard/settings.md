# Settings Page

## Overview

The Settings page provides platform-wide configuration options for system settings, feature toggles, and administrative preferences.

**Required Privilege:** `MANAGE_SETTINGS`

---

## Page Layout

### Sections (Vertical Layout)

1. **General Settings**
2. **Commission & Fees**
3. **Security Settings**
4. **Feature Toggles**
5. **Email Configuration**
6. **Notification Settings**

---

## Section 1: General Settings

```
┌─────────────────────────────────────────────────────────────────┐
│                    General Settings                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Platform Name                                                   │
│ [Lynkr_________________________________]                        │
│                                                                 │
│ Platform URL                                                    │
│ [https://lynkr.com_____________________]                        │
│                                                                 │
│ Support Email                                                   │
│ [support@lynkr.com_____________________]                        │
│                                                                 │
│ Default Language                                                │
│ [English (US) ▼]                                                │
│                                                                 │
│ Default Currency                                                │
│ [USD ($) ▼]                                                     │
│                                                                 │
│ Default Timezone                                                │
│ [UTC ▼]                                                         │
│                                                                 │
│ [Save Changes]                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Section 2: Commission & Fees

```
┌─────────────────────────────────────────────────────────────────┐
│                    Commission & Fees                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Platform Commission Rate                                        │
│ [15__] %                                                        │
│ (Percentage taken from each transaction)                        │
│                                                                 │
│ Minimum Withdrawal Amount                                       │
│ $ [10.00____]                                                   │
│ (Minimum amount providers can withdraw)                         │
│                                                                 │
│ Withdrawal Processing Fee                                       │
│ $ [0.00_____]                                                   │
│ (Fixed fee per withdrawal, 0 for no fee)                        │
│                                                                 │
│ [Save Changes]                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Section 3: Security Settings

```
┌─────────────────────────────────────────────────────────────────┐
│                    Security Settings                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ OTP Expiration Time                                             │
│ [10__] minutes                                                  │
│                                                                 │
│ Password Reset Link Validity                                    │
│ [15__] minutes                                                  │
│                                                                 │
│ Session Timeout                                                 │
│ [30__] days                                                     │
│                                                                 │
│ Max Login Attempts                                              │
│ [5___] attempts before lockout                                  │
│                                                                 │
│ Lockout Duration                                                │
│ [30__] minutes                                                  │
│                                                                 │
│ Password Requirements:                                          │
│ [✓] Minimum 8 characters                                        │
│ [✓] At least one uppercase letter                               │
│ [✓] At least one number                                         │
│ [✓] At least one special character                              │
│                                                                 │
│ [Save Changes]                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Section 4: Feature Toggles

```
┌─────────────────────────────────────────────────────────────────┐
│                    Feature Toggles                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Maintenance Mode                                    [○ OFF]     │
│ Disable platform access for non-admin users                     │
│                                                                 │
│ New User Registrations                              [● ON]      │
│ Allow new users to register                                     │
│                                                                 │
│ Google OAuth Login                                  [● ON]      │
│ Enable Google authentication                                    │
│                                                                 │
│ Provider Applications                               [● ON]      │
│ Allow users to apply as providers                               │
│                                                                 │
│ Teaching Module                                     [● ON]      │
│ Enable teaching/scheduling features                             │
│                                                                 │
│ Subscription Required for Providers                 [○ OFF]     │
│ Require active subscription to receive requests                 │
│                                                                 │
│ [Save Changes]                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Section 5: Email Configuration

```
┌─────────────────────────────────────────────────────────────────┐
│                    Email Configuration                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Email Service Provider                                          │
│ [Gmail ▼]                                                       │
│                                                                 │
│ SMTP Host                                                       │
│ [smtp.gmail.com________________________]                        │
│                                                                 │
│ SMTP Port                                                       │
│ [465__]                                                         │
│                                                                 │
│ Email User                                                      │
│ [noreply@lynkr.com____________________]                         │
│                                                                 │
│ Email Password                                                  │
│ [••••••••••••••••____] [Show]                                   │
│                                                                 │
│ From Name                                                       │
│ [Lynkr_________________________________]                        │
│                                                                 │
│ From Email                                                      │
│ [noreply@lynkr.com_____________________]                        │
│                                                                 │
│ [Test Email] [Save Changes]                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Section 6: Notification Settings

```
┌─────────────────────────────────────────────────────────────────┐
│                    Notification Settings                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Send Email Notifications For:                                   │
│                                                                 │
│ [✓] New user registration                                       │
│ [✓] Password reset requests                                     │
│ [✓] Provider application status                                 │
│ [✓] New service requests received                               │
│ [✓] Proposal updates                                            │
│ [✓] Project status changes                                      │
│ [✓] Payment confirmations                                       │
│ [✓] Escrow releases                                             │
│ [✓] Session bookings                                            │
│ [✓] Account warnings/suspensions                                │
│                                                                 │
│ [Save Changes]                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Business Rules Settings

```
┌─────────────────────────────────────────────────────────────────┐
│                    Business Rules                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Provider Re-application Cooldown                                │
│ [30__] days after rejection                                     │
│                                                                 │
│ Request Auto-Publish Delay                                      │
│ [3___] days before public posting                               │
│                                                                 │
│ Teaching Scheduling Window                                      │
│ [4___] weeks ahead maximum                                      │
│                                                                 │
│ Maximum Group Session Size                                      │
│ [20__] participants                                             │
│                                                                 │
│ File Upload Limits:                                             │
│ Maximum file size: [10__] MB                                    │
│ Allowed types: [pdf, doc, docx, jpg, png, gif]                  │
│                                                                 │
│ [Save Changes]                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Save Confirmation

All settings changes require confirmation:

```
┌─────────────────────────────────────────────────────────────────┐
│               Confirm Changes                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ⚠️ You are about to modify platform settings.                   │
│                                                                 │
│ Changes being made:                                             │
│ • Platform Commission Rate: 15% → 18%                           │
│ • OTP Expiration Time: 10 min → 15 min                          │
│                                                                 │
│ These changes will take effect immediately.                     │
│                                                                 │
│ [Cancel]                              [Confirm & Apply]         │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Management

```typescript
interface SettingsPageState {
  settings: PlatformSettings;
  originalSettings: PlatformSettings;
  hasChanges: boolean;
  isConfirmModalOpen: boolean;
  isSaving: boolean;
  isLoading: boolean;
}

interface PlatformSettings {
  general: {
    platformName: string;
    platformUrl: string;
    supportEmail: string;
    defaultLanguage: string;
    defaultCurrency: string;
    defaultTimezone: string;
  };
  commission: {
    rate: number;
    minWithdrawal: number;
    withdrawalFee: number;
  };
  security: {
    otpExpiration: number;
    passwordResetValidity: number;
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    passwordRequirements: PasswordRequirements;
  };
  features: {
    maintenanceMode: boolean;
    newRegistrations: boolean;
    googleOAuth: boolean;
    providerApplications: boolean;
    teachingModule: boolean;
    subscriptionRequired: boolean;
  };
  email: EmailConfig;
  notifications: NotificationConfig;
  businessRules: BusinessRules;
}
```
