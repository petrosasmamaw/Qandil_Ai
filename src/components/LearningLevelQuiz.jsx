'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FiZap, FiCheckCircle, FiX, FiAward, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { generateLearningLevelQuiz, determineLearningLevel } from '@/utils/geminiService';

export default function LearningLevelQuiz({ profileData, onLevelDetermined, onClose }) {
  const themeMode = useSelector((state) => state.theme?.mode || 'light');
  const isDark = themeMode === 'dark';

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const messagesEndRef = useRef(null);

  // Load quiz questions
  useEffect(() => {
    let isMounted = true;
    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const generatedQuestions = await generateLearningLevelQuiz(profileData);
        if (isMounted) {
          setQuestions(generatedQuestions);
          setAnswers(new Array(generatedQuestions.length).fill(null));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load quiz');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadQuiz();
    return () => {
      isMounted = false;
    };
  }, [profileData]);

  // Auto-scroll to bottom on question change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentQuestionIndex, questions]);

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    setError(null);
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) {
      setError('Please select an option to continue');
      return;
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = questions[currentQuestionIndex].options[selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const nextStoredAns = newAnswers[nextIndex];
      if (nextStoredAns && questions[nextIndex]) {
        setSelectedAnswer(questions[nextIndex].options.indexOf(nextStoredAns));
      } else {
        setSelectedAnswer(null);
      }
      setError(null);
    } else {
      await evaluateLearningLevel(newAnswers);
    }
  };

  const evaluateLearningLevel = async (finalAnswers) => {
    try {
      setEvaluating(true);
      setError(null);
      const levelData = await determineLearningLevel(profileData, finalAnswers, questions);
      setQuizResult(levelData);
    } catch (err) {
      setError(err.message || 'Failed to evaluate learning level');
    } finally {
      setEvaluating(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div
        className="fixed inset-0 z-[100] p-4 flex items-center justify-center backdrop-blur-md transition-all"
        style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(15,23,42,0.45)' }}
      >
        <div
          className="shadow-2xl relative z-10 p-8 max-w-md w-full rounded-2xl flex flex-col items-center justify-center text-center transition-colors"
          style={{
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            color: isDark ? '#f8fafc' : '#0f172a',
            border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
          }}
        >
          <div className="relative mb-5">
            <div
              className="w-16 h-16 rounded-full border-4 animate-spin"
              style={{
                borderColor: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(37,99,235,0.15)',
                borderTopColor: '#2563eb',
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FiZap size={22} />
            </div>
          </div>
          <h3 className="text-lg font-bold mb-1" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
            Generating Smart Assessment...
          </h3>
          <p className="text-xs max-w-xs" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            Tailoring Ethiopian curriculum questions to your grade and study profile.
          </p>
        </div>
      </div>
    );
  }

  // Completed result modal
  if (quizResult) {
    const total = quizResult.total || questions.length || 5;
    const score = quizResult.score !== undefined ? quizResult.score : 0;
    const isPassing = score >= Math.ceil(total / 2);
    const scoreColor = isPassing ? '#10b981' : '#f59e0b';

    return (
      <div
        className="fixed inset-0 z-[100] p-4 flex items-center justify-center backdrop-blur-md animate-fadeIn"
        style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(15,23,42,0.45)' }}
      >
        <div
          className="shadow-2xl relative z-10 p-6 md:p-8 max-w-lg w-full rounded-2xl flex flex-col items-center justify-center text-center"
          style={{
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            color: isDark ? '#f8fafc' : '#0f172a',
            border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
          }}
        >
          <div
            className="p-4 rounded-full mb-4 inline-flex items-center justify-center"
            style={{ backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5', color: scoreColor }}
          >
            <FiCheckCircle size={44} />
          </div>

          <h2 className="text-2xl md:text-3xl font-black mb-1" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
            Quiz Completed!
          </h2>
          <p className="text-xs mb-6" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            Your learning baseline has been successfully calculated.
          </p>

          <div className="grid grid-cols-2 gap-3 w-full mb-6">
            <div
              className="p-4 rounded-xl"
              style={{
                backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              }}
            >
              <span
                className="text-[11px] font-bold uppercase tracking-wider block mb-1"
                style={{ color: isDark ? '#94a3b8' : '#64748b' }}
              >
                Your Score
              </span>
              <span className="text-3xl md:text-4xl font-black" style={{ color: scoreColor }}>
                {score}/{total}
              </span>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{
                backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              }}
            >
              <span
                className="text-[11px] font-bold uppercase tracking-wider block mb-1"
                style={{ color: isDark ? '#94a3b8' : '#64748b' }}
              >
                Learning Level
              </span>
              <span className="text-xl md:text-2xl font-black uppercase block truncate text-blue-600 dark:text-blue-400">
                {quizResult.level}
              </span>
            </div>
          </div>

          <div
            className="w-full p-4 rounded-xl mb-6 text-left"
            style={{
              backgroundColor: isDark ? 'rgba(30,58,138,0.25)' : '#eff6ff',
              border: isDark ? '1px solid rgba(59,130,246,0.3)' : '1px solid #bfdbfe',
            }}
          >
            <div className="flex items-center gap-2 mb-1 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider">
              <FiAward size={14} /> AI Recommendation
            </div>
            <p
              className="text-xs md:text-sm leading-relaxed"
              style={{ color: isDark ? '#cbd5e1' : '#334155' }}
            >
              {quizResult.explanation}
            </p>
          </div>

          <button
            onClick={() => onLevelDetermined(quizResult)}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 flex justify-center items-center gap-2"
          >
            Apply & Save Profile <FiArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage =
    questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-[100] p-4 flex items-center justify-center backdrop-blur-md animate-fadeIn"
      style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(15,23,42,0.45)' }}
    >
      <div
        className="quiz-modal-card shadow-2xl relative z-10 max-w-2xl w-full rounded-2xl flex flex-col max-h-[90vh] overflow-hidden transition-colors"
        style={{
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          color: isDark ? '#f8fafc' : '#0f172a',
          border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
        }}
      >
        {/* Header */}
        <div
          className="p-5 md:p-6 flex justify-between items-center transition-colors"
          style={{
            backgroundColor: isDark ? '#090d16' : '#f8fafc',
            borderBottom: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
          }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                style={{
                  backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : '#dbeafe',
                  color: isDark ? '#93c5fd' : '#1d4ed8',
                }}
              >
                Grade {profileData?.grade || 10}
              </span>
              <h2
                className="text-lg md:text-xl font-bold"
                style={{ color: isDark ? '#ffffff' : '#0f172a' }}
              >
                Level Assessment Quiz
              </h2>
            </div>
            <p className="text-xs mt-1" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{
              color: isDark ? '#94a3b8' : '#64748b',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div
          className="w-full h-1.5"
          style={{ backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }}
        >
          <div
            className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 rounded-r-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Question & Options Content */}
        <div
          className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5"
          style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff' }}
        >
          {error && (
            <div
              className="p-3 rounded-xl text-xs md:text-sm font-medium"
              style={{
                backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2',
                color: isDark ? '#fca5a5' : '#dc2626',
                border: isDark ? '1px solid rgba(239,68,68,0.3)' : '1px solid #fecaca',
              }}
            >
              {error}
            </div>
          )}

          {currentQuestion && (
            <div className="space-y-4">
              <div>
                <h3
                  className="text-base md:text-lg font-semibold leading-snug mb-3"
                  style={{ color: isDark ? '#ffffff' : '#0f172a' }}
                >
                  {currentQuestion.question}
                </h3>

                {currentQuestion.hint && (
                  <div
                    className="p-3 rounded-xl flex items-start gap-2.5"
                    style={{
                      backgroundColor: isDark ? 'rgba(30,58,138,0.25)' : '#eff6ff',
                      border: isDark ? '1px solid rgba(59,130,246,0.3)' : '1px solid #bfdbfe',
                    }}
                  >
                    <FiZap
                      size={16}
                      className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                    />
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: isDark ? '#93c5fd' : '#1e40af' }}
                    >
                      <span className="font-semibold">Hint:</span> {currentQuestion.hint}
                    </p>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  return (
                    <div
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className="flex items-center p-3.5 md:p-4 rounded-xl border-2 cursor-pointer transition-all"
                      style={{
                        backgroundColor: isSelected
                          ? isDark
                            ? 'rgba(30,58,138,0.45)'
                            : '#eff6ff'
                          : isDark
                          ? '#1e293b'
                          : '#ffffff',
                        borderColor: isSelected
                          ? '#2563eb'
                          : isDark
                          ? '#334155'
                          : '#e2e8f0',
                        color: isSelected
                          ? isDark
                            ? '#dbeafe'
                            : '#1e3a8a'
                          : isDark
                          ? '#f1f5f9'
                          : '#1e293b',
                        boxShadow: isSelected
                          ? '0 0 0 2px rgba(37,99,235,0.2)'
                          : 'none',
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 transition-colors"
                        style={{
                          backgroundColor: isSelected
                            ? '#2563eb'
                            : isDark
                            ? '#334155'
                            : '#f1f5f9',
                          color: isSelected
                            ? '#ffffff'
                            : isDark
                            ? '#cbd5e1'
                            : '#475569',
                        }}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span
                        className="text-xs md:text-sm font-medium flex-1"
                        style={{
                          color: isSelected
                            ? isDark
                              ? '#ffffff'
                              : '#1e3a8a'
                            : isDark
                            ? '#f1f5f9'
                            : '#1e293b',
                        }}
                      >
                        {option}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer Actions */}
        <div
          className="p-4 md:p-5 flex justify-between items-center gap-3 transition-colors"
          style={{
            backgroundColor: isDark ? '#090d16' : '#f8fafc',
            borderTop: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
          }}
        >
          <button
            onClick={() => {
              if (currentQuestionIndex > 0) {
                const prevIndex = currentQuestionIndex - 1;
                setCurrentQuestionIndex(prevIndex);
                const prevAns = answers[prevIndex];
                if (prevAns && questions[prevIndex]) {
                  setSelectedAnswer(questions[prevIndex].options.indexOf(prevAns));
                } else {
                  setSelectedAnswer(null);
                }
              }
            }}
            disabled={currentQuestionIndex === 0 || evaluating}
            className="px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              color: isDark ? '#f8fafc' : '#334155',
              border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
            }}
          >
            <FiArrowLeft size={16} /> Previous
          </button>

          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null || evaluating}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs md:text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {evaluating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Evaluating...</span>
              </>
            ) : currentQuestionIndex === questions.length - 1 ? (
              <>
                <span>Complete Quiz</span>
                <FiCheckCircle size={16} />
              </>
            ) : (
              <>
                <span>Next</span>
                <FiArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
