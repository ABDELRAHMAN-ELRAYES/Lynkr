import express from "express";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import config from "./config/config";
import UserRepository from "./modules/user/user.repository";
import { hash } from "./utils/hashing-handler";
import { UserRole } from "./enum/UserRole";
import { globalErrorHandler, notFoundHandler } from "./middlewares/error-handler";
import { generalApiLimiter, authLimiter } from "./middlewares/rate-limit.middleware";

// Import all route modules
import AuthRouter from "./modules/auth/auth.route";
import UserRouter from "./modules/user/user.route";
import PaymentRouter from "./modules/process/money-system/payment/payment.route";
import ServiceRouter from "./modules/service/service.route";
import SubscriptionRouter from "./modules/subscription/subscription.route";
import ReviewRouter from "./modules/process/review/review.route";
import SettingsRouter from "./modules/settings/settings.route";
import MeetingRouter from "./modules/meeting/meeting.route";
import NotificationRouter from "./modules/notification/notification.route";
import ProposalRouter from "./modules/proposal/proposal.route";
import EscrowRouter from "./modules/process/money-system/escrow/escrow.route";
import ProfileRouter from "./modules/provider/profile/profile.route";
import RequestRouter from "./modules/process/request/request.route";
import ProviderApplicationRouter from "./modules/provider/provider-application/provider-application.route";
import ProjectRouter from "./modules/process/project/project.route";
import ConversationRouter from "./modules/messaging/conversation/conversation.route";
import MessageRouter from "./modules/messaging/message/message.route";
import SlotRouter from "./modules/teaching/slot/slot.route";
import SessionRouter from "./modules/teaching/session/session.route";
import ReportRouter from "./modules/report/report.route";
import { bodyParser, cookieParserMiddleware, corsMiddleware, formParser } from "./middlewares/middlewares";

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
        console.log("Default admin user created");
    } catch (err) {
        console.error("Failed to create admin user:", err);
    }
})();

export const ROOT_DIR: string = process.cwd();

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "blob:"],
        },
    },
    crossOriginEmbedderPolicy: false, // Allow cross-origin embedding for uploads
}));

// Rate limiting
app.use("/api/", generalApiLimiter);

// Middleware setup
app.use(corsMiddleware);
app.use(formParser);
app.use(bodyParser);
app.use(cookieParserMiddleware);
app.use(morgan("dev"));

// Serve static files (uploads)
app.use(
    "/api/uploads",
    express.static(path.join(process.cwd(), "uploads"))
);



// API Routes
app.use("/api/auth", authLimiter, AuthRouter);
app.use("/api/users", UserRouter);
app.use("/api/profiles", ProfileRouter);
app.use("/api/providers", ProfileRouter); 
app.use("/api/payments", PaymentRouter);
app.use("/api/services", ServiceRouter);
app.use("/api/subscriptions", SubscriptionRouter);
app.use("/api/reviews", ReviewRouter);
app.use("/api/settings", SettingsRouter);
app.use("/api/meetings", MeetingRouter);
app.use("/api/notifications", NotificationRouter);
app.use("/api/proposals", ProposalRouter);
app.use("/api/escrow", EscrowRouter);
app.use("/api/requests", RequestRouter);
app.use("/api/provider-applications", ProviderApplicationRouter);
app.use("/api/projects", ProjectRouter);
app.use("/api/conversations", ConversationRouter);
app.use("/api/messages", MessageRouter);
app.use("/api/teaching/slots", SlotRouter);
app.use("/api/teaching/sessions", SessionRouter);
app.use("/api/reports", ReportRouter);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

export default app;
