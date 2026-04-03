"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
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
    const body = Object.fromEntries(form.entries());
    try {
      const resp = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await resp.json().catch(() => null);
      if (!resp.ok || data?.error) {
        setError(data?.error?.message || data?.message || "Incorrect email or password");
        setLoading(false);
        return;
      }
    
      // Reload page to fetch session in navbar
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (err) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setSocialLoading("github");
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch (err) {
      setError(err?.message || "GitHub login failed");
      setSocialLoading(null);
    }
  };

  const handleGoogleLogin = async () => {
    setSocialLoading("google");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      setError(err?.message || "Google login failed");
      setSocialLoading(null);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-xl bg-transparent backdrop-blur-md border border-white/10 dark:border-slate-800/40 shadow-sm">
      <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Sign in with email</h1>
      {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-slate-700 dark:text-slate-300">Email</span>
          <input name="email" type="email" required className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-700 dark:text-slate-300">Password</span>
          <input name="password" type="password" required className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
        </label>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-slate-700 dark:text-slate-300">Remember me</span>
          </label>
          <button 
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Forgot password?
          </button>
        </div>
        <button type="submit" disabled={loading} className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium transition-colors">
          {loading ? 'Signing in...' : 'Get Started'}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        <div className="text-sm text-slate-500 dark:text-slate-400">Or continue with</div>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button 
          onClick={handleGoogleLogin}
          disabled={socialLoading !== null}
          className="w-full py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <FcGoogle size={20} /> {socialLoading === "google" ? "..." : "Google"}
        </button>
        <button 
          onClick={handleGitHubLogin}
          disabled={socialLoading !== null}
          className="w-full py-2.5 rounded-lg bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <FaGithub size={20} /> {socialLoading === "github" ? "..." : "GitHub"}
        </button>
      </div>

      <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
          Sign up
        </Link>
      </div>

      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}
