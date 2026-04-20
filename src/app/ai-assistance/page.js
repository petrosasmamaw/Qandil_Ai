'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import ChatBox from '@/components/ChatBox';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchProfileByUserId } from '@/store/slices/profileSlice';
import {
  createAIAssistanceChat,
  addMessageToAIChat,
} from '@/store/slices/aiAssistanceChatSlice';
import { AIAssistanceSkeletonLoader } from '@/components/Skeleton';

import { 
  FiBook, 
  FiZap, 
  FiCpu, 
  FiCheck, 
  FiCheckCircle, 
  FiPlus, 
  FiEdit2 
} from 'react-icons/fi';

// Helper function to extract first 5 words for chat title
const getFirstFiveWords = (text) => {
  if (!text) return 'New Conversation';
  return text
    .split(' ')
    .slice(0, 5)
    .filter(word => word.length > 0)
    .join(' ') || 'New Conversation';
};

// Helper function to extract first 4 words for chat title
const getFirstFourWords = (text) => {
  if (!text) return 'New Conversation';
  return text
    .split(' ')
    .slice(0, 4)
    .filter(word => word.length > 0)
    .join(' ') || 'New Conversation';
};

export default function AIAssistance() {
  const { t } = useTranslation();
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { profile, loading } = useSelector((state) => state.profile);

  // Match Home page theme detection exactly
  useEffect(() => {
    const dark = document.documentElement.classList.contains('dark');
    setIsDark(dark);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession?.user) {
          router.push('/auth/login');
          return;
        }

        setSession(currentSession);
        const result = await dispatch(fetchProfileByUserId(currentSession.user.id));
        
        if (result.payload === null) {
          setError(t('aiAssistance.profileNotFound'));
          return;
        }

        // Don't create chat here - let ChatBox create it when user sends first message
        console.log('Session initialized, waiting for user to send message to create chat');
      } catch (err) {
        console.error('Error initializing session:', err);
        setError(err.message || 'Failed to load session');
      }
    };

    initializeSession();
  }, [router, dispatch, t]);

  // Function to create a new chat (called when user sends first message)
  const handleCreateChat = async (messageContent = '') => {
    try {
      const chatTitle = getFirstFiveWords(messageContent);
      const chatAction = await dispatch(
        createAIAssistanceChat({
          userId: session?.user?.id,
          title: chatTitle,
        })
      );
      
      console.log('Chat created on first message:', chatAction);
      
      if (chatAction.payload && chatAction.payload._id) {
        console.log('Setting currentChatId to:', chatAction.payload._id);
        setCurrentChatId(chatAction.payload._id);
        return chatAction.payload._id;
      } else {
        console.error('Failed to create chat:', chatAction);
        return null;
      }
    } catch (err) {
      console.error('Error creating chat:', err);
      return null;
    }
  };

  if (loading) {
    return <AIAssistanceSkeletonLoader isDark={isDark} />;
  }

  // Same backgroundStyle logic as Home
  const backgroundStyle = {
    '--light-bg-image': "url('https://cdn.vectorstock.com/i/500p/87/24/pastel-pink-and-blue-blur-backdrop-vector-63408724.jpg')",
  };

  return (
    <main 
      className="light-image-bg min-h-screen p-4 md:p-8 transition-colors duration-300 relative z-0" 
      style={backgroundStyle}
    >
      {/* DARK MODE BACKGROUND - Exactly like Home page */}
      {isDark && (
        <div 
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAxL3Jhd3BpeGVsX29mZmljZV8zNF9taW5pbWFsX2Fic3RyYWN0X2JsdWVfYW5kX3B1cnBsZV9uZW9uX3dhdnlfZ182ZWQyZmJmMS05ZWMzLTQxNmItOWY4My0yZmJmNThjOWUyNzVfMS5qcGc.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(8px)',
            transform: 'scale(1.05)', 
          }}
        />
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="light-box px-6 py-4 border shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-600/10 rounded-2xl text-green-600">
              <FiCpu size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight">{t('aiAssistance.title')}</h1>
              <p className="text-sm opacity-70">
                {profile?.level} • {profile?.studySystem?.replace(/_/g, ' ')}
              </p>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => router.push('/chat-history?type=aiAssistance')}
              className="flex-1 md:flex-none px-5 py-3 rounded-xl light-box border font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <FiBook size={18} className="text-blue-500" /> {t('common.history')}
            </button>
              <button
                onClick={async () => {
                  const chatAction = await dispatch(createAIAssistanceChat({
                      userId: session?.user.id,
                      title: t('aiAssistance.newChatTitle'),
                  }));
                  if (chatAction.payload) setCurrentChatId(chatAction.payload._id);
                }}
                className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <FiPlus size={20} /> {t('aiAssistance.newChat')}
              </button>
            </div>
          </div>


        {/* LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 light-box p-4 md:p-6 flex flex-col h-[125vh] md:h-[90vh] border shadow-xl overflow-hidden relative">
             <ChatBox 
              studentProfile={profile}
              chatType="aiAssistance"
              currentChatId={currentChatId}
              onAddMessage={(messageData) => dispatch(addMessageToAIChat(messageData))}
              onCreateChat={handleCreateChat}
            />
          </div>

          <div className="space-y-6">
            <div className="light-box p-6 border shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FiBook className="text-green-600" /> {t('aiAssistance.profile')}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                  <span className="opacity-60">{t('aiAssistance.nameLabel')}</span>
                  <span className="font-semibold">{profile?.name}</span>
                </div>
                <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                  <span className="opacity-60">{t('aiAssistance.gradeLabel')}</span>
                  <span className="font-semibold">{profile?.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">{t('aiAssistance.levelLabel')}</span>
                  <span className="text-green-600 font-bold uppercase text-[10px] bg-green-500/10 px-2 py-1 rounded-md">{profile?.level}</span>
                </div>
              </div>
            </div>

            <div className="light-box p-6 border-l-4 border-l-green-500 shadow-sm">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-green-600"><FiZap /> {t('aiAssistance.howItWorks')}</h3>
              <ul className="text-xs space-y-3 opacity-80">
                <li className="flex items-start gap-2"><FiCheckCircle className="mt-0.5" /> {t('aiAssistance.askQuestions')}</li>
                <li className="flex items-start gap-2"><FiCheckCircle className="mt-0.5" /> {t('aiAssistance.aiAdapts')}</li>
              </ul>
            </div>

            <button
              onClick={() => router.push('/profile')}
              className="w-full py-4 rounded-2xl light-box border font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <FiEdit2 size={16} /> {t('aiAssistance.updateProfile')}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}