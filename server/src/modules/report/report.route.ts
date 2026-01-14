import { Router } from "express";
import {
    submitReport,
    getMyReports,
    getReportById,
    getAllReports,
    updateReportStatus,
    takeAction,
} from "./report.controller";
import { protect, checkPermissions } from "../auth/auth.controller";
import { UserRole } from "../../enum/UserRole";

const ReportRouter = Router();

// All routes require authentication
ReportRouter.use(protect);

// ===== User Routes =====
// Submit a report
ReportRouter.post("/", submitReport);

// Get my submitted reports
ReportRouter.get("/my", getMyReports);

// Get report by ID (user can only see their own, admin can see all)
ReportRouter.get("/:id", getReportById);

// ===== Admin Routes =====
// Get all reports (admin only)
ReportRouter.get(
    "/admin/all",
    checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    getAllReports
);

// Update report status (admin only)
ReportRouter.patch(
    "/:id/status",
    checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    updateReportStatus
);

// Take action on report (admin only)
ReportRouter.post(
    "/:id/action",
    checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    takeAction
);

export default ReportRouter;
