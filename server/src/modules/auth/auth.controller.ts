import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import AuthService from "./auth.service";
import {
    LoginRequest,
    RegisterRequest,
    NoCacheRegisterUserRequest,
    ForgotPasswordRequest,
    VerifyResetPasswordRequest,
    ResetPasswordRequest,
} from "./types/IAuth";

export const getCurrentUserData = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const userId = request.user?.id;
        if (!userId) {
            return next();
        }

        const userResponse = await AuthService.getCurrentUserData(userId, next);
        if (!userResponse) return;

        response.status(200).json({ status: "success", data: userResponse });
    }
);

export const login = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const loginData: LoginRequest = request.body;

        const result = await AuthService.login(loginData, next);
        if (!result) return;

        // Set token in cookie
        response.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        response.status(200).json({ status: "success", data: result });
    }
);

export const register = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const registerData: NoCacheRegisterUserRequest = request.body;

        const result = await AuthService.register(registerData, next);
        if (!result) return;

        response.status(200).json({ status: "success", data: result });
    }
);

export const verifyRegistration = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const verifyData: RegisterRequest = request.body;

        const result = await AuthService.verifyRegistration(verifyData, next);
        if (!result) return;

        // Set token in cookie
        response.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        response.status(200).json({ status: "success", data: result });
    }
);

export const logout = catchAsync(
    async (_request: Request, response: Response, _next: NextFunction) => {
        response.clearCookie("token");
        response.status(200).json({
            status: "success",
            message: "User logged out successfully!",
        });
    }
);

export const forgotPassword = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const data: ForgotPasswordRequest = request.body;

        await AuthService.forgotPassword(data, next);

        response.status(200).json({
            status: "success",
            message: "Password reset email sent successfully!",
        });
    }
);

export const verifyResetPassword = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const data: VerifyResetPasswordRequest = request.body;

        await AuthService.verifyResetPassword(data, next);

        response.status(200).json({
            status: "success",
            message: "Verification code is valid!",
        });
    }
);

export const resetPassword = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const data: ResetPasswordRequest = request.body;

        await AuthService.resetPassword(data, next);

        response.status(200).json({
            status: "success",
            message: "Password reset successfully!",
        });
    }
);
