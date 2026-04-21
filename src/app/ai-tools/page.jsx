"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from '@/hooks/useTranslation';

const AIAssistance = dynamic(() => import('../ai-assistance/page'), { ssr: false });
const NotesPage = dynamic(() => import('../notes/page'), { ssr: false });
const AssignmentGuidePage = dynamic(() => import('../assignment-guide/page'), { ssr: false });
const ImageAnalyzerPage = dynamic(() => import('../image-analyzer/page'), { ssr: false });

export default function AIToolsPage() {
  const [selected, setSelected] = useState(null);
  const [isDark, setIsDark] = useState(false);

  // Detect and sync theme changes
  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    window.addEventListener('themechange', updateTheme);
    return () => {
      observer.disconnect();
      window.removeEventListener('themechange', updateTheme);
    };
  }, []);

  const { t } = useTranslation();

  const tools = [
    { id: 'ai-assistance', label: t('navbar.aiAssistance') || 'AI Assistance' },
    { id: 'notes', label: t('navbar.notes') || 'Notes' },
    { id: 'assignment-guide', label: t('navbar.assignment') || 'Assignment Guide' },
    { id: 'image-analyzer', label: t('navbar.image') || 'Image Analyzer' },
  ];

  const backgroundStyle = {
    '--light-bg-image': "url('https://cdn.vectorstock.com/i/500p/87/24/pastel-pink-and-blue-blur-backdrop-vector-63408724.jpg')",
  };

  return (
    <main className="light-image-bg min-h-screen p-6 md:p-8 transition-colors duration-300 relative z-0 flex flex-col items-center" style={backgroundStyle}>
      {/* DARK MODE BACKGROUND - Matches Home page */}
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

      <div className="w-full max-w-7xl relative z-10">
        {/* header intentionally removed per UX request */}

        <section className="w-full mb-6 sticky top-6 z-50">
          <div className="mx-auto max-w-3xl light-box rounded-2xl p-3 border shadow-sm grid grid-cols-4 justify-center gap-3">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelected(selected === tool.id ? null : tool.id)}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs transition-colors ${
                  selected === tool.id ? 'bg-green-600 text-white' : 'text-black dark:text-white hover:bg-white/10 dark:hover:bg-white/5'
                }`}
                style={selected === tool.id ? { color: '#ffffff' } : { color: isDark ? '#ededed' : '#111827' }}
              >
                <span className={`inline-flex w-5 h-5 items-center justify-center rounded-sm ${selected === tool.id ? 'bg-white/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                  <svg className={`w-3 h-3 ${selected === tool.id ? 'text-white' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2h-4l-4 3v-3H4a2 2 0 01-2-2V5z"/></svg>
                </span>
                <span className="font-medium">{tool.label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="w-full relative z-0 overflow-y-auto">
          {selected === 'ai-assistance' && <AIAssistance />}
          {selected === 'notes' && <NotesPage />}
          {selected === 'assignment-guide' && <AssignmentGuidePage />}
          {selected === 'image-analyzer' && <ImageAnalyzerPage />}
          {!selected && (
            <div className="light-box p-12 rounded-xl border border-dashed text-center" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
              {t('common.selectToolPlaceholder') || 'Select a tool above to open it here.'}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
