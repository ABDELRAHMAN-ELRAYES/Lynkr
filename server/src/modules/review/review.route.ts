import { Router } from "express";
import {
    createReview,
    getAllReviews,
    getReview,
    updateReview,
    deleteReview,
} from "./review.controller";
import { protect } from "../../middlewares/auth.middleware";

const ReviewRouter = Router();

ReviewRouter.route("/")
    .post(protect, createReview)
    .get(getAllReviews);

ReviewRouter.route("/:id")
    .get(getReview)
    .put(protect, updateReview)
    .delete(protect, deleteReview);

export default ReviewRouter;
