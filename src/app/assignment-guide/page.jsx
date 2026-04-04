'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authClient } from '@/lib/authClient';
import { useRouter } from 'next/navigation';
import { fetchProfileByUserId } from '@/store/slices/profileSlice';
import { generateAssignmentGuidance, generateAssignmentGuidanceFromText } from '@/utils/assignmentGuidanceService';
import AssignmentGuidanceDisplay from '@/components/AssignmentGuidanceDisplay';
import ChatHistory from '@/components/ChatHistory';
import ChatBox from '@/components/ChatBox';
import {
  createAssignmentGuideChat,
  addMessageToAssignmentGuideChat,
} from '@/store/slices/assignmentGuideChatSlice';

export default function AssignmentGuidePage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [guidances, setGuidances] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [inputMode, setInputMode] = useState('file'); // 'file' or 'text'
  const [textInput, setTextInput] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { profile } = useSelector((state) => state.profile);
  const { currentChat } = useSelector((state) => state.assignmentGuideChat);

  useEffect(() => {
    const initialize = async () => {
      try {
        const { data } = await authClient.getSession();

          // Initialize new assignment guide chat
          try {
            const chatAction = await dispatch(
              createAssignmentGuideChat({
                userId: data.user.id,
                title: 'New Assignment Guidance Chat',
              })
            );
            if (chatAction.payload) {
              setCurrentChatId(chatAction.payload._id);
            }
          } catch (err) {
            console.error('Error creating assignment guide chat:', err);
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
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading assignment guide...</p>
        </div>
      </div>
    );
  }

  if (!session || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <p className="text-yellow-800 dark:text-yellow-300">Please create your profile first to use the Assignment Guide feature.</p>
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

        // Generate guidance with Gemini
        const result = await generateAssignmentGuidance(file, profile);

        // Add to guidances
        const newGuidance = {
          id: Date.now() + Math.random(),
          fileName: result.fileName,
          guidance: result.guidance,
          processedAt: result.processedAt,
          studentName: profile.name,
        };

        setGuidances((prev) => [newGuidance, ...prev]);
      } catch (err) {
        setError(err.message || 'Failed to generate guidance');
        console.error('Upload error:', err);
      }
    }

    setProcessing(false);
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();

    if (!textInput.trim()) {
      setError('Please enter your assignment');
      return;
    }

    if (!textTitle.trim()) {
      setError('Please enter a title for your assignment');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Generate guidance from text with Gemini
      const result = await generateAssignmentGuidanceFromText(textInput, textTitle, profile);

      // Add to guidances
      const newGuidance = {
        id: Date.now(),
        fileName: result.fileName,
        guidance: result.guidance,
        processedAt: result.processedAt,
        studentName: profile.name,
      };

      setGuidances((prev) => [newGuidance, ...prev]);
      setTextInput('');
      setTextTitle('');
    } catch (err) {
      setError(err.message || 'Failed to generate guidance');
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

  const handleDeleteGuidance = (guidanceId) => {
    setGuidances((prev) => prev.filter((guidance) => guidance.id !== guidanceId));
  };

  const handleDownloadGuidance = (guidance) => {
    const element = document.createElement('a');
    const file = new Blob([guidance.guidance], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${guidance.fileName.split('.')[0]}-guidance.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-yellow-500 bg-clip-text text-transparent">
              📋 Assignment Help
            </h1>
            <p className="text-gray-600 mt-1">
              {profile && `Get guided help for ${profile.name} (Grade ${profile.grade})`}
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
                    createAssignmentGuideChat({
                      userId: session.user.id,
                      title: 'New Assignment Guidance Chat',
                    })
                  );
                  if (chatAction.payload) {
                    setCurrentChatId(chatAction.payload._id);
                  }
                } catch (err) {
                  console.error('Error creating new assignment guide chat:', err);
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
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                📤 Upload Files
              </button>
              <button
                onClick={() => setInputMode('text')}
                className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                  inputMode === 'text'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                ✏️ Paste Assignment
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
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">📤</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Upload Your Assignment</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Drag and drop your assignment PDF or Word document here to get personalized guidance
                  </p>
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
                    className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium cursor-pointer transition-colors disabled:opacity-50"
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
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    value={textTitle}
                    onChange={(e) => setTextTitle(e.target.value)}
                    placeholder="e.g., Write an Essay on Climate Change"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={processing}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Paste Your Assignment Details
                  </label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste your assignment instructions, requirements, or description here..."
                    rows="8"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    disabled={processing}
                  />
                </div>
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {processing ? 'Generating Guidance...' : 'Get Guidance 📋'}
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Guidances</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{guidances.length}</p>
              </div>
            </div>

            {/* Guidances Display */}
            <div className="space-y-6">
              {guidances.length > 0 ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Assignment Guidances</h2>
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
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No guidances generated yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Upload an assignment or paste assignment text to get personalized guidance!</p>
                </div>
              )}
            </div>

            {/* Info Sections */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">💡 How It Works</h3>
                <ol className="text-blue-800 dark:text-blue-400 space-y-2 text-sm">
                  <li>1. Upload your assignment file OR paste assignment text</li>
                  <li>2. AI analyzes the assignment based on your learning profile</li>
                  <li>3. Personalized guidance is generated to help you approach it</li>
                  <li>4. Download and review the guidance to complete your assignment</li>
                </ol>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300 mb-3">📝 What You Get</h3>
                <ul className="text-purple-800 dark:text-purple-400 space-y-2 text-sm">
                  <li>✓ Clear understanding of assignment requirements</li>
                  <li>✓ Step-by-step approach tailored to your learning level</li>
                  <li>✓ Guidance questions to help you think critically</li>
                  <li>✓ Tips based on your study system and learning goals</li>
                </ul>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <ChatBox 
              studentProfile={profile}
              chatType="assignmentGuide"
              currentChatId={currentChatId}
              onAddMessage={(messageData) => dispatch(addMessageToAssignmentGuideChat(messageData))}
            />
          </div>
        </div>

        {/* Chat History Modal */}
        <ChatHistory
          userId={session?.user?.id}
          chatType="assignmentGuide"
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
