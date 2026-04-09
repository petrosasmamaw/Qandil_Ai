'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfileByUserId } from '@/store/slices/profileSlice';
import { supabase } from '@/lib/supabase';
import { analyzeImage } from '@/utils/imageAnalysisService';
import ImageAnalysisDisplay from '@/components/ImageAnalysisDisplay';
import { useTranslation } from '@/hooks/useTranslation';

export default function ImageAnalyzerPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.profile);
  const profileLoading = useSelector((state) => state.profile.loading);
  const profileError = useSelector((state) => state.profile.error);
  const theme = useSelector((state) => state.theme?.mode || 'light');

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isDark, setIsDark] = useState(false);

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
          setError(t('imageAnalyzer.setupDescription'));
          return;
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
      setError(t('imageAnalyzer.invalidImageFile'));
      return;
    }

    setError('');
    setAnalyzing(true);

    try {
      const result = await analyzeImage(file, profile);
      setImageAnalysis(result);
    } catch (err) {
      setError(err.message || t('imageAnalyzer.failedAnalysis'));
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
    const isDarkMode = theme === 'dark' || isDark;
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: isDarkMode ? '#0a0a0a' : '#ffffff',
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(15, 15, 15, 0.9), rgba(26, 26, 26, 0.9), rgba(15, 15, 15, 0.9))'
            : 'linear-gradient(135deg, rgba(248, 250, 249, 0.32), rgba(240, 244, 242, 0.32), rgba(248, 250, 249, 0.32))',
        }}
      >
        <div className="text-center">
          <div 
            className="rounded-full h-12 w-12 border-b-2 mx-auto mb-4 animate-spin"
            style={{ borderColor: isDarkMode ? '#3b82f6' : '#3b82f6' }}
          ></div>
          <p 
            className=""
            style={{ color: isDarkMode ? '#d1d5db' : '#666666' }}
          >
            {t('imageAnalyzer.loadingProfileMsg')}
          </p>
        </div>
      </div>
    );
  }

  if (profileError && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{t('imageAnalyzer.profileErrorMsg')}</p>
          <p className="text-gray-400">{t('imageAnalyzer.profileSetupReminder')}</p>
        </div>
      </div>
    );
  }

  return (
    <main 
      className="light-image-bg min-h-screen p-6 text-gray-800 dark:text-gray-100"
      style={{
        '--light-bg-image': "url('https://cdn.vectorstock.com/i/500p/87/24/pastel-pink-and-blue-blur-backdrop-vector-63408724.jpg')",
        background: `
          ${document.documentElement.classList.contains('dark') ? `
            linear-gradient(135deg, rgba(15, 15, 15, 0.9), rgba(26, 26, 26, 0.9), rgba(15, 15, 15, 0.9)),
            url('https://i.pinimg.com/736x/de/0a/0e/de0a0eb1dd6af97630c3a6b90d162701.jpg') center/cover fixed
          ` : 'none'}
        `,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0a0a0a' : '#ffffff'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-yellow-500 bg-clip-text text-transparent">
              🖼️ {t('imageAnalyzer.title')}
            </h1>
            <p className="text-gray-600 mt-1">
              {profile && `${t('imageAnalyzer.uploadAnalysisFor')} ${profile.name}`}
            </p>
          </div>
        </div>

        {/* LAYOUT */}
        <div className="grid grid-cols-1 gap-6">
          {/* MAIN CONTENT */}
          <div>

            {/* Profile Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
              <div className="bg-white/60 dark:bg-gradient-to-br dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg border border-white/70 dark:border-blue-700 backdrop-blur-lg">
                <p className="text-blue-800 dark:text-blue-300 text-sm font-semibold">{t('imageAnalyzer.studentNameCard')}</p>
                <p className="text-gray-900 dark:text-white font-bold text-lg">{profile?.name}</p>
              </div>
              <div className="bg-white/60 dark:bg-gradient-to-br dark:from-cyan-900 dark:to-cyan-800 p-4 rounded-lg border border-white/70 dark:border-cyan-700 backdrop-blur-lg">
                <p className="text-cyan-800 dark:text-cyan-300 text-sm font-semibold">{t('imageAnalyzer.learningLevelCard')}</p>
                <p className="text-gray-900 dark:text-white font-bold text-lg capitalize">{profile?.level}</p>
              </div>
              <div className="bg-white/60 dark:bg-gradient-to-br dark:from-purple-900 dark:to-purple-800 p-4 rounded-lg border border-white/70 dark:border-purple-700 backdrop-blur-lg">
                <p className="text-purple-800 dark:text-purple-300 text-sm font-semibold">{t('imageAnalyzer.studySystemCard')}</p>
                <p className="text-gray-900 dark:text-white font-bold text-lg">{profile?.studySystem}</p>
              </div>
              <div className="bg-white/60 dark:bg-gradient-to-br dark:from-orange-900 dark:to-orange-800 p-4 rounded-lg border border-white/70 dark:border-orange-700 backdrop-blur-lg">
                <p className="text-orange-800 dark:text-orange-300 text-sm font-semibold">{t('imageAnalyzer.learningGoalCard')}</p>
                <p className="text-gray-900 dark:text-white font-bold text-lg">{profile?.goal}</p>
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
                      ? 'border-blue-400 bg-blue-100/60 dark:bg-blue-500/10 backdrop-blur-lg'
                      : 'border-white/70 dark:border-gray-500 hover:border-blue-300 bg-white/50 dark:bg-transparent backdrop-blur-lg'
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
                  <p className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {analyzing ? t('imageAnalyzer.analyzingText') : t('imageAnalyzer.dropImagePrompt')}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{t('imageAnalyzer.supportedImageFormats')}</p>
                  {analyzing && (
                    <div className="mt-4 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </label>

                {error && (
                  <div className="mt-4 p-4 bg-red-50/75 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-lg backdrop-blur-lg">
                    <p className="text-red-700 dark:text-red-200">{error}</p>
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
        </div>
      </div>
    </main>
  );
}
