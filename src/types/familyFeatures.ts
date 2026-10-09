export type NoteColor = 'yellow' | 'mint' | 'lavender' | 'peach' | 'sky';
export type NoteMagnet = '📌' | '❤️' | '🥑' | '🍕' | '⭐' | '🐱' | '🔑' | '☕';
export type NoteTag = 'love' | 'reminder' | 'urgent' | 'idea' | 'care' | 'general';

export interface FridgeNoteReaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs who reacted
}

export interface FridgeNote {
  id: string;
  homeId: string;
  title: string;
  content: string;
  color: NoteColor;
  magnet: NoteMagnet;
  tag: NoteTag;
  isPinned: boolean;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  reactions: Record<string, string[]>; // emoji -> array of userIds
  createdAt: string;
  updatedAt: string;
}

export type GroceryCategory =
  | 'PRODUCE'
  | 'DAIRY'
  | 'MEAT'
  | 'PANTRY'
  | 'SNACKS'
  | 'HOUSEHOLD'
  | 'PHARMACY'
  | 'OTHER';

export interface ShoppingItem {
  id: string;
  homeId: string;
  title: string;
  category: GroceryCategory;
  quantity: number;
  unit: string;
  isCompleted: boolean;
  creatorId: string;
  creatorName: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  createdAt: string;
  completedAt?: string;
}

export interface FamilyGratitude {
  id: string;
  homeId: string;
  fromId: string;
  fromName: string;
  fromAvatar: string;
  toId: string;
  toName: string;
  toAvatar: string;
  message: string;
  createdAt: string;
}
