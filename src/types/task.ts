export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'OVERDUE' | 'NEEDS_REVISION';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

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
  subject: string;
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
  type: 'task_created' | 'task_completed' | 'task_updated' | 'task_revision' | 'comment_added' | 'member_joined' | 'role_changed';
  actorId: string;
  actorName: string;
  actorAvatar: string;
  taskId?: string;
  taskTitle?: string;
  details?: string;
  timestamp: string;
}
