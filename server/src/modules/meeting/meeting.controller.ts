import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import MeetingService from "./meeting.service";
import AppError from "../../utils/app-error";

export const generateAgoraToken = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const { channelName, uid } = request.body;

        if (!channelName || !uid) {
            return next(new AppError(400, "Channel name and UID are required"));
        }

        const tokenData = await MeetingService.generateAgoraToken(channelName, uid);

        response.status(200).json({
            status: "success",
            data: tokenData,
        });
    }
);

export const createMeeting = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const meeting = await MeetingService.createMeeting(request.body, next);
        response.status(201).json({ status: "success", data: { meeting } });
    }
);

export const getAllMeetings = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const meetings = await MeetingService.getAllMeetings();
        response.status(200).json({ status: "success", data: { meetings } });
    }
);

export const getMeeting = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const meeting = await MeetingService.getMeetingById(request.params.id, next);
        if (!meeting) return;
        response.status(200).json({ status: "success", data: { meeting } });
    }
);

export const updateMeeting = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const meeting = await MeetingService.updateMeeting(request.params.id, request.body, next);
        response.status(200).json({ status: "success", data: { meeting } });
    }
);

export const deleteMeeting = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        await MeetingService.deleteMeeting(request.params.id, next);
        response.status(204).json({ status: "success", data: null });
    }
);
