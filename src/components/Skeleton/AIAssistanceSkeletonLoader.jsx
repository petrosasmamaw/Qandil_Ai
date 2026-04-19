'use client';

import { 
  SkeletonHeader, 
  SkeletonChatBox, 
  SkeletonSidebar 
} from './SkeletonComponents';

/**
 * Complete AI Assistance page skeleton loader
 * Mimics the full layout including header, main chat area, and sidebar
 */
export function AIAssistanceSkeletonLoader({ isDark = false }) {
  const backgroundStyle = {
    '--light-bg-image': "url('https://cdn.vectorstock.com/i/500p/87/24/pastel-pink-and-blue-blur-backdrop-vector-63408724.jpg')",
  };

  return (
    <main 
      className="light-image-bg min-h-screen p-4 md:p-8 transition-colors duration-300 relative z-0"
      style={backgroundStyle}
    >
      {/* DARK MODE BACKGROUND */}
      {isDark && (
        <div 
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAxL3Jhd3BpeGVsX29mZmljZV8zNF9taW5pbWFsX2Fic3RyYWN0X2JsdWVfYW5kX3B1cnBsZV9uZW9uX3dhdXlfZ182ZWQyZmJmMS05ZWMzLTQxNmItOWY4My0yZmJmNThjOWUyNzVfMS5qcGc.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(8px)',
            transform: 'scale(1.05)', 
          }}
        />
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER */}
        <SkeletonHeader />

        {/* LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main chat area - spans 3 columns on large screens */}
          <div className="lg:col-span-3">
            <SkeletonChatBox />
          </div>

          {/* Sidebar - hidden on mobile */}
          <div className="hidden lg:block">
            <SkeletonSidebar />
          </div>
        </div>
      </div>

      {/* Optional: Add custom CSS for smooth animations if needed */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </main>
  );
}
