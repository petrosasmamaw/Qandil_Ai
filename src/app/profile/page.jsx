'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LearningLevelQuiz from '@/components/LearningLevelQuiz';
import {
  createProfile,
  fetchProfileByUserId,
  updateProfile,
  clearError,
  clearSuccess,
} from '@/store/slices/profileSlice';
import { FiTarget, FiZap, FiBarChart2, FiCheck } from 'react-icons/fi';
import { translations } from '@/utils/translations';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { profile, loading, error, success, successMessage } = useSelector(
    (state) => state.profile
  );
  const language = useSelector((state) => state.theme?.language || 'eng');
  const t = (key) => key.split('.').reduce((obj, k) => obj && obj[k], translations[language]) || key;

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
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setSession(session);
          setFormData((prev) => ({
            ...prev,
            userId: session.user.id,
          }));

          // Fetch existing profile
          dispatch(fetchProfileByUserId(session.user.id));
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


  const getStudySystemTrans = (sys) => {
    if (!sys) return '';
    const map = {
      theoretical: 'sysTheoretical',
      conceptual: 'sysConceptual',
      exam_oriented: 'sysExamOriented',
      problem_solving: 'sysProblemSolving',
      mixed: 'sysMixed'
    };
    return map[sys] ? t('profile.' + map[sys]) : sys.replace(/_/g, ' ');
  };

  const getGoalTrans = (goal) => {
    if (!goal) return '';
    const map = {
      pass_exam: 'goalPassExam',
      high_grades: 'goalHighGrades',
      deep_understanding: 'goalDeepUnder',
      quick_revision: 'goalQuickRev'
    };
    return map[goal] ? t('profile.' + map[goal]) : goal.replace(/_/g, ' ');
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-slate-800 dark:border-slate-200 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            {t('profile.loadingProfile')}
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="relative min-h-screen py-12 px-4 text-gray-800 dark:text-gray-100 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:hidden" />
      <div
        className="absolute inset-0 hidden dark:block bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: "url('/dark-tech-bg.svg')",
          filter: 'blur(2px)',
          transform: 'scale(1.03)',
        }}
      />
      <div className="absolute inset-0 hidden dark:block bg-slate-950/72" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
            👤 {isEditing ? t('profile.updateProfile') : t('profile.createProfileTitle')}
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            {isEditing
              ? t('profile.updatePrefsDesc')
              : t('profile.setupDesc')}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 rounded-lg shadow-sm border-l-4 border-green-500 bg-green-50/50 dark:bg-green-500/10 dark:border-green-400 backdrop-blur-lg border border-green-200/40 dark:border-green-400/35">
            <p className="text-green-800 dark:text-green-200 font-medium flex items-center gap-2">
              <FiCheck size={18} /> {successMessage}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg shadow-sm border-l-4 border-red-600 dark:border-red-400 bg-red-50/50 dark:bg-red-500/10 backdrop-blur-lg border border-red-200/40 dark:border-red-400/35">
            <div className="flex justify-between items-start">
              <p className="text-red-800 dark:text-red-200 font-medium">
                ✕ {error}
              </p>
              <button
                onClick={() => dispatch(clearError())}
                className="text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-100"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="rounded-2xl shadow-xl p-8 border border-white/40 bg-white/50 backdrop-blur-lg dark:bg-white/8 dark:border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {t('profile.fullNameLabel')}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                minLength="2"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-gray-300"
                placeholder={t('profile.fullNamePlaceholder')}
              />
            </div>

            {/* Grade Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {t('profile.gradeSelectLabel')}
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all dark:bg-white/10 dark:border-white/20 dark:text-white"
              >
                <option value={9}>{t('profile.grade9')}</option>
                <option value={10}>{t('profile.grade10')}</option>
                <option value={11}>{t('profile.grade11')}</option>
                <option value={12}>{t('profile.grade12')}</option>
              </select>
            </div>

            {/* {t('profile.studySystem')} Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Study System
              </label>
              <select
                name="studySystem"
                value={formData.studySystem}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all dark:bg-white/10 dark:border-white/20 dark:text-white"
              >
                <option value="theoretical">{t('profile.sysTheoretical')}</option>
                <option value="conceptual">{t('profile.sysConceptual')}</option>
                <option value="exam_oriented">{t('profile.sysExamOriented')}</option>
                <option value="problem_solving">{t('profile.sysProblemSolving')}</option>
                <option value="mixed">{t('profile.sysMixed')}</option>
              </select>
            </div>

            {/* Goal Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {t('profile.goal')}
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all dark:bg-white/10 dark:border-white/20 dark:text-white"
              >
                <option value="pass_exam">{t('profile.goalPassExam')}</option>
                <option value="high_grades">{t('profile.goalHighGrades')}</option>
                <option value="deep_understanding">{t('profile.goalDeepUnder')}</option>
                <option value="quick_revision">{t('profile.goalQuickRev')}</option>
              </select>
            </div>

            {/* {t('profile.preferredLangLabel')} Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Preferred Language
              </label>
              <input
                type="text"
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleInputChange}
                maxLength="10"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-gray-300"
                placeholder={t('profile.preferredLangPlaceholder')}
              />
            </div>

            {/* Level Field - AI Quiz */}
            <div className="bg-gradient-to-br from-green-50/50 to-yellow-50/50 dark:from-green-500/12 dark:to-yellow-400/10 p-6 rounded-xl border-2 border-green-200/50 dark:border-green-300/30 backdrop-blur-lg">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <FiTarget size={18} /> {t('profile.level')} {formData.level !== 'foundation' && `✓ ${formData.level.charAt(0).toUpperCase() + formData.level.slice(1)}`}
              </label>
              <button
                type="button"
                onClick={() => setShowQuiz(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                {t('profile.takeQuizBtn')}
              </button>
              <p className="mt-3 text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <FiZap size={14} /> {t('profile.quizSubtext')}
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
                  {isEditing ? t('profile.updatingStatus') : t('profile.creatingStatus')}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FiCheck size={18} />
                  {isEditing ? t('profile.updateProfile') : t('profile.createProfileTitle')}
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Profile Info Card */}
        {profile && (
          <div className="mt-8 rounded-2xl shadow-xl p-6 border border-white/40 bg-white/50 backdrop-blur-lg dark:bg-white/8 dark:border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FiBarChart2 size={18} /> {t('profile.profileInfoSection')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">{t('profile.name')}</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold mt-1">{profile.name}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">{t('profile.grade')}</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold mt-1">{t(`profile.grade${profile.grade}`)}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">{t('profile.level')}</p>
                <p className="text-green-600 font-semibold mt-1 capitalize">{profile.level}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">{t('profile.studySystem')}</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold mt-1 capitalize">{getStudySystemTrans(profile.studySystem)}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">{t('profile.goal')}</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold mt-1 capitalize">{getGoalTrans(profile.goal)}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">{t('profile.lastUpdatedLabel')}</p>
                <p className="text-gray-900 dark:text-gray-100 font-semibold mt-1">{new Date(profile.updatedAt).toLocaleDateString()}</p>
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
