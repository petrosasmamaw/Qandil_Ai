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
import { FiTarget, FiZap, FiBarChart2, FiCheck, FiX } from 'react-icons/fi';
import { useTranslation } from '@/hooks/useTranslation';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { profile, loading, error, success, successMessage } = useSelector(
    (state) => state.profile
  );
  
  const { t, language } = useTranslation();

  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isDark, setIsDark] = useState(false);
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

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setSession(session);
          setFormData((prev) => ({ ...prev, userId: session.user.id }));
          dispatch(fetchProfileByUserId(session.user.id));
        } else {
          router.push('/auth/login');
        }
      } catch (err) {
        router.push('/auth/login');
      } finally {
        setSessionLoading(false);
      }
    };
    getSession();
  }, [dispatch, router]);

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

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => dispatch(clearSuccess()), 3000);
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
      dispatch(updateProfile({ profileId: profile._id, profileData: formData }));
    } else {
      dispatch(createProfile(formData));
    }
  };

  const handleQuizComplete = (levelData) => {
    setFormData((prev) => ({ ...prev, level: levelData.level }));
    setShowQuiz(false);
  };

  const getStudySystemTrans = (system) => {
    const systemMap = {
      theoretical: t('profile.sysTheoretical'),
      conceptual: t('profile.sysConceptual'),
      exam_oriented: t('profile.sysExamOriented'),
      problem_solving: t('profile.sysProblemSolving'),
      mixed: t('profile.sysMixed'),
    };
    return systemMap[system] || system;
  };

  const getGoalTrans = (goal) => {
    const goalMap = {
      pass_exam: t('profile.goalPassExam'),
      high_grades: t('profile.goalHighGrades'),
      deep_understanding: t('profile.goalDeepUnder'),
      quick_revision: t('profile.goalQuickRev'),
    };
    return goalMap[goal] || goal;
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <main className="light-image-bg min-h-screen transition-colors duration-300 relative z-0 py-12 px-4">
      {isDark && (
        <div 
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.openai.com/static-rsc-4/UhK-ZnGnaOc26fOHcPEMngdrJMi0lBmw_eKNkaDh38qqO6xopIWrT3GyMD_7F0bUEwvEgsSxHAA7F9eZ0sIsr6zwzCbSZXRwDuam2ZAsT_4kprqEa4D6b_95yr-58SC2Fzcww7u8K9AFRoRHVUJ2ItNncyjWPfYYxDDhB96QIwwOEW1mvB1bi6CkXIYSZjje?purpose=inline')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            transform: 'scale(1.05)',
          }}
        />
      )}

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-500 mb-2">
             {isEditing ? t('profile.updateProfile') : t('profile.createProfileTitle')}
          </h1>
          <p className="text-lg opacity-80" style={{ color: isDark ? '#fff' : '#000' }} suppressHydrationWarning>
            {isEditing ? t('profile.updatePrefsDesc') : t('profile.setupDesc')}
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 rounded-xl border border-green-500/30 bg-green-500/10 backdrop-blur-md">
            <p className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
              <FiCheck size={18} /> {successMessage}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-md flex justify-between">
            <p className="text-red-600 dark:text-red-400 font-medium">✕ {error}</p>
            <button onClick={() => dispatch(clearError())}><FiX /></button>
          </div>
        )}

        <div className="light-box p-8 border shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">{t('profile.fullNameLabel')}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full"
                placeholder={t('profile.fullNamePlaceholder')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">{t('profile.gradeSelectLabel')}</label>
                <select name="grade" value={formData.grade} onChange={handleInputChange} className="w-full">
                  <option value={9}>{t('profile.grade9')}</option>
                  <option value={10}>{t('profile.grade10')}</option>
                  <option value={11}>{t('profile.grade11')}</option>
                  <option value={12}>{t('profile.grade12')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Preferred Language</label>
                <input
                  type="text"
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Study System</label>
              <select name="studySystem" value={formData.studySystem} onChange={handleInputChange} className="w-full">
                <option value="theoretical">{t('profile.sysTheoretical')}</option>
                <option value="conceptual">{t('profile.sysConceptual')}</option>
                <option value="exam_oriented">{t('profile.sysExamOriented')}</option>
                <option value="problem_solving">{t('profile.sysProblemSolving')}</option>
                <option value="mixed">{t('profile.sysMixed')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">{t('profile.goal')}</label>
              <select name="goal" value={formData.goal} onChange={handleInputChange} className="w-full">
                <option value="pass_exam">{t('profile.goalPassExam')}</option>
                <option value="high_grades">{t('profile.goalHighGrades')}</option>
                <option value="deep_understanding">{t('profile.goalDeepUnder')}</option>
                <option value="quick_revision">{t('profile.goalQuickRev')}</option>
              </select>
            </div>

            <div className="inner-box p-6 border-l-4 border-l-green-500">
              <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                <FiTarget size={18} className="text-green-600" /> 
                {t('profile.level')}: <span className="capitalize text-green-600">{formData.level}</span>
              </label>
              <button
                type="button"
                onClick={() => setShowQuiz(true)}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition transform active:scale-95"
              >
                {t('profile.takeQuizBtn')}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-white/10 hover:bg-white/20 border font-bold rounded-xl transition transform active:scale-95 disabled:opacity-50"
            >
              {loading ? t('profile.creatingStatus') : (isEditing ? t('profile.updateProfile') : t('profile.createProfileTitle'))}
            </button>
          </form>
        </div>

        {profile && (
          <div className="mt-8 light-box p-6 border border-l-4 border-l-blue-500 dark:border-l-blue-400" suppressHydrationWarning>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: isDark ? '#fff' : '#000' }} suppressHydrationWarning>
              <FiBarChart2 size={18} className={isDark ? 'text-blue-400' : 'text-blue-600'} /> {t('profile.profileInfoSection')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="inner-box p-4" suppressHydrationWarning>
                <p className="text-xs uppercase font-bold mb-1 opacity-60" style={{ color: isDark ? '#fff' : '#000' }}>{t('profile.name')}</p>
                <p className="font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>{profile.name}</p>
              </div>

              <div className="inner-box p-4" suppressHydrationWarning>
                <p className="text-xs uppercase font-bold mb-1 opacity-60" style={{ color: isDark ? '#fff' : '#000' }}>{t('profile.grade')}</p>
                <p className="font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>{t(`profile.grade${profile.grade}`)}</p>
              </div>

              <div className="inner-box p-4" suppressHydrationWarning>
                <p className="text-xs uppercase font-bold mb-1 opacity-60" style={{ color: isDark ? '#fff' : '#000' }}>{t('profile.level')}</p>
                <p className="font-semibold capitalize text-green-500">{profile.level}</p>
              </div>

              <div className="inner-box p-4" suppressHydrationWarning>
                <p className="text-xs uppercase font-bold mb-1 opacity-60" style={{ color: isDark ? '#fff' : '#000' }}>{t('profile.studySystem')}</p>
                <p className="font-semibold capitalize" style={{ color: isDark ? '#fff' : '#000' }}>{getStudySystemTrans(profile.studySystem)}</p>
              </div>

              <div className="inner-box p-4" suppressHydrationWarning>
                <p className="text-xs uppercase font-bold mb-1 opacity-60" style={{ color: isDark ? '#fff' : '#000' }}>{t('profile.goal')}</p>
                <p className="font-semibold capitalize" style={{ color: isDark ? '#fff' : '#000' }}>{getGoalTrans(profile.goal)}</p>
              </div>

              <div className="inner-box p-4" suppressHydrationWarning>
                <p className="text-xs uppercase font-bold mb-1 opacity-60" style={{ color: isDark ? '#fff' : '#000' }}>{t('profile.lastUpdatedLabel')}</p>
                <p className="font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>{new Date(profile.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

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