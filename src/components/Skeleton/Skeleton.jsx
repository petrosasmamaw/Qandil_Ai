'use client';

/**
 * Base Skeleton component with shimmer animation
 * Supports light/dark theme and customizable dimensions
 */
export function Skeleton({ className = '', width = 'w-full', height = 'h-4' }) {
  return (
    <div
      className={`
        ${width} ${height}
        bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
        dark:from-gray-700 dark:via-gray-600 dark:to-gray-700
        rounded-lg
        animate-pulse
        ${className}
      `}
    />
  );
}

/**
 * Skeleton with shimmer effect (subtle gradient animation)
 */
export function SkeletonShimmer({ className = '', width = 'w-full', height = 'h-4' }) {
  return (
    <div className={`relative overflow-hidden ${width} ${height} rounded-lg`}>
      <div
        className={`
          ${width} ${height}
          bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
          dark:from-gray-700 dark:via-gray-600 dark:to-gray-700
          ${className}
        `}
      />
      {/* Shimmer effect */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10 animate-shimmer"
        style={{
          animation: 'shimmer 2s infinite',
          backgroundSize: '1000px 100%',
        }}
      />
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Circular skeleton (for avatars, icons, etc.)
 */
export function SkeletonCircle({ className = '', size = 'w-12 h-12' }) {
  return (
    <div
      className={`
        ${size}
        rounded-full
        bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
        dark:from-gray-700 dark:via-gray-600 dark:to-gray-700
        animate-pulse
        ${className}
      `}
    />
  );
}

/**
 * Rectangular skeleton with optional rounded corners
 */
export function SkeletonBar({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4',
  rounded = 'rounded-lg'
}) {
  return (
    <div
      className={`
        ${width} ${height} ${rounded}
        bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
        dark:from-gray-700 dark:via-gray-600 dark:to-gray-700
        animate-pulse
        ${className}
      `}
    />
  );
}
