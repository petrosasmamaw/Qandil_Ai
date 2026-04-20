'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchProfileByUserId } from '@/store/slices/profileSlice';
import { createImageAnalyzerChat, addMessageToImageAnalyzerChat } from '@/store/slices/imageAnalyzerChatSlice';
import { supabase } from '@/lib/supabase';
import { analyzeImage } from '@/utils/imageAnalysisService';
import ImageAnalysisDisplay from '@/components/ImageAnalysisDisplay';
import { useTranslation } from '@/hooks/useTranslation';
import { ImageAnalyzerSkeletonLoader } from '@/components/Skeleton';
import { FiImage, FiUploadCloud, FiInfo, FiBook } from 'react-icons/fi';

// Helper function to extract first 4 words for chat title
const getFirstFourWords = (text) => {
  if (!text) return 'Image Analysis';
  return text
    .split(' ')
    .slice(0, 4)
    .filter(word => word.length > 0)
    .join(' ') || 'Image Analysis';
};

export default function ImageAnalyzerPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.profile);
  const profileLoading = useSelector((state) => state.profile.loading);
  const profileError = useSelector((state) => state.profile.error);
  const language = useSelector((state) => state.language?.language || 'eng');

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [imageChatId, setImageChatId] = useState(null);

  // Unified Theme Detection
  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession?.user) {
          window.location.href = '/auth/login';
          return;
        }

        setSession(currentSession);
        const result = await dispatch(fetchProfileByUserId(currentSession.user.id));
        
        if (result.payload === null) {
          setError(t('imageAnalyzer.setupDescription'));
          return;
        }
      } catch (err) {
        console.error('Error checking session:', err);
        window.location.href = '/auth/login';
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [dispatch, t]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files?.[0]) handleImageUpload(files[0]);
  };

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
  };

  const handleImageUpload = async (file) => {
    if (!file.type.startsWith('image/')) {
      setError(t('imageAnalyzer.invalidImageFile'));
      return;
    }

    setError('');
    setAnalyzing(true);

    try {
      const result = await analyzeImage(file, profile, language);
      setImageAnalysis(result);
      try {
        // create or reuse image-analyzer chat and save file name + analysis
        const chatTitle = getFirstFourWords(result.analysis);
        const chatAction = await dispatch(createImageAnalyzerChat({ userId: session?.user?.id, title: chatTitle }));
        const chatId = chatAction.payload?._id;
        
        if (chatId) {
          setImageChatId(chatId);
          await dispatch(addMessageToImageAnalyzerChat({ chatId, role: 'user', content: '', fileNames: [result.fileName] }));
          await dispatch(addMessageToImageAnalyzerChat({ chatId, role: 'assistant', content: result.analysis || '', fileNames: [] }));
        } else {
          console.error('Failed to create image analyzer chat:', chatAction);
          setError('Failed to save image analysis. Please try again.');
        }
      } catch (err) {
        console.error('Failed to save image analysis to chat:', err);
        setError('Failed to save image analysis. Please try again.');
      }
    } catch (err) {
      setError(err.message || t('imageAnalyzer.failedAnalysis'));
      console.error('Image analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading || profileLoading) {
    return <ImageAnalyzerSkeletonLoader isDark={isDark} />;
  }

  return (
    <main 
      className="light-image-bg min-h-screen p-6 md:p-8 transition-colors duration-300 relative z-0"
      style={{ '--light-bg-image': "url('https://cdn.vectorstock.com/i/500p/87/24/pastel-pink-and-blue-blur-backdrop-vector-63408724.jpg')" }}
    >
      {/* DARK MODE BACKGROUND - Matches global style */}
      {isDark && (
        <div 
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAxL3Jhd3BpeGVsX29mZmljZV8zNF9taW5pbWFsX2Fic3RyYWN0X2JsdWVfYW5kX3B1cnBsZV9uZW9uX3dhdnlfZ182ZWQyZmJmMS05ZWMzLTQxNmItOWY4My0yZmJmNThjOWUyNzVfMS5qcGc.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            transform: 'scale(1.05)', 
          }}
        />
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div className="light-box px-6 py-4 border shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-600">
              <FiImage size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight">{t('imageAnalyzer.title')}</h1>
              <p className="text-sm opacity-70">
                {profile && `${t('imageAnalyzer.uploadAnalysisFor')} ${profile.name}`}
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => router.push('/chat-history?type=imageAnalyzer')}
              className="flex-1 md:flex-none px-5 py-3 rounded-xl light-box border font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <FiBook size={18} className="text-blue-500" /> {t('common.history')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Profile Status Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: t('imageAnalyzer.studentNameCard'), value: profile?.name },
              { label: t('imageAnalyzer.learningLevelCard'), value: profile?.level },
              { label: t('imageAnalyzer.studySystemCard'), value: profile?.studySystem },
              { label: t('imageAnalyzer.learningGoalCard'), value: profile?.goal }
            ].map((stat, i) => (
              <div key={i} className="light-box p-4 border text-center">
                <p className="text-[10px] opacity-50 uppercase font-black tracking-widest mb-1">{stat.label}</p>
                <p className="font-bold capitalize text-sm truncate">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* UPLOADER / ANALYZER AREA */}
          {!imageAnalysis ? (
            <div className="w-full max-w-4xl mx-auto">
              <label
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`block relative overflow-hidden border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all light-box ${
                  dragActive ? 'border-blue-500 bg-blue-500/5 scale-[1.01]' : 'border-black/10 dark:border-white/10 hover:border-blue-400'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={analyzing}
                  className="hidden"
                />
                
                <div className="flex flex-col items-center">
                  <div className={`mb-6 p-6 rounded-full transition-transform duration-500 ${analyzing ? 'animate-bounce' : ''} bg-blue-600/10 text-blue-600`}>
                    <FiUploadCloud size={48} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {analyzing ? t('imageAnalyzer.analyzingText') : t('imageAnalyzer.dropImagePrompt')}
                  </h3>
                  <p className="opacity-60 mb-8 max-w-sm mx-auto">
                    {t('imageAnalyzer.supportedImageFormats')}
                  </p>
                  
                  {analyzing && (
                    <div className="w-48 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 animate-progress"></div>
                    </div>
                  )}
                </div>
              </label>

              {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 backdrop-blur-md flex items-center gap-3">
                  <FiInfo /> <span>{error}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ImageAnalysisDisplay
                analysis={imageAnalysis}
                onDelete={() => {
                  setImageAnalysis(null);
                  setError('');
                }}
              />
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress {
          animation: progress 1.5s infinite linear;
        }
      `}</style>
    </main>
  );
}