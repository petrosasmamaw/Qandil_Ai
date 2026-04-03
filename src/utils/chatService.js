"use client";

/**
 * Creates a new chat and returns the chat ID
 */
export async function createNewChat(type, userId, title = "") {
  const endpoints = {
    aiAssistance: "ai-assistance-chat",
    notes: "notes-chat",
    assignmentGuide: "assignment-guide-chat",
    imageAnalyzer: "image-analyzer-chat",
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/${
        endpoints[type]
      }/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title }),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data._id;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
}

/**
 * Saves a message to the backend
 */
export async function saveMessageToBackend(
  type,
  chatId,
  role,
  content,
  fileNames = []
) {
  const endpoints = {
    aiAssistance: "ai-assistance-chat",
    notes: "notes-chat",
    assignmentGuide: "assignment-guide-chat",
    imageAnalyzer: "image-analyzer-chat",
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/${
        endpoints[type]
      }/message`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, role, content, fileNames }),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
}

/**
 * Fetches chat history for a user
 */
export async function fetchChatHistory(type, userId) {
  const endpoints = {
    aiAssistance: "ai-assistance-chat",
    notes: "notes-chat",
    assignmentGuide: "assignment-guide-chat",
    imageAnalyzer: "image-analyzer-chat",
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/${
        endpoints[type]
      }/history/${userId}`
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
}

/**
 * Fetches a specific chat by ID
 */
export async function fetchChatById(type, chatId) {
  const endpoints = {
    aiAssistance: "ai-assistance-chat",
    notes: "notes-chat",
    assignmentGuide: "assignment-guide-chat",
    imageAnalyzer: "image-analyzer-chat",
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/${
        endpoints[type]
      }/${chatId}`
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data;
  } catch (error) {
    console.error("Error fetching chat:", error);
    throw error;
  }
}

/**
 * Deletes a chat
 */
export async function deleteChat(type, chatId) {
  const endpoints = {
    aiAssistance: "ai-assistance-chat",
    notes: "notes-chat",
    assignmentGuide: "assignment-guide-chat",
    imageAnalyzer: "image-analyzer-chat",
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/${
        endpoints[type]
      }/${chatId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
}
