'use client';

import { Skeleton, SkeletonCircle, SkeletonBar } from './Skeleton';

/**
 * Header skeleton component
 * Mimics the AI Assistance page header with icon, title, and buttons
 */
export function SkeletonHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-pulse">
      {/* Left section - Icon and text */}
      <div className="light-box px-6 py-4 border shadow-sm flex items-center gap-4 w-full md:w-auto">
        <SkeletonCircle size="w-16 h-16" />
        <div className="flex-1 space-y-3">
          <SkeletonBar width="w-48" height="h-6" />
          <SkeletonBar width="w-40" height="h-3" />
        </div>
      </div>

      {/* Right section - Buttons */}
      <div className="flex gap-3 w-full md:w-auto">
        <div className="flex-1 md:flex-none px-5 py-3 rounded-xl light-box border">
          <SkeletonBar width="w-24" height="h-6" />
        </div>
        <div className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-green-600/20">
          <SkeletonBar width="w-24" height="h-6" />
        </div>
      </div>
    </div>
  );
}

/**
 * Single message skeleton (alternating left-right for user/AI)
 */
export function SkeletonMessage({ isUser = false }) {
  return (
    <div
      className={`flex gap-3 mb-4 animate-pulse ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && <SkeletonCircle size="w-8 h-8" />}
      <div
        className={`
          space-y-2 flex-1 max-w-xs
          ${
            isUser
              ? 'items-end'
              : 'items-start'
          }
        `}
      >
        <div
          className={`
            rounded-lg p-3
            ${
              isUser
                ? 'bg-green-600/20 ml-auto'
                : 'bg-gray-200 dark:bg-gray-700 mr-auto'
            }
            w-full
          `}
        >
          <SkeletonBar height="h-4" className="mb-2" />
          <SkeletonBar width="w-3/4" height="h-4" />
        </div>
      </div>
      {isUser && <SkeletonCircle size="w-8 h-8" />}
    </div>
  );
}

/**
 * Chat messages area skeleton (multiple messages)
 */
export function SkeletonChatMessages({ count = 3 }) {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
      {[...Array(count)].map((_, idx) => (
        <SkeletonMessage key={idx} isUser={idx % 2 === 0} />
      ))}
    </div>
  );
}

/**
 * Input box skeleton
 */
export function SkeletonInput() {
  return (
    <div className="flex gap-2 animate-pulse">
      <div className="flex-1 px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center">
        <SkeletonBar width="w-20" height="h-4" />
      </div>
      <div className="px-4 py-3 rounded-lg bg-green-600/20 w-12">
        <SkeletonBar width="w-6" height="h-6" />
      </div>
    </div>
  );
}

/**
 * Chat box skeleton (complete chat interface)
 */
export function SkeletonChatBox() {
  return (
    <div className="light-box p-4 md:p-6 flex flex-col h-[125vh] md:h-[90vh] border shadow-xl overflow-hidden relative animate-pulse">
      {/* Chat header/title */}
      <div className="border-b pb-4 mb-4">
        <SkeletonBar width="w-32" height="h-5" className="mb-2" />
        <SkeletonBar width="w-24" height="h-3" />
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {[...Array(3)].map((_, idx) => (
          <SkeletonMessage key={idx} isUser={idx % 2 === 0} />
        ))}
      </div>

      {/* Input area */}
      <div className="border-t pt-4">
        <SkeletonInput />
      </div>
    </div>
  );
}

/**
 * Sidebar/history skeleton (if applicable)
 */
export function SkeletonSidebar() {
  return (
    <div className="light-box p-4 border shadow-xl rounded-lg animate-pulse">
      <SkeletonBar width="w-24" height="h-5" className="mb-4" />

      {/* Chat history items */}
      <div className="space-y-3">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <SkeletonBar width="w-28" height="h-4" />
            <SkeletonBar width="w-16" height="h-3" className="mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
