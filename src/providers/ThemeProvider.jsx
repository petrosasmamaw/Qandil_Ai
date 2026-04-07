'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '@/store/slices/themeSlice';

export function ThemeProvider({ children }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme') || 'light';
    dispatch(setTheme(savedTheme));
    applyTheme(savedTheme);
  }, [dispatch]);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
  }, [theme, mounted]);

  const applyTheme = (themeMode) => {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    if (themeMode === 'dark') {
      // Add dark class to html
      htmlElement.classList.add('dark');
      htmlElement.style.colorScheme = 'dark';
      
      // Apply dark mode styles to body and all elements
      bodyElement.style.backgroundColor = '#0a0a0a';
      bodyElement.style.color = '#ededed';
      bodyElement.classList.add('dark-mode');
      
      // Apply to entire document
      document.documentElement.style.setProperty('--background', '#0a0a0a', 'important');
      document.documentElement.style.setProperty('--foreground', '#ededed', 'important');
      
      // Dispatch custom event for components to listen
      window.dispatchEvent(new Event('themechange'));
    } else {
      // Remove dark class from html
      htmlElement.classList.remove('dark');
      htmlElement.style.colorScheme = 'light';
      
      // Apply light mode styles
      bodyElement.style.backgroundColor = '#ffffff';
      bodyElement.style.color = '#171717';
      bodyElement.classList.remove('dark-mode');
      
      // Apply to entire document
      document.documentElement.style.setProperty('--background', '#ffffff', 'important');
      document.documentElement.style.setProperty('--foreground', '#171717', 'important');
      
      // Dispatch custom event for components to listen
      window.dispatchEvent(new Event('themechange'));
    }
  };

  if (!mounted) {
    return children;
  }

  return children;
}
