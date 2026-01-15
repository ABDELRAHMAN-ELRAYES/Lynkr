# Module 2: Provider Onboarding & Profile - Web GUI Specification

## 1. Overview
The "Provider Experience" must feel professional and empowering. The Profile is their "Storefront".

## 2. System Pages (Enhanced)

| Page ID | Page Name | UX Goal |
|---|---|---|
| PROV-001 | Onboarding Wizard | Gamified, "Completeness" driven flow |
| PROV-002 | Provider Dashboard | Data visualization rich command center |
| PROV-004 | Public Profile | High-impact "Portfolio" style presentation |

---

## 3. Detailed Experience

### PROV-001: Onboarding Wizard
*   **Navigation**:
    *   **Sticky Sidebar/Top**: "Profile Strength" circular progress indicator. Starts at 10% -> Animates to 100% as steps complete.
    *   **Confetti**: Trigger confetti cannon animation upon "Submit Application".
*   **Step 2: Skills**:
    *   **Smart Input**: Typing "Rea..." suggests "React.js".
    *   **Tag Design**: Selected skills appear as "Pills" with specific category colors (e.g., Tech = Blue, Design = Pink).
*   **Step 5: Portfolio**:
    *   **Upload**: Large perforated drop zone. "Drag your best work here".
    *   **Preview**: Images appear immediately in a Masonry grid with a "Delete" X on hover.

### PROV-002: Provider Dashboard
*   **Visual Hierarchy**:
    *   **Greeting**: "Good Morning, [Name] 🌤️". Dynamic emoji based on time.
    *   **Stats Row**:
        *   Use **Glass Cards** for metrics (Earnings, Views).
        *   **Trend Lines**: Small sparkline charts (green up arrow) inside the cards.
*   **Action Center**:
    *   "Suggested Jobs" carousel. Horizontal scroll with snap effect.

### PROV-004: Public Profile (The "Storefront")
*   **Cover Area**:
    *   Full-width Banner image (User uploaded or default Generative pattern).
    *   **Floating Card**: The basic info (Avatar, Name, Rate) floats overlapping the banner bottom edge (Apple-style design).
*   **Content Layout**:
    *   **Sticky Sidebar**: The "Hire Me" card stays fixed on the right as user scrolls down the long bio/portfolio.
    *   **Tabs**: "Portfolio", "Reviews", "About". Active tab has a sliding underline animation (Framer Motion).
*   **Portfolio Grid**:
    *   Hovering an image: Darkens slightly, shows "View Case Study" button.
    *   Clicking: Opens a **Lightbox Overlay** (Full screen gallery) instead of navigating away.

---

## 4. Modals & Drawers

### MOD-EXP-01: Add Experience (Drawer)
*   **Pattern**: Instead of a center modal, use a **Right-Side Sheet / Drawer**. It slides in from the right, pushing content slightly or overlaying.
*   **Benefit**: Allows referencing the main profile while editing.

---

## 5. Premium UI Touches
*   **Empty States**:
    *   "No Reviews Yet": Show an illustration of a "Ghost" or "Empty Stage" with encouraging text: "Complete your first job to earn reviews!".
*   **Avatars**: Add "Online Status" ring (Green) with a breathing animation.
