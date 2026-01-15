# Module 4: Requests & Proposals - Web GUI Specification

## 1. Overview
Focus on clarity of requirements and ease of comparison for proposals.

## 2. System Pages (Enhanced)

| Page ID | Page Name | Premium Feature |
|---|---|---|
| REQ-001 | Post Request | "AI Assist" for descriptions |
| REQ-002 | Request Details | "Kanban" or "List" view for proposals |
| REQ-004 | Submit Proposal | "Estimated Earnings" Calculator |

---

## 3. High-Fidelity Details

### REQ-001: Post Request Form
*   **AI Auto-Complete (Premium)**:
    *   User types title: "Logo design".
    *   Suggestion Chip: "Generate Description with AI ✨".
    *   Clicking it pre-fills the description with a professional template.
*   **Budget Selector**:
    *   Visual Cards: "Small (<$500)", "Medium ($500-1k)", "Large ($1k+)". Selectable cards instead of just a dropdown.

### REQ-002: Managing Proposals (Client)
*   **Layout**:
    *   **Comparison Table**: Toggle between "Grid View" (Cards) and "Table View" (Compare prices/timelines side-by-side).
*   **Shortlisting**:
    *   "Thumbs Up" / "Thumbs Down" actions on each proposal row.
    *   Thumbs Down fades the row to 50% opacity and moves it to bottom.

### REQ-004: Submit Proposal (Provider)
*   **Earnings Calculator**:
    *   Real-time feedback: Use two inputs "Client Buget" and "You Receive".
    *   As user types "$100", the "Service Fee" ($10) and "You Receive" ($90) update instantly with a smooth number roll animation.

---

## 4. Modals

### MOD-HIRE-CONFIRM
*   **Design**: High-contrast, serious modal.
*   **Content**: "You are hiring **[Name]** for **[$Amount]**."
*   **Visuals**:
    *   Two Avatars (Client & Provider) with a connecting line animation in the header.

---

## 5. Premium UI Touches
*   **Drag & Drop**:
    *   Allow dropping files anywhere on the "Post Request" page to attach them. (Whole page overlay "Drop file to upload").
*   **Status Badges**:
    *   Pill shapes with dot indicators. `Open` (Green), `Reviewing` (Orange), `Hired` (Purple).
