'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authClient } from '@/lib/authClient';
import { useRouter } from 'next/navigation';
import { fetchProfileByUserId } from '@/store/slices/profileSlice';
import { processDocument, processTextContent } from '@/utils/documentProcessingService';
import NoteDisplay from '@/components/NoteDisplay';
import ChatHistory from '@/components/ChatHistory';
import {
  createNotesChat,
  addMessageToNotesChat,
} from '@/store/slices/notesChatSlice';

export default function NotesPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [inputMode, setInputMode] = useState('file'); // 'file' or 'text'
  const [textInput, setTextInput] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { profile } = useSelector((state) => state.profile);
  const { currentChat } = useSelector((state) => state.notesChat);

  useEffect(() => {
    const initialize = async () => {
      try {
        const { data } = await authClient.getSession();

          // Initialize new notes chat
          try {
            const chatAction = await dispatch(
              createNotesChat({
                userId: data.user.id,
                title: 'New Notes Chat',
              })
            );
            if (chatAction.payload) {
              setCurrentChatId(chatAction.payload._id);
            }
          } catch (err) {
            console.error('Error creating notes chat:', err);
          }
        if (data?.user) {
          setSession(data);
          await dispatch(fetchProfileByUserId(data.user.id));
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Error initializing:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [router, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading notes...</p>
        </div>
      </div>
    );
  }

  if (!session || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <p className="text-yellow-800 dark:text-yellow-300">Please create your profile first to use the Notes feature.</p>
            <button
              onClick={() => router.push('/profile')}
              className="mt-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
            >
              Create Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleFileUpload = async (files) => {
    if (files.length === 0) return;

    setProcessing(true);
    setError(null);

    for (const file of files) {
      try {
        // Validate file type
        if (!file.type.includes('pdf') && !file.type.includes('word') && !file.type.includes('document')) {
          setError('Please upload PDF or DOC files only');
          continue;
        }

        // Process document with Gemini
        const result = await processDocument(file, profile);

        // Add to notes
        const newNote = {
          id: Date.now() + Math.random(),
          fileName: result.fileName,
          notes: result.notes,
          processedAt: result.processedAt,
          studentName: profile.name,
        };

        setNotes((prev) => [newNote, ...prev]);
      } catch (err) {
        setError(err.message || 'Failed to process document');
        console.error('Upload error:', err);
      }
    }

    setProcessing(false);
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();

    if (!textInput.trim()) {
      setError('Please enter some text');
      return;
    }

    if (!textTitle.trim()) {
      setError('Please enter a title for your notes');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Process text content with Gemini
      const result = await processTextContent(textInput, textTitle, profile);

      // Add to notes
      const newNote = {
        id: Date.now(),
        fileName: result.fileName,
        notes: result.notes,
        processedAt: result.processedAt,
        studentName: profile.name,
      };

      setNotes((prev) => [newNote, ...prev]);
      setTextInput('');
      setTextTitle('');
    } catch (err) {
      setError(err.message || 'Failed to process text');
      console.error('Text submission error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDeleteNote = (noteId) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  };

  const handleDownloadNote = (note) => {
    const element = document.createElement('a');
    const file = new Blob([note.notes], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${note.fileName.split('.')[0]}-notes.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
              📝 AI-Powered Notes Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload files or paste text to get personalized study notes for {profile.name} (Grade {profile.grade})
            </p>
          </div>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            📚 History
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300">
            ⚠️ {error}
          </div>
        )}

        {/* Input Mode Toggle */}
        <div className="mb-8 flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setInputMode('file')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              inputMode === 'file'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            📤 Upload Files
          </button>
          <button
            onClick={() => setInputMode('text')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              inputMode === 'text'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            ✏️ Paste Text
          </button>
        </div>

        {/* File Upload Area */}
        {inputMode === 'file' && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`mb-12 p-12 border-2 border-dashed rounded-lg transition-all cursor-pointer ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
            }`}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">📤</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Upload Your Study Materials</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop your PDF or Word documents here, or click to browse
              </p>
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
                className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer transition-colors disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Choose Files'}
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Supported formats: PDF, DOCX, DOC</p>
            </div>
          </div>
        )}

        {/* Text Input Area */}
        {inputMode === 'text' && (
          <form onSubmit={handleTextSubmit} className="mb-12 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Title for Your Notes
              </label>
              <input
                type="text"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                placeholder="e.g., Biology Chapter 5: Cells"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={processing}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Paste Your Study Material
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste your study material, notes, or any text content here..."
                rows="8"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                disabled={processing}
              />
            </div>
            <button
              type="submit"
              disabled={processing}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Generate Notes 📝'}
            </button>
          </form>
        )}

        {/* Student Profile Info */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Learning Level</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{profile.level}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Study System</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {profile.studySystem.replace(/_/g, ' ')}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Learning Goal</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {profile.goal.replace(/_/g, ' ')}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Notes</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{notes.length}</p>
          </div>
        </div>

        {/* Notes Display */}
        <div className="space-y-6">
          {notes.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Generated Notes</h2>
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
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">No notes generated yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Upload a file or paste text to get started!</p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">💡 How It Works</h3>
          <ol className="text-blue-800 dark:text-blue-400 space-y-2 text-sm">
            <li>1. Choose to upload files OR paste text content</li>
            <li>2. AI analyzes the content using your learning profile</li>
            <li>3. Personalized study notes are generated based on your level and goals</li>
            <li>4. Download and save your notes for offline study</li>
          </ol>
        </div>

        {/* Chat History Modal */}
        <ChatHistory
          userId={session?.user?.id}
          chatType="notes"
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
