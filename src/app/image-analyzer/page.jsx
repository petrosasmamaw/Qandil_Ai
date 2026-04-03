'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfileByUserId } from '@/store/slices/profileSlice';
import { authClient } from '@/lib/authClient';
import { analyzeImage } from '@/utils/imageAnalysisService';
import ImageAnalysisDisplay from '@/components/ImageAnalysisDisplay';
import ChatHistory from '@/components/ChatHistory';
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
        const { data } = await authClient.getSession();
        if (!data?.user) {
          window.location.href = '/auth/login';
          return;

        // Initialize new image analyzer chat
        try {
          const chatAction = await dispatch(
            createImageAnalyzerChat({
              userId: data.user.id,
              title: 'New Image Analysis Chat',
            })
          );
          if (chatAction.payload) {
            setCurrentChatId(chatAction.payload._id);
          }
        } catch (err) {
          console.error('Error creating image analyzer chat:', err);
        }
        }
        setSession(data);
        dispatch(fetchProfileByUserId(data.user.id));
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              📸 Image Analyzer
            </h1>
            <p className="text-gray-300">Upload an image and get an educational analysis tailored to your learning profile</p>
          </div>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            📚 History
          </button>
        </div>

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

        {/* How It Works */}
        <div className="mt-12 bg-gradient-to-r from-slate-800 to-slate-700 p-8 rounded-lg border border-slate-600">
          <h2 className="text-2xl font-bold mb-6">How Image Analysis Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-3 font-bold">
                1
              </div>
              <p className="text-sm font-semibold">Upload Image</p>
              <p className="text-xs text-gray-400 mt-1">Select or drag an image to upload</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-3 font-bold">
                2
              </div>
              <p className="text-sm font-semibold">AI Analysis</p>
              <p className="text-xs text-gray-400 mt-1">Our AI examines the image</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-3 font-bold">
                3
              </div>
              <p className="text-sm font-semibold">Personalize</p>
              <p className="text-xs text-gray-400 mt-1">Adapted to your learning level</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-3 font-bold">
                4
              </div>
              <p className="text-sm font-semibold">Learn</p>
              <p className="text-xs text-gray-400 mt-1">Get detailed educational insights</p>
            </div>
          </div>
        </div>

        {/* Educational Focus */}
        <div className="mt-8 bg-gradient-to-r from-slate-800 to-slate-700 p-8 rounded-lg border border-slate-600">
          <h2 className="text-2xl font-bold mb-4">Educational Benefits</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="text-cyan-400 mr-3 font-bold">✓</span>
              <span>Learn new concepts by analyzing real-world images</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 mr-3 font-bold">✓</span>
              <span>Get explanations customized to your learning level and study system</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 mr-3 font-bold">✓</span>
              <span>Understand how concepts apply in practical, visual contexts</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 mr-3 font-bold">✓</span>
              <span>Enhance critical thinking with guided image interpretation</span>
            </li>
          </ul>
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
    </div>
  );
}
