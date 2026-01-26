## Module 3: Search & Discovery

**Implementation Task Deep Dive**

---

## Module Goal (Execution Perspective)

Enable clients to **discover providers efficiently** using name search, category filtering, ratings, pricing, and other relevant criteria, while ensuring that only **approved providers** are visible.

---

## 1. Search Entry Tasks

### 1.1 Search Input

* Allow clients to search by:

  * Provider name (full or partial)
  * Service category
* Allow combination of search terms (name + category)
* Provide clear “no results found” feedback

---

### 1.2 Filter Options

* Service category (required for filtering by type)
* Pricing range (hourly or fixed)
* Ratings range (minimum score)
* Language proficiency (optional)
* Availability (Phase 1 optional)
* Ensure filters are additive, not destructive

---

### 1.3 Sort Options

* Sort providers by:

  * Name (A-Z)
  * Rating (high to low)
  * Price (low to high)
  * Latest joined
* Enforce consistent sort behavior for repeatable results

---

## 2. Search Result Presentation Tasks

### 2.1 Result Card Composition

* Display for each provider:

  * Name
  * Service category
  * Rating
  * Price per hour
  * Primary skills
  * Short bio
* Ensure consistent layout and completeness
* Highlight search term matches

---

### 2.2 Result Pagination / Segmentation

* Split results into manageable segments (page or scrollable block)
* Show total results count
* Maintain filter and sort across pages
* Provide navigation controls

---

## 3. Provider Detail Access Tasks

* Allow clicking on a provider to view full profile
* Display:

  * Work experience
  * Education
  * Languages
  * Availability (if applicable)
* Clearly indicate provider approval status
* Allow direct engagement from profile (request or proposal initiation)

---

## 4. Search Behavior & Constraints

* Only **approved providers** appear in search results
* Providers under review, suspended, or rejected are hidden
* Inactive or incomplete profiles do not appear
* Handle case-insensitive and partial matches
* Avoid exposing private or sensitive data in results

---

## 5. Edge Case Handling

* No matching providers
* Search term matches multiple categories
* Multiple filters with no results
* Providers with incomplete ratings
* Handling provider profile deletion while appearing in results

---

## 6. Activity Logging

* Track search queries for audit or analytics
* Log applied filters and selected provider clicks
* Maintain anonymized analytics (Phase 1 optional)

---

## 7. Module Completion Criteria

Module 3 is complete when:

* Clients can perform searches by name and category
* Filters and sorting work consistently and logically
* Only eligible providers are shown
* Provider profiles can be viewed directly from search
* Search results are paginated and clear
* Edge cases are gracefully handled

---

## 8. Technical Realization & API Reference

### 8.1 Service & Skill Definitions
**Logic**:
*   Admin defines Master Services (e.g., Engineering, Teaching).
*   Admin defines Master Skills under each Service.
*   Providers select from these during onboarding.

**API Endpoints (Service Module)**:
*   `GET /api/services` - List all available service categories.
*   `GET /api/services/:id` - Get service details.
*   `GET /api/services/:id/skills` - Get valid skills for a service category.
*   `POST /api/services` (Admin) - Create new service.
*   `POST /api/services/:id/skills` (Admin) - Add skill to service.

### 8.2 Provider Search & Discovery
**Logic**:
*   **Search Engine**: Query builder on `ProviderProfile` model.
*   **Filters**: `serviceId` (Exact), `name` (Partial, ILIKE), `minPrice`/`maxPrice`, `language` (Array overlap), `rating` (GTE).
*   **Sorting**: Dynamic sorting field + direction.
*   **Results**: Paginated list of profiles with summary data.

**API Endpoints (Profile Module)**:
*   `GET /api/provider-profiles/search` - Main search endpoint.
    *   *Query Params*: `q` (name), `service`, `minPrice`, `maxPrice`, `language`, `minRating`, `sortBy`, `sortOrder`, `page`, `limit`.
*   `GET /api/provider-profiles` - Directory listing (typically all approved).

### 8.3 Provider Details
**Logic**:
*   Full profile view for detail page. Includes public relations (Educations, Experiences).
*   Strictly filters non-approved profiles unless viewed by Admin or Owner.

**API Endpoints**:
*   `GET /api/provider-profiles/:id` - Get detailed public profile.

