import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt-handler";
import AppError from "../utils/app-error";
import { UserRole, AdminPrivilege } from "../enum/UserRole";

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email?: string;
                role?: string;
            };
        }
    }
}

export const protect = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    try {
        // Get token from cookie or Authorization header
        let token: string | undefined;

        if (req.cookies?.jwt) {
            token = req.cookies.jwt;
        } else if (req.cookies?.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next(new AppError(401, "You are not logged in"));
        }

        // Verify token
        const decoded = verifyJWT(token);
        if (!decoded || !decoded.id) {
            return next(new AppError(401, "Invalid or expired token"));
        }

        // Attach user to request
        req.user = {
            id: decoded.id as string,
            email: decoded.email as string,
            role: decoded.role as string,
        };
        next();
    } catch (error) {
        next(new AppError(401, "Authentication failed"));
    }
};

export const restrictTo = (...roles: UserRole[]) => {
    return (_req: Request, _res: Response, next: NextFunction) => {
        if (!_req.user || !roles.includes(_req.user.role as UserRole)) {
            return next(
                new AppError(403, "You do not have permission to perform this action")
            );
        }
        next();
    };
};

export const checkPermissions = (
    roles: UserRole[],
    _privileges?: AdminPrivilege[]
) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError(401, "You are not authenticated"));
        }

        // Check if user has required role
        if (!roles.includes(req.user.role as UserRole)) {
            return next(
                new AppError(403, "You do not have permission to perform this action")
            );
        }

        // If privileges are specified, check them (for admin users)
        // This would require fetching user privileges from database
        // For now, we'll skip this check

        next();
    };
};
