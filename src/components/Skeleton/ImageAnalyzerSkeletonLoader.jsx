'use client';

import { Skeleton, SkeletonCircle, SkeletonBar } from './Skeleton';

/**
 * Image Analyzer page specific skeleton components
 */

// Profile card skeleton
export function SkeletonProfileCard() {
  return (
    <div className="light-box p-4 border text-center animate-pulse">
      <SkeletonBar width="w-16" height="h-3" className="mx-auto mb-2" />
      <SkeletonBar width="w-20" height="h-4" className="mx-auto" />
    </div>
  );
}

// Profile status bar skeleton (4 columns)
export function SkeletonProfileBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, idx) => (
        <SkeletonProfileCard key={idx} />
      ))}
    </div>
  );
}

// Image uploader area skeleton
export function SkeletonImageUploader() {
  return (
    <div className="w-full max-w-4xl mx-auto animate-pulse">
      <div className="border-2 border-dashed rounded-3xl p-16 text-center light-box border-black/10 dark:border-white/10">
        <div className="flex flex-col items-center">
          {/* Upload icon */}
          <div className="mb-6 p-6 rounded-full bg-blue-600/10">
            <SkeletonBar width="w-12" height="h-12" className="rounded-full" />
          </div>
          
          {/* Title */}
          <SkeletonBar width="w-48" height="h-6" className="mb-3" />
          
          {/* Description */}
          <SkeletonBar width="w-56" height="h-4" className="mb-8" />
          
          {/* Progress bar indicator */}
          <div className="w-48 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Image analysis result skeleton
export function SkeletonAnalysisResult() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="light-box p-8 border shadow-lg space-y-6 animate-pulse">
        {/* Image thumbnail skeleton */}
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBar width="w-32" height="h-4" />
            <SkeletonBar width="w-48" height="h-3" />
          </div>
        </div>

        {/* Analysis content lines */}
        <div className="space-y-3">
          <SkeletonBar width="w-40" height="h-5" />
          <div className="space-y-2">
            <SkeletonBar width="w-full" height="h-4" />
            <SkeletonBar width="w-full" height="h-4" />
            <SkeletonBar width="w-3/4" height="h-4" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <SkeletonBar width="w-24" height="h-10" className="rounded-lg" />
          <SkeletonBar width="w-24" height="h-10" className="rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * Complete Image Analyzer page skeleton loader
 */
export function ImageAnalyzerSkeletonLoader({ isDark = false }) {
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
            filter: 'blur(8px)',
            transform: 'scale(1.05)',
          }}
        />
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10 animate-pulse">
          <div className="light-box px-6 py-4 border shadow-sm flex items-center gap-4 w-full md:w-auto">
            <SkeletonCircle size="w-16 h-16" />
            <div className="flex-1 space-y-2">
              <SkeletonBar width="w-40" height="h-6" />
              <SkeletonBar width="w-48" height="h-3" />
            </div>
          </div>
          <div className="hidden md:flex gap-3">
            <SkeletonBar width="w-24" height="h-10" className="rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* PROFILE STATUS BAR */}
          <SkeletonProfileBar />

          {/* UPLOADER AREA */}
          <SkeletonImageUploader />
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
