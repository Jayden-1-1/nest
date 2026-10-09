export type UserRole = 'OWNER' | 'PARENT' | 'MEMBER';

export type AppTheme = 'light' | 'dark' | 'system';
export type AppLanguage = 'en' | 'ru';

export interface UserProfile {
  id: string;
  displayName: string;
  username: string;
  email: string;
  avatarUrl: string;
  gender?: 'boy' | 'girl' | 'role' | 'style';
  theme: AppTheme;
  language: AppLanguage;
  notifications: {
    newTask: boolean;
    comment: boolean;
    invite: boolean;
    overdueTask: boolean;
    deadlineSoon: boolean;
  };
  privacy: {
    showActivity: boolean;
    allowDirectInvites: boolean;
  };
  createdAt: string;
}

export interface StoredUserAccount extends UserProfile {
  passwordHash: string;
  homeId?: string;
  familyRole?: UserRole;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
