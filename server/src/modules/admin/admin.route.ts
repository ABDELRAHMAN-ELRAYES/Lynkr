import { Router } from "express";
import {
    getDashboardStats,
    getAllUsers,
} from "./admin.controller";
import { UserRole } from "../../enum/UserRole";
import { protect, checkPermissions } from "../auth/auth.controller";

const AdminRouter = Router();

// All admin routes require ADMIN or SUPER_ADMIN role
AdminRouter.use(protect, checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]));

AdminRouter.get("/dashboard", getDashboardStats);
AdminRouter.get("/users", getAllUsers);

export default AdminRouter;
