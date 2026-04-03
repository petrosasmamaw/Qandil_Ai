"use client";

/**
 * INTEGRATION GUIDE FOR CHAT STORAGE IN EACH PAGE
 * 
 * This is a template showing how to integrate chat storage in your pages.
 * Copy this pattern to ai-assistance, notes, assignment-guide, and image-analyzer pages.
 */

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import ChatHistory from "@/components/ChatHistory";
import {
  createAIAssistanceChat,
  addMessageToAIChat,
  clearError,
  clearSuccess,
} from "@/store/slices/aiAssistanceChatSlice";
import {
  createNotesChat,
  addMessageToNotesChat,
  clearError as clearNotesError,
  clearSuccess as clearNotesSuccess,
} from "@/store/slices/notesChatSlice";
import {
  createAssignmentGuideChat,
  addMessageToAssignmentGuideChat,
  clearError as clearAssignmentError,
  clearSuccess as clearAssignmentSuccess,
} from "@/store/slices/assignmentGuideChatSlice";
import {
  createImageAnalyzerChat,
  addMessageToImageAnalyzerChat,
  clearError as clearImageError,
  clearSuccess as clearImageSuccess,
} from "@/store/slices/imageAnalyzerChatSlice";

/**
 * EXAMPLE: AI Assistance Page Integration
 */
export default function AIAssistancePageExample() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const messageEndRef = useRef(null);

  // Get state from Redux
  const { currentChat, loading, error, success } = useSelector(
    (state) => state.aiAssistanceChat
  );

  // Initialize new chat on mount
  useEffect(() => {
    if (session?.user?.id && !currentChatId) {
      initializeNewChat();
    }
  }, [session?.user?.id]);

  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clear notifications
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => dispatch(clearSuccess()), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const initializeNewChat = async () => {
    try {
      const chatId = await dispatch(
        createAIAssistanceChat({ userId: session.user.id, title: "New Chat" })
      ).unwrap();
      setCurrentChatId(chatId._id || chatId);
      setMessages([]);
    } catch (err) {
      console.error("Error creating chat:", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentChatId) return;

    // Add user message to local state
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // Save user message to backend
      await dispatch(
        addMessageToAIChat({
          chatId: currentChatId,
          role: "user",
          content: input,
          fileNames: [], // Add file names if files are attached
        })
      ).unwrap();

      // Call your AI service (Gemini, etc.) - this runs on frontend
      const aiResponse = await callAIService(input); // Your existing AI logic

      // Add AI response to local state
      const assistantMessage = { role: "assistant", content: aiResponse };
      setMessages((prev) => [...prev, assistantMessage]);

      // Save AI response to backend
      await dispatch(
        addMessageToAIChat({
          chatId: currentChatId,
          role: "assistant",
          content: aiResponse,
          fileNames: [],
        })
      ).unwrap();
    } catch (err) {
      console.error("Error sending message:", err);
      dispatch(clearError());
    }
  };

  const callAIService = async (prompt) => {
    // Replace with your existing AI service call
    // Example: const response = await educationalChatService(prompt);
    // For now, returning placeholder
    return "AI response will be generated here using your existing AI service";
  };

  const handleHistorySelect = (chatId) => {
    setCurrentChatId(chatId);
    // Load messages from selected chat
    if (currentChat?.messages) {
      setMessages(currentChat.messages);
    }
    setIsHistoryOpen(false);
  };

  const handleNewChat = async () => {
    await initializeNewChat();
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Assistance</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            📚 History
          </button>
          <button
            onClick={handleNewChat}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ➕ New Chat
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3">
          Message saved successfully!
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Start a new conversation or load from history</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading || !currentChatId}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            disabled={loading || !currentChatId}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>

      {/* History Modal */}
      <ChatHistory
        userId={session?.user?.id}
        chatType="aiAssistance"
        onHistorySelect={handleHistorySelect}
        onClose={() => setIsHistoryOpen(false)}
        isOpen={isHistoryOpen}
      />
    </div>
  );
}

/**
 * COPY THIS PATTERN FOR OTHER PAGES:
 * 
 * For Notes Page:
 * - Replace 'aiAssistanceChat' with 'notesChat'
 * - Replace imports with notesChatSlice actions
 * - Change chatType to "notes"
 * - Update AI service call to your notes service
 * 
 * For Assignment Guide Page:
 * - Replace 'aiAssistanceChat' with 'assignmentGuideChat'
 * - Replace imports with assignmentGuideChatSlice actions
 * - Change chatType to "assignmentGuide"
 * - Update AI service call to your assignment guidance service
 * 
 * For Image Analyzer Page:
 * - Replace 'aiAssistanceChat' with 'imageAnalyzerChat'
 * - Replace imports with imageAnalyzerChatSlice actions
 * - Change chatType to "imageAnalyzer"
 * - Update AI service call to your image analysis service
 * - Add file input for images
 * - Extract file names and pass to fileNames parameter
 */
