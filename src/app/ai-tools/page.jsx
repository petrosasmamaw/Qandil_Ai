'use client';

import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from '@/hooks/useTranslation';

// Dynamically import the existing tool pages to render inside this container
const AIAssistancePage = dynamic(() => import('@/app/ai-assistance/page.js').then(m => m.default), { ssr: false });
const NotesPage = dynamic(() => import('@/app/notes/page.jsx').then(m => m.default), { ssr: false });
const AssignmentGuidePage = dynamic(() => import('@/app/assignment-guide/page.jsx').then(m => m.default), { ssr: false });
const ImageAnalyzerPage = dynamic(() => import('@/app/image-analyzer/page.jsx').then(m => m.default), { ssr: false });

export default function AIToolsPage() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState('ai-assistance');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const dark = document.documentElement.classList.contains('dark');
    setIsDark(dark);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const tabs = [
    { key: 'ai-assistance', label: t('navbar.aiAssistance') },
    { key: 'notes', label: t('navbar.notes') },
    { key: 'assignment-guide', label: t('navbar.assignment') },
    { key: 'image-analyzer', label: t('navbar.image') },
  ];

  const renderSelected = () => {
    switch (selected) {
      case 'ai-assistance':
        return <AIAssistancePage />;
      case 'notes':
        return <NotesPage />;
      case 'assignment-guide':
        return <AssignmentGuidePage />;
      case 'image-analyzer':
        return <ImageAnalyzerPage />;
      default:
        return <AIAssistancePage />;
    }
  };

  return (
    <main className="light-image-bg min-h-screen transition-colors duration-300 relative z-0">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative z-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>{t('navbar.aiTools') || 'AI Tools'}</h1>
          <p className="text-sm" style={{ color: isDark ? '#D1D5DB' : '#1A3263' }}>{t('dashboard.tagline') || 'Manage AI tools and related features'}</p>
        </div>

        <div className="light-box p-4 rounded-2xl border mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            {tabs.map((tab) => {
              const active = selected === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelected(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${active ? 'scale-105 shadow-md' : 'hover:scale-105'}`}
                  style={active ? (isDark ? { backgroundColor: '#1f2937', color: '#fff' } : { backgroundColor: '#0f172a', color: '#fff' }) : (isDark ? { backgroundColor: 'transparent', color: '#d1d5db' } : { backgroundColor: 'transparent', color: '#1A3263' })}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Suspense fallback={<div className="text-center py-12">Loading tool...</div>}>
            {renderSelected()}
          </Suspense>
        </div>
      </div>
    </main>
  );
}
