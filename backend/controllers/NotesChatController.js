import NotesChat from "../models/NotesChat.js";
import mongoose from "mongoose";

export const createNotesChat = async (req, res) => {
  try {
    const { userId, title } = req.body;

    console.log('createNotesChat controller called with:', { userId, title });

    if (!userId) {
      console.error('Error: userId is missing');
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const chat = new NotesChat({
      userId,
      title: title || "New Notes",
    });

    await chat.save();
    
    console.log('Notes chat created successfully:', { chatId: chat._id, userId, title });

    res.status(201).json({
      success: true,
      message: "Notes chat created successfully",
      data: chat,
    });
  } catch (error) {
    console.error('Error creating notes chat:', error);
    res.status(500).json({
      success: false,
      message: "Error creating notes chat",
      error: error.message,
    });
  }
};

export const addMessageToNotesChat = async (req, res) => {
  try {
    const { chatId, role, content, fileNames } = req.body;

    console.log('addMessageToNotesChat controller called with:', { chatId, role, content, fileNames });

    if (!chatId) {
      console.error('Error: chatId is missing');
      return res.status(400).json({
        success: false,
        message: "Chat ID is required",
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      console.error('Invalid ObjectId format:', chatId);
      return res.status(400).json({
        success: false,
        message: "Invalid chat ID format",
      });
    }

    // Verify chat exists first
    const existingChat = await NotesChat.findById(chatId);
    console.log('Existing chat found:', !!existingChat);

    const chat = await NotesChat.findByIdAndUpdate(
      chatId,
      {
        $push: {
          messages: {
            role,
            content,
            fileNames: fileNames || [],
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!chat) {
      console.error('Error: Chat not found for ID:', chatId);
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    console.log('Message added successfully to chat:', chatId);
    res.status(200).json({
      success: true,
      message: "Message added successfully",
      data: chat,
    });
  } catch (error) {
    console.error('Error in addMessageToNotesChat:', error);
    res.status(500).json({
      success: false,
      message: "Error adding message",
      error: error.message,
    });
  }
};

export const getNotesChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Return full chats including messages so frontend can display contents in history modal
    const chats = await NotesChat.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notes history",
      error: error.message,
    });
  }
};

export const getNotesChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await NotesChat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notes",
      error: error.message,
    });
  }
};

export const deleteNotesChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await NotesChat.findByIdAndDelete(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notes deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting notes",
      error: error.message,
    });
  }
};

export const updateNotesChatTitle = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const chat = await NotesChat.findByIdAndUpdate(
      chatId,
      { title: title.trim() },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notes title updated successfully",
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notes title",
      error: error.message,
    });
  }
};
