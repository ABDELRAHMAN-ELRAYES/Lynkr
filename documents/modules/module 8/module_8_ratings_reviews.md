## Module 8: Ratings & Reviews

**Implementation Task Deep Dive**

---

## 1. Review Submission System

### 1.1 Support for Multiple Engagement Types

*   **Project Reviews**: `ReviewService.submitProjectReview` handles reviews for completed projects.
*   **Session Reviews**: `ReviewService.submitSessionReview` handles reviews for completed teaching sessions.

### 1.2 Validation & Eligibility

*   **Completion Requirement**: Reviews are strictly blocked unless the project or session status is `COMPLETED`.
*   **Participation Check**: Only actual participants (Client, Provider, Instructor, Student) can submit reviews.
*   **One Review Per Engagement**: Uniqueness check prevents duplicate reviews for the same transaction.
*   **Rating Validation**: Enforces integer ratings between 1 and 5.

### 1.3 Bi-Directional Feedback

*   **Client to Provider**: Updates provider's public stats.
*   **Provider to Client**: Supported in the database and service logic (visible internally / to provider).

---

## 2. Rating Aggregation

### 2.1 Score Calculation

*   **Real-time Update**: `updateProviderRatingStats` is triggered immediately after a client submits a review.
*   **Stats**: Aggregates `averageRating` and `totalReviews` and persists them to the `ProviderProfile`.

---

## 3. Implementation Status (Updated)

**Implemented:**

*   **Core Review Logic**: Complete implementation for both Projects and Sessions.
*   **Review Lifecycle**: Submission, validation, and storage are fully handled.
*   **Stats Aggregation**: Automatic provider profile updates upon review submission.
*   **Eligibility API**: Dedicated endpoints (`checkProjectReviewEligibility`, `checkSessionReviewEligibility`) allow frontend to check if a review button should be enabled.
