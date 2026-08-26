"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowLeft, FiTrash2, FiClock } from "react-icons/fi";
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/lib/supabase';
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

function ChatHistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [session, setSession] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const chatType = searchParams.get('type') || 'aiAssistance';

  // Get all chat states at top level (required for hooks)
  const aiAssistanceChatState = useSelector((state) => state.aiAssistanceChat);
  const notesChatState = useSelector((state) => state.notesChat);
  const assignmentGuideChatState = useSelector((state) => state.assignmentGuideChat);
  const imageAnalyzerChatState = useSelector((state) => state.imageAnalyzerChat);

  // Select appropriate state based on chatType - memoized to prevent unnecessary recalculations
  const state = useMemo(() => {
    const stateMap = {
      aiAssistance: aiAssistanceChatState,
      notes: notesChatState,
      assignmentGuide: assignmentGuideChatState,
      imageAnalyzer: imageAnalyzerChatState,
    };
    return stateMap[chatType];
  }, [chatType, aiAssistanceChatState, notesChatState, assignmentGuideChatState, imageAnalyzerChatState]);

  const { chatHistory = [], loading, error } = state || {};

  // Get appropriate thunks - memoized to prevent recreating every render
  const thunks = useMemo(() => {
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
  }, [chatType]);

  // Detect dark mode
  useEffect(() => {
    setMounted(true);
    const dark = document.documentElement.classList.contains('dark');
    setIsDark(dark);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Get session and fetch history
  useEffect(() => {
    const initializeAndFetch = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession?.user) {
          router.push('/auth/login');
          return;
        }
        setSession(currentSession);
        console.log('Fetching history for user:', currentSession.user.id, 'chatType:', chatType);
        const result = await dispatch(thunks.fetchHistory(currentSession.user.id));
        console.log('Fetch history result:', result);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setPageLoading(false);
      }
    };
    
    initializeAndFetch();
  }, [dispatch, chatType]);

  const handleSelectChat = async (chatId) => {
    setSelectedChatId(chatId);
    await dispatch(thunks.fetchChatById(chatId));
  };

  const handleOpenChat = async (chatId) => {
    await dispatch(thunks.fetchChatById(chatId));
    router.back();
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
        ? state.currentChat
        : chatHistory.find((c) => c._id === selectedChatId))
    : null;

  const getChatTypeLabel = () => {
    const labels = {
      aiAssistance: t('navbar.aiAssistance') || 'AI Assistance',
      notes: t('navbar.notes') || 'Notes',
      assignmentGuide: t('navbar.assignment') || 'Assignment Guide',
      imageAnalyzer: t('navbar.image') || 'Image Analyzer',
    };
    return labels[chatType];
  };

  return (
    <main className="light-image-bg min-h-screen transition-colors duration-300 relative z-0">
      {/* DARK MODE BACKGROUND IMAGE WITH BLUR ONLY */}
      {isDark && (
        <div 
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9ibWFnZXMvd2Vic2l0ZS8yMDI0LTAxL3Jhd3BpeGVsX29mZmljZV8zNF9taW5pbWFsX2Fic3RyYWN0X2JsdWVfYW5kX3B1cnBsZV9uZW9uX3dhdnlfZ282ZWQyZmJmMS05ZWMzLTQxNmItOWY4My0yZmJmNThjOWUyNzVfMS5qcGc.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(8px)',
            transform: 'scale(1.05)',
          }}
        />
      )}

      <div className="max-w-7xl mx-auto relative z-10 p-6 md:p-8">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-3 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-all"
          >
            <FiArrowLeft size={24} className="text-blue-500" />
          </button>
          <div>
            <h1 className="text-3xl font-bold" style={{color: isDark ? '#ffffff' : '#000000'}}>{t('common.historyTitle')}</h1>
            <p className="text-sm opacity-70" style={{color: isDark ? '#ffffff' : '#000000'}}>{getChatTypeLabel()}</p>
          </div>
        </div>

        {/* LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Chat List */}
          <div className="lg:col-span-1 light-box p-4 border rounded-xl shadow-sm max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="bg-red-500/20 dark:bg-red-900/30 border border-red-300/50 dark:border-red-700/30 text-red-900 dark:text-red-200 px-4 py-3 rounded-lg mb-4">
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
              <div className="flex items-center justify-center h-40">
                <p className="text-gray-700 dark:text-gray-300">{t('common.loadingHistory')}</p>
              </div>
            ) : chatHistory.length === 0 ? (
              <div className="flex items-center justify-center h-40">
                <p style={{color: isDark ? '#d1d5db' : '#000000'}} className="text-gray-700 dark:text-gray-300">{t('common.noConversations')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {chatHistory.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => handleSelectChat(chat._id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all border-2 backdrop-blur-sm ${
                      selectedChatId === chat._id
                        ? "bg-green-500/40 dark:bg-green-900/40 border-green-400 dark:border-green-500"
                        : "bg-white/20 dark:bg-white/10 border-transparent hover:bg-white/30 dark:hover:bg-white/20"
                    }`}
                  >
                    <h3 className="font-semibold truncate" style={{color: isDark ? '#ffffff' : '#000000'}}>{chat.title}</h3>
                    <p className="text-xs" style={{color: isDark ? '#d1d5db' : '#000000'}}>
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel - Chat Content */}
          <div className="lg:col-span-3 light-box p-6 border rounded-xl shadow-sm flex flex-col h-[70vh] overflow-hidden">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-green-500/60 to-emerald-500/60 p-4 rounded-lg mb-4" style={{color: '#ffffff'}}>
                  <h3 className="text-xl font-bold">{selectedChat.title}</h3>
                  <p className="text-sm text-green-100">
                    {selectedChat.messages?.length || 0} messages
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {Array.isArray(selectedChat.messages) && selectedChat.messages.length > 0 ? (
                    selectedChat.messages.map((m, i) => (
                      <div
                        key={i}
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-sm px-4 py-3 rounded-lg backdrop-blur-sm ${
                            m.role === 'user'
                              ? 'bg-green-500/50 rounded-br-none border border-green-400/50'
                              : 'bg-white/30 dark:bg-white/20 rounded-bl-none border border-white/40'
                          }`}
                          style={{color: isDark ? '#ffffff' : '#000000'}}
                        >
                          <div className="text-xs font-semibold mb-1 opacity-70">
                            {m.role === 'user' ? t('common.you') : t('common.assistant')}
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                          {m.fileNames && m.fileNames.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-current border-opacity-20">
                              {m.fileNames.map((fn, idx) => (
                                <div key={idx} className="text-xs opacity-80 underline decoration-dotted" style={{color: isDark ? '#ffffff' : '#000000'}}>
                                  📎 {fn}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="text-xs mt-2 opacity-60" style={{color: isDark ? '#ffffff' : '#000000'}}>
                            {new Date(m.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p style={{color: isDark ? '#d1d5db' : '#000000'}} className="text-gray-600 dark:text-gray-300">{t('common.noConversations')}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="border-t border-white/20 pt-4 flex gap-3">
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
                  <FiClock size={48} className="mx-auto mb-4 opacity-50" />
                  <p style={{color: isDark ? '#d1d5db' : '#000000'}} className="text-gray-700 dark:text-gray-300 text-lg">
                    {t('common.noConversations') || 'Select a chat to view'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ChatHistoryPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading chat history...</div>}>
      <ChatHistoryContent />
    </Suspense>
  );
}
