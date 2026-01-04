import { Router } from "express";
import {
    getCurrentUserData,
    login,
    register,
    verifyRegistration,
    logout,
    forgotPassword,
    verifyResetPassword,
    resetPassword,
} from "./auth.controller";
import { protect } from "../../middlewares/auth.middleware";
import passport from "../../config/passport";
import { signJWT } from "../../utils/jwt-handler";
import config from "../../config/config";

const AuthRouter = Router();

AuthRouter.get("/me", protect, getCurrentUserData);
AuthRouter.post("/login", login);
AuthRouter.post("/register", register);
AuthRouter.post("/register-verification", verifyRegistration);
AuthRouter.post("/logout", logout);
AuthRouter.post("/forget-password", forgotPassword);
AuthRouter.post("/verify-reset-password", verifyResetPassword);
AuthRouter.post("/reset-password", resetPassword);

// OAuth routes
AuthRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

AuthRouter.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        const user = req.user as any;

        // Sign JWT and set cookie
        const token = signJWT(user.id, res);

        // Redirect to frontend with token
        res.redirect(`${config.frontendUrl || process.env.FRONTEND_URL}?token=${token}`);
    }
);

export default AuthRouter;
