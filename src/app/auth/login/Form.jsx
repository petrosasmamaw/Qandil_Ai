"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FiCpu, FiCheck } from "react-icons/fi";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [error, setError] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const email = form.get('email');
    const password = form.get('password');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      // Redirect to home
      window.location.href = "/";
    } catch (err) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setSocialLoading("github");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        setError(error.message);
        setSocialLoading(null);
      }
    } catch (err) {
      setError(err?.message || "GitHub login failed");
      setSocialLoading(null);
    }
  };

  const handleGoogleLogin = async () => {
    setSocialLoading("google");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        setError(error.message);
        setSocialLoading(null);
      }
    } catch (err) {
      setError(err?.message || "Google login failed");
      setSocialLoading(null);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 shadow-2xl border border-slate-800">
      <div className="mb-6">
        <div className="text-4xl mb-3 text-blue-400"><FiCpu size={40} /></div>
        <h2 className="text-xl font-bold text-white mb-1">Welcome back to <span className="text-blue-400">Qandil!</span></h2>
        <p className="text-slate-400 text-sm">Sign in to continue your learning journey</p>
      </div>

      {error && <p className="text-red-400 mb-4 text-sm bg-red-900/20 p-3 rounded-lg border border-red-800">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input 
            name="email" 
            type="email" 
            required 
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
          />
        </div>
        <div>
          <input 
            name="password" 
            type="password" 
            required 
            placeholder="Enter your password"
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-400">
            <input type="checkbox" className="rounded bg-slate-800 border-slate-700" />
            Remember me
          </label>
          <button 
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Forgot password?
          </button>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold transition-all"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-700" />
        <div className="text-sm text-slate-400">Or continue with</div>
        <div className="flex-1 h-px bg-slate-700" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button 
          onClick={handleGoogleLogin}
          disabled={socialLoading !== null}
          className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
        >
          <FcGoogle size={20} /> {socialLoading === "google" ? "..." : "Google"}
        </button>
        <button 
          onClick={handleGitHubLogin}
          disabled={socialLoading !== null}
          className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
        >
          <FaGithub size={20} /> {socialLoading === "github" ? "..." : "GitHub"}
        </button>
      </div>

      <div className="mt-6 text-center text-sm text-slate-400">
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 font-medium">
          Sign up
        </Link>
      </div>

      <div className="mt-4 text-center text-xs text-slate-500">
        <Link href="#" className="hover:text-slate-400">Terms of Service</Link> · <Link href="#" className="hover:text-slate-400">Privacy Policy</Link>
      </div>

      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}
