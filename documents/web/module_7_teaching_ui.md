# Module 7: Teaching & Scheduling - Web GUI Specification

## 1. Overview
Calendly-style simplicity with custom branding.

## 2. System Pages

| Page ID | Page Name | UX Goal |
|---|---|---|
| TCH-001 | Availability Manager | Drag-and-drop ease |
| TCH-002 | Booking Flow | Frictionless conversion step |

---

## 3. High-Fidelity Details

### TCH-001: Availability Manager
*   **Interaction**: **Click & Drag**.
    *   Provider can click a time and drag down to select duration (e.g., 9am - 11am).
    *   **Resize**: Grab bottom handle of a slot to extend it.
*   **Color Coding**:
    *   `Open Slot`: Green outline.
    *   `Booked Slot`: Solid Blue.
    *   `Past Slot`: Grayed out / Stripped pattern.

### TCH-002: Booking Flow (Student)
*   **Step-by-Step Transition**:
    *   Select Date -> (Slide Left) -> Select Time -> (Slide Left) -> Confirm Details.
    *   Maintains focus without reloading page.
*   **Timezone Intelligence**:
    *   Auto-detect user timezone.
    *   Banner: "Times are shown in your local time (London/BST)".

---

## 4. Premium UI Touches
*   **Countdown-to-Start**:
    *   On "My Sessions" card, the countdown ("Starts in 00:45:00") uses a monospace font (like a digial clock) for stability.
*   **Join Button Pulse**:
    *   When 5 minutes remain, the "Join Meeting" button gets a "Heartbeat" glow animation to attract attention.
