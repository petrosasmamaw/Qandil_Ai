"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAIAssistanceChatHistory as fetchAIHistory,
  fetchAIAssistanceChatById as fetchAIChatById,
  deleteAIAssistanceChatThunk,
  clearError as clearAIError,
} from "@/store/slices/aiAssistanceChatSlice";
import {
  fetchNotesChatHistory as fetchNotesHistory,
  fetchNotesChatById as fetchNotesChatById,
  deleteNotesChatThunk,
  clearError as clearNotesError,
} from "@/store/slices/notesChatSlice";
import {
  fetchAssignmentGuideChatHistory as fetchAssignmentHistory,
  fetchAssignmentGuideChatById as fetchAssignmentChatById,
  deleteAssignmentGuideChatThunk,
  clearError as clearAssignmentError,
} from "@/store/slices/assignmentGuideChatSlice";
import {
  fetchImageAnalyzerChatHistory as fetchImageHistory,
  fetchImageAnalyzerChatById as fetchImageChatById,
  deleteImageAnalyzerChatThunk,
  clearError as clearImageError,
} from "@/store/slices/imageAnalyzerChatSlice";

const ChatHistory = ({
  userId,
  chatType,
  onHistorySelect,
  onClose,
  isOpen,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Select appropriate slice based on chatType
  const getSliceState = () => {
    const sliceMap = {
      aiAssistance: "aiAssistanceChat",
      notes: "notesChat",
      assignmentGuide: "assignmentGuideChat",
      imageAnalyzer: "imageAnalyzerChat",
    };
    return useSelector((state) => state[sliceMap[chatType]]);
  };

  const state = getSliceState();
  const { chatHistory, loading, error } = state;

  // Get appropriate thunks
  const getThunks = () => {
    const thunkMap = {
      aiAssistance: {
        fetchHistory: fetchAIHistory,
        fetchChatById: fetchAIChatById,
        deleteChat: deleteAIAssistanceChatThunk,
        clearError: clearAIError,
      },
      notes: {
        fetchHistory: fetchNotesHistory,
        fetchChatById: fetchNotesChatById,
        deleteChat: deleteNotesChatThunk,
        clearError: clearNotesError,
      },
      assignmentGuide: {
        fetchHistory: fetchAssignmentHistory,
        fetchChatById: fetchAssignmentChatById,
        deleteChat: deleteAssignmentGuideChatThunk,
        clearError: clearAssignmentError,
      },
      imageAnalyzer: {
        fetchHistory: fetchImageHistory,
        fetchChatById: fetchImageChatById,
        deleteChat: deleteImageAnalyzerChatThunk,
        clearError: clearImageError,
      },
    };
    return thunkMap[chatType];
  };

  const thunks = getThunks();

  useEffect(() => {
    if (isOpen && userId) {
      dispatch(thunks.fetchHistory(userId));
    }
  }, [isOpen, userId, dispatch]);

  const handleSelectChat = async (chatId) => {
    await dispatch(thunks.fetchChatById(chatId));
    onHistorySelect?.(chatId);
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this chat?")) {
      await dispatch(thunks.deleteChat(chatId));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-96 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 p-1 rounded"
          >
            ✕
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2">
            {error}
            <button
              onClick={() => dispatch(thunks.clearError())}
              className="ml-2 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading history...</p>
            </div>
          ) : chatHistory.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No chat history yet</p>
            </div>
          ) : (
            <ul className="divide-y">
              {chatHistory.map((chat) => (
                <li
                  key={chat._id}
                  className="p-3 hover:bg-gray-100 cursor-pointer transition"
                  onClick={() => handleSelectChat(chat._id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {chat.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(chat._id, e)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
