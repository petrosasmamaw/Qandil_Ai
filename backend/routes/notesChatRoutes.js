import express from "express";
import {
  createNotesChat,
  addMessageToNotesChat,
  getNotesChatHistory,
  getNotesChatById,
  deleteNotesChat,
  updateNotesChatTitle,
} from "../controllers/NotesChatController.js";

const router = express.Router();

// Create new notes chat
router.post("/create", createNotesChat);

// Add message to chat
router.post("/message", addMessageToNotesChat);

// Get chat history for user
router.get("/history/:userId", getNotesChatHistory);

// Get specific chat
router.get("/:chatId", getNotesChatById);

// Update chat title
router.patch("/:chatId", updateNotesChatTitle);

// Delete chat
router.delete("/:chatId", deleteNotesChat);

export default router;
