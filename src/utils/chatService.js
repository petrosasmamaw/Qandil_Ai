"use client";

import { getApiBaseUrl } from "./apiUrl";

const getEndpointUrl = (type, path = "") => {
  const endpoints = {
    aiAssistance: "ai-assistance-chat",
    notes: "notes-chat",
    assignmentGuide: "assignment-guide-chat",
    imageAnalyzer: "image-analyzer-chat",
  };
  const base = getApiBaseUrl();
  const endpoint = endpoints[type];
  return path ? `${base}/${endpoint}/${path}` : `${base}/${endpoint}`;
};

/**
 * Creates a new chat and returns the chat ID
 */
export async function createNewChat(type, userId, title = "") {
  try {
    const response = await fetch(getEndpointUrl(type, "create"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, title }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data._id || data.data.id;
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
  try {
    const response = await fetch(getEndpointUrl(type, "message"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, role, content, fileNames }),
    });

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
  try {
    const response = await fetch(getEndpointUrl(type, `history/${userId}`));
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
  try {
    const response = await fetch(getEndpointUrl(type, chatId));
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
  try {
    const response = await fetch(getEndpointUrl(type, chatId), {
      method: "DELETE",
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
}
