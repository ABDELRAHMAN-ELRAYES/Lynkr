import { Router,Request,Response } from "express";
import {
    getCurrentUserData,
    login,
    register,
    logout,
    resetPassword,
    registerVerification,
    forgetPassword,
    protect,
} from "./auth.controller";
import passport from "../../config/passport";
import config from "../../config/config";
import { signJWT } from "@/utils/jwt";

const AuthRouter = Router();

AuthRouter.route("/login").post(login);
AuthRouter.route("/register").post(register);
AuthRouter.route("/register-verification").post(registerVerification);
AuthRouter.route("/forget-password").post(forgetPassword);
AuthRouter.route("/reset-password").post(resetPassword);
AuthRouter.route("/logout").post(logout);
AuthRouter.route("/me").get(protect, getCurrentUserData);
// OAuth routes
AuthRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

AuthRouter.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req:Request, res:Response) => {
        const user = req.user as any;

        // Sign JWT and set cookie
        const token = signJWT(user.id);

        // Redirect to frontend with token
        res.redirect(`${config.webUrl || process.env.FRONTEND_URL}?token=${token}`);
    }
);

export default AuthRouter;
