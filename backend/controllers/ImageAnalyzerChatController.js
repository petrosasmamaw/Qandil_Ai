import ImageAnalyzerChat from "../models/ImageAnalyzerChat.js";
import mongoose from "mongoose";

export const createImageAnalyzerChat = async (req, res) => {
  try {
    const { userId, title } = req.body;

    const chat = new ImageAnalyzerChat({
      userId,
      title: title || "Image Analysis",
    });

    await chat.save();
    res.status(201).json({
      success: true,
      message: "Image analyzer chat created successfully",
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating image analyzer chat",
      error: error.message,
    });
  }
};

export const addMessageToImageAnalyzerChat = async (req, res) => {
  try {
    const { chatId, role, content, fileNames } = req.body;

    console.log('addMessageToImageAnalyzerChat controller called with:', { chatId, role, content, fileNames });

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
    const existingChat = await ImageAnalyzerChat.findById(chatId);
    console.log('Existing chat found:', !!existingChat);

    const chat = await ImageAnalyzerChat.findByIdAndUpdate(
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
    console.error('Error in addMessageToImageAnalyzerChat:', error);
    res.status(500).json({
      success: false,
      message: "Error adding message",
      error: error.message,
    });
  }
};

export const getImageAnalyzerChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Return full chats including messages so frontend can display contents in history modal
    const chats = await ImageAnalyzerChat.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching image analyzer history",
      error: error.message,
    });
  }
};

export const getImageAnalyzerChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await ImageAnalyzerChat.findById(chatId);

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
      message: "Error fetching image analyzer data",
      error: error.message,
    });
  }
};

export const deleteImageAnalyzerChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await ImageAnalyzerChat.findByIdAndDelete(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image analyzer data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting image analyzer data",
      error: error.message,
    });
  }
};

export const updateImageAnalyzerChatTitle = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const chat = await ImageAnalyzerChat.findByIdAndUpdate(
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
      message: "Image analyzer title updated successfully",
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating image analyzer title",
      error: error.message,
    });
  }
};
