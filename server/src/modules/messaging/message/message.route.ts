import { Router } from "express";
import {
    createMessage,
    getMessagesByConversationId,
    markMessageAsRead,
    markConversationAsRead,
} from "./message.controller";
import { protect } from "../../auth/auth.controller";

const MessageRouter = Router();

// All routes require authentication
MessageRouter.use(protect);

// Send a new message
MessageRouter.post("/", createMessage);

// Get messages for a conversation (paginated)
MessageRouter.get("/conversation/:conversationId", getMessagesByConversationId);

// Mark a single message as read
MessageRouter.patch("/:id/read", markMessageAsRead);

// Mark all messages in a conversation as read
MessageRouter.patch("/conversation/:conversationId/read", markConversationAsRead);

export default MessageRouter;
