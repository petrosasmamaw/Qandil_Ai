'use client';

import { auth } from './auth';

export { auth };

// Seamless bridge for backward compatibility with components importing supabase
export const supabase = {
  auth: {
    getSession: () => auth.getSession(),
    signInWithPassword: ({ email, password }) => auth.login({ email, password }),
    signUp: ({ email, password, options }) => {
      const name = options?.data?.name || options?.data?.full_name || email.split('@')[0];
      return auth.register({ name, email, password });
    },
    signOut: () => auth.signOut(),
    onAuthStateChange: (callback) => auth.onAuthStateChange(callback),
    resetPasswordForEmail: async (email) => {
      return { data: {}, error: null };
    },
    updateUser: async (attributes) => {
      return { data: { user: auth.getUser() }, error: null };
    },
    signInWithOAuth: async () => {
      return { data: null, error: { message: 'OAuth is disabled. Please use email and password.' } };
    },
  },
};

export const getSupabaseClient = () => supabase;
export default supabase;