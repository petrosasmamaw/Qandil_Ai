'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { fetchProfileByUserId } from '@/store/slices/profileSlice';
import { generateAssignmentGuidance, generateAssignmentGuidanceFromText } from '@/utils/assignmentGuidanceService';
import AssignmentGuidanceDisplay from '@/components/AssignmentGuidanceDisplay';
import { useTranslation } from '@/hooks/useTranslation';
import { FiClipboard, FiBook, FiZap, FiFileText, FiCheck } from 'react-icons/fi';

export default function AssignmentGuidePage() {
  const { t } = useTranslation();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [guidances, setGuidances] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [inputMode, setInputMode] = useState('file'); // 'file' or 'text'
  const [textInput, setTextInput] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { profile } = useSelector((state) => state.profile);

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
    const initialize = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession?.user) {
          router.push('/auth/login');
          return;
        }

        setSession(currentSession);
        const result = await dispatch(fetchProfileByUserId(currentSession.user.id));
        
        if (result.payload === null) {
          setError(t('assignmentGuide.setupDescription'));
          return;
        }
      } catch (err) {
        console.error('Error initializing:', err);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [router, dispatch, t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black/10 border-t-green-600 mx-auto"></div>
          <p className="mt-4 opacity-70">{t('assignmentGuide.loading')}</p>
        </div>
      </div>
    );
  }

  if (!session || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full light-box p-8 border text-center shadow-xl">
          <p className="opacity-70 mb-6">{t('assignmentGuide.profileNotCreated')}</p>
          <button
            onClick={() => router.push('/profile')}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all"
          >
            {t('assignmentGuide.profileRequired')}
          </button>
        </div>
      </div>
    );
  }

  // logic functions for processing files and text remain same...
  const handleFileUpload = async (files) => { /* ... (keep your existing logic) */ };
  const handleTextSubmit = async (e) => { /* ... (keep your existing logic) */ };
  const handleDrag = (e) => { /* ... (keep your existing logic) */ };
  const handleDrop = (e) => { /* ... (keep your existing logic) */ };
  const handleDeleteGuidance = (guidanceId) => { /* ... (keep your existing logic) */ };
  const handleDownloadGuidance = (guidance) => { /* ... (keep your existing logic) */ };

  return (
    <main 
      className="light-image-bg min-h-screen p-6 md:p-8 transition-colors duration-300 relative z-0"
      style={{ '--light-bg-image': "url('https://cdn.vectorstock.com/i/500p/87/24/pastel-pink-and-blue-blur-backdrop-vector-63408724.jpg')" }}
    >
      {/* DARK MODE BACKGROUND - Matches Home Page perfectly */}
      {isDark && (
        <div 
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.openai.com/static-rsc-4/UhK-ZnGnaOc26fOHcPEMngdrJMi0lBmw_eKNkaDh38qqO6xopIWrT3GyMD_7F0bUEwvEgsSxHAA7F9eZ0sIsr6zwzCbSZXRwDuam2ZAsT_4kprqEa4D6b_95yr-58SC2Fzcww7u8K9AFRoRHVUJ2ItNncyjWPfYYxDDhB96QIwwOEW1mvB1bi6CkXIYSZjje?purpose=inline')`,
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
        <div className="flex justify-between items-center mb-8">
          <div className="light-box px-6 py-4 border shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-600/10 rounded-2xl text-green-600">
              <FiClipboard size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight">{t('assignmentGuide.titleDisplay')}</h1>
              <p className="text-sm opacity-70">
                {t('assignmentGuide.getGuidedHelp')} {profile.name} • {t('profile.grade')} {profile.grade}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 backdrop-blur-md">
              ⚠️ {error}
            </div>
          )}

          {/* Mode Selector */}
          <div className="flex gap-2">
            {['file', 'text'].map((mode) => (
              <button
                key={mode}
                onClick={() => setInputMode(mode)}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  inputMode === mode 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'light-box border opacity-70 hover:opacity-100'
                }`}
              >
                {mode === 'file' ? '📤 ' + t('assignmentGuide.uploadFiles') : '✏️ ' + t('assignmentGuide.pasteText')}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="w-full">
            {inputMode === 'file' ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`p-12 border-2 border-dashed rounded-3xl transition-all text-center light-box ${
                  dragActive ? 'border-green-500 bg-green-500/5' : 'border-black/10 dark:border-white/10'
                }`}
              >
                <div className="text-5xl mb-4">📤</div>
                <h3 className="text-xl font-bold mb-2">{t('assignmentGuide.uploadMaterials')}</h3>
                <p className="opacity-60 mb-6">{t('assignmentGuide.dragDropDescription')}</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="assignment-file-input"
                  disabled={processing}
                />
                <label
                  htmlFor="assignment-file-input"
                  className="inline-block px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold cursor-pointer transition-all"
                >
                  {processing ? t('assignmentGuide.processing') : t('assignmentGuide.chooseFiles')}
                </label>
              </div>
            ) : (
              <form onSubmit={handleTextSubmit} className="light-box p-8 border shadow-xl space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase opacity-50 mb-2">{t('assignmentGuide.titleForAssignment')}</label>
                  <input
                    type="text"
                    value={textTitle}
                    onChange={(e) => setTextTitle(e.target.value)}
                    placeholder={t('assignmentGuide.titlePlaceholder')}
                    className="w-full p-4 rounded-xl light-box border focus:ring-2 focus:ring-green-500 transition-all outline-none"
                    disabled={processing}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase opacity-50 mb-2">{t('assignmentGuide.pasteContent')}</label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={t('assignmentGuide.contentPlaceholder')}
                    rows="8"
                    className="w-full p-4 rounded-xl light-box border focus:ring-2 focus:ring-green-500 transition-all resize-none outline-none"
                    disabled={processing}
                  />
                </div>
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg"
                >
                  {processing ? t('assignmentGuide.processingText') : t('assignmentGuide.generateButton')}
                </button>
              </form>
            )}
          </div>

          {/* User Profile Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: t('profile.level'), value: profile.level },
              { label: t('profile.studySystem'), value: profile.studySystem.replace(/_/g, ' ') },
              { label: t('profile.goal'), value: profile.goal.replace(/_/g, ' ') },
              { label: 'Guidances', value: guidances.length }
            ].map((stat, i) => (
              <div key={i} className="light-box p-4 border text-center">
                <p className="text-[10px] opacity-50 uppercase font-black tracking-widest mb-1">{stat.label}</p>
                <p className="font-bold capitalize text-sm">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Guidances Results */}
          <div className="space-y-6">
            {guidances.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold px-2">{t('assignmentGuide.guidanceGenerated')}</h2>
                {guidances.map((guidance) => (
                  <AssignmentGuidanceDisplay
                    key={guidance.id}
                    guidance={guidance}
                    onDelete={handleDeleteGuidance}
                    onDownload={handleDownloadGuidance}
                  />
                ))}
              </>
            ) : (
              <div className="light-box p-20 border text-center opacity-60">
                <FiBook size={48} className="mx-auto mb-4 text-green-600" />
                <p className="font-bold">{t('assignmentGuide.guidanceNotFound')}</p>
                <p className="text-sm">{t('assignmentGuide.guidanceNotFoundDesc')}</p>
              </div>
            )}
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="light-box p-6 border-l-4 border-l-green-500 shadow-sm">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-green-600">
                <FiZap /> {t('assignmentGuide.helpTitle')}
              </h3>
              <ol className="text-sm space-y-2 opacity-80">
                <li>1. {t('assignmentGuide.uploadFiles')} / {t('assignmentGuide.pasteText')}</li>
                <li>2. AI analyzes requirements using your profile.</li>
                <li>3. Get a custom approach for your assignment.</li>
              </ol>
            </div>

            <div className="light-box p-6 border-l-4 border-l-blue-500 shadow-sm">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-blue-600">
                <FiFileText /> {t('assignmentGuide.whatYouGet')}
              </h3>
              <ul className="text-sm space-y-2 opacity-80">
                <li className="flex items-center gap-2"><FiCheck size={14} /> Simplified requirements</li>
                <li className="flex items-center gap-2"><FiCheck size={14} /> Critical thinking questions</li>
                <li className="flex items-center gap-2"><FiCheck size={14} /> Step-by-step logic map</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}