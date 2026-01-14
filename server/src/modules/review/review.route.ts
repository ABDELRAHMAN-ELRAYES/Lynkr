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
import { protect } from "../auth/auth.controller";

const ReviewRouter = Router();

// All routes require authentication
ReviewRouter.use(protect);

// ===== My Reviews =====
// GET /api/v1/reviews/given - Get reviews I've submitted
ReviewRouter.get("/given", getMyReviewsGiven);

// GET /api/v1/reviews/received - Get reviews I've received
ReviewRouter.get("/received", getMyReviewsReceived);

// ===== Provider Reviews (Public) =====
// GET /api/v1/reviews/provider/:providerUserId - Get public provider reviews
ReviewRouter.get("/provider/:providerUserId", getProviderReviews);

// ===== Single Review =====
// GET /api/v1/reviews/:id - Get a specific review
ReviewRouter.get("/:id", getReviewById);

// ===== Project Reviews =====
// POST /api/v1/reviews/projects/:projectId - Submit project review
ReviewRouter.post("/projects/:projectId", submitProjectReview);

// GET /api/v1/reviews/projects/:projectId/eligibility - Check project review eligibility
ReviewRouter.get("/projects/:projectId/eligibility", checkProjectReviewEligibility);

// ===== Session Reviews =====
// POST /api/v1/reviews/sessions/:sessionId - Submit session review
ReviewRouter.post("/sessions/:sessionId", submitSessionReview);

// GET /api/v1/reviews/sessions/:sessionId/eligibility - Check session review eligibility
ReviewRouter.get("/sessions/:sessionId/eligibility", checkSessionReviewEligibility);

export default ReviewRouter;
