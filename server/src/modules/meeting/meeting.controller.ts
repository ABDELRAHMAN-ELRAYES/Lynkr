import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import MeetingService from "./meeting.service";

// Create a new meeting
export const createMeeting = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { projectId, guestId, scheduledAt } = req.body;
        const hostId = (req.user as any).id;

        const meeting = await MeetingService.createMeeting(
            { projectId, hostId, guestId, scheduledAt },
            next
        );

        if (!meeting) return;

        res.status(201).json({
            status: "success",
            data: { meeting },
        });
    }
);

// Get meeting by ID
export const getMeetingById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const userId = (req.user as any).id;

        const meeting = await MeetingService.getMeetingById(id, userId, next);

        if (!meeting) return;

        res.status(200).json({
            status: "success",
            data: { meeting },
        });
    }
);

// Get token to join meeting
export const getJoinToken = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const userId = (req.user as any).id;

        const tokenData = await MeetingService.getJoinToken(id, userId, next);

        if (!tokenData) return;

        res.status(200).json({
            status: "success",
            data: tokenData,
        });
    }
);

// Start meeting
export const startMeeting = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const userId = (req.user as any).id;

        const meeting = await MeetingService.startMeeting(id, userId, next);

        if (!meeting) return;

        res.status(200).json({
            status: "success",
            data: { meeting },
        });
    }
);

// End meeting
export const endMeeting = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const userId = (req.user as any).id;

        const meeting = await MeetingService.endMeeting(id, userId, next);

        if (!meeting) return;

        res.status(200).json({
            status: "success",
            data: { meeting },
        });
    }
);

// Cancel meeting
export const cancelMeeting = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const userId = (req.user as any).id;

        const meeting = await MeetingService.cancelMeeting(id, userId, next);

        if (!meeting) return;

        res.status(200).json({
            status: "success",
            data: { meeting },
        });
    }
);

// Get meetings for a project
export const getProjectMeetings = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { projectId } = req.params;
        const userId = (req.user as any).id;

        const meetings = await MeetingService.getProjectMeetings(projectId, userId, next);

        if (!meetings) return;

        res.status(200).json({
            status: "success",
            data: { meetings },
        });
    }
);

// Get user's meetings
export const getUserMeetings = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req.user as any).id;

        const meetings = await MeetingService.getUserMeetings(userId, next);

        if (!meetings) return;

        res.status(200).json({
            status: "success",
            data: { meetings },
        });
    }
);

// Accept meeting
export const acceptMeeting = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const userId = (req.user as any).id;

        const meeting = await MeetingService.acceptMeeting(id, userId, next);

        if (!meeting) return;

        res.status(200).json({
            status: "success",
            message: "Meeting accepted",
            data: { meeting },
        });
    }
);

// Decline meeting
export const declineMeeting = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const userId = (req.user as any).id;

        const meeting = await MeetingService.declineMeeting(id, userId, next);

        if (!meeting) return;

        res.status(200).json({
            status: "success",
            message: "Meeting declined",
            data: { meeting },
        });
    }
);
