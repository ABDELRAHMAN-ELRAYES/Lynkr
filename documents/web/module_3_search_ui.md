# Module 3: Search & Discovery - Web GUI Specification

## 1. Overview
The Search experience should be **instant** and **exploratory**. Think Airbnb or Upwork.

## 2. System Pages

| Page ID | Page Name | UX Goal |
|---|---|---|
| SRCH-001 | Search Results | Fast filtering, easy comparison |
| SRCH-002 | Category Landing | SEO-rich, visually inspiring entry point |

---

## 3. High-Fidelity Details

### SRCH-001: Search Results Page
*   **The "Filters" Experience**:
    *   **Desktop**: Sticky Sidebar on the left.
    *   **Price Slider**: distinct "Dual Thumb" slider with a histogram bar chart behind it showing distribution of prices.
    *   **Instant Updates**: Changing a filter does NOT reload the page. It triggers a "Skeleton Loading" state on the grid, then fades in new results (AJAX/React Query).
*   **The "Grid"**:
    *   **Card Design**:
        *   Clean white card, heavy shadow on hover.
        *   **Carousel**: The card's image area is a mini-carousel of the provider's portfolio items. User can click arrows *on the card* to see work samples without entering the profile.
    *   **Badges**: "Top Rated" (Gold), "New" (Green). Positioned absolute top-left.

### SRCH-002: Category Landing
*   **Hero**:
    *   Large Typography: "Find the perfect **Designer**". The word "Designer" allows a dropdown change or types out different categories.
    *   Search Bar embedded in Hero.
*   **Sub-Categories**:
    *   Pill list (Horizontal scroll): "Logo Design", "Web Design", "Illustration".
    *   Clicking a pill auto-scrolls to that section or filters the list below.

---

## 4. Interaction Design

### Infinite Scroll vs Pagination
*   **Decision**: Use **"Load More" Button** (Hybrid).
    *   Autoscrolling can be annoying if footer is needed.
    *   "Load More" allows user control but keeps the flow smooth.

### Mobile Experience
*   **Floating Action Button (FAB)**:
    *   "Filter (3)" button floats bottom-center on mobile. Opens full-screen filter sheet.
*   **Map View (Optional Phase 2)**: Toggle between List and Map (if location based).

---

## 5. Premium UI Touches
*   **Search Suggestions**:
    *   Focusing the search bar drops down a "Recent Searches" and "Trending" list with icons.
*   **Transitions**:
    *   Card Entrance: Staggered animation (Cards fade in one by one: 0.1s, 0.2s, 0.3s...).
