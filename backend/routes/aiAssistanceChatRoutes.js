import express from "express";
import {
  createAIAssistanceChat,
  addMessageToAIChat,
  getAIAssistanceChatHistory,
  getAIAssistanceChatById,
  deleteAIAssistanceChat,
} from "../controllers/AIAssistanceChatController.js";

const router = express.Router();

// Create new AI assistance chat
router.post("/create", createAIAssistanceChat);

// Add message to chat
router.post("/message", addMessageToAIChat);

// Get chat history for user
router.get("/history/:userId", getAIAssistanceChatHistory);

// Get specific chat
router.get("/:chatId", getAIAssistanceChatById);

// Delete chat
router.delete("/:chatId", deleteAIAssistanceChat);

export default router;
