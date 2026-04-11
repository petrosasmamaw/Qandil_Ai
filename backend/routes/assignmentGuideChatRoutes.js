import express from "express";
import {
  createAssignmentGuideChat,
  addMessageToAssignmentGuideChat,
  getAssignmentGuideChatHistory,
  getAssignmentGuideChatById,
  deleteAssignmentGuideChat,
  updateAssignmentGuideChatTitle,
} from "../controllers/AssignmentGuideChatController.js";

const router = express.Router();

// Create new assignment guide chat
router.post("/create", createAssignmentGuideChat);

// Add message to chat
router.post("/message", addMessageToAssignmentGuideChat);

// Get chat history for user
router.get("/history/:userId", getAssignmentGuideChatHistory);

// Get specific chat
router.get("/:chatId", getAssignmentGuideChatById);

// Update chat title
router.patch("/:chatId", updateAssignmentGuideChatTitle);

// Delete chat
router.delete("/:chatId", deleteAssignmentGuideChat);

export default router;
