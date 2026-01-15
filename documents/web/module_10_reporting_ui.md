# Module 10: Reporting - Web GUI Specification

## 1. Overview
This is a functional utility, but should still feel polished.

## 2. Modals

### MOD-REPORT
*   **Tone**: Serious, clean, no distractions.
*   **Multi-Step**:
    1.  **Reason**: "Why are you reporting this?" (Radio list).
    2.  **Details**: Text input.
    3.  **Evidence**: File upload (Optional).
*   **Success**:
    *   "Thank you. We will review this shortly."
    *   Do NOT use confetti here. Use a simple Checkmark circle.

## 3. Admin Dashboard (Reports)
*   **Data Grid**:
    *   Use a high-density table (Ag-Grid style or similar layout).
    *   **Status Pills**: `Resolved` (Green), `Pending` (Yellow), `Banned` (Red).
*   **Quick Actions**:
    *   Hovering a row shows `Verify` / `Dismiss` buttons immediately.

---

## 4. Premium UI Touches
*   **Privacy Blur**:
    *   In the Admin view, reported content (images) handles should be "Blurred" by default until Admin clicks "Reveal Content" (for safety).
