'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '@/store/slices/themeSlice';
import { toggleLanguage } from '@/store/slices/languageSlice';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/lib/supabase';

export const Navbar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const { t, language } = useTranslation();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isActive = (href) => {
    return pathname === href;
  };

  // Navigation items with icons
  const navItems = [
    {
      href: '/',
      labelKey: 'navbar.home',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      href: '/dashboard',
      labelKey: 'navbar.dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
    },
    {
      href: '/ai-assistance',
      labelKey: 'navbar.aiAssistance',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.343a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM15.657 14.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM11 17a1 1 0 102 0v-1a1 1 0 10-2 0v1zM5.343 15.657a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM5.343 4.343a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM10 13a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      ),
    },
    {
      href: '/notes',
      labelKey: 'navbar.notes',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 012-2h6a2 2 0 012 2v12a1 1 0 110 2h-2.343l-2.828-2.828A1 1 0 0010 14H8V9a1 1 0 000 2h2V4z" />
        </svg>
      ),
    },
    {
      href: '/assignment-guide',
      labelKey: 'navbar.assignment',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a1 1 0 100-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2 1 1 0 000 2h1a1 1 0 100-2h-1a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a1 1 0 10-2 0v10a1 1 0 11-2 0V5a1 1 0 10-2 0v10a1 1 0 11-2 0V5z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      href: '/image-analyzer',
      labelKey: 'navbar.image',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
        </svg>
      ),
    },
    {
      href: '/profile',
      labelKey: 'navbar.profile',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="sticky top-0 z-50">
      {/* Glassmorphic navbar background - amazing light theme */}
      <div className="absolute inset-0 bg-white/20 dark:bg-gray-800/40 backdrop-blur-md border-b border-white/30 dark:border-gray-700/30 rounded-bl-xl rounded-br-xl shadow-sm"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with Animation */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer focus:outline-none">
              <div className="logo-animate p-1.5 bg-white/85 dark:bg-gray-800/70 rounded-full border border-gray-200/70 dark:border-gray-600/50 shadow-md">
                <Image
                  src="/qandil-logo.png"
                  alt="Qandil AI Logo"
                  width={34}
                  height={34}
                  loading="eager"
                  className="transition-transform duration-300 group-hover:scale-110 w-8 h-8"
                />
              </div>
              <span 
                className="text-xl font-bold transition-all duration-300"
                style={mounted ? (theme === 'light' ? { color: 'black', textShadow: 'none', background: 'none', WebkitTextFillColor: 'black' } : { color: 'white', textShadow: 'none', background: 'none' }) : { color: 'black', textShadow: 'none', background: 'none', WebkitTextFillColor: 'black' }}
                suppressHydrationWarning
              >
                Qandil AI
              </span>
            </Link>
          </div>

          {/* Center Navigation - Glassmorphic Pills */}
          {!loading && session?.user && (
            <div className="hidden md:flex items-center gap-1.5 bg-gray-900/10 dark:bg-gray-800/50 backdrop-blur-md rounded-full px-1.5 py-1.5 border border-gray-900/10 dark:border-gray-700/30 shadow-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ${
                    isActive(item.href)
                      ? 'bg-gray-900/80 dark:bg-gray-700/80 text-white dark:text-white shadow-md scale-105'
                      : 'text-gray-900 dark:text-gray-300 hover:text-black dark:hover:text-gray-100 hover:bg-gray-900/20 dark:hover:bg-gray-600/50'
                  }`}
                >
                  {item.icon}
                  <span>{t(item.labelKey)}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Auth Buttons Section */}
          <div className="flex items-center gap-3 text-black">
            {/* Language Toggle Button */}
            {mounted && session?.user && (
              <button
                onClick={() => dispatch(toggleLanguage())}
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-900/10 dark:bg-gray-800/50 border border-gray-900/20 dark:border-blue-600/50 text-gray-900 dark:text-blue-100 hover:bg-gray-900/20 dark:hover:bg-blue-950/20 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                title="Toggle language"
              >
                {language === 'eng' ? '🇺🇸 ENG' : '🇪🇹 AMH'}
              </button>
            )}

            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2.5 rounded-full text-sm font-medium bg-gray-900/10 dark:bg-gray-800/50 border border-gray-900/20 dark:border-gray-600/50 text-gray-900 dark:text-gray-100 hover:bg-gray-900/20 dark:hover:bg-gray-700/70 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                suppressHydrationWarning
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-10.121l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.464 5.464a1 1 0 00-1.414-1.414l-.707.707A1 1 0 004.757 6.17l.707-.707zm1.414 8.828a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )}

            {/* Sign Out Button - Right Side */}
            {!loading && session?.user && (
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = '/auth/login';
                }}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-gray-800/50 border-2 border-red-300 dark:border-red-600 hover:bg-red-100 dark:hover:bg-red-950/20 hover:border-red-500 dark:hover:border-red-500 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
              >
                {t('navbar.signOut')}
              </button>
            )}

            {loading ? (
              <div className="text-sm dark:text-gray-400" style={{ color: mounted && theme === 'light' ? 'black' : undefined }} suppressHydrationWarning>Loading...</div>
            ) : session?.user ? (
              <div className="flex items-center gap-3">
                {/* Sign In/Sign Up - shown when not logged in */}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
                  style={mounted ? (theme === 'light' 
                    ? { color: 'black', backgroundColor: '#f3f4f6', border: '1px solid #9ca3af' }
                    : { color: 'white', backgroundColor: 'rgba(55,65,81,0.6)', border: '1px solid rgba(107,114,128,0.5)' }
                  ) : { color: 'black', backgroundColor: '#f3f4f6', border: '1px solid #9ca3af' }}
                  suppressHydrationWarning
                >
                  {t('navbar.signIn')}
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
                  style={mounted ? (theme === 'light'
                    ? { color: 'white', backgroundColor: 'black', border: '1px solid black' }
                    : { color: '#111827', backgroundImage: 'linear-gradient(to right, #d1d5db, #9ca3af)', border: 'none' }
                  ) : { color: 'white', backgroundColor: 'black', border: '1px solid black' }}
                  suppressHydrationWarning
                >
                  {t('navbar.signUp')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none transition-colors hover:bg-white/50 dark:hover:bg-gray-800/50">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
