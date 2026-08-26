import AIAssistanceChat from "../models/AIAssistanceChat.js";

export const createAIAssistanceChat = async (req, res) => {
  try {
    const { userId, title } = req.body;

    console.log('createAIAssistanceChat controller called with:', { userId, title });

    if (!userId) {
      console.error('Error: userId is missing');
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const chat = await AIAssistanceChat.create({
      userId,
      title: title || "New Chat",
    });
    
    console.log('Chat created successfully:', { chatId: chat._id, userId, title });

    res.status(201).json({
      success: true,
      message: "Chat created successfully",
      data: chat,
    });
  } catch (error) {
    console.error('Error creating chat:', error);
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

    console.log('addMessageToAIChat controller called with:', { chatId, role, content, fileNames });

    if (!chatId) {
      console.error('Error: chatId is missing');
      return res.status(400).json({
        success: false,
        message: "Chat ID is required",
      });
    }
    
    const existingChat = await AIAssistanceChat.findById(chatId);
    console.log('Existing chat found:', !!existingChat);
    if (existingChat) {
      console.log('Chat details:', { _id: existingChat._id, title: existingChat.title, messagesCount: existingChat.messages.length });
    }

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
      console.error('Error: Chat not found after update for ID:', chatId);
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    console.log('Message added successfully to chat:', chatId);
    console.log('Updated chat messages count:', chat.messages?.length);

    res.status(200).json({
      success: true,
      message: "Message added successfully",
      data: chat,
    });
  } catch (error) {
    console.error('Error in addMessageToAIChat:', error);
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

    const chats = await AIAssistanceChat.find({ userId });

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

export const updateAIAssistanceChatTitle = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const chat = await AIAssistanceChat.findByIdAndUpdate(
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
      message: "Chat title updated successfully",
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating chat title",
      error: error.message,
    });
  }
};
