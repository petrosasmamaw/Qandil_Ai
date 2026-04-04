'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfileByUserId } from '@/store/slices/profileSlice';
import { supabase } from '@/lib/supabase';
import { analyzeImage } from '@/utils/imageAnalysisService';
import ImageAnalysisDisplay from '@/components/ImageAnalysisDisplay';
import ChatHistory from '@/components/ChatHistory';
import ChatBox from '@/components/ChatBox';
import { FiBook } from 'react-icons/fi';
import {
  createImageAnalyzerChat,
  addMessageToImageAnalyzerChat,
} from '@/store/slices/imageAnalyzerChatSlice';

export default function ImageAnalyzerPage() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.profile);
  const profileLoading = useSelector((state) => state.profile.loading);
  const profileError = useSelector((state) => state.profile.error);
  const { currentChat } = useSelector((state) => state.imageAnalyzerChat);

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          window.location.href = '/auth/login';
          return;
        }

        setSession(session);

        // Fetch student profile using Redux
        const result = await dispatch(fetchProfileByUserId(session.user.id));
        
        if (result.payload === null) {
          setError('Profile not found. Please create your profile first.');
          return;
        }

        // Initialize new image analyzer chat
        try {
          const chatAction = await dispatch(
            createImageAnalyzerChat({
              userId: session.user.id,
              title: 'New Image Analysis Chat',
            })
          );
          if (chatAction.payload) {
            setCurrentChatId(chatAction.payload._id);
          }
        } catch (err) {
          console.error('Error creating image analyzer chat:', err);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        window.location.href = '/auth/login';
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [dispatch]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setError('');
    setAnalyzing(true);

    try {
      const result = await analyzeImage(file, profile);
      setImageAnalysis(result);
    } catch (err) {
      setError(err.message || 'Failed to analyze image');
      console.error('Image analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDeleteAnalysis = () => {
    setImageAnalysis(null);
    setError('');
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (profileError && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Failed to load your profile</p>
          <p className="text-gray-400">Please make sure you have completed your profile setup</p>
        </div>
      </div>
    );
  }

  return (
    <main 
      className="min-h-screen p-6 text-gray-800"
      style={{
        background: `
          linear-gradient(135deg, rgba(248, 250, 249, 0.9), rgba(240, 244, 242, 0.9), rgba(248, 250, 249, 0.9)),
          url('https://i.pinimg.com/736x/de/0a/0e/de0a0eb1dd6af97630c3a6b90d162701.jpg') center/cover fixed
        `,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-yellow-500 bg-clip-text text-transparent">
              🖼️ Image Analyzer
            </h1>
            <p className="text-gray-600 mt-1">
              {profile && `Upload images for intelligent analysis for ${profile.name}`}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition-colors"
            >
              <FiBook size={18} className="text-green-700" /> History
            </button>
            <button
              onClick={async () => {
                try {
                  const chatAction = await dispatch(
                    createImageAnalyzerChat({
                      userId: session.user.id,
                      title: 'New Image Analysis Chat',
                    })
                  );
                  if (chatAction.payload) {
                    setCurrentChatId(chatAction.payload._id);
                  }
                } catch (err) {
                  console.error('Error creating new image analyzer chat:', err);
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
          {/* MAIN CONTENT */}
          <div className="lg:col-span-3">

            {/* Profile Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-4 rounded-lg border border-blue-700">
                <p className="text-blue-300 text-sm font-semibold">Student Name</p>
                <p className="text-white font-bold text-lg">{profile?.name}</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-900 to-cyan-800 p-4 rounded-lg border border-cyan-700">
                <p className="text-cyan-300 text-sm font-semibold">Learning Level</p>
                <p className="text-white font-bold text-lg capitalize">{profile?.level}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-4 rounded-lg border border-purple-700">
                <p className="text-purple-300 text-sm font-semibold">Study System</p>
                <p className="text-white font-bold text-lg">{profile?.studySystem}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-900 to-orange-800 p-4 rounded-lg border border-orange-700">
                <p className="text-orange-300 text-sm font-semibold">Learning Goal</p>
                <p className="text-white font-bold text-lg">{profile?.goal}</p>
              </div>
            </div>

            {/* Upload Area */}
            {!imageAnalysis ? (
              <div className="mb-8">
                <label
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`block border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-blue-400 bg-blue-500 bg-opacity-10'
                      : 'border-gray-500 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={analyzing}
                    className="hidden"
                  />
                  <div className="mb-4">
                    <span className="text-5xl">🖼️</span>
                  </div>
                  <p className="text-xl font-semibold mb-2">
                    {analyzing ? 'Analyzing image...' : 'Drop your image here or click to upload'}
                  </p>
                  <p className="text-gray-400 text-sm">Supported formats: PNG, JPG, GIF, WebP</p>
                  {analyzing && (
                    <div className="mt-4 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </label>

                {error && (
                  <div className="mt-4 p-4 bg-red-900 bg-opacity-50 border border-red-700 rounded-lg">
                    <p className="text-red-200">{error}</p>
                  </div>
                )}
              </div>
            ) : (
              <ImageAnalysisDisplay
                analysis={imageAnalysis}
                onDelete={handleDeleteAnalysis}
              />
            )}
          </div>

          {/* Chat Box Sidebar */}
          <div className="lg:col-span-1">
            <ChatBox 
              studentProfile={profile}
              chatType="imageAnalyzer"
              currentChatId={currentChatId}
              onAddMessage={(messageData) => dispatch(addMessageToImageAnalyzerChat(messageData))}
            />
          </div>
        </div>

        {/* Chat History Modal */}
        <ChatHistory
          userId={session?.user?.id}
          chatType="imageAnalyzer"
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
