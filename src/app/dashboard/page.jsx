'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/lib/supabase';
import { fetchProfileByUserId } from '@/store/slices/profileSlice';
import dynamic from 'next/dynamic';
import { FiMessageSquare, FiBook, FiClipboard, FiImage, FiCalendar, FiClock, FiSearch } from 'react-icons/fi';
import { IoStatsChart } from 'react-icons/io5';
import { MdNotifications } from 'react-icons/md';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { t, language } = useTranslation();
  
  const profile = useSelector((state) => state.profile.profile);
  const [user, setUser] = useState(null);
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">{t('common.loading') || 'Loading...'}</p>
        </div>
      </div>
    );
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
      font: { size: 18 },
    },
    xaxis: { title: 'Chat Type' },
    yaxis: { title: 'Count' },
    hovermode: 'closest',
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#111827' },
    margin: { l: 50, r: 50, t: 80, b: 50 },
  };

  const layoutMessages = {
    title: {
      text: 'Message Distribution',
      font: { size: 18 },
    },
    xaxis: { title: 'Chat Type' },
    yaxis: { title: 'Message Count' },
    hovermode: 'closest',
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#111827' },
    margin: { l: 50, r: 50, t: 80, b: 50 },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-12">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Greeting */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Hello <span className="text-indigo-600 dark:text-indigo-400">{profile?.name?.split(' ')[0] || 'Student'}</span> 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Let's learn something new today!</p>
            </div>

            {/* Search & Notification */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <FiSearch className="text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent outline-none text-sm text-gray-600 dark:text-gray-400 flex-1 placeholder-gray-400"
                />
              </div>
              <button className="relative p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <MdNotifications className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          
          {/* Left Column - Overview & Charts */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Overview Stats */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* AI Assistance Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border-l-4 border-indigo-600 dark:border-indigo-500 p-5 shadow-sm hover:shadow-lg transition duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-3">
                    <FiMessageSquare className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">AI Assistance</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{chatStats.aiAssistance.chats}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{chatStats.aiAssistance.messages} messages</p>
                </div>

                {/* Notes Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border-l-4 border-green-500 dark:border-green-400 p-5 shadow-sm hover:shadow-lg transition duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-3">
                    <FiBook className="text-green-500 w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Notes</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{chatStats.notes.chats}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{chatStats.notes.messages} messages</p>
                </div>

                {/* Assignment Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border-l-4 border-blue-500 dark:border-blue-400 p-5 shadow-sm hover:shadow-lg transition duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-3">
                    <FiClipboard className="text-blue-500 w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Certificate</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{chatStats.assignmentGuide.chats}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{chatStats.assignmentGuide.messages} completed</p>
                </div>

                {/* Image Analyzer Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border-l-4 border-purple-600 dark:border-purple-500 p-5 shadow-sm hover:shadow-lg transition duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-3">
                    <FiImage className="text-purple-600 w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Community</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{chatStats.imageAnalyzer.chats * 10}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Support members</p>
                </div>
              </div>
            </div>

            {/* Activity Hours Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Hours</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Weekly</span>
                  <select defaultValue="Weekly" className="bg-transparent text-gray-600 dark:text-gray-400 text-sm border-none outline-none cursor-pointer font-medium">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <p>Time spent: <span className="font-semibold text-gray-900 dark:text-white">28 hrs</span> <span className="text-green-600">↑ 95%</span></p>
                <p className="mt-2">Lessons taken: <span className="font-semibold text-gray-900 dark:text-white">60</span> <span className="text-yellow-600">→ 75%</span></p>
                <p className="mt-2">Exam passed: <span className="font-semibold text-gray-900 dark:text-white">10</span> <span className="text-green-600">→ 100%</span></p>
              </div>
              <div className="h-72 -mx-6">
                <Plot
                  data={[
                    {
                      x: ['S', 'M', 'W', 'T', 'F', 'S', 'S'],
                      y: [20, 35, 25, 40, 30, 25, 35],
                      type: 'bar',
                      marker: {
                        color: ['#6366F1', '#10B981', '#3B82F6', '#EC4899', '#F59E0B', '#8B5CF6', '#EC4899'],
                      },
                    },
                  ]}
                  layout={{
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: '#111827' },
                    margin: { l: 40, r: 20, t: 20, b: 40 },
                    xaxis: { showgrid: false },
                    yaxis: { showgrid: true, gridcolor: 'rgba(200,200,200,0.2)' },
                  }}
                  config={{ responsive: true, displayModeBar: false }}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Performance</h3>
              <div className="mb-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Your productivity is 40% higher</span>
                  <span className="font-semibold text-gray-900 dark:text-white">40%</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">compared to last month</p>
              </div>
              <div className="h-72 -mx-6">
                <Plot
                  data={[
                    {
                      x: ['S', 'M', 'W', 'T', 'F', 'S', 'S'],
                      y: [30, 40, 35, 45, 40, 38, 42],
                      type: 'scatter',
                      mode: 'lines+markers',
                      line: { color: '#6366F1', width: 3 },
                      marker: { size: 8, color: '#6366F1' },
                      fill: 'tozeroy',
                      name: 'Messages',
                    },
                  ]}
                  layout={{
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: '#111827' },
                    margin: { l: 40, r: 20, t: 20, b: 40 },
                    xaxis: { showgrid: false },
                    yaxis: { showgrid: true, gridcolor: 'rgba(200,200,200,0.2)' },
                  }}
                  config={{ responsive: true, displayModeBar: false }}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar - Profile & Events */}
          <div className="space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile</h3>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {profile?.name?.charAt(0).toUpperCase() || '👤'}
                </div>
              </div>
              <div className="text-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile?.name || 'Student'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">College Student</p>
              </div>

              {/* Profile Stats */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Learning Level</span>
                  <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{profile?.level?.charAt(0).toUpperCase() + profile?.level?.slice(1) || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Grade</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{profile?.grade}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Chats</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{totalChats}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Study Streak</span>
                  <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">7 days 🔥</span>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium transition">
                  👥 Team Meetup
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition">
                  🎬 Illustration
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium transition">
                  🔍 Research
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium transition">
                  📊 Report
                </button>
              </div>
            </div>

            {/* Study Progress */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 rounded-lg shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">40%</h3>
              <p className="text-sm mb-4 opacity-90">Your productivity is 40% higher compared to last month</p>
              <div className="w-full bg-white/20 rounded-full h-2.5">
                <div className="bg-white h-2.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <p className="text-xs mt-3 opacity-75">Keep it up! You're making great progress 💪</p>
            </div>
          </div>
        </div>

        {/* My Assignments / Chat Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">My Chat Sessions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-600 dark:text-gray-400">Task</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-600 dark:text-gray-400">Grade</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-600 dark:text-gray-400">Update</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-medium text-gray-900 dark:text-white">AI Assistance Chat</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{chatStats.aiAssistance.messages}/200</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">Completed</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-gray-900 dark:text-white">Notes Study Session</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{chatStats.notes.messages}/200</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">Completed</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-gray-900 dark:text-white">Assignment Guide</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">--/200</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">Upcoming</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
