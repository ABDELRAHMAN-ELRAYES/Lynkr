import { Router } from "express";
import {
    getEscrowByProject,
    getProviderBalance,
    requestWithdrawal
} from "./escrow.controller";
import { protect } from "../../../auth/auth.controller";

const EscrowRouter = Router();

// All routes require authentication
EscrowRouter.use(protect);

// Get escrow for a project
EscrowRouter.get("/project/:projectId", getEscrowByProject);

// Get provider's available balance
EscrowRouter.get("/balance", getProviderBalance);

// Request withdrawal (provider only)
EscrowRouter.post("/withdraw", requestWithdrawal);

export default EscrowRouter;
