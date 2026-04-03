import express from "express";
import {
  createImageAnalyzerChat,
  addMessageToImageAnalyzerChat,
  getImageAnalyzerChatHistory,
  getImageAnalyzerChatById,
  deleteImageAnalyzerChat,
} from "../controllers/ImageAnalyzerChatController.js";

const router = express.Router();

// Create new image analyzer chat
router.post("/create", createImageAnalyzerChat);

// Add message to chat
router.post("/message", addMessageToImageAnalyzerChat);

// Get chat history for user
router.get("/history/:userId", getImageAnalyzerChatHistory);

// Get specific chat
router.get("/:chatId", getImageAnalyzerChatById);

// Delete chat
router.delete("/:chatId", deleteImageAnalyzerChat);

export default router;
