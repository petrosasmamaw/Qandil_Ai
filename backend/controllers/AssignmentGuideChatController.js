import AssignmentGuideChat from "../models/AssignmentGuideChat.js";
import mongoose from "mongoose";

export const createAssignmentGuideChat = async (req, res) => {
  try {
    const { userId, title } = req.body;

    console.log('createAssignmentGuideChat controller called with:', { userId, title });

    if (!userId) {
      console.error('Error: userId is missing');
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const chat = new AssignmentGuideChat({
      userId,
      title: title || "Assignment Guidance",
    });

    await chat.save();
    
    console.log('Assignment guide chat created successfully:', { chatId: chat._id, userId, title });

    res.status(201).json({
      success: true,
      message: "Assignment guide chat created successfully",
      data: chat,
    });
  } catch (error) {
    console.error('Error creating assignment guide chat:', error);
    res.status(500).json({
      success: false,
      message: "Error creating assignment guide chat",
      error: error.message,
    });
  }
};

export const addMessageToAssignmentGuideChat = async (req, res) => {
  try {
    const { chatId, role, content, fileNames } = req.body;

    console.log('addMessageToAssignmentGuideChat controller called with:', { chatId, role, content, fileNames });

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
    const existingChat = await AssignmentGuideChat.findById(chatId);
    console.log('Existing chat found:', !!existingChat);

    const chat = await AssignmentGuideChat.findByIdAndUpdate(
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
    console.error('Error in addMessageToAssignmentGuideChat:', error);
    res.status(500).json({
      success: false,
      message: "Error adding message",
      error: error.message,
    });
  }
};

export const getAssignmentGuideChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Return full chats including messages so frontend can display contents in history modal
    const chats = await AssignmentGuideChat.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching assignment guide history",
      error: error.message,
    });
  }
};

export const getAssignmentGuideChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await AssignmentGuideChat.findById(chatId);

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
      message: "Error fetching assignment guide",
      error: error.message,
    });
  }
};

export const deleteAssignmentGuideChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await AssignmentGuideChat.findByIdAndDelete(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Assignment guide deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting assignment guide",
      error: error.message,
    });
  }
};

export const updateAssignmentGuideChatTitle = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const chat = await AssignmentGuideChat.findByIdAndUpdate(
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
      message: "Assignment guide title updated successfully",
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating assignment guide title",
      error: error.message,
    });
  }
};
