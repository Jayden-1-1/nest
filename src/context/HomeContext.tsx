import React, { createContext, useContext, useState, useEffect } from 'react';
import { Home, HomeMember, AtmosphereType, HomePermissions } from '../types/home';
import { UserRole } from '../types/user';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useToast } from './ToastContext';

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
  joinHomeByCode: (code: string) => { success: boolean; error?: string };
  updateHome: (updates: Partial<Home>) => void;
  updateMemberRole: (userId: string, newRole: UserRole) => void;
  removeMember: (userId: string) => void;
  transferOwnership: (newOwnerId: string) => void;
  deleteHome: (homeId: string) => void;
  leaveHome: (homeId: string) => void;
}

const INITIAL_HOMES: Home[] = [
  {
    id: 'home_miller',
    name: 'Miller Residence',
    description: 'Family daily learning, assignments and home activities',
    ownerId: 'user_elena',
    inviteCode: 'NEST01',
    inviteLink: 'https://nest.family/join/NEST01',
    atmosphere: 'Clouds',
    members: [
      {
        userId: 'user_elena',
        displayName: 'Elena',
        username: 'elena',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        role: 'OWNER',
        joinedAt: '2026-08-15T10:00:00Z',
      },
      {
        userId: 'user_dmitry',
        displayName: 'Dmitry',
        username: 'dmitry',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'PARENT',
        joinedAt: '2026-08-20T12:00:00Z',
      },
      {
        userId: 'user_alexey',
        displayName: 'Alexey',
        username: 'alexey',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'MEMBER',
        joinedAt: '2026-09-01T08:00:00Z',
      },
    ],
    permissions: {
      membersCanCreateTasks: true,
      membersCanComment: true,
      parentsCanManageInvites: true,
      allowGuestView: false,
    },
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-10-07T21:00:00Z',
  },
  {
    id: 'home_studio',
    name: 'Architecture Studio',
    description: 'Autonomous research monographs, design systems and design thesis',
    ownerId: 'user_alexey',
    inviteCode: 'STUDIO',
    inviteLink: 'https://nest.family/join/STUDIO',
    atmosphere: 'Midnight',
    members: [
      {
        userId: 'user_alexey',
        displayName: 'Alexey',
        username: 'alexey',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'OWNER',
        joinedAt: '2026-09-10T09:00:00Z',
      },
      {
        userId: 'user_elena',
        displayName: 'Elena',
        username: 'elena',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        role: 'PARENT',
        joinedAt: '2026-09-12T14:00:00Z',
      },
    ],
    permissions: {
      membersCanCreateTasks: true,
      membersCanComment: true,
      parentsCanManageInvites: true,
      allowGuestView: true,
    },
    createdAt: '2026-09-10T09:00:00Z',
    updatedAt: '2026-10-07T21:00:00Z',
  },
];

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const HomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { setAtmosphere } = useTheme();
  const toast = useToast();

  const [allHomes, setAllHomes] = useState<Home[]>(() => {
    const saved = localStorage.getItem('nest_homes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_HOMES;
      }
    }
    return INITIAL_HOMES;
  });

  const [currentHomeId, setCurrentHomeId] = useState<string>(() => {
    return localStorage.getItem('nest_current_home_id') || INITIAL_HOMES[0].id;
  });

  useEffect(() => {
    localStorage.setItem('nest_homes', JSON.stringify(allHomes));
  }, [allHomes]);

  useEffect(() => {
    localStorage.setItem('nest_current_home_id', currentHomeId);
  }, [currentHomeId]);

  // Find user's accessible homes
  const userHomes = allHomes.filter((h) =>
    user ? h.members.some((m) => m.userId === user.id) : true
  );

  const currentHome =
    allHomes.find((h) => h.id === currentHomeId) ||
    userHomes[0] ||
    allHomes[0] ||
    null;

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
  const currentUserRole: UserRole | null = memberRecord ? memberRecord.role : (user ? 'MEMBER' : null);

  const isOwner = currentUserRole === 'OWNER';
  const isParent = currentUserRole === 'PARENT' || isOwner;
  const isMember = currentUserRole === 'MEMBER';
  const canManageHome = isOwner;
  const canCreateTasks = isOwner || isParent || (currentHome?.permissions.membersCanCreateTasks ?? true);

  const switchHome = (homeId: string) => {
    const target = allHomes.find((h) => h.id === homeId);
    if (target) {
      setCurrentHomeId(homeId);
      toast.info(`Switched to ${target.name}`);
    }
  };

  const createHome = (name: string, atmosphere: AtmosphereType = 'Clouds'): Home => {
    if (!user) throw new Error('Must be logged in');

    const newHome: Home = {
      id: `home_${Date.now()}`,
      name,
      ownerId: user.id,
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      inviteLink: `https://nest.family/join/${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
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
        membersCanCreateTasks: true,
        membersCanComment: true,
        parentsCanManageInvites: true,
        allowGuestView: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAllHomes((prev) => [newHome, ...prev]);
    setCurrentHomeId(newHome.id);
    toast.success(`Home "${name}" created!`);
    return newHome;
  };

  const joinHomeByCode = (code: string): { success: boolean; error?: string } => {
    if (!user) {
      toast.error('Must be signed in to join a home');
      return { success: false, error: 'Must be signed in to join a home' };
    }

    const targetHome = allHomes.find((h) => h.inviteCode.toUpperCase() === code.trim().toUpperCase());
    if (!targetHome) {
      toast.error('Invalid invite code. Please check and try again.');
      return { success: false, error: 'Invalid invite code. Please check and try again.' };
    }

    const alreadyMember = targetHome.members.some((m) => m.userId === user.id);
    if (alreadyMember) {
      setCurrentHomeId(targetHome.id);
      toast.info(`Switched to ${targetHome.name}`);
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

    setAllHomes((prev) =>
      prev.map((h) =>
        h.id === targetHome.id ? { ...h, members: [...h.members, newMember], updatedAt: new Date().toISOString() } : h
      )
    );
    setCurrentHomeId(targetHome.id);
    toast.success(`Joined ${targetHome.name}!`);
    return { success: true };
  };

  const updateHome = (updates: Partial<Home>) => {
    if (!currentHome) return;
    setAllHomes((prev) =>
      prev.map((h) =>
        h.id === currentHome.id ? { ...h, ...updates, updatedAt: new Date().toISOString() } : h
      )
    );
    toast.success('Home settings updated');
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
    toast.info(`Member role updated to ${newRole}`);
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
    toast.info('Member removed from Home');
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
    toast.success('Ownership transferred successfully');
  };

  const deleteHome = (homeId: string) => {
    if (!isOwner) return;
    const remaining = allHomes.filter((h) => h.id !== homeId);
    setAllHomes(remaining);
    if (currentHomeId === homeId && remaining.length > 0) {
      setCurrentHomeId(remaining[0].id);
    }
    toast.info('Home deleted');
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
    toast.info('You left the Home');
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
