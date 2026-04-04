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
import { FiTarget, FiZap, FiBarChart2, FiCheck } from 'react-icons/fi';

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
    <main 
      className="min-h-screen py-12 px-4 text-gray-800"
      style={{
        background: `
          linear-gradient(135deg, rgba(248, 250, 249, 0.9), rgba(240, 244, 242, 0.9), rgba(248, 250, 249, 0.9)),
          url('https://i.pinimg.com/736x/4b/8d/4f/4b8d4f848eb1385772e2fa5cd8c1dd38.jpg') center/cover fixed
        `,
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
            👤 {isEditing ? 'Update Profile' : 'Create Profile'}
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            {isEditing
              ? 'Update your learning preferences and goals'
              : 'Set up your learning profile to get started'}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-600 rounded-lg shadow-sm">
            <p className="text-green-800 font-medium flex items-center gap-2">
              <FiCheck size={18} /> {successMessage}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-red-800 font-medium">
                ✕ {error}
              </p>
              <button
                onClick={() => dispatch(clearError())}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                minLength="2"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                placeholder="Enter your full name"
              />
            </div>

            {/* Grade Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Grade (9-12)
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              >
                <option value={9}>Grade 9</option>
                <option value={10}>Grade 10</option>
                <option value={11}>Grade 11</option>
                <option value={12}>Grade 12</option>
              </select>
            </div>

            {/* Study System Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Study System
              </label>
              <select
                name="studySystem"
                value={formData.studySystem}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Learning Goal
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              >
                <option value="pass_exam">Pass Exam</option>
                <option value="high_grades">High Grades</option>
                <option value="deep_understanding">Deep Understanding</option>
                <option value="quick_revision">Quick Revision</option>
              </select>
            </div>

            {/* Preferred Language Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Preferred Language
              </label>
              <input
                type="text"
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleInputChange}
                maxLength="10"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                placeholder="en, ar, fr..."
              />
            </div>

            {/* Level Field - AI Quiz */}
            <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-xl border-2 border-green-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiTarget size={18} /> Learning Level {formData.level !== 'foundation' && `✓ ${formData.level.charAt(0).toUpperCase() + formData.level.slice(1)}`}
              </label>
              <button
                type="button"
                onClick={() => setShowQuiz(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                Take AI Quiz to Determine Level
              </button>
              <p className="mt-3 text-xs text-gray-600 flex items-center gap-2">
                <FiZap size={14} /> Quick 5-question quiz to automatically determine your learning level
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FiCheck size={18} />
                  {isEditing ? 'Update Profile' : 'Create Profile'}
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Profile Info Card */}
        {profile && (
          <div className="mt-8 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiBarChart2 size={18} /> Profile Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 font-medium">Name</p>
                <p className="text-gray-900 font-semibold mt-1">{profile.name}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Grade</p>
                <p className="text-gray-900 font-semibold mt-1">Grade {profile.grade}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Learning Level</p>
                <p className="text-green-600 font-semibold mt-1 capitalize">{profile.level}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Study System</p>
                <p className="text-gray-900 font-semibold mt-1 capitalize">{profile.studySystem.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Goal</p>
                <p className="text-gray-900 font-semibold mt-1 capitalize">{profile.goal.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Last Updated</p>
                <p className="text-gray-900 font-semibold mt-1">{new Date(profile.updatedAt).toLocaleDateString()}</p>
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
    </main>
  );
}
