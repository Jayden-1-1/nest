import { UserRole } from './user';

export type AtmosphereType = 'Midnight' | 'Clouds' | 'Sunset' | 'Ocean' | 'Aurora';

export interface HomeMember {
  userId: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  role: UserRole;
  joinedAt: string;
}

export interface HomePermissions {
  membersCanCreateTasks: boolean;
  membersCanComment: boolean;
  parentsCanManageInvites: boolean;
  allowGuestView: boolean;
}

export interface Home {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  inviteCode: string;
  inviteLink: string;
  atmosphere: AtmosphereType;
  members: HomeMember[];
  permissions: HomePermissions;
  createdAt: string;
  updatedAt: string;
}
