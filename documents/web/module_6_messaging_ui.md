# Module 6: Messaging & Meetings - Web GUI Specification

## 1. Overview
A **WhatsApp/Slack-like** experience. Fast, responsive, and intuitive.

## 2. System Pages

| Page ID | Page Name | UX Goal |
|---|---|---|
| MSG-001 | Chat Interface | Instant communication |
| MTG-001 | Video Room | Stable, easy-to-use conferencing |

---

## 3. High-Fidelity Details

### MSG-001: Chat Interface
*   **Sidebar (Threads)**:
    *   **Active State**: Selected thread has a light blue background and a blue vertical accent bar on left.
    *   **Snippets**: Truncate with ellipsis.
*   **Conversation Area**:
    *   **Bubble Design**:
        *   **Me**: Primary Color Gradient background, White text. Border-radius usually (18px) with one sharp corner (bottom-right).
        *   **Them**: Light Gray background, Dark text. Sharp corner (bottom-left).
    *   **Grouping**: Messages sent within 1 minute by same user Group together (Avatar only on last one).
    *   **Date Separators**: "Today", "Yesterday" sticky headers in the chat scroll.
*   **Input**:
    *   **Auto-Height**: Textarea grows up to 4 lines then scrolls.
    *   **Emoji Picker**: Integrated floating picker.

### MTG-001: Video Room (Agora)
*   **Controls**:
    *   **Glass Bar**: Control buttons float in a frosted glass rounded container at bottom center.
    *   **Hover**: Buttons scale up on hover.
*   **Grid**:
    *   **Dominant Speaker**: Smooth transition when active speaker changes (Swap positions or highlight).
    *   **Network Quality**: Small signal bars icon on each participant video.

---

## 4. Premium UI Touches
*   **Skeleton Loading**: When loading a chat, show gray bars representing bubbles.
*   **Typing Indicator**:
    *   Three dots bouncing animation `( . . . )` inside a bubble.
*   **Sound Effects**:
    *   Subtle "Pop" sound on incoming message (User toggleable).
    *   "Ring" sound for incoming video call.
