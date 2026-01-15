# Module 1: Identity & Access Management (IAM) - Web GUI Specification

## 1. Overview
This module handles the entry point for all users. The goal is a **frictionless, trustworthy, and visually stunning** entry experience.

## 2. System Pages

| Page ID | Page Name | URL Path | User Role | Description |
|---|---|---|---|---|
| AUTH-001 | Login Page | `/auth/login` | Public | Entry point with "Glass" card design |
| AUTH-002 | Register Landing | `/auth/register` | Public | Interactive Role Selection |
| AUTH-003 | Client Signup | `/auth/register/client` | Public | Streamlined form |
| AUTH-004 | Provider Signup | `/auth/register/provider` | Public | Value-proposition focused form |
| AUTH-005 | Verify Email | `/auth/verify` | Public | OTP entry with auto-advance |
| AUTH-006 | Forgot Password | `/auth/forgot-password` | Public | Recovery flow |
| AUTH-007 | Reset Password | `/auth/reset-password` | Public | Secure reset |

---

## 3. High-Fidelity Details & Interactions

### AUTH-001: Login Page
*   **Visual Style**:
    *   **Background**: Dynamic gradient mesh or blur (Aurora effect) moving slowly.
    *   **Card**: Glassmorphism effect (White with 10% opacity, blur 20px, thin border).
*   **Layout**:
    *   **Left (Desktop)**: Branding "Art" - High definition vector illustration of people connecting. Text: "Unlock Global Talent".
    *   **Right**: The floating glass form.
*   **Micro-Interactions**:
    *   Input focus: Border glows Primary Color, label floats up (Material style) or smooth fade.
    *   Button Hover: Slight lift (transform: translateY(-2px)) + Shadow bloom.
*   **Components**:
    *   `Social Login Row`: "Google" button with full logo, white background, shadow-sm. Use a separator line "Or continue with".
    *   `Password Input`: Eye icon toggles visible/hidden with a smooth morph animation.

### AUTH-002: Register Landing (Role Selection)
*   **Layout**: Centralized "Hero" container.
*   **The Experience**:
    *   Heading: "How do you want to use Lynkr?"
    *   **Selection Cards** (Large Clickable Areas):
        *   **Client Card**:
            *   Icon: Animated Lottie file (Person hiring).
            *   Hover: Card expands, background color shifts to soft Blue.
            *   Radio Button: Top right corner checkmark appears on selection.
        *   **Provider Card**:
            *   Icon: Animated Lottie file (Person working on laptop).
            *   Hover: Card expands, background color shifts to soft Purple.
    *   **Action**: "Create Account" button appears/activates *only* after selection is made (Slide up animation).

### AUTH-003 / AUTH-004: Signup Forms
*   **Progressive Disclosure**:
    *   Don't show all fields at once if possible. Group into "Account" (Name/Email) and "Security" (Password) if length allows, or keep simple.
*   **Password Strength**: real-time bar that grows Green/Yellow/Red. Context tooltips ("Add a number", "Add a symbol") fade in/out.

### AUTH-005: OTP Verification
*   **Interaction**:
    *   **Auto-Focus**: Immediate focus on load.
    *   **Paste Support**: Pasting "123456" automatically fills all slots.
    *   **Auto-Submit**: Trigger API call instantly on 6th digit input. Show loading spinner inside the inputs or overlay.

---

## 4. Premium UI Touches
*   **Transitions**: Page transitions (Fade + Slide Up) when moving from Login -> Register.
*   **Error States**: Shake animation on the form card when submission fails. Inputs turn subtle red with soft red background.
*   **Loading**: Don't use standard browser loaders. Use a custom "Pulse" logo or skeleton loader for the entire container.
