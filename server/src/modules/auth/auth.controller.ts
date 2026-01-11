import { catchAsync } from "../../utils/catch-async";
import { Request, Response, NextFunction } from "express";
import {
  IRegisterData,
  IRegisterVerificationData,
  IResetPasswordData,
} from "./types/IAuth";
import AuthenticationService from "./auth.service";
import { AdminPrivilege, UserRole } from "../../enum/UserRole";
import { IUser } from "../user/types/IUser";
import { getRolePrivileges, getRoleAllowedTabs } from "../../config/rbac";

export const login = catchAsync(async (request: Request, response: Response, next: NextFunction) => {
  const data = await AuthenticationService.login(request.body, response, next);
  if (!data) return;

  const { user, token } = data;

  const dbPrivileges = user.privileges?.map((p) => p.name) ?? [];

  const privileges = getRolePrivileges(user.role, dbPrivileges);
  const allowedTabs = getRoleAllowedTabs(user.role, dbPrivileges);

  response.status(200).json({
    status: "success",
    message: "تم تسجيل الدخول بنجاح!",
    data: {
      token,
      user: {
        ...user,
        privileges,
        allowedTabs,
      },
    },
  });
});

// Verify user registration process using OTP
export const register = catchAsync(
  async (request: Request, response: Response, next: NextFunction) => {
    // gather siging up information :first name, last name, date of birth, email, password
    const userData: IRegisterVerificationData = {
      email: request.body.email,
    };
    // Verify User with OTP across his gmail
    const data = await AuthenticationService.register(userData, next);

    if (!data) return;
    const { email, otp } = data;
    response.status(200).json({
      status: "success",
      message: "تم إرسال بريد التحقق من التسجيل، يرجى التحقق من صندوق بريدك الإلكتروني!",
      data: { email, otp },
    });
  }
);
// Signup user after verification
export const registerVerification = catchAsync(
  async (request: Request, response: Response, next: NextFunction) => {
    // Extract otp from request body
    const { otp, user } = request.body;
    const verificationData: IRegisterData = {
      otp,
      user,
    };

    // use the verification data for user verification and signup if verified
    const data = await AuthenticationService.registerVerification(
      verificationData,
      response,
      next
    );
    if (!data) return;

    response.status(200).json({
      status: "success",
      message: "تم التسجيل بنجاح",
      data,
    });
  }
);
// Protect specific routes from unlogged users
export const protect = catchAsync(
  async (request: Request, response: Response, next: NextFunction) => {
    AuthenticationService.protect(request, next);
  }
);

// Restrict routes to specific users roles
export const checkPermissions = (
  allowedRoles: UserRole[],
  requiredPrivileges: AdminPrivilege[] = []
) =>
  catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
      const user = request.user as IUser;

      AuthenticationService.checkPermissions(
        user,
        allowedRoles,
        requiredPrivileges,
        next
      );
    }
  );

// Respond to the user action to change his password and send reset password mail
export const forgetPassword = catchAsync(
  async (request: Request, response: Response, next: NextFunction) => {
    // Take the user email for sending password reset mail
    const userEmail: string = request.body.email;

    const data = await AuthenticationService.forgetPassword(userEmail, next);
    if (!data) return;

    response.status(200).json({
      status: "success",
      data,
    });
  }
);

// Reset user password
export const resetPassword = catchAsync(
  async (request: Request, response: Response, next: NextFunction) => {
    const resetData: IResetPasswordData = {
      token: request.body.token,
      password: request.body.password,
    };

    const user = await AuthenticationService.resetPassword(resetData, next);
    if (!user) return;

    response.status(200).json({
      status: "success",
      message: "تم إعادة تعيين كلمة المرور بنجاح!",
      data: { user },
    });
  }
);

// Logout the current user
export const logout = catchAsync(
  async (request: Request, response: Response, next: NextFunction) => {
    AuthenticationService.logout(response);
    response.status(200).json({
      status: "success",
      message: "تم تسجيل الخروج بنجاح",
    });
  }
);

// * Get current user session Data
export const getCurrentUserData = catchAsync(
  async (request: Request, response: Response, next: NextFunction) => {
    const user = await AuthenticationService.getCurrentUserData(request, next);
    if (!user) return;

    const dbPrivileges = user.privileges?.map((p) => p.name) ?? [];

    const privileges = getRolePrivileges(user.role, dbPrivileges);
    const allowedTabs = getRoleAllowedTabs(user.role, dbPrivileges);

    response.status(200).json({
      status: "success",
      data: {
        user: {
          ...user,
          privileges,
          allowedTabs,
        },
      },
    });
  }
);
