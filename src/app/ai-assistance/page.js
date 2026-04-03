'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authClient } from '@/lib/authClient';
import { useRouter } from 'next/navigation';
import ChatBox from '@/components/ChatBox';
import { fetchProfileByUserId } from '@/store/slices/profileSlice';

export default function AIAssistance() {
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const { profile, loading } = useSelector((state) => state.profile);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
            🤖 Personalized AI Assistance
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your AI tutor is specialized for your learning level ({profile.level}) and study approach ({profile.studySystem})
          </p>
        </div>

        {/* Main Layout - Chat and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <ChatBox studentProfile={profile} />
          </div>

          {/* Sidebar - Student Info & Tips */}
          <div className="space-y-4">
            {/* Student Profile Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📚 Your Profile</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{profile.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Grade</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{profile.grade}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Learning Level</p>
                  <p className="font-semibold text-blue-600 dark:text-blue-400 capitalize">
                    {profile.level}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Study System</p>
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">
                    {profile.studySystem.replace(/_/g, ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Goal</p>
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">
                    {profile.goal.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">💡 How It Works</h3>
              <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-2">
                <li className="flex gap-2">
                  <span className="font-bold">1️⃣</span>
                  <span>Ask any educational question</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">2️⃣</span>
                  <span>AI adapts to your learning level</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">3️⃣</span>
                  <span>Get personalized explanations</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">4️⃣</span>
                  <span>Learn and improve continuously</span>
                </li>
              </ol>
            </div>

            {/* Educational Focus */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-3">✅ Educational Focus</h3>
              <p className="text-sm text-green-800 dark:text-green-400">
                This AI tutor is designed specifically for academic learning and skill development. Topics covered include:
              </p>
              <ul className="text-sm text-green-800 dark:text-green-400 mt-3 space-y-1">
                <li>✓ Academic subjects</li>
                <li>✓ Study techniques</li>
                <li>✓ Exam preparation</li>
                <li>✓ Problem solving</li>
                <li>✓ Concept explanations</li>
              </ul>
            </div>

            {/* Update Profile */}
            <button
              onClick={() => router.push('/profile')}
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
            >
              📝 Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
