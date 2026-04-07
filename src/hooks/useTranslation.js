'use client';

import { useSelector } from 'react-redux';
import { translations } from '@/utils/translations';

export const useTranslation = () => {
  const language = useSelector((state) => state.language?.language || 'eng');
  
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
