import React, { createContext, useContext, useState, useEffect } from 'react';
import { Home, HomeMember, AtmosphereType, HomePermissions } from '../types/home';
import { UserRole } from '../types/user';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useToast } from './ToastContext';
import { ROLE_AVATARS } from '../utils/avatars';
import {
  generateInviteCode,
  sanitizeInviteCode,
  buildInviteLink,
  publishHomeInvite,
  fetchRemoteHomeInvite,
} from '../utils/inviteSync';

interface HomeContextType {
  currentHome: Home | null;
  allHomes: Home[];
  currentUserRole: UserRole | null;
  isOwner: boolean;
  isParent: boolean;
  isMember: boolean;
  canManageHome: boolean;
  canCreateTasks: boolean;
  switchHome: (homeId: string) => void;
  createHome: (name: string, atmosphere?: AtmosphereType) => Home;
  joinHomeByCode: (code: string) => Promise<{ success: boolean; error?: string }>;
  regenerateInviteCode: (homeId?: string) => string;
  updateHome: (updates: Partial<Home>) => void;
  updateMemberRole: (userId: string, newRole: UserRole) => void;
  removeMember: (userId: string) => void;
  transferOwnership: (newOwnerId: string) => void;
  deleteHome: (homeId: string) => void;
  leaveHome: (homeId: string) => void;
}

export const INITIAL_HOMES: Home[] = [];

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const HomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { setAtmosphere } = useTheme();
  const toast = useToast();

  const [allHomes, setAllHomes] = useState<Home[]>(() => {
    const saved = localStorage.getItem('nest_homes_v8') || localStorage.getItem('nest_homes');
    if (saved) {
      try {
        const parsed: Home[] = JSON.parse(saved);
        // Clean out any legacy mock accounts
        const clean = parsed.filter(
          (h) =>
            h.id !== 'home_family_main' &&
            h.id !== 'home_creative_studio' &&
            !h.ownerId.includes('user_creator')
        );
        // Ensure every existing home has a valid, fresh inviteCode and inviteLink
        let changed = false;
        const validated = clean.map((h) => {
          const validCode = sanitizeInviteCode(h.inviteCode);
          if (!validCode || validCode.length < 5 || validCode === 'NEST01') {
            changed = true;
            const newCode = generateInviteCode();
            return {
              ...h,
              inviteCode: newCode,
              inviteLink: buildInviteLink({ ...h, inviteCode: newCode }),
            };
          }
          if (!h.inviteLink || h.inviteLink.includes('nest.family')) {
            changed = true;
            return {
              ...h,
              inviteCode: validCode,
              inviteLink: buildInviteLink({ ...h, inviteCode: validCode }),
            };
          }
          return {
            ...h,
            inviteCode: validCode,
          };
        });
        if (changed) {
          localStorage.setItem('nest_homes_v8', JSON.stringify(validated));
          localStorage.setItem('nest_homes', JSON.stringify(validated));
        }
        return validated;
      } catch {
        return [];
      }
    }
    return [];
  });

  const [currentHomeId, setCurrentHomeId] = useState<string>(() => {
    const saved = localStorage.getItem('nest_current_home_id_v8') || localStorage.getItem('nest_current_home_id');
    if (saved && saved !== 'home_family_main' && saved !== 'home_creative_studio') return saved;
    return allHomes[0]?.id || '';
  });

  useEffect(() => {
    localStorage.setItem('nest_homes_v8', JSON.stringify(allHomes));
    localStorage.setItem('nest_homes', JSON.stringify(allHomes));
  }, [allHomes]);

  useEffect(() => {
    if (currentHomeId) {
      localStorage.setItem('nest_current_home_id_v8', currentHomeId);
      localStorage.setItem('nest_current_home_id', currentHomeId);
    }
  }, [currentHomeId]);

  // Find user's accessible homes
  const userHomes = allHomes.filter((h) =>
    user ? h.members.some((m) => m.userId === user.id) || h.ownerId === user.id : true
  );

  const currentHome =
    allHomes.find((h) => h.id === currentHomeId) ||
    userHomes[0] ||
    allHomes[0] ||
    null;

  // Auto-provision or register home for logged-in user if none exists
  useEffect(() => {
    if (!user) return;
    setAllHomes((prev) => {
      let currentList = prev;
      try {
        const saved = localStorage.getItem('nest_homes_v8') || localStorage.getItem('nest_homes');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentList = parsed;
          }
        }
      } catch {}

      const userHasHome = currentList.some(
        (h) => h.members?.some((m) => m.userId === user.id) || h.ownerId === user.id
      );
      if (!userHasHome) {
        const code = generateInviteCode();
        const defaultHome: Home = {
          id: `home_${Date.now()}`,
          name: `Дом семьи ${user.displayName}`,
          ownerId: user.id,
          inviteCode: code,
          inviteLink: '',
          atmosphere: 'Midnight',
          members: [
            {
              userId: user.id,
              displayName: user.displayName,
              username: user.username,
              avatarUrl: user.avatarUrl,
              role: user.familyRole || 'PARENT',
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
        defaultHome.inviteLink = buildInviteLink(defaultHome);
        publishHomeInvite(defaultHome);
        setCurrentHomeId(defaultHome.id);
        return [defaultHome, ...currentList];
      }
      return currentList;
    });
  }, [user]);

  // Broadcast homes to cloud relay periodically or when modified so other devices can join by code
  useEffect(() => {
    if (allHomes.length > 0) {
      allHomes.forEach((h) => {
        publishHomeInvite(h);
      });
    }
  }, [allHomes]);

  // Sync atmosphere with active Home
  useEffect(() => {
    if (currentHome) {
      setAtmosphere(currentHome.atmosphere);
    }
  }, [currentHome?.id, currentHome?.atmosphere]);

  // Sync current user's profile updates into all Home member records
  useEffect(() => {
    if (!user) return;
    setAllHomes((prev) =>
      prev.map((h) => {
        const hasMember = h.members.some((m) => m.userId === user.id);
        if (!hasMember) return h;
        return {
          ...h,
          members: h.members.map((m) =>
            m.userId === user.id
              ? {
                  ...m,
                  displayName: user.displayName,
                  username: user.username,
                  avatarUrl: user.avatarUrl,
                }
              : m
          ),
        };
      })
    );
  }, [user?.displayName, user?.username, user?.avatarUrl, user?.id]);

  // Find current user's role in active Home
  const memberRecord = user && currentHome ? currentHome.members.find((m) => m.userId === user.id) : null;
  const isOwner = Boolean(
    (currentHome && user && currentHome.ownerId === user.id) ||
    memberRecord?.role === 'OWNER' ||
    user?.familyRole === 'OWNER'
  );
  const isParent = Boolean(
    isOwner ||
    memberRecord?.role === 'PARENT' ||
    user?.familyRole === 'PARENT'
  );
  const currentUserRole: UserRole | null = isOwner ? 'OWNER' : (isParent ? 'PARENT' : (memberRecord?.role || user?.familyRole || (user ? 'MEMBER' : null)));

  const isMember = currentUserRole === 'MEMBER';
  const canManageHome = isOwner;
  const canCreateTasks = isOwner || isParent;

  const switchHome = (homeId: string) => {
    const target = allHomes.find((h) => h.id === homeId);
    if (target) {
      setCurrentHomeId(homeId);
      toast.info(`Переключено на «${target.name}»`);
    }
  };

  const createHome = (name: string, atmosphere: AtmosphereType = 'Clouds'): Home => {
    if (!user) throw new Error('Must be logged in');

    const code = generateInviteCode();
    const newHome: Home = {
      id: `home_${Date.now()}`,
      name: name.trim() || 'Наш Семейный Дом',
      ownerId: user.id,
      inviteCode: code,
      inviteLink: '',
      atmosphere,
      members: [
        {
          userId: user.id,
          displayName: user.displayName,
          username: user.username,
          avatarUrl: user.avatarUrl,
          role: 'OWNER',
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

    newHome.inviteLink = buildInviteLink(newHome);
    publishHomeInvite(newHome);

    setAllHomes((prev) => [newHome, ...prev]);
    setCurrentHomeId(newHome.id);
    toast.success(`Дом «${newHome.name}» успешно создан!`);
    return newHome;
  };

  const regenerateInviteCode = (homeId?: string): string => {
    const targetId = homeId || currentHome?.id;
    if (!targetId) return '';

    const newCode = generateInviteCode();
    setAllHomes((prev) =>
      prev.map((h) => {
        if (h.id !== targetId) return h;
        const updated = {
          ...h,
          inviteCode: newCode,
          inviteLink: buildInviteLink({ ...h, inviteCode: newCode }),
          updatedAt: new Date().toISOString(),
        };
        publishHomeInvite(updated);
        return updated;
      })
    );
    toast.success(`Код приглашения обновлен: ${newCode}`);
    return newCode;
  };

  const joinHomeByCode = async (code: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      toast.error('Для входа по коду выберите вкладку «Вход по коду» на странице авторизации');
      return { success: false, error: 'Must be signed in to join a home' };
    }

    const cleanCode = sanitizeInviteCode(code);
    if (!cleanCode) {
      toast.error('Введите корректный код приглашения');
      return { success: false, error: 'Empty invite code' };
    }

    // 1. Try local homes first
    let targetHome = allHomes.find((h) => sanitizeInviteCode(h.inviteCode) === cleanCode);

    // 2. If not found locally, query remote pub/sub cloud relay
    if (!targetHome) {
      const remoteHome = await fetchRemoteHomeInvite(cleanCode);
      if (remoteHome) {
        targetHome = remoteHome;
        setAllHomes((prev) => {
          const exists = prev.some((h) => h.id === remoteHome.id);
          if (exists) {
            return prev.map((h) => (h.id === remoteHome.id ? remoteHome : h));
          }
          return [...prev, remoteHome];
        });
      }
    }

    if (!targetHome) {
      if (cleanCode.length >= 4) {
        targetHome = {
          id: `home_${cleanCode.toLowerCase()}`,
          name: 'Семейный Дом',
          ownerId: user.id,
          inviteCode: cleanCode,
          inviteLink: '',
          atmosphere: 'Midnight',
          members: [],
          permissions: {
            membersCanCreateTasks: false,
            membersCanComment: true,
            parentsCanManageInvites: true,
            allowGuestView: false,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        targetHome.inviteLink = buildInviteLink(targetHome);
        publishHomeInvite(targetHome);
      } else {
        toast.error('Дом с таким кодом не найден. Проверьте правильность кода.');
        return { success: false, error: 'Invalid invite code. Please check and try again.' };
      }
    }

    const alreadyMember = targetHome.members.some((m) => m.userId === user.id);
    if (alreadyMember) {
      setCurrentHomeId(targetHome.id);
      toast.info(`Вы уже в доме «${targetHome.name}»`);
      return { success: true };
    }

    const newMember: HomeMember = {
      userId: user.id,
      displayName: user.displayName,
      username: user.username,
      avatarUrl: user.avatarUrl,
      role: 'MEMBER',
      joinedAt: new Date().toISOString(),
    };

    const updatedHome = {
      ...targetHome,
      members: [...targetHome.members, newMember],
      updatedAt: new Date().toISOString(),
    };

    setAllHomes((prev) => {
      const exists = prev.some((h) => h.id === targetHome!.id);
      if (exists) {
        return prev.map((h) => (h.id === targetHome!.id ? updatedHome : h));
      }
      return [...prev, updatedHome];
    });

    publishHomeInvite(updatedHome);
    setCurrentHomeId(targetHome.id);
    toast.success(`Вы присоединились к дому «${targetHome.name}»!`);
    return { success: true };
  };

  const updateHome = (updates: Partial<Home>) => {
    if (!currentHome) return;
    setAllHomes((prev) =>
      prev.map((h) =>
        h.id === currentHome.id ? { ...h, ...updates, updatedAt: new Date().toISOString() } : h
      )
    );
    toast.success('Настройки дома обновлены');
  };

  const updateMemberRole = (userId: string, newRole: UserRole) => {
    if (!currentHome || !isOwner) return;
    setAllHomes((prev) =>
      prev.map((h) => {
        if (h.id !== currentHome.id) return h;
        return {
          ...h,
          members: h.members.map((m) => (m.userId === userId ? { ...m, role: newRole } : m)),
          updatedAt: new Date().toISOString(),
        };
      })
    );
    toast.info(`Роль участника изменена на ${newRole}`);
  };

  const removeMember = (userId: string) => {
    if (!currentHome || !isOwner) return;
    if (userId === currentHome.ownerId) return; // Cannot remove owner directly
    setAllHomes((prev) =>
      prev.map((h) => {
        if (h.id !== currentHome.id) return h;
        return {
          ...h,
          members: h.members.filter((m) => m.userId !== userId),
          updatedAt: new Date().toISOString(),
        };
      })
    );
    toast.info('Участник удален из дома');
  };

  const transferOwnership = (newOwnerId: string) => {
    if (!currentHome || !isOwner) return;
    setAllHomes((prev) =>
      prev.map((h) => {
        if (h.id !== currentHome.id) return h;
        return {
          ...h,
          ownerId: newOwnerId,
          members: h.members.map((m) => {
            if (m.userId === newOwnerId) return { ...m, role: 'OWNER' };
            if (m.userId === user?.id) return { ...m, role: 'PARENT' };
            return m;
          }),
          updatedAt: new Date().toISOString(),
        };
      })
    );
    toast.success('Права Создателя Дома переданы');
  };

  const deleteHome = (homeId: string) => {
    if (!isOwner) return;
    const remaining = allHomes.filter((h) => h.id !== homeId);
    setAllHomes(remaining);
    if (currentHomeId === homeId && remaining.length > 0) {
      setCurrentHomeId(remaining[0].id);
    }
    toast.info('Дом удален');
  };

  const leaveHome = (homeId: string) => {
    if (!user) return;
    setAllHomes((prev) =>
      prev.map((h) => {
        if (h.id !== homeId) return h;
        return {
          ...h,
          members: h.members.filter((m) => m.userId !== user.id),
        };
      })
    );
    const otherHomes = allHomes.filter((h) => h.id !== homeId && h.members.some((m) => m.userId === user.id));
    if (otherHomes.length > 0) {
      setCurrentHomeId(otherHomes[0].id);
    }
    toast.info('Вы вышли из дома');
  };

  return (
    <HomeContext.Provider
      value={{
        currentHome,
        allHomes: userHomes,
        currentUserRole,
        isOwner,
        isParent,
        isMember,
        canManageHome,
        canCreateTasks,
        switchHome,
        createHome,
        joinHomeByCode,
        regenerateInviteCode,
        updateHome,
        updateMemberRole,
        removeMember,
        transferOwnership,
        deleteHome,
        leaveHome,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
};
