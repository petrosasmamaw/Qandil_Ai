'use client';

import { useSelector } from 'react-redux';
import { translations } from '@/utils/translations';
import { useState, useEffect } from 'react';

export const useTranslation = () => {
  const reduxLanguage = useSelector((state) => state.language?.language || 'eng');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const language = mounted ? reduxLanguage : 'eng';
  
  const t = (key) => {
    const keys = key.split('.');
    let translation = translations[language];
    
    for (const k of keys) {
      translation = translation?.[k];
    }
    
    return translation || key;
  };

  return { t, language };
};
