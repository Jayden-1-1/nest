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

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_01',
    homeId: 'home_family_main',
    title: 'Убрать в комнате и подготовить рабочее место',
    description: 'Сложить книги и конспекты на столе, протереть пыль, проветрить пространство и заправить кровать.',
    creatorId: 'user_creator',
    creatorName: 'Создатель Дома',
    assigneeId: 'user_member',
    assigneeName: 'Участник Дома',
    assigneeAvatar: ROLE_AVATARS[2].url,
    category: 'CHORES',
    subject: 'Дом и порядок',
    date: getTodayString(),
    time: '18:00',
    isAllDay: false,
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    attachments: [
      {
        id: 'att_1',
        type: 'note',
        title: 'Чек-лист порядка в комнате',
        content: '1. Письменный стол\n2. Полки с материалами\n3. Ковёр\n4. Проветрить комнату',
        createdAt: '2026-10-09T09:00:00Z',
      },
    ],
    comments: [
      {
        id: 'comm_1',
        authorId: 'user_creator',
        authorName: 'Создатель Дома',
        authorAvatar: ROLE_AVATARS[0].url,
        content: 'Не забудь протереть подоконник перед тем, как расставлять вещи на полки!',
        createdAt: '2026-10-09T10:15:00Z',
      },
      {
        id: 'comm_2',
        authorId: 'user_member',
        authorName: 'Участник Дома',
        authorAvatar: ROLE_AVATARS[2].url,
        content: 'Стол уже в идеальном порядке, сейчас приступаю к полу.',
        createdAt: '2026-10-09T11:00:00Z',
      },
    ],
    createdAt: '2026-10-09T08:00:00Z',
    updatedAt: '2026-10-09T11:00:00Z',
  },
  {
    id: 'task_02',
    homeId: 'home_family_main',
    title: 'Купить свежие продукты к ужину',
    description: 'Взять свежее фермерское молоко, зерновой хлеб, десяток яиц и сезонные яблоки в семейной лавке.',
    creatorId: 'user_parent',
    creatorName: 'Родитель / Наставник',
    assigneeId: 'user_member',
    assigneeName: 'Участник Дома',
    assigneeAvatar: ROLE_AVATARS[2].url,
    category: 'SHOPPING',
    subject: 'Покупки',
    date: getTodayString(),
    time: '17:00',
    isAllDay: false,
    priority: 'MEDIUM',
    status: 'TODO',
    attachments: [
      {
        id: 'att_2',
        type: 'note',
        title: 'Список продуктов',
        content: '1. Фермерское молоко 3.2%\n2. Зерновой хлеб\n3. Десяток яиц С0\n4. Яблоки зеленые 1 кг',
        createdAt: '2026-10-09T09:30:00Z',
      },
    ],
    comments: [
      {
        id: 'comm_3',
        authorId: 'user_parent',
        authorName: 'Родитель / Наставник',
        authorAvatar: ROLE_AVATARS[1].url,
        content: 'Список покупок прикреплен в заметке.',
        createdAt: '2026-10-09T09:40:00Z',
      },
    ],
    createdAt: '2026-10-09T09:00:00Z',
    updatedAt: '2026-10-09T09:40:00Z',
  },
  {
    id: 'task_03',
    homeId: 'home_family_main',
    title: 'Покормить питомца и налить свежей воды',
    description: 'Утренний влажный рацион, свежая фильтрованная вода и немного сухого корма.',
    creatorId: 'user_creator',
    creatorName: 'Создатель Дома',
    assigneeId: 'user_member',
    assigneeName: 'Участник Дома',
    assigneeAvatar: ROLE_AVATARS[2].url,
    category: 'PETS',
    subject: 'Забота о питомцах',
    date: getTodayString(),
    time: '',
    isAllDay: true,
    priority: 'HIGH',
    status: 'TODO',
    attachments: [],
    comments: [],
    createdAt: '2026-10-09T07:30:00Z',
    updatedAt: '2026-10-09T07:30:00Z',
  },
  {
    id: 'task_04',
    homeId: 'home_family_main',
    title: 'Практикум по математике и алгоритмам',
    description: 'Параграф 14: квадратные уравнения и теорема Виета. Задачи № 45–48 в тетради практикума.',
    creatorId: 'user_parent',
    creatorName: 'Родитель / Наставник',
    assigneeId: 'user_member',
    assigneeName: 'Участник Дома',
    assigneeAvatar: ROLE_AVATARS[2].url,
    category: 'SCHOOL',
    schoolSubject: 'MATH',
    subject: 'Математика',
    date: getTodayString(),
    time: '16:00',
    isAllDay: false,
    priority: 'HIGH',
    status: 'NEEDS_REVISION',
    revisionNote: 'В задаче № 47 потерян минус при переносе слагаемого в правую часть. Перепроверь вычисления.',
    attachments: [
      {
        id: 'att_3',
        type: 'link',
        title: 'Электронный задачник: Глава 14',
        url: 'https://uchebnik.online/math-algebra-8',
        createdAt: '2026-10-09T08:15:00Z',
      },
    ],
    comments: [
      {
        id: 'comm_4',
        authorId: 'user_parent',
        authorName: 'Родитель / Наставник',
        authorAvatar: ROLE_AVATARS[1].url,
        content: 'Обрати внимание на дискриминант в третьем уравнении.',
        createdAt: '2026-10-09T12:00:00Z',
      },
    ],
    createdAt: '2026-10-09T08:00:00Z',
    updatedAt: '2026-10-09T12:00:00Z',
  },
  {
    id: 'task_05',
    homeId: 'home_family_main',
    title: 'Полить растения на балконе и в гостиной',
    description: 'Опрыскать монстеру и фикус отстоянной водой, проверить влажность земли у герани.',
    creatorId: 'user_creator',
    creatorName: 'Создатель Дома',
    assigneeId: 'user_member',
    assigneeName: 'Участник Дома',
    assigneeAvatar: ROLE_AVATARS[2].url,
    category: 'CHORES',
    subject: 'Дом и порядок',
    date: getTodayString(),
    time: '11:00',
    isAllDay: false,
    priority: 'LOW',
    status: 'DONE',
    completedAt: '2026-10-09T11:20:00Z',
    attachments: [],
    comments: [],
    createdAt: '2026-10-09T08:30:00Z',
    updatedAt: '2026-10-09T11:20:00Z',
  },
  {
    id: 'task_06',
    homeId: 'home_family_main',
    title: 'Помочь приготовить семейный ужин',
    description: 'Помыть и нарезать овощи для салата, накрыть большой семейный стол к 19:30.',
    creatorId: 'user_creator',
    creatorName: 'Создатель Дома',
    assigneeId: 'user_member',
    assigneeName: 'Участник Дома',
    assigneeAvatar: ROLE_AVATARS[2].url,
    category: 'FAMILY',
    subject: 'Семья и традиции',
    date: getTodayString(),
    time: '19:00',
    isAllDay: false,
    priority: 'MEDIUM',
    status: 'TODO',
    attachments: [],
    comments: [],
    createdAt: '2026-10-09T10:00:00Z',
    updatedAt: '2026-10-09T10:00:00Z',
  },
  {
    id: 'task_07',
    homeId: 'home_family_main',
    title: 'Утренняя разминка и стакан воды',
    description: '15 минут разминки и растяжки для бодрого начала продуктивного дня.',
    creatorId: 'user_creator',
    creatorName: 'Создатель Дома',
    assigneeId: 'user_member',
    assigneeName: 'Участник Дома',
    assigneeAvatar: ROLE_AVATARS[2].url,
    category: 'HEALTH',
    subject: 'Здоровье и ритм',
    date: getTodayString(),
    time: '08:30',
    isAllDay: false,
    priority: 'LOW',
    status: 'DONE',
    completedAt: '2026-10-09T08:45:00Z',
    attachments: [],
    comments: [],
    createdAt: '2026-10-09T07:00:00Z',
    updatedAt: '2026-10-09T08:45:00Z',
  },
];

export const INITIAL_ACTIVITY: ActivityEvent[] = [
  {
    id: 'act_1',
    homeId: 'home_family_main',
    type: 'task_completed',
    actorId: 'user_member',
    actorName: 'Участник Дома',
    actorAvatar: ROLE_AVATARS[2].url,
    taskId: 'task_05',
    taskTitle: 'Полить растения на балконе и в гостиной',
    details: 'Опрыскал растения и проверил влажность земли.',
    timestamp: '2026-10-09T11:20:00Z',
  },
  {
    id: 'act_2',
    homeId: 'home_family_main',
    type: 'task_revision',
    actorId: 'user_parent',
    actorName: 'Родитель / Наставник',
    actorAvatar: ROLE_AVATARS[1].url,
    taskId: 'task_04',
    taskTitle: 'Практикум по математике и алгоритмам',
    details: 'Вернул на доработку: В задаче № 47 потерян минус при переносе слагаемого.',
    timestamp: '2026-10-09T12:00:00Z',
  },
  {
    id: 'act_3',
    homeId: 'home_family_main',
    type: 'comment_added',
    actorId: 'user_creator',
    actorName: 'Создатель Дома',
    actorAvatar: ROLE_AVATARS[0].url,
    taskId: 'task_01',
    taskTitle: 'Убрать в комнате и подготовить рабочее место',
    details: '«Не забудь протереть подоконник перед тем, как расставлять вещи на полки!»',
    timestamp: '2026-10-09T10:15:00Z',
  },
  {
    id: 'act_4',
    homeId: 'home_family_main',
    type: 'task_created',
    actorId: 'user_parent',
    actorName: 'Родитель / Наставник',
    actorAvatar: ROLE_AVATARS[1].url,
    taskId: 'task_02',
    taskTitle: 'Купить свежие продукты к ужину',
    details: 'Назначена Участнику со списком покупок.',
    timestamp: '2026-10-09T09:00:00Z',
  },
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentHome } = useHome();
  const { user } = useAuth();
  const toast = useToast();

  const [allTasks, setAllTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('nest_family_tasks_v5');
    if (saved) {
      try {
        const parsed: Task[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && !JSON.stringify(parsed).includes('unsplash') && !JSON.stringify(parsed).includes('home_miller')) {
          return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return INITIAL_TASKS;
  });

  const [allActivity, setAllActivity] = useState<ActivityEvent[]>(() => {
    const saved = localStorage.getItem('nest_family_activity_v5');
    if (saved) {
      try {
        const parsed: ActivityEvent[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && !JSON.stringify(parsed).includes('unsplash') && !JSON.stringify(parsed).includes('home_miller')) {
          return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return INITIAL_ACTIVITY;
  });

  useEffect(() => {
    localStorage.setItem('nest_family_tasks_v5', JSON.stringify(allTasks));
  }, [allTasks]);

  useEffect(() => {
    localStorage.setItem('nest_family_activity_v5', JSON.stringify(allActivity));
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
