'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOutAction } from '@/app/actions/auth-actions';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/authClient';

export const Navbar = () => {
  const pathname = usePathname();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await authClient.getSession();
        setSession(data);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getSession();
    
    // Poll for session updates every 5 seconds
    const interval = setInterval(getSession, 5000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (href) => {
    return pathname === href;
  };

  // Navigation items with icons
  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      href: '/ai-assistance',
      label: 'AI Assistance',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.343a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM15.657 14.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM11 17a1 1 0 102 0v-1a1 1 0 10-2 0v1zM5.343 15.657a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM5.343 4.343a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM10 13a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      ),
    },
    {
      href: '/notes',
      label: 'Notes',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 012-2h6a2 2 0 012 2v12a1 1 0 110 2h-2.343l-2.828-2.828A1 1 0 0010 14H8V9a1 1 0 000 2h2V4z" />
        </svg>
      ),
    },
    {
      href: '/assignment-guide',
      label: 'Assignment',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a1 1 0 100-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2 1 1 0 000 2h1a1 1 0 100-2h-1a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a1 1 0 10-2 0v10a1 1 0 11-2 0V5a1 1 0 10-2 0v10a1 1 0 11-2 0V5z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      href: '/image-analyzer',
      label: 'Image',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
        </svg>
      ),
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="sticky top-0 z-50">
      {/* Glassmorphic navbar background */}
      <div className="absolute inset-0 bg-gray-400/40 dark:bg-gray-800/40 backdrop-blur-md border-b border-white/30 dark:border-gray-700/30 rounded-bl-2xl rounded-br-2xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with Animation */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer focus:outline-none">
              <div className="logo-animate p-2 bg-white/70 dark:bg-gray-800/70 rounded-full border border-gray-300/50 dark:border-gray-600/50 shadow-md">
                <Image
                  src="/qandil-logo.png"
                  alt="Qandil AI Logo"
                  width={40}
                  height={40}
                  className="transition-transform duration-300 group-hover:scale-110 w-10 h-10"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-200 bg-clip-text text-transparent transition-all duration-300 group-hover:from-gray-800 group-hover:to-gray-600">
                Qandil AI
              </span>
            </Link>
          </div>

          {/* Center Navigation - Glassmorphic Pills */}
          {!loading && session?.user && (
            <div className="hidden md:flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-full px-2 py-2 border border-white/30 dark:border-gray-700/30 shadow-lg">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ${
                    isActive(item.href)
                      ? 'bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white shadow-lg scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-600/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Auth Buttons Section */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="text-sm text-gray-600">Loading...</div>
            ) : session?.user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:block px-4 py-2">
                  <p className="text-sm font-medium bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                    {session.user.name || session.user.email}
                  </p>
                </div>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full text-sm font-medium text-red-600 dark:text-red-400 bg-white/50 dark:bg-gray-800/50 border-2 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-400 dark:hover:border-red-500 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-6 py-2 rounded-full text-sm font-medium text-gray-900 dark:text-gray-100 bg-white/60 dark:bg-gray-700/60 hover:bg-white dark:hover:bg-gray-600 border border-gray-300/50 dark:border-gray-500/50 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-6 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-300 dark:to-gray-400 hover:from-gray-900 hover:to-black dark:hover:from-gray-200 dark:hover:to-gray-300 text-white dark:text-gray-900 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Sign Up
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
