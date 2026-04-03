"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/authClient";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const queryToken = searchParams.get("token");
    const queryError = searchParams.get("error");

    if (queryError) {
      setError("Invalid or expired reset link. Please request a new password reset.");
    } else if (!queryToken) {
      setError("No reset token found. Please click the link from your reset email.");
    } else {
      setToken(queryToken);
    }
  }, [searchParams]);

  useEffect(() => {
    let strength = 0;
    if (newPassword.length >= 8) strength++;
    if (newPassword.length >= 12) strength++;
    if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) strength++;
    if (/\d/.test(newPassword)) strength++;
    if (/[!@#$%^&*]/.test(newPassword)) strength++;
    setPasswordStrength(strength);
  }, [newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!token) {
      setError("Invalid reset token. Please request a new password reset.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: resetError } = await authClient.resetPassword({
        newPassword: newPassword,
        token: token,
      });

      if (resetError) {
        setError(
          resetError.message ||
            "Failed to reset password. The link may have expired. Please request a new one."
        );
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (err) {
      setError(
        err?.message ||
          "Failed to reset password. Please try again or request a new reset link."
      );
      console.error("Password reset error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-300";
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "No password";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Fair";
    return "Strong";
  };

  return (
    <>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
          backgroundSize: "400% 400%",
          animation: "gradient 15s ease infinite",
        }}
      >
        {/* Decorative floating elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="w-full max-w-md p-8 rounded-xl bg-transparent backdrop-blur-md border border-white/10 dark:border-slate-800/40 shadow-sm relative z-10">
          <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">
            Reset Password
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Enter your new password below
          </p>

          {success && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-700 dark:text-green-300 font-medium flex items-center gap-2">
                ✅ Password reset successfully!
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Redirecting to login...
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 font-medium">Error</p>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {!error && token && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  New Password
                </span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        Password strength:
                      </span>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getPasswordStrengthColor()} transition-all`}
                        style={{
                          width: `${(passwordStrength / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  At least 8 characters
                </p>
              </label>

              <label className="block">
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Confirm Password
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter password"
                  className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
              </label>

              {newPassword !== confirmPassword && confirmPassword && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  ⚠️ Passwords do not match
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white font-medium transition-colors mt-6"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-4">
                Remember your password?{" "}
                <a
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Back to login
                </a>
              </p>
            </form>
          )}

          {error && (
            <div className="mt-4 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Need help?
              </p>
              <a
                href="/auth/login"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Return to login
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
