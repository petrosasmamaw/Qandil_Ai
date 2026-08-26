'use client';

import { useState, useEffect, useRef } from 'react';
import { FiZap, FiCheckCircle, FiX, FiAward, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { generateLearningLevelQuiz, determineLearningLevel } from '@/utils/geminiService';

export default function LearningLevelQuiz({ profileData, onLevelDetermined, onClose }) {
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
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // If user had previously selected an answer on that next question, preserve it
      const nextStoredAns = newAnswers[currentQuestionIndex + 1];
      if (nextStoredAns && questions[currentQuestionIndex + 1]) {
        setSelectedAnswer(questions[currentQuestionIndex + 1].options.indexOf(nextStoredAns));
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
      <div className="fixed inset-0 z-[100] p-4 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-md transition-all">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative z-10 p-8 max-w-md w-full rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="relative mb-5">
            <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-600 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FiZap size={22} />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            Generating Smart Assessment...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
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
    const scoreColor = isPassing ? 'text-emerald-500' : 'text-amber-500';

    return (
      <div className="fixed inset-0 z-[100] p-4 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative z-10 p-6 md:p-8 max-w-lg w-full rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 mb-4 inline-flex items-center justify-center">
            <FiCheckCircle size={44} />
          </div>

          <h2 className="text-2xl md:text-3xl font-black mb-1 text-slate-900 dark:text-white">
            Quiz Completed!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Your learning baseline has been successfully calculated.
          </p>

          <div className="grid grid-cols-2 gap-3 w-full mb-6">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Your Score
              </span>
              <span className={`text-3xl md:text-4xl font-black ${scoreColor}`}>
                {score}/{total}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Learning Level
              </span>
              <span className="text-xl md:text-2xl font-black uppercase text-blue-600 dark:text-blue-400 block truncate">
                {quizResult.level}
              </span>
            </div>
          </div>

          <div className="w-full bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/50 p-4 rounded-xl mb-6 text-left">
            <div className="flex items-center gap-2 mb-1 text-blue-700 dark:text-blue-300 font-semibold text-xs uppercase tracking-wider">
              <FiAward size={14} /> AI Recommendation
            </div>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
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
  const progressPercentage = questions.length > 0
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;

  return (
    <div className="fixed inset-0 z-[100] p-4 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative z-10 max-w-2xl w-full rounded-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 p-5 md:p-6 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                Grade {profileData?.grade || 10}
              </span>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                Level Assessment Quiz
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800">
          <div
            className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 rounded-r-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Question & Options Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-xs md:text-sm font-medium">
              {error}
            </div>
          )}

          {currentQuestion && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white leading-snug mb-3">
                  {currentQuestion.question}
                </h3>

                {currentQuestion.hint && (
                  <div className="p-3 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/40 rounded-xl flex items-start gap-2.5">
                    <FiZap size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800 dark:text-blue-300">
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
                      className={`flex items-center p-3.5 md:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 dark:border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white dark:bg-blue-500'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-xs md:text-sm font-medium flex-1">
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
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 md:p-5 flex justify-between items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
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
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs md:text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
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
