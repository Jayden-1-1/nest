import React, { useState, Suspense, lazy } from 'react';
import { useAuth } from './context/AuthContext';
import { useHome } from './context/HomeContext';
import { Layout } from './components/layout/Layout';
import { WelcomePage } from './pages/WelcomePage';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { TaskCreateEditModal } from './components/tasks/TaskCreateEditModal';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { HomeCreateJoinModal } from './components/home/HomeCreateJoinModal';
import { OnboardingState } from './components/onboarding/HomeOnboardingModal';
import { LegalDocId } from './data/legalDocs';
import { Task } from './types/task';

// Dynamic code splitting for secondary pages and dialogs
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const CalendarPage = lazy(() => import('./pages/CalendarPage').then(m => ({ default: m.CalendarPage })));
const ProgressPage = lazy(() => import('./pages/ProgressPage').then(m => ({ default: m.ProgressPage })));
const ActivityPage = lazy(() => import('./pages/ActivityPage').then(m => ({ default: m.ActivityPage })));
const MembersPage = lazy(() => import('./pages/MembersPage').then(m => ({ default: m.MembersPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const FridgePage = lazy(() => import('./pages/FridgePage').then(m => ({ default: m.FridgePage })));
const ShoppingPage = lazy(() => import('./pages/ShoppingPage').then(m => ({ default: m.ShoppingPage })));
const SpotlightTutorial = lazy(() => import('./components/onboarding/SpotlightTutorial').then(m => ({ default: m.SpotlightTutorial })));
const HomeOnboardingModal = lazy(() => import('./components/onboarding/HomeOnboardingModal').then(m => ({ default: m.HomeOnboardingModal })));
const LegalDocsModal = lazy(() => import('./components/legal/LegalDocsModal').then(m => ({ default: m.LegalDocsModal })));

const PageLoader = () => (
  <div className="flex items-center justify-center p-12 min-h-[320px]">
    <div className="w-7 h-7 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
  </div>
);

export function App() {
  const { user } = useAuth();
  const { currentHome, currentUserRole } = useHome();

  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [showAuth, setShowAuth] = useState<boolean>(false);

  // Modals
  const [taskCreateModalOpen, setTaskCreateModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [defaultTaskDate, setDefaultTaskDate] = useState<string | undefined>(undefined);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false);

  const [homeModalOpen, setHomeModalOpen] = useState(false);
  const [homeModalMode, setHomeModalMode] = useState<'create' | 'join'>('create');

  // Onboarding Walkthrough Modal State
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    isOpen: false,
    mode: 'creator',
  });

  // Real In-App Spotlight Interactive Tutorial
  const [spotlightTutorialOpen, setSpotlightTutorialOpen] = useState(false);
  const [spotlightTutorialMode, setSpotlightTutorialMode] = useState<'creator' | 'joined'>('creator');

  // Legal Modal State (callable anywhere in app)
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [selectedLegalDoc, setSelectedLegalDoc] = useState<LegalDocId>('privacy-guarantee');

  // If user is not authenticated and auth page is not shown, show WelcomePage
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'code'>('code');

  if (!user) {
    if (showAuth) {
      return (
        <Suspense fallback={<PageLoader />}>
          <AuthPage
            initialMode={authMode}
            onBack={() => setShowAuth(false)}
            onSuccess={() => setShowAuth(false)}
          />
        </Suspense>
      );
    }
    return (
      <WelcomePage
        onEnter={(mode) => {
          setAuthMode(mode || 'code');
          setShowAuth(true);
        }}
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
      <Suspense fallback={<PageLoader />}>
        {/* Route Switcher */}
        {currentRoute === 'home' && (
          <DashboardPage
            onOpenCreateTask={() => {
              setTaskToEdit(null);
              setDefaultTaskDate(undefined);
              setTaskCreateModalOpen(true);
            }}
            onSelectTask={handleSelectTask}
            onNavigate={(route) => setCurrentRoute(route)}
            onOpenWalkthrough={() => {
              setSpotlightTutorialMode(currentUserRole === 'MEMBER' ? 'joined' : 'creator');
              setSpotlightTutorialOpen(true);
            }}
          />
        )}

        {currentRoute === 'tasks' && (
          <TasksPage
            onOpenCreateTask={() => {
              setTaskToEdit(null);
              setDefaultTaskDate(undefined);
              setTaskCreateModalOpen(true);
            }}
            onSelectTask={handleSelectTask}
          />
        )}

        {currentRoute === 'calendar' && (
          <CalendarPage
            onOpenCreateTask={(date?: string) => {
              setTaskToEdit(null);
              setDefaultTaskDate(date);
              setTaskCreateModalOpen(true);
            }}
            onSelectTask={handleSelectTask}
          />
        )}

        {currentRoute === 'fridge' && <FridgePage />}

        {currentRoute === 'shopping' && <ShoppingPage />}

        {currentRoute === 'progress' && <ProgressPage />}

        {currentRoute === 'activity' && <ActivityPage />}

        {currentRoute === 'members' && <MembersPage />}

        {currentRoute === 'profile' && <ProfilePage />}

        {currentRoute === 'settings' && (
          <SettingsPage
            onReplayTutorial={() => {
              setCurrentRoute('home');
              setSpotlightTutorialMode(currentUserRole === 'MEMBER' ? 'joined' : 'creator');
              setSpotlightTutorialOpen(true);
            }}
          />
        )}

        {/* Task Create / Edit Modal */}
        <TaskCreateEditModal
          isOpen={taskCreateModalOpen}
          taskToEdit={taskToEdit}
          defaultDate={defaultTaskDate}
          onClose={() => {
            setTaskCreateModalOpen(false);
            setTaskToEdit(null);
            setDefaultTaskDate(undefined);
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
          onHomeCreated={(_newHome) => {
            setSpotlightTutorialMode('creator');
            setSpotlightTutorialOpen(true);
          }}
          onHomeJoined={(_targetHome) => {
            setSpotlightTutorialMode('joined');
            setSpotlightTutorialOpen(true);
          }}
        />

        {/* Real In-App Spotlight Interactive Tutorial */}
        <SpotlightTutorial
          isOpen={spotlightTutorialOpen}
          mode={spotlightTutorialMode}
          onClose={() => setSpotlightTutorialOpen(false)}
          onNavigateToTab={(tab) => setCurrentRoute(tab)}
          onOpenCreateTask={() => {
            setTaskToEdit(null);
            setDefaultTaskDate(undefined);
            setTaskCreateModalOpen(true);
          }}
        />

        {/* Home Onboarding & Interactive Walkthrough Modal (Optional legacy fallback) */}
        <HomeOnboardingModal
          state={onboardingState}
          onClose={() => setOnboardingState((prev) => ({ ...prev, isOpen: false }))}
          onNavigateToTab={(tab) => setCurrentRoute(tab)}
        />

        {/* Legal Documents Viewer Modal */}
        <LegalDocsModal
          isOpen={legalModalOpen}
          initialDocId={selectedLegalDoc}
          onClose={() => setLegalModalOpen(false)}
        />
      </Suspense>
    </Layout>
  );
}

export default App;
