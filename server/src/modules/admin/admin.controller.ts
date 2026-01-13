import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import AdminService from "./admin.service";

export const getDashboardStats = catchAsync(
    async (_request: Request, response: Response, _next: NextFunction) => {
        const stats = await AdminService.getDashboardStats();
        response.status(200).json({ status: "success", data: stats });
    }
);

export const getAllUsers = catchAsync(
    async (_request: Request, response: Response, _next: NextFunction) => {
        const users = await AdminService.getAllUsers();
        response.status(200).json({ status: "success", data: { users } });
    }
);
