import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AuthState, AppLanguage, UserRole, StoredUserAccount } from '../types/user';
import { ROLE_AVATARS } from '../utils/avatars';

export interface AuthContextType extends AuthState {
  login: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    displayName: string;
    username: string;
    email: string;
    password?: string;
    role?: UserRole;
    homeName?: string;
    avatarUrl?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  loginByCode: (
    code: string,
    displayName?: string,
    role?: UserRole,
    password?: string
  ) => Promise<{ success: boolean; error?: string; homeName?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  getAllRegisteredUsers: () => StoredUserAccount[];
}

const USERS_DB_KEY = 'nest_users_db_v1';
const ACTIVE_USER_KEY = 'nest_active_user';

// Helper to access persistent user database
export const getUsersDb = (): StoredUserAccount[] => {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return [];
};

export const saveUsersDb = (users: StoredUserAccount[]) => {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch {
    // storage errors
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(ACTIVE_USER_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clean out legacy demo users so user experiences genuine flow
        if (
          parsed.id === 'user_creator' ||
          parsed.id === 'user_parent' ||
          parsed.id === 'user_member' ||
          parsed.email?.includes('@nest.family')
        ) {
          localStorage.removeItem(ACTIVE_USER_KEY);
          return null;
        }
        return parsed;
      } catch {
        return null;
      }
    }
    // Pure production behavior: initial visitor has NO logged in user!
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(ACTIVE_USER_KEY);
    }
  }, [user]);

  // Real Email / Username + Password Login
  const login = async (
    identifier: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 250));

    const clean = identifier.trim().toLowerCase().replace(/^@/, '');
    if (!clean) {
      setIsLoading(false);
      return { success: false, error: 'Введите адрес электронной почты или логин' };
    }

    const db = getUsersDb();
    const found = db.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        u.username.toLowerCase() === clean
    );

    if (!found) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Пользователь с такой почтой или логином не найден. Пожалуйста, создайте аккаунт.',
      };
    }

    // Check password if provided
    if (password && found.passwordHash && found.passwordHash !== password) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Неверный пароль. Пожалуйста, проверьте введённые данные.',
      };
    }

    // Set active user
    setUser(found);

    // If user has a registered home, select it
    try {
      const homesRaw = localStorage.getItem('nest_homes');
      if (homesRaw) {
        const homes = JSON.parse(homesRaw);
        const userHome = homes.find((h: any) =>
          h.members?.some((m: any) => m.userId === found.id) || h.ownerId === found.id
        );
        if (userHome) {
          localStorage.setItem('nest_current_home_id', userHome.id);
        }
      }
    } catch {}

    setIsLoading(false);
    return { success: true };
  };

  // Real Account Registration & Home Creation
  const register = async (data: {
    displayName: string;
    username: string;
    email: string;
    password?: string;
    role?: UserRole;
    homeName?: string;
    avatarUrl?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));

    const displayName = data.displayName.trim();
    const cleanUsername = data.username.replace(/^@/, '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    const cleanEmail = data.email.trim().toLowerCase();
    const password = data.password?.trim() || '';

    if (!displayName) {
      setIsLoading(false);
      return { success: false, error: 'Пожалуйста, укажите ваше имя' };
    }
    if (!cleanUsername) {
      setIsLoading(false);
      return { success: false, error: 'Пожалуйста, укажите имя пользователя (@ник)' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setIsLoading(false);
      return { success: false, error: 'Пожалуйста, укажите корректный адрес электронной почты' };
    }
    if (password && password.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Пароль должен содержать минимум 6 символов' };
    }

    const db = getUsersDb();

    // Check for email collision
    if (db.some((u) => u.email.toLowerCase() === cleanEmail)) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Пользователь с таким адресом почты уже зарегистрирован. Пожалуйста, войдите в аккаунт.',
      };
    }

    // Check for username collision
    if (db.some((u) => u.username.toLowerCase() === cleanUsername)) {
      setIsLoading(false);
      return {
        success: false,
        error: `Имя пользователя @${cleanUsername} уже занято. Выберите другое.`,
      };
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const role: UserRole = data.role || 'OWNER';
    const avatarUrl =
      data.avatarUrl ||
      (role === 'OWNER'
        ? ROLE_AVATARS[0].url
        : role === 'PARENT'
          ? ROLE_AVATARS[1].url
          : ROLE_AVATARS[2].url);

    const newUser: StoredUserAccount = {
      id: userId,
      displayName,
      username: cleanUsername,
      email: cleanEmail,
      passwordHash: password || 'nest123456',
      familyRole: role,
      avatarUrl,
      theme: 'light',
      language: (localStorage.getItem('nest_language') as AppLanguage) || 'ru',
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
      createdAt: new Date().toISOString(),
    };

    // Save into users DB
    const updatedDb = [...db, newUser];
    saveUsersDb(updatedDb);

    // Automatically provision their real family Home!
    const homeName = data.homeName?.trim() || `Дом семьи ${displayName}`;
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newHomeId = `home_${Date.now()}`;

    const newHome = {
      id: newHomeId,
      name: homeName,
      description: `Семейное пространство: домашние дела, планы и забота семьи ${displayName}`,
      ownerId: userId,
      inviteCode,
      inviteLink: `https://nest.family/join/${inviteCode}`,
      atmosphere: 'Clouds' as const,
      members: [
        {
          userId: userId,
          displayName: newUser.displayName,
          username: newUser.username,
          avatarUrl: newUser.avatarUrl,
          role: role,
          joinedAt: new Date().toISOString(),
        },
      ],
      permissions: {
        membersCanCreateTasks: false,
        membersCanComment: true,
        parentsCanManageInvites: true,
        allowGuestView: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      let currentHomes: any[] = [];
      const homesRaw = localStorage.getItem('nest_homes');
      if (homesRaw) currentHomes = JSON.parse(homesRaw);
      // Filter out old demo homes
      const cleanHomes = currentHomes.filter((h: any) => !h.id.startsWith('home_miller'));
      localStorage.setItem('nest_homes', JSON.stringify([newHome, ...cleanHomes]));
      localStorage.setItem('nest_current_home_id', newHomeId);
    } catch {
      // storage errors
    }

    setUser(newUser);
    setIsLoading(false);
    return { success: true };
  };

  // Real Join Home by 6-Character Code
  const loginByCode = async (
    code: string,
    displayName?: string,
    role: UserRole = 'MEMBER',
    password?: string
  ): Promise<{ success: boolean; error?: string; homeName?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setIsLoading(false);
      return { success: false, error: 'Пожалуйста, введите 6-значный код Дома' };
    }

    let homes: any[] = [];
    try {
      const saved = localStorage.getItem('nest_homes');
      if (saved) homes = JSON.parse(saved);
    } catch {}

    const targetHome = homes.find((h: any) => h.inviteCode && h.inviteCode.toUpperCase() === cleanCode);

    if (!targetHome) {
      setIsLoading(false);
      return {
        success: false,
        error: `Дом с кодом «${cleanCode}» не найден. Проверьте код приглашения от вашей семьи.`,
      };
    }

    const chosenName = displayName?.trim() || (role === 'PARENT' ? 'Родитель' : 'Участник Дома');
    const userRole: UserRole = role || 'MEMBER';
    const avatarUrl =
      userRole === 'OWNER'
        ? ROLE_AVATARS[0].url
        : userRole === 'PARENT'
          ? ROLE_AVATARS[1].url
          : ROLE_AVATARS[2].url;
    const cleanUsername =
      chosenName.toLowerCase().replace(/[^a-z0-9_]/g, '') ||
      `member_${Date.now().toString().slice(-4)}`;
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newUser: StoredUserAccount = {
      id: userId,
      displayName: chosenName,
      username: cleanUsername,
      email: `${cleanUsername}@nest.local`,
      passwordHash: password || 'nest123456',
      familyRole: userRole,
      avatarUrl,
      homeId: targetHome.id,
      theme: 'light',
      language: (localStorage.getItem('nest_language') as AppLanguage) || 'ru',
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
      createdAt: new Date().toISOString(),
    };

    // Save in user DB
    const db = getUsersDb();
    saveUsersDb([...db, newUser]);

    // Add member into targetHome
    const updatedHomes = homes.map((h: any) => {
      if (h.id === targetHome.id) {
        return {
          ...h,
          members: [
            ...(h.members || []),
            {
              userId: newUser.id,
              displayName: newUser.displayName,
              username: newUser.username,
              avatarUrl: newUser.avatarUrl,
              role: userRole,
              joinedAt: new Date().toISOString(),
            },
          ],
        };
      }
      return h;
    });
    localStorage.setItem('nest_homes', JSON.stringify(updatedHomes));
    localStorage.setItem('nest_current_home_id', targetHome.id);

    setUser(newUser);
    setIsLoading(false);
    return { success: true, homeName: targetHome.name };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(ACTIVE_USER_KEY);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);

    // Sync to user DB
    const db = getUsersDb();
    const updatedDb = db.map((u) => (u.id === user.id ? { ...u, ...updates } : u));
    saveUsersDb(updatedDb);
  };

  const getAllRegisteredUsers = () => {
    return getUsersDb();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginByCode,
        logout,
        updateProfile,
        getAllRegisteredUsers,
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
