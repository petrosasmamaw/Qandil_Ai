'use client';

import { useState, useEffect, useRef } from 'react';
import { FiZap, FiCheckCircle } from 'react-icons/fi';
import { generateLearningLevelQuiz, determineLearningLevel } from '@/utils/geminiService';

export default function LearningLevelQuiz({ profileData, onLevelDetermined, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const messagesEndRef = useRef(null);

  // Load quiz questions
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const generatedQuestions = await generateLearningLevelQuiz(profileData);
        setQuestions(generatedQuestions);
        setAnswers(new Array(generatedQuestions.length).fill(null));
      } catch (err) {
        setError(err.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [profileData]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentQuestionIndex, questions]);

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex);
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) {
      setError('Please select an answer');
      return;
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = questions[currentQuestionIndex].options[selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setError(null);
    } else {
      // All questions answered, determine level
      await evaluateLearningLevel(newAnswers);
    }
  };

  const evaluateLearningLevel = async (finalAnswers) => {
    try {
      setEvaluating(true);
      setError(null);
      const levelData = await determineLearningLevel(profileData, finalAnswers);
      onLevelDetermined(levelData);
    } catch (err) {
      setError(err.message || 'Failed to evaluate learning level');
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white/25 dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full shadow-xl backdrop-blur-md border border-white/40 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Generating personalized quiz questions based on your profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/25 dark:bg-gray-800 rounded-lg max-w-2xl w-full shadow-xl flex flex-col max-h-[90vh] backdrop-blur-md border border-white/40 dark:border-gray-700">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Learning Level Assessment
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-1 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-300 dark:to-gray-400 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-300 font-medium">✕ {error}</p>
            </div>
          )}

          {currentQuestion && (
            <div className="space-y-6">
              {/* Question */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {currentQuestion.question}
                </h3>

                {currentQuestion.hint && (
                  <div className="mb-4 p-3 bg-blue-50/75 dark:bg-blue-900/20 border border-blue-200/70 dark:border-blue-800 rounded flex items-start gap-2 backdrop-blur-md">
                    <FiZap size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Hint: {currentQuestion.hint}
                    </p>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                    style={{
                      borderColor:
                        selectedAnswer === index
                          ? 'rgb(31, 41, 55)'
                          : 'rgb(229, 231, 235)',
                      backgroundColor:
                        selectedAnswer === index
                          ? 'rgb(243, 244, 246)'
                          : 'transparent',
                    }}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={index}
                      checked={selectedAnswer === index}
                      onChange={() => handleAnswerSelect(index)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="ml-3 text-gray-900 dark:text-white font-medium">
                      {String.fromCharCode(65 + index)}) {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center gap-4">
          <button
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
                setSelectedAnswer(
                  answers[currentQuestionIndex - 1] !== null
                    ? questions[currentQuestionIndex - 1].options.indexOf(
                        answers[currentQuestionIndex - 1]
                      )
                    : null
                );
              }
            }}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null || evaluating}
            className="px-8 py-2 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-300 dark:to-gray-400 hover:from-gray-900 hover:to-black dark:hover:from-gray-200 dark:hover:to-gray-300 text-white dark:text-gray-900 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {evaluating ? (
              <span className="flex items-center gap-2">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white dark:border-gray-900"></div>
                Evaluating...
              </span>
            ) : currentQuestionIndex === questions.length - 1 ? (
              'Complete Quiz'
            ) : (
              'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
