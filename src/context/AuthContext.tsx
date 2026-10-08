import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AuthState, AppLanguage, AppTheme } from '../types/user';

interface AuthContextType extends AuthState {
  login: (email: string) => Promise<boolean>;
  register: (data: { displayName: string; username: string; email: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  switchDemoUser: (persona: 'alexey' | 'elena' | 'dmitry') => void;
}

const DEFAULT_USERS: Record<string, UserProfile> = {
  alexey: {
    id: 'user_alexey',
    displayName: 'Alexey',
    username: 'alexey',
    email: 'alexey@nest.family',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80',
    gender: 'boy',
    theme: 'light',
    language: 'ru',
    notifications: {
      newTask: true,
      comment: true,
      invite: true,
      overdueTask: true,
      deadlineSoon: true,
    },
    privacy: {
      showActivity: true,
      allowDirectInvites: true,
    },
    createdAt: '2026-09-01T08:00:00Z',
  },
  elena: {
    id: 'user_elena',
    displayName: 'Elena',
    username: 'elena',
    email: 'elena@nest.family',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80',
    gender: 'girl',
    theme: 'light',
    language: 'ru',
    notifications: {
      newTask: true,
      comment: true,
      invite: true,
      overdueTask: true,
      deadlineSoon: true,
    },
    privacy: {
      showActivity: true,
      allowDirectInvites: true,
    },
    createdAt: '2026-08-15T10:00:00Z',
  },
  dmitry: {
    id: 'user_dmitry',
    displayName: 'Dmitry',
    username: 'dmitry',
    email: 'dmitry@nest.family',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    gender: 'boy',
    theme: 'light',
    language: 'ru',
    notifications: {
      newTask: true,
      comment: true,
      invite: true,
      overdueTask: true,
      deadlineSoon: true,
    },
    privacy: {
      showActivity: true,
      allowDirectInvites: true,
    },
    createdAt: '2026-08-20T12:00:00Z',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nest_active_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_USERS.alexey;
      }
    }
    return DEFAULT_USERS.alexey; // Default active demo user is Alexey
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('nest_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nest_active_user');
    }
  }, [user]);

  const login = async (email: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    const normalized = email.toLowerCase().trim();
    if (normalized.includes('elena')) {
      setUser(DEFAULT_USERS.elena);
    } else if (normalized.includes('dmitry')) {
      setUser(DEFAULT_USERS.dmitry);
    } else {
      // Create user or use Alexey
      const found = Object.values(DEFAULT_USERS).find((u) => u.email.toLowerCase() === normalized);
      if (found) {
        setUser(found);
      } else {
        const newUser: UserProfile = {
          id: `user_${Date.now()}`,
          displayName: email.split('@')[0],
          username: email.split('@')[0].toLowerCase(),
          email,
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          theme: 'light',
          language: 'ru',
          notifications: { newTask: true, comment: true, invite: true, overdueTask: true, deadlineSoon: true },
          privacy: { showActivity: true, allowDirectInvites: true },
          createdAt: new Date().toISOString(),
        };
        setUser(newUser);
      }
    }
    setIsLoading(false);
    return true;
  };

  const register = async (data: { displayName: string; username: string; email: string }) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      displayName: data.displayName,
      username: data.username.replace('@', ''),
      email: data.email,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      theme: 'light',
      language: (localStorage.getItem('nest_language') as AppLanguage) || 'ru',
      notifications: { newTask: true, comment: true, invite: true, overdueTask: true, deadlineSoon: true },
      privacy: { showActivity: true, allowDirectInvites: true },
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
  };

  const switchDemoUser = (persona: 'alexey' | 'elena' | 'dmitry') => {
    setUser(DEFAULT_USERS[persona]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
