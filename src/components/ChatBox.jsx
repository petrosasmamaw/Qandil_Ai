'use client';

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendChatMessage, getInitialGreeting } from '@/utils/educationalChatService';
import { translations } from '@/utils/translations';
import { FiAward, FiZap, FiSend } from 'react-icons/fi';

export default function ChatBox({ 
  studentProfile, 
  onClose, 
  chatType,                    
  currentChatId,               
  onAddMessage                 
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const dispatch = useDispatch();
  
  const language = useSelector((state) => state.theme?.language || 'eng');
  
  const t = (key) => {
    return key.split('.').reduce((obj, k) => obj && obj[k], translations[language]) || key;
  };

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (studentProfile) {
      const greeting = getInitialGreeting(studentProfile);
      setMessages([
        {
          id: 1,
          sender: 'ai',
          content: greeting,
          timestamp: new Date(),
        },
      ]);
    }
  }, [studentProfile]);

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
      if (onAddMessage) {
        await onAddMessage({
          chatId: currentChatId,
          role: 'user',
          content: inputValue,
          fileNames: [],
        });
      }

      const conversationHistory = messages
        .filter(msg => msg.sender === 'user')
        .map((msg) => ({
          sender: msg.sender,
          content: msg.content,
        }));

      const response = await sendChatMessage(
        studentProfile,
        conversationHistory,
        inputValue
      );

      const aiMessage = {
        id: messages.length + 2,
        sender: 'ai',
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

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
    <div className="h-full flex flex-col bg-transparent overflow-hidden">
      {/* Header - Glassy with transition */}
      <div className="bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 p-4 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg text-green-600 dark:text-green-400">
             <FiAward size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">{t('common.educationalAiTutor')}</h3>
            <p className="text-xs opacity-60 font-medium">{t('common.personalizedAssistant')} {studentProfile?.name || 'Student'}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] lg:max-w-[70%] px-5 py-3 rounded-2xl shadow-sm transition-all ${
                message.sender === 'user'
                  ? 'bg-green-600 text-white rounded-br-none shadow-green-500/20'
                  : 'light-box rounded-bl-none border border-black/5 dark:border-white/10'
              }`}
              style={message.sender === 'ai' ? { color: isDark ? '#ffffff' : '#000000' } : {}}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
              <div
                className={`text-[10px] mt-2 font-medium opacity-60 ${
                  message.sender === 'user' ? 'text-white' : ''
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="light-box px-5 py-3 rounded-2xl rounded-bl-none border border-black/5 flex items-center gap-3" style={{ color: isDark ? '#ffffff' : '#000000' }}>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce"></span>
              </span>
              <span className="text-xs font-semibold opacity-60 uppercase tracking-tighter">{t('common.thinking')}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mb-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs font-medium animate-pulse">
          ⚠️ {error}
        </div>
      )}

      {/* Input Area - Integrated Glass Design */}
      <div className="p-4 md:p-6 bg-black/5 dark:bg-white/5 border-t border-black/5 dark:border-white/10 backdrop-blur-xl">
        <form onSubmit={handleSendMessage} className="relative group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('common.askQuestion')}
            disabled={loading}
            className="w-full pl-5 pr-14 py-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all disabled:opacity-50 text-sm"
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="absolute right-2 top-2 bottom-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all disabled:opacity-0 disabled:scale-90 flex items-center justify-center shadow-lg shadow-green-600/20"
          >
            <FiSend size={18} />
          </button>
        </form>
        
        {/* Footer info badge */}
        <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-green-500/5 rounded-lg border border-green-500/10">
          <FiZap size={14} className="text-green-600" />
          <p className="text-[10px] font-medium opacity-70 leading-tight">
            {t('common.tutorDescription')}
          </p>
        </div>
      </div>
    </div>
  );
}