export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'OVERDUE' | 'NEEDS_REVISION';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type TaskCategory = 
  | 'CHORES'     // Home & Chores (уборка, стирка, посуда, полив цветов)
  | 'SHOPPING'   // Shopping & Errands (продукты, аптека, покупки)
  | 'PETS'       // Pets (кормление, выгул, уход)
  | 'SCHOOL'     // School & Learning (учеба, уроки, курсы)
  | 'FAMILY'     // Family & Personal (семейный ужин, прогулка, спорт)
  | 'HEALTH'     // Health & Routine (зарядка, прием витаминов, сон)
  | 'OTHER';     // Other (прочее)

export type SchoolSubject = 
  | 'MATH'         // Mathematics
  | 'LANGUAGES'    // Languages (English, etc.)
  | 'LITERATURE'   // Literature & Reading
  | 'SCIENCE'      // Physics, Chemistry, Biology
  | 'HISTORY'      // History & Social Studies
  | 'ARTS'         // Arts & Music
  | 'OTHER';       // Other subject

export interface TaskAttachment {
  id: string;
  type: 'image' | 'file' | 'link' | 'note';
  title: string;
  url?: string;
  content?: string;
  size?: string;
  createdAt: string;
}

export interface TaskComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  homeId: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar?: string;
  category: TaskCategory;
  schoolSubject?: SchoolSubject;
  subject?: string; // Kept for backwards compatibility / legacy display
  date: string; // YYYY-MM-DD
  time?: string; // e.g. "14:00" or empty for ALL DAY
  isAllDay: boolean;
  priority: TaskPriority;
  status: TaskStatus;
  attachments: TaskAttachment[];
  comments: TaskComment[];
  revisionNote?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityEvent {
  id: string;
  homeId: string;
  type: 'task_created' | 'task_completed' | 'task_updated' | 'task_revision' | 'comment_added' | 'member_joined' | 'role_changed' | 'task_deleted' | 'task_status_changed';
  actorId: string;
  actorName: string;
  actorAvatar: string;
  taskId?: string;
  taskTitle?: string;
  details?: string;
  timestamp: string;
}
