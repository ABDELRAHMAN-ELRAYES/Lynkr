import { Router } from "express";
import {
    createMeeting,
    getMeetingById,
    getJoinToken,
    startMeeting,
    endMeeting,
    cancelMeeting,
    getProjectMeetings,
    getUserMeetings,
    acceptMeeting,
    declineMeeting,
} from "./meeting.controller";
import { protect } from "../auth/auth.controller";

const MeetingRouter = Router();

// All routes require authentication
MeetingRouter.use(protect);

// Get current user's meetings
MeetingRouter.get("/me", getUserMeetings);

// Get meetings for a project
MeetingRouter.get("/project/:projectId", getProjectMeetings);

// Get meeting by ID
MeetingRouter.get("/:id", getMeetingById);

// Get token to join meeting
MeetingRouter.get("/:id/token", getJoinToken);

// Create a new meeting
MeetingRouter.post("/", createMeeting);

// Start meeting
MeetingRouter.patch("/:id/start", startMeeting);

// End meeting
MeetingRouter.patch("/:id/end", endMeeting);

// Accept meeting
MeetingRouter.patch("/:id/accept", acceptMeeting);

// Decline meeting
MeetingRouter.patch("/:id/decline", declineMeeting);

// Cancel meeting
MeetingRouter.delete("/:id", cancelMeeting);

export default MeetingRouter;
