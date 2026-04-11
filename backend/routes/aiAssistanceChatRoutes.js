import express from "express";
import {
  createAIAssistanceChat,
  addMessageToAIChat,
  getAIAssistanceChatHistory,
  getAIAssistanceChatById,
  deleteAIAssistanceChat,
  updateAIAssistanceChatTitle,
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

// Update chat title
router.patch("/:chatId", updateAIAssistanceChatTitle);

// Delete chat
router.delete("/:chatId", deleteAIAssistanceChat);

export default router;
