'use client';

import { Skeleton, SkeletonCircle, SkeletonBar } from './Skeleton';

/**
 * Dashboard page specific skeleton components
 */

// Stat card skeleton (for the 4-column grid)
export function SkeletonStatCard() {
  return (
    <div className="light-box p-6 rounded-2xl border animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <SkeletonCircle size="w-6 h-6" />
      </div>
      <SkeletonBar width="w-24" height="h-4" className="mb-2" />
      <SkeletonBar width="w-16" height="h-9" className="mb-2" />
      <SkeletonBar width="w-32" height="h-3" />
    </div>
  );
}

// Stats grid skeleton (4 columns)
export function SkeletonStatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-pulse">
      {[...Array(4)].map((_, idx) => (
        <SkeletonStatCard key={idx} />
      ))}
    </div>
  );
}

// Chart placeholder skeleton
export function SkeletonChart() {
  return (
    <div className="light-box p-6 rounded-2xl border animate-pulse">
      <SkeletonBar width="w-48" height="h-6" className="mb-6" />
      <div className="h-80 space-y-3">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <SkeletonBar width="w-full" height="h-32" className="mb-2" />
            <SkeletonBar width="w-20" height="h-3" className="mx-auto" />
          </div>
          <div className="flex-1">
            <SkeletonBar width="w-full" height="h-40" className="mb-2" />
            <SkeletonBar width="w-20" height="h-3" className="mx-auto" />
          </div>
          <div className="flex-1">
            <SkeletonBar width="w-full" height="h-28" className="mb-2" />
            <SkeletonBar width="w-20" height="h-3" className="mx-auto" />
          </div>
          <div className="flex-1">
            <SkeletonBar width="w-full" height="h-36" className="mb-2" />
            <SkeletonBar width="w-20" height="h-3" className="mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile card skeleton
export function SkeletonProfileCard() {
  return (
    <div className="light-box p-6 rounded-2xl border animate-pulse">
      <div className="flex justify-center mb-6">
        <SkeletonCircle size="w-24 h-24" />
      </div>
      <div className="text-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
        <SkeletonBar width="w-32" height="h-5" className="mx-auto mb-2" />
        <SkeletonBar width="w-24" height="h-3" className="mx-auto" />
      </div>

      <div className="space-y-3">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <SkeletonBar width="w-20" height="h-3" />
            <SkeletonBar width="w-16" height="h-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Quick stats card skeleton
export function SkeletonQuickStats() {
  return (
    <div className="light-box bg-gradient-to-br from-green-500/10 to-green-600/10 dark:from-green-500/5 dark:to-green-600/5 rounded-2xl border border-green-200/50 dark:border-green-800/30 p-6 animate-pulse">
      <SkeletonBar width="w-32" height="h-4" className="mb-2 opacity-90" />
      <SkeletonBar width="w-16" height="h-9" className="mb-4" />
      <SkeletonBar width="w-48" height="h-3" />
    </div>
  );
}

// Table row skeleton
export function SkeletonTableRow() {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-700 animate-pulse">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <SkeletonCircle size="w-3 h-3" />
          <SkeletonBar width="w-32" height="h-4" />
        </div>
      </td>
      <td className="py-4 px-4">
        <SkeletonBar width="w-12" height="h-4" />
      </td>
      <td className="py-4 px-4">
        <SkeletonBar width="w-12" height="h-4" />
      </td>
      <td className="py-4 px-4">
        <SkeletonBar width="w-16" height="h-6" className="rounded-full" />
      </td>
    </tr>
  );
}

// Table skeleton
export function SkeletonTable() {
  return (
    <div className="light-box p-6 rounded-2xl border animate-pulse">
      <SkeletonBar width="w-48" height="h-6" className="mb-6" />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 dark:border-gray-700">
            <tr>
              {[...Array(4)].map((_, idx) => (
                <th key={idx} className="text-left py-4 px-4">
                  <SkeletonBar width="w-20" height="h-3" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(4)].map((_, idx) => (
              <SkeletonTableRow key={idx} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Complete Dashboard page skeleton loader
 */
export function DashboardSkeletonLoader({ isDark = false }) {
  const backgroundStyle = {
    '--light-bg-image': "url('https://cdn.vectorstock.com/i/500p/87/24/pastel-pink-and-blue-blur-backdrop-vector-63408724.jpg')",
  };

  return (
    <main 
      className="light-image-bg min-h-screen transition-colors duration-300 relative z-0"
      style={backgroundStyle}
    >
      {/* DARK MODE BACKGROUND */}
      {isDark && (
        <div 
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAxL3Jhd3BpeGVsX29mZmljZV8zNF9taW5pbWFsX2Fic3RyYWN0X2JsdWVfYW5kX3B1cnBsZV9uZW9uX3dhdXlfZ282ZWQyZmJmMS05ZWMzLTQxNmItOWY4My0yZmJmNThjOWUyMjc1XzEuanBn.jpg')`,
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
        <div className="mb-12 animate-pulse">
          <SkeletonBar width="w-96" height="h-12" className="mb-3" />
          <SkeletonBar width="w-80" height="h-4" />
        </div>

        {/* Stats Grid */}
        <SkeletonStatsGrid />

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Left Column - Chart */}
          <div className="lg:col-span-2">
            <SkeletonChart />
          </div>

          {/* Right Column - Profile & Stats */}
          <div className="space-y-6">
            <SkeletonProfileCard />
            <SkeletonQuickStats />
          </div>
        </div>

        {/* Table Section */}
        <SkeletonTable />
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
