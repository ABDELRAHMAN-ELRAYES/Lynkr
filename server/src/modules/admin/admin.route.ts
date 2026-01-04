import { Router } from "express";
import {
    getDashboardStats,
    getAllUsers,
} from "./admin.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { UserRole } from "../../enum/UserRole";

const AdminRouter = Router();

// All admin routes require ADMIN or SUPER_ADMIN role
AdminRouter.use(protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN));

AdminRouter.get("/dashboard", getDashboardStats);
AdminRouter.get("/users", getAllUsers);

export default AdminRouter;
