import { Router } from "express";
import {
    createProposal,
    getProposalsByRequest,
    getProposal,
    acceptProposal,
    rejectProposal,
    updateProposal,
    deleteProposal,
} from "./proposal.controller";
import { protect } from "../auth/auth.controller";

import upload from "../../middlewares/file-upload";
import { compressImages } from "../../middlewares/compress-image";

const ProposalRouter = Router();

ProposalRouter.use(protect);

ProposalRouter.post("/", upload.array("files"), compressImages, createProposal);
ProposalRouter.get("/request/:requestId", getProposalsByRequest);
ProposalRouter.get("/:id", getProposal);
ProposalRouter.patch("/:id/accept", acceptProposal);
ProposalRouter.patch("/:id/reject", rejectProposal);
ProposalRouter.put("/:id", upload.array("files"), compressImages, updateProposal);
ProposalRouter.delete("/:id", deleteProposal);

export default ProposalRouter;
