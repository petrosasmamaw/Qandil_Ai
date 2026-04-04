'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authClient } from '@/lib/authClient';
import { useRouter } from 'next/navigation';
import ChatBox from '@/components/ChatBox';
import ChatHistory from '@/components/ChatHistory';
import { fetchProfileByUserId } from '@/store/slices/profileSlice';
import {
  createAIAssistanceChat,
  addMessageToAIChat,
} from '@/store/slices/aiAssistanceChatSlice';

export default function AIAssistance() {
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { profile, loading } = useSelector((state) => state.profile);
  const { currentChat } = useSelector((state) => state.aiAssistanceChat);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Get session
        const { data } = await authClient.getSession();
        if (!data?.user) {
          router.push('/auth/login');
          return;
        }

        setSession(data);

        // Fetch student profile using Redux
        const result = await dispatch(fetchProfileByUserId(data.user.id));
        
        if (result.payload === null) {
          setError('Profile not found. Please create your profile first.');
          return;
        }


        // Initialize new chat
        try {
          const chatAction = await dispatch(
            createAIAssistanceChat({
              userId: data.user.id,
              title: 'New AI Assistance Chat',
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading AI Assistant...</p>
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
            <h2 className="text-2xl font-bold text-red-900 dark:text-red-300 mb-2">Setup Required</h2>
            <p className="text-red-800 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => router.push('/profile')}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Create Profile
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
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-yellow-500 bg-clip-text text-transparent">
              🤖 AI Assistant
            </h1>
            <p className="text-gray-600 mt-1">
              {profile && `Tuned for your learning level (${profile.level}) and study approach (${profile.studySystem})`}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition-colors"
            >
              📚 History
            </button>
            <button
              onClick={async () => {
                try {
                  const chatAction = await dispatch(
                    createAIAssistanceChat({
                      userId: session.user.id,
                      title: 'New AI Assistance Chat',
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
              ➕ New Chat
            </button>
          </div>
        </div>

        {/* LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* CHAT AREA */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-md p-6 flex flex-col h-[75vh]">
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
            <div className="bg-white p-5 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-green-700 mb-3">📚 Profile</h3>
              {profile && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600"><span className="font-medium">Name:</span> {profile.name}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Grade:</span> {profile.grade}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Level:</span> <span className="capitalize text-green-600 font-semibold">{profile.level}</span></p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Study:</span> <span className="capitalize">{profile.studySystem.replace(/_/g, ' ')}</span></p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Goal:</span> <span className="capitalize">{profile.goal.replace(/_/g, ' ')}</span></p>
                </div>
              )}
            </div>

            {/* How it works */}
            <div className="bg-green-50 p-5 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-green-800 mb-3">
                💡 How it works
              </h3>
              <ul className="text-sm space-y-2 text-green-700">
                <li>1️⃣ Ask questions</li>
                <li>2️⃣ AI adapts to you</li>
                <li>3️⃣ Get explanations</li>
                <li>4️⃣ Improve daily</li>
              </ul>
            </div>

            {/* Focus */}
            <div className="bg-yellow-50 p-5 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-yellow-700 mb-3">
                ✅ Focus
              </h3>
              <ul className="text-sm space-y-1 text-yellow-600">
                <li>✓ Study help</li>
                <li>✓ Exams</li>
                <li>✓ Problem solving</li>
                <li>✓ Concepts</li>
              </ul>
            </div>

            {/* Update Profile Button */}
            <button
              onClick={() => router.push('/profile')}
              className="w-full py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition-colors font-medium"
            >
              📝 Update Profile
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
