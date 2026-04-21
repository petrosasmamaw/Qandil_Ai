'use client';

import { useTranslation } from '@/hooks/useTranslation';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="text-center py-6 sm:py-8 border-t border-black/10 dark:border-white/10 text-xs sm:text-sm px-4 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm">
      © {new Date().getFullYear()} QandilAI. {t('home.empoweringStudents')}
    </footer>
  );
};
