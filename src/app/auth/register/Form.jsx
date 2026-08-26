"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import { FiCpu, FiUser, FiMail, FiLock } from "react-icons/fi";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const name = form.get("name")?.toString().trim();
    const email = form.get("email")?.toString().trim();
    const password = form.get("password")?.toString();

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await auth.register({
        name,
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Automatically logged in and redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 shadow-2xl border border-slate-800">
      <div className="mb-6 text-center">
        <div className="inline-flex p-3 rounded-xl bg-blue-500/10 text-blue-400 mb-3">
          <FiCpu size={36} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">
          Join <span className="text-blue-400">Qandil AI</span>
        </h2>
        <p className="text-slate-400 text-sm">Create your personalized student account</p>
      </div>

      {error && (
        <p className="text-red-400 mb-4 text-sm bg-red-900/20 p-3 rounded-lg border border-red-800">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <FiUser size={18} />
            </div>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Abebe Bikila"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <FiMail size={18} />
            </div>
            <input
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Password (min 6 characters)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <FiLock size={18} />
            </div>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm text-slate-300 pt-1 cursor-pointer">
          <input
            type="checkbox"
            required
            className="rounded w-4 h-4 bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500"
          />
          <span>
            I agree to the{" "}
            <Link href="#" className="text-blue-400 hover:text-blue-300">
              Terms & Conditions
            </Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold transition-all shadow-lg shadow-blue-500/20"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
          Sign in
        </Link>
      </div>

      <div className="mt-4 text-center text-xs text-slate-500">
        <Link href="#" className="hover:text-slate-400">Terms of Service</Link> · <Link href="#" className="hover:text-slate-400">Privacy Policy</Link>
      </div>
    </div>
  );
}
