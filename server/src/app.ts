import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import config from "./config/config";
import UserRepository from "./modules/user/user.repository";
import { hash } from "./utils/hashing-handler";
import { UserRole } from "./enum/UserRole";
import { globalErrorHandler, notFoundHandler } from "./middlewares/error-handler";

// Import all route modules
import AuthRouter from "./modules/auth/auth.route";
import UserRouter from "./modules/user/user.route";
import ProfileRouter from "./modules/profile/profile.route";
import OperationRouter from "./modules/operation/operation.route";
import PaymentRouter from "./modules/payment/payment.route";
import ServiceRouter from "./modules/service/service.route";
import SubscriptionRouter from "./modules/subscription/subscription.route";
import ReviewRouter from "./modules/review/review.route";
import SettingsRouter from "./modules/settings/settings.route";
import AdminRouter from "./modules/admin/admin.route";
import FileRouter from "./modules/file/file.route";
import ChatRouter from "./modules/chat/chat.route";
import MeetingRouter from "./modules/meeting/meeting.route";
import NotificationRouter from "./modules/notification/notification.route";
import ProposalRouter from "./modules/proposal/proposal.route";
import EscrowRouter from "./modules/escrow/escrow.route";

// Seed default admin user
(async () => {
    const userRepo = UserRepository.getInstance();
    const user = await userRepo.getUserByUsernameOrEmail(
        config.adminDefault.email
    );

    if (user) return;

    const hashedPass = await hash(config.adminDefault.password);

    const userData = {
        email: config.adminDefault.email,
        username: "admin",
        password: hashedPass,
        firstName: "Admin",
        lastName: "User",
        phone: "+1234567890",
        role: UserRole.SUPER_ADMIN,
        active: true,
        emailVerified: true,
    };

    try {
        await userRepo.addUser(userData);
        console.log("✅ Default admin user created");
    } catch (err) {
        console.error("❌ Failed to create admin user:", err);
    }
})();

export const ROOT_DIR: string = process.cwd();

const app = express();

// Middleware setup
app.use(cors({
    origin: config.cors.origin,
    credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// Serve static files (uploads)
app.use(
    "/api/uploads",
    express.static(path.join(process.cwd(), "uploads"))
);

// Health check route
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
});

// API Routes
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/profiles", ProfileRouter);
app.use("/api/v1/operations", OperationRouter);
app.use("/api/v1/payments", PaymentRouter);
app.use("/api/v1/services", ServiceRouter);
app.use("/api/v1/subscriptions", SubscriptionRouter);
app.use("/api/v1/reviews", ReviewRouter);
app.use("/api/v1/settings", SettingsRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/files", FileRouter);
app.use("/api/v1/chat", ChatRouter);
app.use("/api/v1/meetings", MeetingRouter);
app.use("/api/v1/notifications", NotificationRouter);
app.use("/api/v1/proposals", ProposalRouter);
app.use("/api/v1/escrow", EscrowRouter);

// 404 handler - MUST be after all routes
app.use(notFoundHandler);

// Global error handler - MUST be last
app.use(globalErrorHandler);

export default app;
