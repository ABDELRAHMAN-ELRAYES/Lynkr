import {
    LoginRequest,
    RegisterRequest,
    NoCacheRegisterUserRequest,
    ForgotPasswordRequest,
    VerifyResetPasswordRequest,
    ResetPasswordRequest,
    AuthResponse,
    NoCachePendingUserRegistration,
} from "./types/IAuth";
import { hash, compare } from "../../utils/hashing-handler";
import { generateToken, generateVerificationCode } from "../../utils/jwt-handler";
import UserService from "../user/user.service";
import { NextFunction } from "express";
import AppError from "../../utils/app-error";
import EmailService from "../../utils/email.service";

// In-memory store for verification codes (in production, use Redis)
const verificationCodes = new Map<string, { code: string; data: any; expiresAt: number }>();

class AuthService {
    static async login(loginData: LoginRequest, next: NextFunction): Promise<AuthResponse | undefined> {
        const { email, password } = loginData;

        const user = await UserService.getUserByUsernameOrEmail(email, next);
        if (!user) return;

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            next(new AppError(401, "Invalid credentials"));
            return;
        }

        if (!user.active) {
            next(new AppError(403, "Account is inactive"));
            return;
        }

        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role as any,
                active: user.active,
                privileges: user.privileges as any,
            },
            token,
        };
    }

    static async register(
        request: NoCacheRegisterUserRequest,
        next: NextFunction
    ): Promise<NoCachePendingUserRegistration | undefined> {
        const { email } = request;

        // Check if user already exists
        const existingUser = await UserService.isUserEmailExisted(email, next);
        if (existingUser?.status === "fail") return;

        // Generate verification code
        const verificationCode = generateVerificationCode();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Store verification data
        verificationCodes.set(email, {
            code: verificationCode,
            data: request,
            expiresAt,
        });

        // Send verification email
        try {
            await EmailService.sendVerificationEmail(email, verificationCode);
        } catch (error) {
            next(new AppError(500, "Failed to send verification email"));
            return;
        }

        return {
            email,
            verificationCode, // In production, don't return this
        };
    }

    static async verifyRegistration(
        signupData: RegisterRequest,
        next: NextFunction
    ): Promise<AuthResponse | undefined> {
        const { email, verificationCode } = signupData;

        const storedData = verificationCodes.get(email);
        if (!storedData) {
            next(new AppError(400, "Verification code not found or expired"));
            return;
        }

        if (storedData.code !== verificationCode) {
            next(new AppError(400, "Invalid verification code"));
            return;
        }

        if (Date.now() > storedData.expiresAt) {
            verificationCodes.delete(email);
            next(new AppError(400, "Verification code expired"));
            return;
        }

        // Create user
        const user = await UserService.saveUser(storedData.data, next);
        if (!user) return;

        // Clean up verification code
        verificationCodes.delete(email);

        // Send welcome email
        try {
            await EmailService.sendWelcomeEmail(user.email, user.firstName);
        } catch (error) {
            // Log error but don't fail registration
            console.error("Failed to send welcome email:", error);
        }

        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role as any,
                active: user.active,
            },
            token,
        };
    }

    static async forgotPassword(data: ForgotPasswordRequest, next: NextFunction): Promise<void> {
        const { email } = data;

        const user = await UserService.getUserByUsernameOrEmail(email, next);
        if (!user) return;

        const verificationCode = generateVerificationCode();
        const expiresAt = Date.now() + 10 * 60 * 1000;

        verificationCodes.set(`reset_${email}`, {
            code: verificationCode,
            data: { email },
            expiresAt,
        });

        try {
            await EmailService.sendPasswordResetEmail(email, verificationCode);
        } catch (error) {
            next(new AppError(500, "Failed to send password reset email"));
        }
    }

    static async verifyResetPassword(
        data: VerifyResetPasswordRequest,
        next: NextFunction
    ): Promise<void> {
        const { email, verificationCode } = data;

        const storedData = verificationCodes.get(`reset_${email}`);
        if (!storedData) {
            next(new AppError(400, "Verification code not found or expired"));
            return;
        }

        if (storedData.code !== verificationCode) {
            next(new AppError(400, "Invalid verification code"));
            return;
        }

        if (Date.now() > storedData.expiresAt) {
            verificationCodes.delete(`reset_${email}`);
            next(new AppError(400, "Verification code expired"));
            return;
        }
    }

    static async resetPassword(data: ResetPasswordRequest, next: NextFunction): Promise<void> {
        const { email, password, verificationCode } = data;

        const storedData = verificationCodes.get(`reset_${email}`);
        if (!storedData) {
            next(new AppError(400, "Verification code not found or expired"));
            return;
        }

        if (storedData.code !== verificationCode) {
            next(new AppError(400, "Invalid verification code"));
            return;
        }

        if (Date.now() > storedData.expiresAt) {
            verificationCodes.delete(`reset_${email}`);
            next(new AppError(400, "Verification code expired"));
            return;
        }

        const hashedPassword = await hash(password);
        await UserService.updateUserPasswordByEmail(email, hashedPassword);

        verificationCodes.delete(`reset_${email}`);
    }

    static async getCurrentUserData(userId: string, next: NextFunction): Promise<AuthResponse | undefined> {
        const user = await UserService.getUser(userId, next);
        if (!user) return;

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role as any,
                active: user.active,
                privileges: user.privileges as any,
            },
        };
    }
}

export default AuthService;
