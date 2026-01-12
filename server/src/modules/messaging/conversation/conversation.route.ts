import { Router } from "express";
import {
    getUserConversations,
    getConversationById,
    getConversationByProjectId,
    createConversation,
} from "./conversation.controller";
import { protect } from "../../auth/auth.controller";

const ConversationRouter = Router();

// All routes require authentication
ConversationRouter.use(protect);

// Get all conversations for current user
ConversationRouter.get("/", getUserConversations);

// Get conversation by project ID
ConversationRouter.get("/project/:projectId", getConversationByProjectId);

// Get conversation by ID (with messages)
ConversationRouter.get("/:id", getConversationById);

// Create a new conversation (typically called when project is created)
ConversationRouter.post("/", createConversation);

export default ConversationRouter;
