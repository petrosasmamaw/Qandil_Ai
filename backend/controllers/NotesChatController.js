import NotesChat from "../models/NotesChat.js";

export const createNotesChat = async (req, res) => {
  try {
    const { userId, title } = req.body;

    const chat = new NotesChat({
      userId,
      title: title || "New Notes",
    });

    await chat.save();
    res.status(201).json({
      success: true,
      message: "Notes chat created successfully",
      data: chat,
    });
  } catch (error) {
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

export const getNotesChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await NotesChat.find({ userId })
      .sort({ createdAt: -1 })
      .select("_id title subject createdAt updatedAt");

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
