import { Router } from "express";
import {
    createEscrow,
    getEscrowByProject,
    releaseFunds,
    cancelEscrow,
} from "./escrow.controller";
import { protect } from "../auth/auth.controller";

const EscrowRouter = Router();

EscrowRouter.post("/", protect, createEscrow);
EscrowRouter.get("/project/:projectId", protect, getEscrowByProject);
EscrowRouter.post("/:id/release", protect, releaseFunds);
EscrowRouter.post("/:id/cancel", protect, cancelEscrow);

export default EscrowRouter;
