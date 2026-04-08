'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import ChatBox from '@/components/ChatBox';
import ChatHistory from '@/components/ChatHistory';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchProfileByUserId } from '@/store/slices/profileSlice';
import {
  createAIAssistanceChat,
  addMessageToAIChat,
} from '@/store/slices/aiAssistanceChatSlice';
import { FiBook, FiZap, FiFileText, FiCpu, FiCheck, FiCheckCircle } from 'react-icons/fi';

export default function AIAssistance() {
  const { t } = useTranslation();
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { profile, loading } = useSelector((state) => state.profile);
  const { currentChat } = useSelector((state) => state.aiAssistanceChat);
  const theme = useSelector((state) => state.theme?.mode || 'light');

  // Listen for theme changes
  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    updateTheme();
    window.addEventListener('themechange', updateTheme);
    
    // Also watch for class changes on html element
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      window.removeEventListener('themechange', updateTheme);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Get session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push('/auth/login');
          return;
        }

        setSession(session);

        // Fetch student profile using Redux
        const result = await dispatch(fetchProfileByUserId(session.user.id));
        
        if (result.payload === null) {
          setError(t('aiAssistance.profileNotFound'));
          return;
        }


        // Initialize new chat
        try {
          const chatAction = await dispatch(
            createAIAssistanceChat({
              userId: session.user.id,
              title: t('aiAssistance.newChatTitle'),
            })
          );
          if (chatAction.payload) {
            setCurrentChatId(chatAction.payload._id);
          }
        } catch (err) {
          console.error('Error creating chat:', err);
        }
        if (result.type.endsWith('/rejected')) {
          setError(result.payload || 'Failed to fetch profile');
        }
      } catch (err) {
        console.error('Error initializing chat:', err);
        setError(err.message || 'Failed to load chat');
      }
    };

    initializeChat();
  }, [router, dispatch]);

  if (loading) {
    const isDarkMode = theme === 'dark' || isDark;
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: isDarkMode ? '#0a0a0a' : '#ffffff',
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(15, 15, 15, 0.9), rgba(26, 26, 26, 0.9), rgba(15, 15, 15, 0.9))'
            : 'linear-gradient(135deg, rgba(248, 250, 249, 0.9), rgba(240, 244, 242, 0.9), rgba(248, 250, 249, 0.9))',
        }}
      >
        <div className="text-center">
          <div 
            className="inline-block rounded-lg p-8"
            style={{
              backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-green-600 mb-4 mx-auto"></div>
            <p 
              style={{ color: isDarkMode ? '#a0a0a0' : '#666666' }}
              className="text-lg font-medium"
            >
              {t('aiAssistance.loadingAiAssistant')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <div className="text-red-600 dark:text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-900 dark:text-red-300 mb-2">{t('aiAssistance.setupRequired')}</h2>
            <p className="text-red-800 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => router.push('/profile')}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              {t('aiAssistance.createProfile')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <main 
      className="min-h-screen p-6 text-gray-800 dark:text-gray-100"
      style={{
        background: `
          linear-gradient(135deg, ${isDark ? 'rgba(15, 15, 15, 0.9), rgba(26, 26, 26, 0.9), rgba(15, 15, 15, 0.9)' : 'rgba(248, 250, 249, 0.9), rgba(240, 244, 242, 0.9), rgba(248, 250, 249, 0.9)'}),
          url('https://i.pinimg.com/736x/de/0a/0e/de0a0eb1dd6af97630c3a6b90d162701.jpg') center/cover fixed
        `,
        backgroundColor: isDark ? '#0a0a0a' : '#ffffff'
      }}
    >
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-yellow-500 bg-clip-text text-transparent">
              <FiCpu size={24} className="text-green-700" /> {t('aiAssistance.title')}
            </h1>
            <p className="text-gray-600 mt-1">
              {profile && `${t('aiAssistance.tuned')} (${profile.level}) and study approach (${profile.studySystem})`}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition-colors"
            >
              <FiBook size={18} className="text-green-700" /> {t('aiAssistance.history')}
            </button>
            <button
              onClick={async () => {
                try {
                  const chatAction = await dispatch(
                    createAIAssistanceChat({
                      userId: session.user.id,
                      title: t('aiAssistance.newChatTitle'),
                    })
                  );
                  if (chatAction.payload) {
                    setCurrentChatId(chatAction.payload._id);
                  }
                } catch (err) {
                  console.error('Error creating new chat:', err);
                }
              }}
              className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
            >
              ➕ {t('aiAssistance.newChat')}
            </button>
          </div>
        </div>

        {/* LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* CHAT AREA */}
          <div className="lg:col-span-3 bg-white/90 dark:bg-slate-900/60 dark:backdrop-blur-md rounded-2xl shadow-lg dark:shadow-lg p-6 flex flex-col h-[75vh] border dark:border-blue-400/30">
            <ChatBox 
              studentProfile={profile}
              chatType="aiAssistance"
              currentChatId={currentChatId}
              onAddMessage={(messageData) => dispatch(addMessageToAIChat(messageData))}
            />
          </div>

          {/* SIDEBAR */}
          <div className="space-y-4">

            {/* Profile Widget */}
            <div className="bg-white/90 dark:bg-slate-900/60 dark:backdrop-blur-md p-5 rounded-2xl shadow-md dark:shadow-md border dark:border-blue-400/30">
              <h3 className="font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2"><FiBook size={18} /> {t('aiAssistance.profile')}</h3>
              {profile && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-medium">{t('aiAssistance.nameLabel')}:</span> {profile.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-medium">{t('aiAssistance.gradeLabel')}:</span> {profile.grade}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-medium">{t('aiAssistance.levelLabel')}:</span> <span className="capitalize text-green-600 dark:text-green-400 font-semibold">{profile.level}</span></p>
                  <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-medium">{t('aiAssistance.studyLabel')}:</span> <span className="capitalize">{profile.studySystem.replace(/_/g, ' ')}</span></p>
                  <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-medium">{t('aiAssistance.goalLabel')}:</span> <span className="capitalize">{profile.goal.replace(/_/g, ' ')}</span></p>
                </div>
              )}
            </div>

            {/* How it works */}
            <div className="bg-green-50/90 dark:bg-green-500/15 dark:backdrop-blur-md p-5 rounded-2xl shadow-md dark:shadow-md border dark:border-green-400/30">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                <FiZap size={18} /> {t('aiAssistance.howItWorks')}
              </h3>
              <ul className="text-sm space-y-2 text-green-700 dark:text-green-200">
                <li className="flex items-center gap-2"><FiCheckCircle size={14} /> {t('aiAssistance.askQuestions')}</li>
                <li className="flex items-center gap-2"><FiCheckCircle size={14} /> {t('aiAssistance.aiAdapts')}</li>
                <li className="flex items-center gap-2"><FiCheckCircle size={14} /> {t('aiAssistance.getExplanations')}</li>
                <li className="flex items-center gap-2"><FiCheckCircle size={14} /> {t('aiAssistance.improveDaily')}</li>
              </ul>
            </div>

            {/* Focus */}
            <div className="bg-yellow-50/90 dark:bg-yellow-500/15 dark:backdrop-blur-md p-5 rounded-2xl shadow-md dark:shadow-md border dark:border-yellow-400/30">
              <h3 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-3">
                ✅ {t('aiAssistance.focus')}
              </h3>
              <ul className="text-sm space-y-1 text-yellow-600 dark:text-yellow-200">
                <li className="flex items-center gap-2"><FiCheck size={16} /> {t('aiAssistance.studyHelp')}</li>
                <li className="flex items-center gap-2"><FiCheck size={16} /> {t('aiAssistance.exams')}</li>
                <li className="flex items-center gap-2"><FiCheck size={16} /> {t('aiAssistance.problemSolving')}</li>
                <li className="flex items-center gap-2"><FiCheck size={16} /> {t('aiAssistance.concepts')}</li>
              </ul>
            </div>

            {/* Update Profile Button */}
            <button
              onClick={() => router.push('/profile')}
              className="w-full py-3 rounded-xl bg-gray-200 dark:bg-slate-700/60 dark:backdrop-blur-sm dark:border dark:border-blue-400/30 hover:bg-gray-300 dark:hover:bg-slate-700/80 transition-colors font-medium text-gray-900 dark:text-white"
            >
              <span className="flex items-center gap-2"><FiFileText size={16} /> {t('aiAssistance.updateProfile')}</span>
            </button>
          </div>
        </div>

        {/* Chat History Modal */}
        <ChatHistory
          userId={session?.user?.id}
          chatType="aiAssistance"
          onHistorySelect={(chatId) => {
            setCurrentChatId(chatId);
            setIsHistoryOpen(false);
          }}
          onClose={() => setIsHistoryOpen(false)}
          isOpen={isHistoryOpen}
        />
      </div>
    </main>
  );
}
