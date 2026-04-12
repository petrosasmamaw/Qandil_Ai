'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function DashboardStatCard({ 
  title, 
  count, 
  subtitle, 
  icon, 
  color = 'blue',
  trend 
}) {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const colorSchemes = {
    blue: 'from-blue-500/20 to-blue-600/20 dark:from-blue-500/10 dark:to-blue-600/10 border-blue-400/30 dark:border-blue-500/20',
    green: 'from-green-500/20 to-green-600/20 dark:from-green-500/10 dark:to-green-600/10 border-green-400/30 dark:border-green-500/20',
    purple: 'from-purple-500/20 to-purple-600/20 dark:from-purple-500/10 dark:to-purple-600/10 border-purple-400/30 dark:border-purple-500/20',
    orange: 'from-orange-500/20 to-orange-600/20 dark:from-orange-500/10 dark:to-orange-600/10 border-orange-400/30 dark:border-orange-500/20',
    pink: 'from-pink-500/20 to-pink-600/20 dark:from-pink-500/10 dark:to-pink-600/10 border-pink-400/30 dark:border-pink-500/20',
  };

  const iconBgSchemes = {
    blue: 'bg-blue-500/30 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-500/30 dark:bg-green-500/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-500/30 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-500/30 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400',
    pink: 'bg-pink-500/30 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400',
  };

  if (!mounted) return null;

  return (
    <div className={`bg-gradient-to-br ${colorSchemes[color]} backdrop-blur-lg border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1`}>
      {/* Icon */}
      <div className={`w-14 h-14 rounded-lg ${iconBgSchemes[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>

      {/* Title and Count */}
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
          {title}
        </p>
        <p className="text-4xl font-bold text-gray-900 dark:text-white">
          {count}
        </p>
      </div>

      {/* Subtitle and Trend */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {subtitle}
        </span>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${
            trend.positive 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {trend.positive ? (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 5a1 1 0 011 1v5.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L11 11.586V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 15a1 1 0 01-1-1v-5.586l-1.293 1.293a1 1 0 11-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 11-1.414 1.414L13 8.414V14a1 1 0 01-1 1z" clipRule="evenodd" />
              </svg>
            )}
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}
