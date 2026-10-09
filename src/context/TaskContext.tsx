import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Task, TaskStatus, TaskPriority, TaskCategory, SchoolSubject, TaskAttachment, ActivityEvent } from '../types/task';
import { useHome } from './HomeContext';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { formatLocalDate } from '../utils/date';
import { ROLE_AVATARS } from '../utils/avatars';

interface TaskContextType {
  tasks: Task[];
  activity: ActivityEvent[];
  createTask: (data: {
    title: string;
    description?: string;
    category?: TaskCategory;
    schoolSubject?: SchoolSubject;
    subject?: string;
    assigneeId: string;
    date?: string;
    time?: string;
    isAllDay?: boolean;
    priority?: TaskPriority;
    attachments?: TaskAttachment[];
  }) => Task;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskStatus: (taskId: string) => void;
  requestRevision: (taskId: string, note: string) => void;
  addComment: (taskId: string, content: string) => void;
  addAttachment: (taskId: string, attachment: Omit<TaskAttachment, 'id' | 'createdAt'>) => void;
}

// Snappy harmonious celebratory audio chime
const playSuccessChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [587.33, 739.99, 880.00];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.07);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i * 0.07 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.07);
      osc.stop(ctx.currentTime + i * 0.07 + 0.45);
    });
  } catch {
    // Audio context may be restricted before interaction
  }
};

const getTodayString = () => formatLocalDate(new Date());

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_ACTIVITY: ActivityEvent[] = [];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentHome, isOwner, isParent, canCreateTasks } = useHome();
  const { user } = useAuth();
  const toast = useToast();

  const [allTasks, setAllTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('nest_family_tasks_v8');
    if (saved) {
      try {
        const parsed: Task[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return INITIAL_TASKS;
  });

  const [allActivity, setAllActivity] = useState<ActivityEvent[]>(() => {
    const saved = localStorage.getItem('nest_family_activity_v8');
    if (saved) {
      try {
        const parsed: ActivityEvent[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return INITIAL_ACTIVITY;
  });

  useEffect(() => {
    localStorage.setItem('nest_family_tasks_v8', JSON.stringify(allTasks));
  }, [allTasks]);

  useEffect(() => {
    localStorage.setItem('nest_family_activity_v8', JSON.stringify(allActivity));
  }, [allActivity]);

  // Tasks belonging to current Home (or fallback to all if matching)
  const tasks = allTasks.filter((t) => (currentHome ? t.homeId === currentHome.id : true));
  const activity = allActivity.filter((a) => (currentHome ? a.homeId === currentHome.id : true));

  const recordActivity = (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => {
    const newEvent: ActivityEvent = {
      ...event,
      id: `act_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setAllActivity((prev) => [newEvent, ...prev]);
  };

  const createTask = (data: {
    title: string;
    description?: string;
    category?: TaskCategory;
    schoolSubject?: SchoolSubject;
    subject?: string;
    assigneeId: string;
    date?: string;
    time?: string;
    isAllDay?: boolean;
    priority?: TaskPriority;
    attachments?: TaskAttachment[];
  }): Task => {
    if (!currentHome || !user) throw new Error('Home and user required');
    if (!canCreateTasks && !isOwner && !isParent) {
      toast.error('Только родители и создатель дома могут создавать задачи');
      throw new Error('Permission denied: only parents and owners can create tasks');
    }

    const assigneeMember = currentHome.members.find((m) => m.userId === data.assigneeId) || {
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
    };

    const taskCategory: TaskCategory = data.category || 'CHORES';

    const newTask: Task = {
      id: `task_${Date.now()}`,
      homeId: currentHome.id,
      title: data.title.trim(),
      description: data.description ? data.description.trim() : '',
      creatorId: user.id,
      creatorName: user.displayName,
      assigneeId: data.assigneeId,
      assigneeName: assigneeMember.displayName,
      assigneeAvatar: assigneeMember.avatarUrl,
      category: taskCategory,
      schoolSubject: taskCategory === 'SCHOOL' ? data.schoolSubject : undefined,
      subject: data.subject || data.category || 'Общие дела',
      date: data.date || getTodayString(),
      time: data.time || '',
      isAllDay: data.isAllDay ?? !data.time,
      priority: data.priority || 'MEDIUM',
      status: 'TODO',
      attachments: data.attachments || [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAllTasks((prev) => [newTask, ...prev]);

    recordActivity({
      homeId: currentHome.id,
      type: 'task_created',
      actorId: user.id,
      actorName: user.displayName,
      actorAvatar: user.avatarUrl,
      taskId: newTask.id,
      taskTitle: newTask.title,
      details: `Создана в категории «${newTask.category}»`,
    });

    toast.success('Задача добавлена в семейный список');
    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    if (!isOwner && !isParent) {
      const forbidden = ['title', 'description', 'assigneeId', 'assigneeName', 'assigneeAvatar', 'category', 'schoolSubject', 'subject', 'date', 'time', 'isAllDay', 'priority'];
      const hasForbidden = Object.keys(updates).some((k) => forbidden.includes(k));
      if (hasForbidden) {
        toast.error('Редактировать параметры задачи могут только родители');
        return;
      }
    }

    setAllTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    if (user && currentHome) {
      const task = allTasks.find((t) => t.id === taskId);
      if (task) {
        recordActivity({
          homeId: currentHome.id,
          type: 'task_updated',
          actorId: user.id,
          actorName: user.displayName,
          actorAvatar: user.avatarUrl,
          taskId: task.id,
          taskTitle: task.title,
          details: 'Обновлены параметры задачи',
        });
      }
    }
  };

  const deleteTask = (taskId: string) => {
    if (!isOwner && !isParent) {
      toast.error('Только родители и создатель дома могут удалять задачи');
      return;
    }

    const taskToDelete = allTasks.find((t) => t.id === taskId);
    setAllTasks((prev) => prev.filter((t) => t.id !== taskId));

    if (taskToDelete && user && currentHome) {
      recordActivity({
        homeId: currentHome.id,
        type: 'task_deleted',
        actorId: user.id,
        actorName: user.displayName,
        actorAvatar: user.avatarUrl,
        taskId: taskToDelete.id,
        taskTitle: taskToDelete.title,
        details: 'Задача удалена',
      });
    }
    toast.info('Задача удалена');
  };

  const toggleTaskStatus = (taskId: string) => {
    const targetTask = allTasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    if (!isOwner && !isParent && targetTask.assigneeId && user && targetTask.assigneeId !== user.id) {
      toast.error('Вы можете отмечать только свои задачи');
      return;
    }

    let nextStatus: TaskStatus = 'TODO';
    if (targetTask.status === 'TODO') {
      nextStatus = 'IN_PROGRESS';
    } else if (targetTask.status === 'IN_PROGRESS' || targetTask.status === 'NEEDS_REVISION') {
      nextStatus = 'DONE';
    } else if (targetTask.status === 'DONE') {
      nextStatus = 'TODO';
    }

    const isNowDone = nextStatus === 'DONE';

    setAllTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          status: nextStatus,
          completedAt: isNowDone ? new Date().toISOString() : undefined,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    if (isNowDone) {
      playSuccessChime();
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#D97706', '#4F46E5', '#10B981', '#F59E0B'],
        });
      } catch {
        // Confetti effect
      }
      toast.success(`«${targetTask.title}» выполнена! Отличная работа!`);
    } else {
      toast.info(`Статус задачи: ${nextStatus}`);
    }

    if (user && currentHome) {
      recordActivity({
        homeId: currentHome.id,
        type: isNowDone ? 'task_completed' : 'task_status_changed',
        actorId: user.id,
        actorName: user.displayName,
        actorAvatar: user.avatarUrl,
        taskId: targetTask.id,
        taskTitle: targetTask.title,
        details: `Статус изменен на ${nextStatus}`,
      });
    }
  };

  const requestRevision = (taskId: string, note: string) => {
    if (!isOwner && !isParent) {
      toast.error('Только родители и создатель дома могут возвращать задачи на доработку');
      return;
    }

    const targetTask = allTasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    setAllTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          status: 'NEEDS_REVISION',
          revisionNote: note.trim(),
          updatedAt: new Date().toISOString(),
        };
      })
    );

    toast.info('Задача возвращена на доработку с комментарием');

    if (user && currentHome) {
      recordActivity({
        homeId: currentHome.id,
        type: 'task_revision',
        actorId: user.id,
        actorName: user.displayName,
        actorAvatar: user.avatarUrl,
        taskId: targetTask.id,
        taskTitle: targetTask.title,
        details: `Комментарий к доработке: ${note}`,
      });
    }
  };

  const addComment = (taskId: string, content: string) => {
    if (!user || !content.trim()) return;

    const newComment = {
      id: `comm_${Date.now()}`,
      authorId: user.id,
      authorName: user.displayName,
      authorAvatar: user.avatarUrl,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    setAllTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          comments: [...t.comments, newComment],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    if (currentHome) {
      const task = allTasks.find((t) => t.id === taskId);
      recordActivity({
        homeId: currentHome.id,
        type: 'comment_added',
        actorId: user.id,
        actorName: user.displayName,
        actorAvatar: user.avatarUrl,
        taskId,
        taskTitle: task?.title || 'Задача',
        details: content.trim().length > 60 ? `${content.trim().slice(0, 57)}...` : content.trim(),
      });
    }

    toast.success('Комментарий добавлен');
  };

  const addAttachment = (taskId: string, attachment: Omit<TaskAttachment, 'id' | 'createdAt'>) => {
    const newAtt: TaskAttachment = {
      ...attachment,
      id: `att_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setAllTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          attachments: [...t.attachments, newAtt],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    toast.success('Материал прикреплен к задаче');
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        activity,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        requestRevision,
        addComment,
        addAttachment,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
