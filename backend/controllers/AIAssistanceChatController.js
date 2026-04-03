import AIAssistanceChat from "../models/AIAssistanceChat.js";

export const createAIAssistanceChat = async (req, res) => {
  try {
    const { userId, title } = req.body;

    const chat = new AIAssistanceChat({
      userId,
      title: title || "New Chat",
    });

    await chat.save();
    res.status(201).json({
      success: true,
      message: "Chat created successfully",
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating chat",
      error: error.message,
    });
  }
};

export const addMessageToAIChat = async (req, res) => {
  try {
    const { chatId, role, content, fileNames } = req.body;

    const chat = await AIAssistanceChat.findByIdAndUpdate(
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
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message added successfully",
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding message",
      error: error.message,
    });
  }
};

export const getAIAssistanceChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await AIAssistanceChat.find({ userId })
      .sort({ createdAt: -1 })
      .select("_id title learningLevel createdAt updatedAt");

    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching chat history",
      error: error.message,
    });
  }
};

export const getAIAssistanceChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await AIAssistanceChat.findById(chatId);

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
      message: "Error fetching chat",
      error: error.message,
    });
  }
};

export const deleteAIAssistanceChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await AIAssistanceChat.findByIdAndDelete(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting chat",
      error: error.message,
    });
  }
};
