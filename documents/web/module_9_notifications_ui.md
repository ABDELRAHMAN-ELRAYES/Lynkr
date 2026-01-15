# Module 9: Notifications - Web GUI Specification

## 1. Overview
Non-intrusive but noticeable.

## 2. Components

### Notification Dropdown
*   **Header**: "Tabs" inside the dropdown?
    *   `All`, `Unread`, `Mentions`.
*   **Empty State**:
    *   "All caught up!" with a sleepy illustration (Sun/Moon).
*   **Item Design**:
    *   **Unread**: Light Blue background.
    *   **Read**: White/Transparent background.
    *   **Actionable**: If notification is "Proposal Recieved", include a `View` button *inline* in the notification item.

### Activity Feed
*   **Timeline Line**:
    *   Vertical line connecting items on the left side.
    *   Icons (circles) sit on the line.

---

## 3. Premium UI Touches
*   **Toasts (Snackbars)**:
    *   Position: Bottom-Left (less intrusive than Top-Right).
    *   **Stacking**: If multiple events happen, stack them like cards with a slight vertical offset.
    *   **Swipe to dismiss**: On mobile, swipe toast left to close.
*   **Grouped Events**:
    *   "John and 3 others liked your profile." (Stacked avatars).
