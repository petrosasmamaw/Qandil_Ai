'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/lib/supabase';
import { fetchProfileByUserId } from '@/store/slices/profileSlice';
import { DashboardSkeletonLoader } from '@/components/Skeleton';
import dynamic from 'next/dynamic';
import { FiMessageSquare, FiBook, FiClipboard, FiImage, FiArrowRight } from 'react-icons/fi';
import { IoStatsChart } from 'react-icons/io5';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { t, language } = useTranslation();
  
  const profile = useSelector((state) => state.profile.profile);
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [chatStats, setChatStats] = useState({
    aiAssistance: { chats: 0, messages: 0 },
    notes: { chats: 0, messages: 0 },
    assignmentGuide: { chats: 0, messages: 0 },
    imageAnalyzer: { chats: 0, messages: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect dark mode
  useEffect(() => {
    const dark = document.documentElement.classList.contains('dark');
    setIsDark(dark);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Fetch user session and profile
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          dispatch(fetchProfileByUserId(session.user.id));
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    getUser();
  }, [dispatch]);

  // Fetch chat statistics
  useEffect(() => {
    const fetchChatStats = async () => {
      if (!user?.id) return;

      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

        // Fetch all chat types
        const [aiRes, notesRes, assignmentRes, imageRes] = await Promise.all([
          fetch(`${backendUrl}/ai-assistance-chat/history/${user.id}`),
          fetch(`${backendUrl}/notes-chat/history/${user.id}`),
          fetch(`${backendUrl}/assignment-guide-chat/history/${user.id}`),
          fetch(`${backendUrl}/image-analyzer-chat/history/${user.id}`),
        ]);

        const aiData = await aiRes.json();
        const notesData = await notesRes.json();
        const assignmentData = await assignmentRes.json();
        const imageData = await imageRes.json();

        const calculateStats = (chats) => {
          const totalMessages = chats?.data?.reduce((sum, chat) => {
            return sum + (chat.messages?.length || 0);
          }, 0) || 0;
          return {
            chats: chats?.data?.length || 0,
            messages: totalMessages,
          };
        };

        setChatStats({
          aiAssistance: calculateStats(aiData),
          notes: calculateStats(notesData),
          assignmentGuide: calculateStats(assignmentData),
          imageAnalyzer: calculateStats(imageData),
        });
      } catch (error) {
        console.error('Error fetching chat stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatStats();
  }, [user?.id]);

  if (!mounted || loading) {
    return <DashboardSkeletonLoader isDark={isDark} />;
  }

  // Calculate total stats
  const totalChats = Object.values(chatStats).reduce((sum, stat) => sum + stat.chats, 0);
  const totalMessages = Object.values(chatStats).reduce((sum, stat) => sum + stat.messages, 0);

  // 3D Chart Data
  const chatTypes = ['AI Assistance', 'Notes', 'Assignment', 'Image Analyzer'];
  const chatCounts = [
    chatStats.aiAssistance.chats,
    chatStats.notes.chats,
    chatStats.assignmentGuide.chats,
    chatStats.imageAnalyzer.chats,
  ];
  const messageCounts = [
    chatStats.aiAssistance.messages,
    chatStats.notes.messages,
    chatStats.assignmentGuide.messages,
    chatStats.imageAnalyzer.messages,
  ];

  // 3D Bar Chart for Chat Distribution
  const chart3DData = [
    {
      x: chatTypes,
      y: chatCounts,
      type: 'bar',
      marker: {
        color: chatCounts.map((val, idx) => ['#3B82F6', '#10B981', '#F59E0B', '#EC4899'][idx]),
        line: {
          color: 'rgba(100, 100, 100, 0.8)',
          width: 1.5,
        },
      },
      text: chatCounts,
      textposition: 'outside',
      hovertemplate: '<b>%{x}</b><br>Chats: %{y}<extra></extra>',
    },
  ];

  // 3D Pie-like visualization with scatter
  const totalStats = chatCounts.reduce((a, b) => a + b, 0);
  const pieData = [
    {
      x: chatTypes,
      y: chatCounts,
      mode: 'markers',
      marker: {
        size: chatCounts.map((val) => (val / Math.max(...chatCounts)) * 50 + 20),
        color: chatCounts,
        colorscale: 'Viridis',
        showscale: true,
        colorbar: {
          title: 'Chat Count',
        },
        line: {
          color: 'white',
          width: 2,
        },
      },
      text: chatCounts.map((val) => `${((val / totalStats) * 100).toFixed(1)}%`),
      textposition: 'middle center',
      textfont: {
        color: 'white',
        size: 12,
      },
      hovertemplate: '<b>%{x}</b><br>Chats: %{y}<br>Percentage: %{text}<extra></extra>',
    },
  ];

  // 3D Surface plot for messages trend
  const messageDistribution = [
    {
      x: chatTypes,
      y: messageCounts,
      type: 'bar',
      marker: {
        color: messageCounts.map((val, idx) => ['#60A5FA', '#34D399', '#FBBF24', '#F472B6'][idx]),
      },
      text: messageCounts,
      textposition: 'outside',
      hovertemplate: '<b>%{x}</b><br>Messages: %{y}<extra></extra>',
    },
  ];

  const layout3D = {
    title: {
      text: 'Chat Distribution',
      font: { size: 18, color: isDark ? '#F3F4F6' : '#1A3263' },
    },
    xaxis: { title: 'Chat Type', titlefont: { color: isDark ? '#F3F4F6' : '#1A3263' }, tickfont: { color: isDark ? '#D1D5DB' : '#1A3263' } },
    yaxis: { title: 'Count', titlefont: { color: isDark ? '#F3F4F6' : '#1A3263' }, tickfont: { color: isDark ? '#D1D5DB' : '#1A3263' } },
    hovermode: 'closest',
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { color: isDark ? '#F3F4F6' : '#1A3263' },
    margin: { l: 50, r: 50, t: 80, b: 50 },
  };

  const layoutMessages = {
    title: {
      text: 'Message Distribution',
      font: { size: 18, color: isDark ? '#F3F4F6' : '#1A3263' },
    },
    xaxis: { title: 'Chat Type', titlefont: { color: isDark ? '#F3F4F6' : '#1A3263' }, tickfont: { color: isDark ? '#D1D5DB' : '#1A3263' } },
    yaxis: { title: 'Message Count', titlefont: { color: isDark ? '#F3F4F6' : '#1A3263' }, tickfont: { color: isDark ? '#D1D5DB' : '#1A3263' } },
    hovermode: 'closest',
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { color: isDark ? '#F3F4F6' : '#1A3263' },
    margin: { l: 50, r: 50, t: 80, b: 50 },
  };

  return (
    <main className="light-image-bg min-h-screen transition-colors duration-300 relative z-0">
      {/* DARK MODE BACKGROUND IMAGE WITH BLUR ONLY */}
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

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative z-10">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
            {t('dashboard.welcome')} <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-500">{profile?.name?.split(' ')[0] || 'Student'}</span> 👋
          </h1>
          <p style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{t('dashboard.tagline')}</p>
        </div>

        {/* Overview Stats - 4 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* AI Assistance Card */}
          <div className="light-box p-6 rounded-2xl border hover:scale-105 transition duration-300">
            <div className="flex items-center justify-between mb-3">
              <FiMessageSquare className="text-green-600 w-6 h-6" />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{t('dashboard.stats.aiAssistance')}</p>
            <p className="text-3xl font-bold" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{chatStats.aiAssistance.chats}</p>
            <p className="text-xs mt-2" style={{ color: isDark ? '#9CA3AF' : '#1A3263' }}>{chatStats.aiAssistance.messages} {t('dashboard.stats.messages')}</p>
          </div>

          {/* Notes Card */}
          <div className="light-box p-6 rounded-2xl border hover:scale-105 transition duration-300">
            <div className="flex items-center justify-between mb-3">
              <FiBook className="text-green-600 w-6 h-6" />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{t('dashboard.stats.notes')}</p>
            <p className="text-3xl font-bold" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{chatStats.notes.chats}</p>
            <p className="text-xs mt-2" style={{ color: isDark ? '#9CA3AF' : '#1A3263' }}>{chatStats.notes.messages} {t('dashboard.stats.messages')}</p>
          </div>

          {/* Assignment Guide Card */}
          <div className="light-box p-6 rounded-2xl border hover:scale-105 transition duration-300">
            <div className="flex items-center justify-between mb-3">
              <FiClipboard className="text-green-600 w-6 h-6" />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{t('dashboard.stats.assignmentGuide')}</p>
            <p className="text-3xl font-bold" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{chatStats.assignmentGuide.chats}</p>
            <p className="text-xs mt-2" style={{ color: isDark ? '#9CA3AF' : '#1A3263' }}>{chatStats.assignmentGuide.messages} {t('dashboard.stats.messages')}</p>
          </div>

          {/* Image Analyzer Card */}
          <div className="light-box p-6 rounded-2xl border hover:scale-105 transition duration-300">
            <div className="flex items-center justify-between mb-3">
              <FiImage className="text-green-600 w-6 h-6" />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{t('dashboard.stats.imageAnalyzer')}</p>
            <p className="text-3xl font-bold" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{chatStats.imageAnalyzer.chats}</p>
            <p className="text-xs mt-2" style={{ color: isDark ? '#9CA3AF' : '#1A3263' }}>{chatStats.imageAnalyzer.messages} {t('dashboard.stats.messages')}</p>
          </div>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Left Column - Chat Distribution */}
          <div className="lg:col-span-2 light-box p-6 rounded-2xl border">
            <h3 className="text-lg font-semibold mb-6" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{t('dashboard.charts.chatDistribution')}</h3>
            <div className="h-80 -mx-6">
              <Plot
                data={[
                  {
                    x: [
                      t('dashboard.stats.aiAssistance'),
                      t('dashboard.stats.notes'),
                      t('dashboard.stats.assignmentGuide'),
                      t('dashboard.stats.imageAnalyzer')
                    ],
                    y: [
                      chatStats.aiAssistance.chats || 0,
                      chatStats.notes.chats || 0,
                      chatStats.assignmentGuide.chats || 0,
                      chatStats.imageAnalyzer.chats || 0,
                    ],
                    type: 'bar',
                    marker: {
                      color: ['#16a34a', '#22c55e', '#84cc16', '#4ade80'],
                    },
                    text: [
                      chatStats.aiAssistance.chats || 0,
                      chatStats.notes.chats || 0,
                      chatStats.assignmentGuide.chats || 0,
                      chatStats.imageAnalyzer.chats || 0,
                    ],
                    textposition: 'outside',
                  },
                ]}
                layout={{
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  font: { color: isDark ? '#ededed' : '#111827' },
                  margin: { l: 40, r: 20, t: 20, b: 40 },
                  xaxis: { showgrid: false },
                  yaxis: { showgrid: true, gridcolor: isDark ? 'rgba(200,200,200,0.1)' : 'rgba(200,200,200,0.2)' },
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>

          {/* Right Column - Profile & Stats */}
          <div className="space-y-6">
            
            {/* Profile Card */}
            <div className="light-box p-6 rounded-2xl border">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                  {profile?.name?.charAt(0).toUpperCase() || '👤'}
                </div>
              </div>
              <div className="text-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
                <p className="text-lg font-semibold" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{profile?.name || 'Student'}</p>
                <p className="text-sm" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{t('dashboard.profile.grade')} {profile?.grade || 'N/A'}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{t('dashboard.profile.level')}</span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400 capitalize">{profile?.level || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{t('dashboard.profile.totalChats')}</span>
                  <span className="text-sm font-semibold" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{totalChats}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{t('dashboard.profile.totalMessages')}</span>
                  <span className="text-sm font-semibold" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{totalMessages}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="light-box bg-gradient-to-br from-green-500/10 to-green-600/10 dark:from-green-500/5 dark:to-green-600/5 rounded-2xl border border-green-200/50 dark:border-green-800/30 p-6 text-gray-900 dark:text-white">
              <h3 className="text-sm font-medium opacity-90 mb-2" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{t('dashboard.charts.learningActivity')}</h3>
              <p className="text-3xl font-bold mb-4" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{totalMessages}</p>
              <p className="text-xs opacity-75" style={{ color: isDark ? '#9CA3AF' : '#1A3263' }}>{t('dashboard.charts.activityDesc')}</p>
            </div>
          </div>
        </div>

        {/* Learning Sessions Table */}
        <div className="light-box p-6 rounded-2xl border">
          <h3 className="text-lg font-semibold mb-6" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{t('dashboard.table.title')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-4 px-4 font-semibold text-sm" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{t('dashboard.table.type')}</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{t('dashboard.table.chats')}</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{t('dashboard.table.messages')}</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{t('dashboard.table.status')}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span className="font-medium" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{t('dashboard.stats.aiAssistance')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{chatStats.aiAssistance.chats}</td>
                  <td className="py-4 px-4" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{chatStats.aiAssistance.messages}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">{t('dashboard.table.active')}</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{t('dashboard.stats.notes')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{chatStats.notes.chats}</td>
                  <td className="py-4 px-4" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{chatStats.notes.messages}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">{t('dashboard.table.active')}</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="font-medium" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{t('dashboard.stats.assignmentGuide')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{chatStats.assignmentGuide.chats}</td>
                  <td className="py-4 px-4" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{chatStats.assignmentGuide.messages}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${chatStats.assignmentGuide.chats > 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'}`}>
                      {chatStats.assignmentGuide.chats > 0 ? t('dashboard.table.active') : t('dashboard.table.notStarted')}
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                      <span className="font-medium" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{t('dashboard.stats.imageAnalyzer')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{chatStats.imageAnalyzer.chats}</td>
                  <td className="py-4 px-4" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{chatStats.imageAnalyzer.messages}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${chatStats.imageAnalyzer.chats > 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'}`}>
                      {chatStats.imageAnalyzer.chats > 0 ? t('dashboard.table.active') : t('dashboard.table.notStarted')}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
