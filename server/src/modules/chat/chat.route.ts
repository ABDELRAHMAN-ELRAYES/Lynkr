import { Router } from "express";
import {
    createMessage,
    getAllMessages,
    getMessage,
    getConversation,
} from "./chat.controller";
import { protect } from "../auth/auth.controller";

const ChatRouter = Router();

ChatRouter.route("/messages")
    .post(protect, createMessage)
    .get(protect, getAllMessages);

ChatRouter.get("/messages/:id", protect, getMessage);
ChatRouter.get("/conversation/:userId1/:userId2", protect, getConversation);

export default ChatRouter;
