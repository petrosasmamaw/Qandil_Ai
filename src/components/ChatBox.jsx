'use client';

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendChatMessage, getInitialGreeting } from '@/utils/educationalChatService';
import { translations } from '@/utils/translations';
import { FiAward, FiZap } from 'react-icons/fi';

export default function ChatBox({ 
  studentProfile, 
  onClose, 
  chatType,                    // 'aiAssistance', 'notes', 'assignmentGuide', 'imageAnalyzer'
  currentChatId,               // Current chat ID from Redux
  onAddMessage                 // Callback to save message to DB
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const dispatch = useDispatch();
  
  // Get language from Redux
  const language = useSelector((state) => state.theme?.language || 'eng');
  
  // Translation helper function
  const t = (key) => {
    return key.split('.').reduce((obj, k) => obj && obj[k], translations[language]) || key;
  };

  // Load initial greeting
  useEffect(() => {
    const greeting = getInitialGreeting(studentProfile);
    setMessages([
      {
        id: 1,
        sender: 'ai',
        content: greeting,
        timestamp: new Date(),
      },
    ]);
  }, [studentProfile]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setError(t('common.typeMessage'));
      return;
    }

    if (!currentChatId) {
      setError(t('common.chatNotInitialized'));
      return;
    }

    // Add user message to local state
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setError(null);
    setLoading(true);

    try {
      // Save user message to database
      if (onAddMessage) {
        await onAddMessage({
          chatId: currentChatId,
          role: 'user',
          content: inputValue,
          fileNames: [],
        });
      }

      // Prepare conversation history for API (only user messages, excluding AI greeting)
      const conversationHistory = messages
        .filter(msg => msg.sender === 'user')
        .map((msg) => ({
          sender: msg.sender,
          content: msg.content,
        }));

      // Send message to Gemini
      const response = await sendChatMessage(
        studentProfile,
        conversationHistory,
        inputValue
      );

      // Add AI response to local state
      const aiMessage = {
        id: messages.length + 2,
        sender: 'ai',
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Save AI response to database
      if (onAddMessage) {
        await onAddMessage({
          chatId: currentChatId,
          role: 'assistant',
          content: response.message,
          fileNames: [],
        });
      }
    } catch (err) {
      setError(err.message || t('common.failedToSend'));
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white/25 dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-white/40 dark:border-gray-700 backdrop-blur-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2"><FiAward size={20} /> {t('common.educationalAiTutor')}</h3>
          <p className="text-sm text-gray-300">{t('common.personalizedAssistant')} {studentProfile.name}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white/35 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none border border-white/40 dark:border-gray-700'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === 'user'
                    ? 'text-blue-100'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/35 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg rounded-bl-none px-4 py-3 border border-white/40 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-600 dark:border-gray-400"></div>
                <span className="text-sm">{t('common.thinking')}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-800 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200/70 dark:border-gray-700 p-4 bg-gray-50/70 dark:bg-gray-800 backdrop-blur-md">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('common.askQuestion')}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '...' : t('common.send')}
          </button>
        </form>
        <div className="flex items-start gap-2 mt-2 p-2 bg-blue-50 dark:bg-blue-950 rounded text-xs text-blue-800 dark:text-blue-300">
          <FiZap size={14} className="flex-shrink-0 mt-0.5" />
          <p>{t('common.tutorDescription')}</p>
        </div>
      </div>
    </div>
  );
}
