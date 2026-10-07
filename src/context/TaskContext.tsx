import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Task, TaskStatus, TaskPriority, TaskAttachment, ActivityEvent } from '../types/task';
import { useHome } from './HomeContext';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  activity: ActivityEvent[];
  createTask: (data: {
    title: string;
    description?: string;
    subject: string;
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

// Gentle Web Audio API chime
const playSuccessChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    // Audio context may be restricted before interaction
  }
};

const getTodayString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const INITIAL_TASKS: Task[] = [
  {
    id: 'task_01',
    homeId: 'home_miller',
    title: 'Exercise 347–350',
    description: 'Multivariable integration proofs & topological boundary mappings. Riemann Surfaces & Complex Moduli Differential Topology.',
    creatorId: 'user_elena',
    creatorName: 'Elena',
    assigneeId: 'user_alexey',
    assigneeName: 'Alexey',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subject: 'Mathematics',
    date: getTodayString(),
    time: '',
    isAllDay: true,
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    attachments: [
      {
        id: 'att_1',
        type: 'link',
        title: 'Topology Chapter 14 Proofs',
        url: 'https://ocw.mit.edu/courses/mathematics',
        createdAt: '2026-10-07T10:00:00Z',
      },
    ],
    comments: [
      {
        id: 'comm_1',
        authorId: 'user_elena',
        authorName: 'Elena',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        content: 'Check step 4 in problem 349 carefully before writing the conclusion.',
        createdAt: '2026-10-07T11:20:00Z',
      },
      {
        id: 'comm_2',
        authorId: 'user_alexey',
        authorName: 'Alexey',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'Understood, applying the Green theorem boundary condition now.',
        createdAt: '2026-10-07T12:05:00Z',
      },
    ],
    createdAt: '2026-10-07T08:00:00Z',
    updatedAt: '2026-10-07T12:05:00Z',
  },
  {
    id: 'task_02',
    homeId: 'home_miller',
    title: 'Monograph 04 Reading',
    description: 'Frampton Critical Regionalism, Sections 3.2 - 4.1. Write a 2-page synthesis on tectonic articulation.',
    creatorId: 'user_dmitry',
    creatorName: 'Dmitry',
    assigneeId: 'user_alexey',
    assigneeName: 'Alexey',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subject: 'Theory & Semiotics',
    date: getTodayString(),
    time: '14:00',
    isAllDay: false,
    priority: 'MEDIUM',
    status: 'TODO',
    attachments: [
      {
        id: 'att_2',
        type: 'file',
        title: 'Monograph_04_Regionalism.pdf',
        size: '3.4 MB',
        createdAt: '2026-10-07T09:15:00Z',
      },
    ],
    comments: [],
    createdAt: '2026-10-07T09:00:00Z',
    updatedAt: '2026-10-07T09:00:00Z',
  },
  {
    id: 'task_03',
    homeId: 'home_miller',
    title: 'Synchronize token bindings',
    description: 'Ensure color tokens and typography scale harmonize across mobile navigation and dashboard matrices.',
    creatorId: 'user_elena',
    creatorName: 'Elena',
    assigneeId: 'user_alexey',
    assigneeName: 'Alexey',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subject: 'Design Studio',
    date: getTodayString(),
    time: '',
    isAllDay: true,
    priority: 'LOW',
    status: 'TODO',
    attachments: [],
    comments: [],
    createdAt: '2026-10-07T09:30:00Z',
    updatedAt: '2026-10-07T09:30:00Z',
  },
  {
    id: 'task_04',
    homeId: 'home_miller',
    title: 'Typography Calibration',
    description: 'Plus Jakarta Sans headline kerning and tracking verification against Stitch specifications.',
    creatorId: 'user_dmitry',
    creatorName: 'Dmitry',
    assigneeId: 'user_alexey',
    assigneeName: 'Alexey',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subject: 'Design Studio',
    date: getTodayString(),
    time: '11:00',
    isAllDay: false,
    priority: 'LOW',
    status: 'DONE',
    attachments: [],
    comments: [],
    completedAt: '2026-10-07T11:45:00Z',
    createdAt: '2026-10-07T08:30:00Z',
    updatedAt: '2026-10-07T11:45:00Z',
  },
  {
    id: 'task_05',
    homeId: 'home_miller',
    title: 'Literature Essay: Tolstoy & Chekhov',
    description: 'Comparative structural analysis of dramatic timing and social psychology in late 19th century narratives.',
    creatorId: 'user_elena',
    creatorName: 'Elena',
    assigneeId: 'user_alexey',
    assigneeName: 'Alexey',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subject: 'Literature',
    date: getTodayString(),
    time: '18:00',
    isAllDay: false,
    priority: 'HIGH',
    status: 'NEEDS_REVISION',
    revisionNote: 'Please expand section 3 on Chekhov’s dramatic subtext and add 2 direct textual citations.',
    attachments: [
      {
        id: 'att_3',
        type: 'note',
        title: 'Draft Essay Notes',
        content: 'Key thesis: The suspension of dramatic climax in Chekhov vs the ethical imperative in Tolstoy.',
        createdAt: '2026-10-06T15:00:00Z',
      },
    ],
    comments: [
      {
        id: 'comm_3',
        authorId: 'user_elena',
        authorName: 'Elena',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        content: 'The introduction is strong, but the secondary characters need more grounding.',
        createdAt: '2026-10-07T14:10:00Z',
      },
    ],
    createdAt: '2026-10-06T10:00:00Z',
    updatedAt: '2026-10-07T14:10:00Z',
  },
  {
    id: 'task_06',
    homeId: 'home_miller',
    title: 'Physics Laboratory Report: Optics',
    description: 'Refractive index measurements and wave interference diffraction patterns.',
    creatorId: 'user_dmitry',
    creatorName: 'Dmitry',
    assigneeId: 'user_alexey',
    assigneeName: 'Alexey',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subject: 'Physics',
    date: '2026-10-05',
    time: '16:00',
    isAllDay: false,
    priority: 'HIGH',
    status: 'OVERDUE',
    attachments: [],
    comments: [],
    createdAt: '2026-10-04T09:00:00Z',
    updatedAt: '2026-10-06T00:01:00Z',
  },
  {
    id: 'task_07',
    homeId: 'home_miller',
    title: 'Botanical Garden Herbarium',
    description: 'Collect, press and catalog 15 native specimens with taxonomic classifications and habitat coordinates.',
    creatorId: 'user_elena',
    creatorName: 'Elena',
    assigneeId: 'user_alexey',
    assigneeName: 'Alexey',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subject: 'Biology',
    date: '2026-10-15',
    time: '',
    isAllDay: true,
    priority: 'MEDIUM',
    status: 'TODO',
    attachments: [],
    comments: [],
    createdAt: '2026-10-05T14:00:00Z',
    updatedAt: '2026-10-05T14:00:00Z',
  },
];

const INITIAL_ACTIVITY: ActivityEvent[] = [
  {
    id: 'act_1',
    homeId: 'home_miller',
    type: 'task_completed',
    actorId: 'user_alexey',
    actorName: 'Alexey',
    actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    taskId: 'task_04',
    taskTitle: 'Typography Calibration',
    details: 'Verified Plus Jakarta Sans and Inter font hierarchy.',
    timestamp: '2026-10-07T11:45:00Z',
  },
  {
    id: 'act_2',
    homeId: 'home_miller',
    type: 'task_revision',
    actorId: 'user_elena',
    actorName: 'Elena',
    actorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    taskId: 'task_05',
    taskTitle: 'Literature Essay: Tolstoy & Chekhov',
    details: 'Returned with feedback: Expand section 3 citations.',
    timestamp: '2026-10-07T14:10:00Z',
  },
  {
    id: 'act_3',
    homeId: 'home_miller',
    type: 'comment_added',
    actorId: 'user_alexey',
    actorName: 'Alexey',
    actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    taskId: 'task_01',
    taskTitle: 'Exercise 347–350',
    details: 'Applied Green theorem boundary conditions.',
    timestamp: '2026-10-07T12:05:00Z',
  },
  {
    id: 'act_4',
    homeId: 'home_miller',
    type: 'task_created',
    actorId: 'user_dmitry',
    actorName: 'Dmitry',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    taskId: 'task_02',
    taskTitle: 'Monograph 04 Reading',
    details: 'Assigned to Alexey with PDF attachment.',
    timestamp: '2026-10-07T09:00:00Z',
  },
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentHome } = useHome();
  const { user } = useAuth();

  const [allTasks, setAllTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('nest_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TASKS;
      }
    }
    return INITIAL_TASKS;
  });

  const [allActivity, setAllActivity] = useState<ActivityEvent[]>(() => {
    const saved = localStorage.getItem('nest_activity');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ACTIVITY;
      }
    }
    return INITIAL_ACTIVITY;
  });

  useEffect(() => {
    localStorage.setItem('nest_tasks', JSON.stringify(allTasks));
  }, [allTasks]);

  useEffect(() => {
    localStorage.setItem('nest_activity', JSON.stringify(allActivity));
  }, [allActivity]);

  // Tasks belonging to current Home
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
    subject: string;
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

    const newTask: Task = {
      id: `task_${Date.now()}`,
      homeId: currentHome.id,
      title: data.title,
      description: data.description || '',
      creatorId: user.id,
      creatorName: user.displayName,
      assigneeId: data.assigneeId,
      assigneeName: assigneeMember.displayName,
      assigneeAvatar: assigneeMember.avatarUrl,
      subject: data.subject,
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
      details: `Created in ${newTask.subject}`,
    });

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
          taskId,
          taskTitle: task.title,
          details: 'Updated details',
        });
      }
    }
  };

  const deleteTask = (taskId: string) => {
    setAllTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const toggleTaskStatus = (taskId: string) => {
    const task = allTasks.find((t) => t.id === taskId);
    if (!task || !user || !currentHome) return;

    const nextStatus: TaskStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
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
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0F4CFF', '#3B82F6', '#121316', '#FAF8F5'],
      });

      recordActivity({
        homeId: currentHome.id,
        type: 'task_completed',
        actorId: user.id,
        actorName: user.displayName,
        actorAvatar: user.avatarUrl,
        taskId,
        taskTitle: task.title,
        details: 'Completed on schedule',
      });
    } else {
      recordActivity({
        homeId: currentHome.id,
        type: 'task_updated',
        actorId: user.id,
        actorName: user.displayName,
        actorAvatar: user.avatarUrl,
        taskId,
        taskTitle: task.title,
        details: 'Reopened task',
      });
    }
  };

  const requestRevision = (taskId: string, note: string) => {
    const task = allTasks.find((t) => t.id === taskId);
    if (!task || !user || !currentHome) return;

    setAllTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          status: 'NEEDS_REVISION',
          revisionNote: note,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    recordActivity({
      homeId: currentHome.id,
      type: 'task_revision',
      actorId: user.id,
      actorName: user.displayName,
      actorAvatar: user.avatarUrl,
      taskId,
      taskTitle: task.title,
      details: note,
    });
  };

  const addComment = (taskId: string, content: string) => {
    if (!user || !currentHome) return;

    const newComment = {
      id: `comm_${Date.now()}`,
      authorId: user.id,
      authorName: user.displayName,
      authorAvatar: user.avatarUrl,
      content,
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

    const task = allTasks.find((t) => t.id === taskId);
    if (task) {
      recordActivity({
        homeId: currentHome.id,
        type: 'comment_added',
        actorId: user.id,
        actorName: user.displayName,
        actorAvatar: user.avatarUrl,
        taskId,
        taskTitle: task.title,
        details: content.length > 50 ? `${content.substring(0, 50)}...` : content,
      });
    }
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
