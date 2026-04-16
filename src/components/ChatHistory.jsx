"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowLeft, FiTrash2, FiClock } from "react-icons/fi";
import { useTranslation } from '@/hooks/useTranslation';
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
  const [selectedChatId, setSelectedChatId] = useState(null);
  const { t } = useTranslation();

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
      console.log(`Fetching ${chatType} history for user:`, userId);
      dispatch(thunks.fetchHistory(userId));
    }
  }, [isOpen, userId, chatType, dispatch]);

  const handleSelectChat = async (chatId) => {
    setSelectedChatId(chatId);
    // Fetch individual chat to ensure messages are fully loaded
    await dispatch(thunks.fetchChatById(chatId));
  };

  const handleOpenChat = async (chatId) => {
    await dispatch(thunks.fetchChatById(chatId));
    onHistorySelect?.(chatId);
    onClose?.();
  };

  const handleDeleteChat = async (chatId) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      await dispatch(thunks.deleteChat(chatId));
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
      }
    }
  };

  const selectedChat = selectedChatId 
    ? (state?.currentChat && state.currentChat._id === selectedChatId 
        ? state.currentChat  // Use the freshly fetched full chat
        : chatHistory.find((c) => c._id === selectedChatId))  // Fallback to history
    : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-white/20 dark:border-gray-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FiClock size={24} />
            <div>
              <h2 className="text-2xl font-bold">{t('common.historyTitle')}</h2>
              <p className="text-sm text-green-100">{chatHistory.length} {t('common.conversations')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
          >
            ✕
          </button>
        </div>

        {/* Main Container */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Chat List */}
          <div className="w-full md:w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            {error && (
              <div className="bg-red-100 dark:bg-red-900 border-b border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3">
                <div className="text-sm">{error}</div>
                <button
                  onClick={() => dispatch(thunks.clearError())}
                  className="text-xs underline mt-1"
                >
                  Dismiss
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">{t('common.loadingHistory')}</p>
                </div>
              </div>
            ) : chatHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">{t('common.noConversations')}</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {chatHistory.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => handleSelectChat(chat._id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                      selectedChatId === chat._id
                        ? "bg-green-100 dark:bg-green-900/30 border-green-500"
                        : "bg-white dark:bg-gray-700 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{chat.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel - Chat Content */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold">{selectedChat.title}</h3>
                  <p className="text-sm text-green-100">
                    {selectedChat.messages?.length || 0} messages
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {Array.isArray(selectedChat.messages) && selectedChat.messages.length > 0 ? (
                    selectedChat.messages.map((m, i) => (
                      <div
                        key={i}
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-3 rounded-lg ${
                            m.role === 'user'
                              ? 'bg-green-600 text-white rounded-br-none'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none'
                          }`}
                        >
                          <div className="text-xs font-semibold mb-1 opacity-70">
                            {m.role === 'user' ? t('common.you') : t('common.assistant')}
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                          {m.fileNames && m.fileNames.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-current border-opacity-20">
                              {m.fileNames.map((fn, idx) => (
                                <div key={idx} className="text-xs opacity-80 underline decoration-dotted">
                                  📎 {fn}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="text-xs mt-2 opacity-60">
                            {new Date(m.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400">{t('common.noConversations')}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3">
                  <button
                    onClick={() => handleOpenChat(selectedChat._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                  >
                    {t('common.continueChat')}
                  </button>
                  <button
                    onClick={() => handleDeleteChat(selectedChat._id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center gap-2"
                  >
                    <FiTrash2 size={18} />
                    {t('common.delete')}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Select a chat to view
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
