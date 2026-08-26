import { getApiBaseUrl } from '../utils/apiUrl';

const TOKEN_KEY = 'qandil_auth_token';
const USER_KEY = 'qandil_auth_user';

const getBackendUrl = () => getApiBaseUrl();


class AuthClient {
  constructor() {
    this.listeners = new Set();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === TOKEN_KEY || event.key === USER_KEY) {
          const session = this.getSessionSync();
          const eventType = session ? 'SIGNED_IN' : 'SIGNED_OUT';
          this.notify(eventType, session);
        }
      });
    }
  }

  notify(event, session) {
    this.listeners.forEach((callback) => {
      try {
        callback(event, session);
      } catch (err) {
        console.error('Auth listener callback error:', err);
      }
    });
  }

  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  getUser() {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  getSessionSync() {
    const token = this.getToken();
    const user = this.getUser();
    if (!token || !user) return null;
    return {
      access_token: token,
      token,
      user: {
        id: user.id || user._id,
        _id: user.id || user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        user_metadata: {
          name: user.name,
          full_name: user.name,
        },
      },
    };
  }

  async getSession() {
    const session = this.getSessionSync();
    return {
      data: {
        session,
      },
      error: null,
    };
  }

  async register({ name, email, password }) {
    try {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          data: null,
          error: { message: data.message || 'Registration failed' },
        };
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }

      const session = this.getSessionSync();
      this.notify('SIGNED_IN', session);

      return {
        data: { user: data.user, session },
        error: null,
      };
    } catch (err) {
      console.error('Auth register network error:', err);
      return {
        data: null,
        error: { message: err.message || 'Failed to connect to authentication server' },
      };
    }
  }

  async login({ email, password }) {
    try {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          data: null,
          error: { message: data.message || 'Invalid email or password' },
        };
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }

      const session = this.getSessionSync();
      this.notify('SIGNED_IN', session);

      return {
        data: { user: data.user, session },
        error: null,
      };
    } catch (err) {
      console.error('Auth login network error:', err);
      return {
        data: null,
        error: { message: err.message || 'Failed to connect to authentication server' },
      };
    }
  }

  async signOut() {
    try {
      const backendUrl = getBackendUrl();
      const token = this.getToken();
      if (token) {
        fetch(`${backendUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {});
      }
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
      this.notify('SIGNED_OUT', null);
      return { error: null };
    }
  }

  onAuthStateChange(callback) {
    this.listeners.add(callback);
    // Trigger immediately with current state
    const session = this.getSessionSync();
    if (session) {
      setTimeout(() => callback('SIGNED_IN', session), 0);
    }

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners.delete(callback);
          },
        },
      },
    };
  }

  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }
}

export const auth = new AuthClient();
export default auth;
