'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { fetchProfileByUserId } from '@/store/slices/profileSlice';
import { createNotesChat, addMessageToNotesChat } from '@/store/slices/notesChatSlice';
import { processDocument, processTextContent } from '@/utils/documentProcessingService';
import NoteDisplay from '@/components/NoteDisplay';
import ChatHistory from '@/components/ChatHistory';
import { useTranslation } from '@/hooks/useTranslation';
import { NotesSkeletonLoader } from '@/components/Skeleton';
import { FiFileText, FiBook, FiZap, FiPlus } from 'react-icons/fi';

// Helper function to extract first 4 words for chat title
const getFirstFourWords = (text) => {
  if (!text) return 'Notes Chat';
  return text
    .split(' ')
    .slice(0, 4)
    .filter(word => word.length > 0)
    .join(' ') || 'Notes Chat';
};

export default function NotesPage() {
  const { t } = useTranslation();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState([]);
  const [notesChatId, setNotesChatId] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [inputMode, setInputMode] = useState('file'); // 'file' or 'text'
  const [textInput, setTextInput] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { profile } = useSelector((state) => state.profile);
  const language = useSelector((state) => state.language?.language || 'eng');

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
          setError(t('notes.profileNotCreated'));
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
    return <NotesSkeletonLoader isDark={isDark} />;
  }

  if (!session || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full light-box p-8 border text-center shadow-xl">
          <p className="opacity-70 mb-6">{t('notes.profileNotCreated')}</p>
          <button
            onClick={() => router.push('/profile')}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all"
          >
            {t('notes.profileRequired')}
          </button>
        </div>
      </div>
    );
  }

  // Handle Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files);
    }
  };

  // Handle Document Upload
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    
    // Check file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError(t('notes.invalidFileType') || 'Please upload PDF or Word documents only.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setError(null);
    setProcessing(true);
    
    try {
      const result = await processDocument(file, Object.fromEntries(Object.entries(profile).filter(([k]) => ['name', 'grade', 'level', 'studySystem', 'goal', 'preferredLanguage'].includes(k))), language);
      
      if (result.success) {
        const newNote = {
          id: Date.now().toString(),
          title: result.fileName,
          content: result.notes,
          date: new Date().toISOString(),
        };
        setNotes([newNote, ...notes]);

        try {
          // Ensure a notes chat exists, create if not
          if (!notesChatId) {
            const chatTitle = getFirstFourWords(result.notes);
            const chatAction = await dispatch(createNotesChat({ userId: session?.user?.id, title: chatTitle }));
            if (chatAction.payload && chatAction.payload._id) {
              setNotesChatId(chatAction.payload._id);
            } else {
              console.error('Failed to create notes chat:', chatAction);
              setError('Failed to save chat. Please try again.');
              return;
            }
          }

          const chatTitle = getFirstFourWords(result.notes);
          const chatIdToUse = notesChatId || (await dispatch(createNotesChat({ userId: session?.user?.id, title: chatTitle }))).payload?._id;

          if (!chatIdToUse) {
            console.error('No valid chatId for saving message');
            setError('Failed to initialize chat. Please try again.');
            return;
          }

          // Add user file message (store file name)
          await dispatch(addMessageToNotesChat({ chatId: chatIdToUse, role: 'user', content: '', fileNames: [file.name] }));

          // Add assistant generated note message
          await dispatch(addMessageToNotesChat({ chatId: chatIdToUse, role: 'assistant', content: result.notes, fileNames: [] }));
        } catch (err) {
          console.error('Failed to save notes to chat:', err);
        }
      }
    } catch (err) {
      console.error(err);
      setError(t('notes.failedProcess') || err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Handle Text Submission
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textInput.trim()) {
      setError(t('notes.emptyText') || 'Please enter some text.');
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (!textTitle.trim()) {
      setError(t('notes.emptyTitle') || 'Please enter a title.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setError(null);
    setProcessing(true);
    
    try {
      const result = await processTextContent(textInput, textTitle, Object.fromEntries(Object.entries(profile).filter(([k]) => ['name', 'grade', 'level', 'studySystem', 'goal', 'preferredLanguage'].includes(k))), language);
      
      if (result.success) {
        const newNote = {
          id: Date.now().toString(),
          title: textTitle,
          content: result.notes,
          date: new Date().toISOString(),
        };
        setNotes([newNote, ...notes]);
        setTextInput('');
        setTextTitle('');
        try {
          if (!notesChatId) {
            const chatTitle = getFirstFourWords(textInput);
            const chatAction = await dispatch(createNotesChat({ userId: session?.user?.id, title: chatTitle }));
            if (chatAction.payload && chatAction.payload._id) {
              setNotesChatId(chatAction.payload._id);
            } else {
              console.error('Failed to create notes chat:', chatAction);
              setError('Failed to save chat. Please try again.');
              return;
            }
          }

          const chatTitle = getFirstFourWords(textInput);
          const chatIdToUse = notesChatId || (await dispatch(createNotesChat({ userId: session?.user?.id, title: chatTitle }))).payload?._id;

          if (!chatIdToUse) {
            console.error('No valid chatId for saving message');
            setError('Failed to initialize chat. Please try again.');
            return;
          }

          // store user text message
          await dispatch(addMessageToNotesChat({ chatId: chatIdToUse, role: 'user', content: textInput, fileNames: [] }));

          // store assistant generated notes
          await dispatch(addMessageToNotesChat({ chatId: chatIdToUse, role: 'assistant', content: result.notes, fileNames: [] }));
        } catch (err) {
          console.error('Failed to save text notes to chat:', err);
        }
      }
    } catch (err) {
      console.error(err);
      setError(t('notes.failedTextProcess') || err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Delete & Download Note
  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };
  
  const handleDownloadNote = (note) => {
    const element = document.createElement("a");
    const file = new Blob([note.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${note.title || 'study-notes'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const backgroundStyle = {
    '--light-bg-image': "url('https://cdn.vectorstock.com/i/500p/87/24/pastel-pink-and-blue-blur-backdrop-vector-63408724.jpg')",
  };

  return (
    <main 
      className="light-image-bg min-h-screen p-6 md:p-8 transition-colors duration-300 relative z-0" 
      style={backgroundStyle}
    >
      {/* DARK MODE BACKGROUND - Matches Home Page perfectly */}
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
        <div className="flex justify-between items-center mb-8">
          <div className="light-box px-6 py-4 border shadow-sm flex items-center gap-4">
             <div className="p-3 bg-green-600/10 rounded-2xl text-green-600">
                <FiFileText size={32} />
             </div>
             <div>
                <h1 className="text-2xl font-bold leading-tight">{t('notes.title')}</h1>
                <p className="text-sm opacity-70">
                  {profile.name} • {t('notes.gradeText')} {profile.grade}
                </p>
             </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex-1 md:flex-none px-5 py-3 rounded-xl light-box border font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <FiBook size={18} className="text-blue-500" /> {t('common.history')}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 backdrop-blur-md">
            ⚠️ {error}
          </div>
        )}

        {/* Input Mode Toggle */}
        <div className="mb-8 flex gap-2">
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
              {mode === 'file' ? '📤 ' + t('notes.uploadFiles') : '✏️ ' + t('notes.pasteText')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Input Area */}
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
                <div className="text-5xl mb-4">📂</div>
                <h3 className="text-xl font-bold mb-2">{t('notes.uploadMaterials')}</h3>
                <p className="opacity-60 mb-6">{t('notes.dragDropDescription')}</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-input"
                  disabled={processing}
                />
                <label
                  htmlFor="file-input"
                  className="inline-block px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold cursor-pointer transition-all"
                >
                  {processing ? t('notes.processing') : t('notes.chooseFiles')}
                </label>
              </div>
            ) : (
              <form onSubmit={handleTextSubmit} className="light-box p-8 border shadow-xl space-y-4">
                <input
                  type="text"
                  value={textTitle}
                  onChange={(e) => setTextTitle(e.target.value)}
                  placeholder={t('notes.titlePlaceholder')}
                  className="w-full p-4 rounded-xl light-box border focus:ring-2 focus:ring-green-500 transition-all"
                />
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={t('notes.contentPlaceholder')}
                  rows="8"
                  className="w-full p-4 rounded-xl light-box border focus:ring-2 focus:ring-green-500 transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg"
                >
                  {processing ? 'Processing...' : 'Generate Notes'}
                </button>
              </form>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Level', value: profile.level },
              { label: 'System', value: profile.studySystem.replace(/_/g, ' ') },
              { label: 'Goal', value: profile.goal.replace(/_/g, ' ') },
              { label: 'Notes', value: notes.length }
            ].map((stat, i) => (
              <div key={i} className="light-box p-4 border text-center">
                <p className="text-xs opacity-50 uppercase font-bold tracking-wider mb-1">{stat.label}</p>
                <p className="font-bold capitalize">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Notes Display Section */}
          <div className="space-y-6">
            {notes.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold px-2">Your Generated Notes</h2>
                {notes.map((note) => (
                  <NoteDisplay
                    key={note.id}
                    note={note}
                    onDelete={handleDeleteNote}
                    onDownload={handleDownloadNote}
                  />
                ))}
              </>
            ) : (
              <div className="light-box p-20 border text-center opacity-60">
                <FiBook size={48} className="mx-auto mb-4 text-green-600" />
                <p>{t('notes.noNotes') || "No notes generated yet. Upload a file to start."}</p>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="light-box p-6 border-l-4 border-l-blue-500 shadow-sm">
            <h3 className="font-bold mb-3 flex items-center gap-2 text-blue-600">
              <FiZap /> {t('notes.howItWorksTitle')}
            </h3>
            <ul className="text-sm space-y-2 opacity-80">
              <li>{t('notes.howItWorksStep1')}</li>
              <li>{t('notes.howItWorksStep2').replace('{level}', profile.level)}</li>
              <li>{t('notes.howItWorksStep3')}</li>
            </ul>
          </div>
        </div>
      </div>

      <ChatHistory
        userId={session?.user?.id}
        chatType="notes"
        onHistorySelect={(chatId) => {
          setNotesChatId(chatId);
          setIsHistoryOpen(false);
        }}
        onClose={() => setIsHistoryOpen(false)}
        isOpen={isHistoryOpen}
      />
    </main>
  );
}