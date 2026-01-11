import { Router } from "express";
import {
    createProposal,
    getProposalsByOrder,
    getProposal,
    acceptProposal,
    rejectProposal,
    updateProposal,
    deleteProposal,
} from "./proposal.controller";
import { protect } from "../auth/auth.controller";

const ProposalRouter = Router();

ProposalRouter.post("/", protect, createProposal);
ProposalRouter.get("/order/:orderId", protect, getProposalsByOrder);
ProposalRouter.get("/:id", protect, getProposal);
ProposalRouter.patch("/:id/accept", protect, acceptProposal);
ProposalRouter.patch("/:id/reject", protect, rejectProposal);
ProposalRouter.put("/:id", protect, updateProposal);
ProposalRouter.delete("/:id", protect, deleteProposal);

export default ProposalRouter;
