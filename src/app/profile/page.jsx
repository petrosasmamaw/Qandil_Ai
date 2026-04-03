'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/authClient';
import LearningLevelQuiz from '@/components/LearningLevelQuiz';
import {
  createProfile,
  fetchProfileByUserId,
  updateProfile,
  clearError,
  clearSuccess,
} from '@/store/slices/profileSlice';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { profile, loading, error, success, successMessage } = useSelector(
    (state) => state.profile
  );

  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    grade: 9,
    level: 'foundation',
    studySystem: 'theoretical',
    preferredLanguage: 'en',
    goal: 'pass_exam',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch session
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (data?.user) {
          setSession(data);
          setFormData((prev) => ({
            ...prev,
            userId: data.user.id,
          }));

          // Fetch existing profile
          dispatch(fetchProfileByUserId(data.user.id));
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        router.push('/auth/login');
      } finally {
        setSessionLoading(false);
      }
    };

    getSession();
  }, [dispatch, router]);

  // Update form data when profile is fetched
  useEffect(() => {
    if (profile) {
      setFormData({
        userId: profile.userId,
        name: profile.name,
        grade: profile.grade,
        level: profile.level,
        studySystem: profile.studySystem,
        preferredLanguage: profile.preferredLanguage,
        goal: profile.goal,
      });
      setIsEditing(true);
    }
  }, [profile]);

  // Clear success message after delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'grade' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing && profile) {
      // Update profile
      dispatch(
        updateProfile({
          profileId: profile._id,
          profileData: formData,
        })
      );
    } else {
      // Create profile
      dispatch(createProfile(formData));
    }
  };

  const handleQuizComplete = (levelData) => {
    // Set the determined learning level
    setFormData((prev) => ({
      ...prev,
      level: levelData.level,
    }));
    setShowQuiz(false);
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
            {isEditing ? 'Update Your Profile' : 'Create Your Profile'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditing
              ? 'Update your learning preferences and goals'
              : 'Set up your learning profile to get started'}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-300 font-medium">
              ✓ {successMessage}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex justify-between items-start">
              <p className="text-red-800 dark:text-red-300 font-medium">
                ✕ {error}
              </p>
              <button
                onClick={() => dispatch(clearError())}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              minLength="2"
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-all"
              placeholder="Enter your full name"
            />
          </div>

          {/* Grade Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Grade (9-12)
            </label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-all"
            >
              <option value={9}>9</option>
              <option value={10}>10</option>
              <option value={11}>11</option>
              <option value={12}>12</option>
            </select>
          </div>

          {/* Study System Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Study System
            </label>
            <select
              name="studySystem"
              value={formData.studySystem}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-all"
            >
              <option value="theoretical">Theoretical</option>
              <option value="conceptual">Conceptual</option>
              <option value="exam_oriented">Exam Oriented</option>
              <option value="problem_solving">Problem Solving</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          {/* Goal Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Learning Goal
            </label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-all"
            >
              <option value="pass_exam">Pass Exam</option>
              <option value="high_grades">High Grades</option>
              <option value="deep_understanding">Deep Understanding</option>
              <option value="quick_revision">Quick Revision</option>
            </select>
          </div>

          {/* Preferred Language Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Preferred Language
            </label>
            <input
              type="text"
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleInputChange}
              maxLength="10"
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-all"
              placeholder="en, ar, etc."
            />
          </div>

          {/* Level Field - AI Quiz */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Learning Level {formData.level !== 'foundation' && `✓ ${formData.level.charAt(0).toUpperCase() + formData.level.slice(1)}`}
            </label>
            <button
              type="button"
              onClick={() => setShowQuiz(true)}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              🎯 Test Learning Level with AI Quiz
            </button>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Take a quick 5-question quiz to determine your learning level automatically
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-300 dark:to-gray-400 hover:from-gray-900 hover:to-black dark:hover:from-gray-200 dark:hover:to-gray-300 text-white dark:text-gray-900 font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white dark:border-gray-900"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              <span>{isEditing ? 'Update Profile' : 'Create Profile'}</span>
            )}
          </button>
        </form>

        {/* Profile Info */}
        {profile && (
          <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profile Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Profile ID</p>
                <p className="text-gray-900 dark:text-white font-mono text-xs break-all">
                  {profile._id}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Created</p>
                <p className="text-gray-900 dark:text-white">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Last Updated</p>
                <p className="text-gray-900 dark:text-white">
                  {new Date(profile.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Learning Level Quiz Modal */}
        {showQuiz && (
          <LearningLevelQuiz
            profileData={formData}
            onLevelDetermined={handleQuizComplete}
            onClose={() => setShowQuiz(false)}
          />
        )}
      </div>
    </div>
  );
}
