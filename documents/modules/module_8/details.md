# Module 8: Ratings & Reviews

## Technical Realization & API Reference

### 8.1 Review Logic & Eligibility
**Logic**:
*   **Contextual**: Reviews are strictly bound to a completed interaction (`Project` or `Session`).
*   **Eligibility Check**:
    *   User must be a participant (Client or Provider/Student or Instructor).
    *   Interaction must be `COMPLETED` (not Canceled/Active).
    *   One review per interaction per user.
*   **Rating Dimensions**:
    *   Communication (1-5)
    *   Quality (1-5)
    *   Adherence (1-5) (Commitment)

**API Endpoints (Review Module)**:
*   `POST /api/v1/reviews/projects/:projectId` - Submit review for a project.
    *   *Payload*: `communication`, `quality`, `adherence` (optional), `comment`, `isAnonymous`.
*   `POST /api/v1/reviews/sessions/:sessionId` - Submit review for a teaching session.
*   `GET /api/v1/reviews/projects/:projectId/eligibility` - Check if user can review.
*   `GET /api/v1/reviews/sessions/:sessionId/eligibility` - Check if user can review.

### 8.2 Review Aggregation & Display
**Logic**:
*   **Public Profile**: Provider profiles display aggregated ratings (Average) and list of received reviews.
*   **My Reviews**: Users can track reviews they gave and received.
*   **Anonymous**: Option to hide reviewer name from public view (but known to system).

**API Endpoints**:
*   `GET /api/v1/reviews/given` - Reviews submitted by current user.
*   `GET /api/v1/reviews/received` - Reviews about current user.
*   `GET /api/v1/reviews/provider/:providerUserId` - Public list of reviews for a provider.
*   `GET /api/v1/reviews/:id` - Get single review details.
