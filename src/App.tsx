import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useHome } from './context/HomeContext';
import { Layout } from './components/layout/Layout';
import { WelcomePage } from './pages/WelcomePage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { CalendarPage } from './pages/CalendarPage';
import { ProgressPage } from './pages/ProgressPage';
import { ActivityPage } from './pages/ActivityPage';
import { MembersPage } from './pages/MembersPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { TaskCreateEditModal } from './components/tasks/TaskCreateEditModal';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { HomeCreateJoinModal } from './components/home/HomeCreateJoinModal';
import { Task } from './types/task';

export function App() {
  const { user, switchDemoUser } = useAuth();
  const { currentHome } = useHome();

  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [showAuth, setShowAuth] = useState<boolean>(false);

  // Modals
  const [taskCreateModalOpen, setTaskCreateModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false);

  const [homeModalOpen, setHomeModalOpen] = useState(false);
  const [homeModalMode, setHomeModalMode] = useState<'create' | 'join'>('create');

  // If user is not authenticated and auth page is not shown, show WelcomePage
  if (!user) {
    if (showAuth) {
      return (
        <AuthPage
          onBack={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      );
    }
    return (
      <WelcomePage
        onEnter={() => setShowAuth(true)}
        onExploreDemo={(persona) => switchDemoUser(persona)}
      />
    );
  }

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setTaskDetailModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setTaskCreateModalOpen(true);
  };

  return (
    <Layout
      currentRoute={currentRoute}
      onNavigate={(route) => setCurrentRoute(route)}
      onOpenCreateHome={() => {
        setHomeModalMode('create');
        setHomeModalOpen(true);
      }}
      onOpenJoinHome={() => {
        setHomeModalMode('join');
        setHomeModalOpen(true);
      }}
    >
      {/* Route Switcher */}
      {currentRoute === 'home' && (
        <DashboardPage
          onOpenCreateTask={() => {
            setTaskToEdit(null);
            setTaskCreateModalOpen(true);
          }}
          onSelectTask={handleSelectTask}
          onNavigate={(route) => setCurrentRoute(route)}
        />
      )}

      {currentRoute === 'tasks' && (
        <TasksPage
          onOpenCreateTask={() => {
            setTaskToEdit(null);
            setTaskCreateModalOpen(true);
          }}
          onSelectTask={handleSelectTask}
        />
      )}

      {currentRoute === 'calendar' && (
        <CalendarPage
          onOpenCreateTask={() => {
            setTaskToEdit(null);
            setTaskCreateModalOpen(true);
          }}
          onSelectTask={handleSelectTask}
        />
      )}

      {currentRoute === 'progress' && <ProgressPage />}

      {currentRoute === 'activity' && <ActivityPage />}

      {currentRoute === 'members' && <MembersPage />}

      {currentRoute === 'profile' && <ProfilePage />}

      {currentRoute === 'settings' && <SettingsPage />}

      {/* Task Create / Edit Modal */}
      <TaskCreateEditModal
        isOpen={taskCreateModalOpen}
        taskToEdit={taskToEdit}
        onClose={() => {
          setTaskCreateModalOpen(false);
          setTaskToEdit(null);
        }}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={taskDetailModalOpen}
        task={selectedTask}
        onClose={() => {
          setTaskDetailModalOpen(false);
          setSelectedTask(null);
        }}
        onEdit={handleEditTask}
      />

      {/* Home Create / Join Modal */}
      <HomeCreateJoinModal
        isOpen={homeModalOpen}
        initialMode={homeModalMode}
        onClose={() => setHomeModalOpen(false)}
      />
    </Layout>
  );
}

export default App;
