'use client';

import { Skeleton, SkeletonCircle, SkeletonBar } from './Skeleton';

/**
 * Notes page specific skeleton components
 */

// Stat card skeleton
export function SkeletonStatCard() {
  return (
    <div className="light-box p-4 border text-center animate-pulse">
      <SkeletonBar width="w-16" height="h-3" className="mx-auto mb-2" />
      <SkeletonBar width="w-20" height="h-4" className="mx-auto" />
    </div>
  );
}

// Stats bar skeleton (4 columns)
export function SkeletonStatsBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, idx) => (
        <SkeletonStatCard key={idx} />
      ))}
    </div>
  );
}

// File upload area skeleton
export function SkeletonFileUpload() {
  return (
    <div className="p-12 border-2 border-dashed rounded-3xl light-box animate-pulse">
      <div className="text-center">
        <SkeletonBar width="w-12" height="h-12" className="mx-auto mb-4 rounded-full" />
        <SkeletonBar width="w-40" height="h-6" className="mx-auto mb-3" />
        <SkeletonBar width="w-48" height="h-4" className="mx-auto mb-6" />
        <SkeletonBar width="w-32" height="h-10" className="mx-auto rounded-xl" />
      </div>
    </div>
  );
}

// Text form skeleton
export function SkeletonTextForm() {
  return (
    <div className="light-box p-8 border shadow-xl space-y-4 animate-pulse">
      <SkeletonBar width="w-full" height="h-12" className="rounded-xl" />
      <div className="space-y-2">
        <SkeletonBar width="w-full" height="h-24" className="rounded-xl" />
        <SkeletonBar width="w-4/5" height="h-6" className="rounded-xl" />
      </div>
      <SkeletonBar width="w-full" height="h-12" className="rounded-xl" />
    </div>
  );
}

// Note card skeleton
export function SkeletonNoteCard() {
  return (
    <div className="light-box p-6 border shadow-md space-y-3 animate-pulse">
      {/* Title */}
      <SkeletonBar width="w-48" height="h-5" className="mb-4" />
      
      {/* Content lines */}
      <div className="space-y-2">
        <SkeletonBar width="w-full" height="h-4" />
        <SkeletonBar width="w-full" height="h-4" />
        <SkeletonBar width="w-3/4" height="h-4" />
      </div>
      
      {/* Footer with buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <SkeletonBar width="w-20" height="h-8" className="rounded-lg" />
        <SkeletonBar width="w-20" height="h-8" className="rounded-lg" />
      </div>
    </div>
  );
}

// Notes section skeleton
export function SkeletonNotesSection() {
  return (
    <div className="space-y-6 animate-pulse">
      <SkeletonBar width="w-40" height="h-7" />
      {[...Array(2)].map((_, idx) => (
        <SkeletonNoteCard key={idx} />
      ))}
    </div>
  );
}

/**
 * Complete Notes page skeleton loader
 */
export function NotesSkeletonLoader({ isDark = false }) {
  const backgroundStyle = {
    '--light-bg-image': "url('https://cdn.vectorstock.com/i/500p/87/24/pastel-pink-and-blue-blur-backdrop-vector-63408724.jpg')",
  };

  return (
    <main 
      className="light-image-bg min-h-screen p-6 md:p-8 transition-colors duration-300 relative z-0"
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
        <div className="flex justify-between items-center mb-8 animate-pulse">
          <div className="light-box px-6 py-4 border shadow-sm flex items-center gap-4 w-full md:w-auto">
            <SkeletonCircle size="w-16 h-16" />
            <div className="flex-1 space-y-2">
              <SkeletonBar width="w-32" height="h-6" />
              <SkeletonBar width="w-40" height="h-3" />
            </div>
          </div>
          <div className="hidden md:flex gap-3">
            <SkeletonBar width="w-24" height="h-10" className="rounded-xl" />
          </div>
        </div>

        {/* INPUT MODE TOGGLE */}
        <div className="mb-8 flex gap-2 animate-pulse">
          <SkeletonBar width="w-32" height="h-11" className="rounded-xl" />
          <SkeletonBar width="w-32" height="h-11" className="rounded-xl" />
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* MAIN INPUT AREA - File Upload */}
          <div className="w-full">
            <SkeletonFileUpload />
          </div>

          {/* STATS BAR */}
          <SkeletonStatsBar />

          {/* NOTES SECTION */}
          <SkeletonNotesSection />

          {/* INFO SECTION */}
          <div className="light-box p-6 border-l-4 border-l-blue-500 shadow-sm animate-pulse">
            <SkeletonBar width="w-40" height="h-5" className="mb-3" />
            <div className="space-y-2">
              <SkeletonBar width="w-full" height="h-4" />
              <SkeletonBar width="w-full" height="h-4" />
              <SkeletonBar width="w-3/4" height="h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
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
