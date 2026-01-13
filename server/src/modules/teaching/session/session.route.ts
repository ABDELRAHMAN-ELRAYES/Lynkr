import { Router } from "express";
import SessionController from "./session.controller";
import { AuthMiddleware } from "../../../middlewares/auth.middleware";

const router = Router();

// All routes require authentication
router.use(AuthMiddleware.protect);

// Booking routes
router.post("/book", SessionController.bookSession);
router.post("/confirm", SessionController.confirmBooking);

// Session list routes
router.get("/my", SessionController.getMySessions);
router.get("/instructor", SessionController.getInstructorSessions);

// Session detail and lifecycle routes
router.get("/:id", SessionController.getSessionById);
router.patch("/:id/start", SessionController.startSession);
router.patch("/:id/complete", SessionController.completeSession);
router.patch("/:id/cancel", SessionController.cancelSession);
router.post("/:id/join", SessionController.joinSession);
router.post("/:id/leave", SessionController.leaveSession);

export default router;
