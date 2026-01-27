import { Router } from "express";
import {
    submitProjectReview,
    submitSessionReview,
    getMyReviewsGiven,
    getMyReviewsReceived,
    getProviderReviews,
    getReviewById,
    checkProjectReviewEligibility,
    checkSessionReviewEligibility,
} from "./review.controller";
import { protect } from "../../auth/auth.controller";

const ReviewRouter = Router();

// All routes require authentication
ReviewRouter.use(protect);

// ===== My Reviews =====
// GET /api/reviews/given - Get reviews I've submitted
ReviewRouter.get("/given", getMyReviewsGiven);

// GET /api/reviews/received - Get reviews I've received
ReviewRouter.get("/received", getMyReviewsReceived);

// ===== Provider Reviews (Public) =====
// GET /api/reviews/provider/:providerUserId - Get public provider reviews
ReviewRouter.get("/provider/:providerUserId", getProviderReviews);

// ===== Single Review =====
// GET /api/reviews/:id - Get a specific review
ReviewRouter.get("/:id", getReviewById);

// ===== Project Reviews =====
// POST /api/reviews/projects/:projectId - Submit project review
ReviewRouter.post("/projects/:projectId", submitProjectReview);

// GET /api/reviews/projects/:projectId/eligibility - Check project review eligibility
ReviewRouter.get("/projects/:projectId/eligibility", checkProjectReviewEligibility);

// ===== Session Reviews =====
// POST /api/reviews/sessions/:sessionId - Submit session review
ReviewRouter.post("/sessions/:sessionId", submitSessionReview);

// GET /api/reviews/sessions/:sessionId/eligibility - Check session review eligibility
ReviewRouter.get("/sessions/:sessionId/eligibility", checkSessionReviewEligibility);

export default ReviewRouter;
