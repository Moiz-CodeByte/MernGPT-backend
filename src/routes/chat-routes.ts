import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletitionValidator, validate } from "../utils/validators.js";
import { deleteChats, generateChatCompletion, sendChatToUser } from "../controllers/chat-controllers.js";

const chatRoutes = Router();
chatRoutes.post("/new", validate(chatCompletitionValidator) ,verifyToken, generateChatCompletion);
chatRoutes.get("/all-chats", verifyToken, sendChatToUser);
chatRoutes.delete("/delete", verifyToken, deleteChats);
export default chatRoutes;