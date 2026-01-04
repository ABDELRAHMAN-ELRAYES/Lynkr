import { Router } from "express";
import {
    generateAgoraToken,
    createMeeting,
    getAllMeetings,
    getMeeting,
    updateMeeting,
    deleteMeeting,
} from "./meeting.controller";
import { protect } from "../../middlewares/auth.middleware";

const MeetingRouter = Router();

MeetingRouter.post("/token", protect, generateAgoraToken);

MeetingRouter.route("/")
    .post(protect, createMeeting)
    .get(protect, getAllMeetings);

MeetingRouter.route("/:id")
    .get(protect, getMeeting)
    .put(protect, updateMeeting)
    .delete(protect, deleteMeeting);

export default MeetingRouter;
