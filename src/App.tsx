import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { storageService, SelectedLocation } from './services/storageService';
import { UserProfile } from './types';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { LocationModal } from './components/common/LocationModal';
import { PointsCelebration } from './components/common/PointsCelebration';
import { AuthModal } from './components/auth/AuthModal';
import { NotificationsModal } from './components/common/NotificationsModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { updatePresenceInFirestore, subscribeToPresenceList } from './services/firestoreService';
import { Tooltip } from './components/common/Tooltip';

// Views
import { HomeView } from './components/home/HomeView';
import { ReportView } from './components/report/ReportView';
import { VerifyView } from './components/verify/VerifyView';
import { TruthView } from './components/truth/TruthView';
import { MarketView } from './components/market/MarketView';
import { RecipeView } from './components/recipe/RecipeView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminView } from './components/admin/AdminView';
import { SabiersChatView } from './components/chat/SabiersChatView';
import { SabiationView } from './components/sabiation/SabiationView';
import { SaboAiModal } from './components/sabo/SaboAiModal';
import { AboutView } from './components/common/AboutView';
import { RumorMapView } from './components/map/RumorMapView';
import { RumorStatsDashboard } from './components/stats/RumorStatsDashboard';
import { DeluxeForensicsContainer } from './components/forensics/DeluxeForensicsContainer';
import { Sparkles, Bot } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [extraViewData, setExtraViewData] = useState<any>(null);

  const [location, setLocation] = useState<SelectedLocation>(storageService.getLocation());
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // Sabo AI Modal state
  const [isSaboAiOpen, setIsSaboAiOpen] = useState<boolean>(false);
  const [isSaboBreathing, setIsSaboBreathing] = useState<boolean>(false);

  // Notifications Modal state
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState<boolean>(false);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup' | 'admin'>('signin');

  // Points celebration banner/toast
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);
  const [pointsMessage, setPointsMessage] = useState<string>('');

  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<UserProfile>(storageService.getUser());

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('sabi_dark_mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sabi_dark_mode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setLocation(storageService.getLocation());
      setCurrentUser(storageService.getUser());
    });
    
    // Check onboarding & show interactive tutorial when user lands
    const user = storageService.getUser();
    const hasSeenThisSession = sessionStorage.getItem('sabi_tutorial_session_landed');
    if (!user.hasSeenOnboarding || !hasSeenThisSession) {
      setIsOnboardingOpen(true);
      sessionStorage.setItem('sabi_tutorial_session_landed', 'true');
    }
    
    return unsubscribe;
  }, []);

  useEffect(() => {
    const user = storageService.getUser();
    
    const pingPresence = async () => {
      try {
        updatePresenceInFirestore(user.id, user.name);
        const res = await fetch(`/api/online-users?userId=${encodeURIComponent(user.id)}&name=${encodeURIComponent(user.name)}`);
        if (res.ok) {
          const data = await res.json();
          if (typeof data.count === 'number' && data.count > 0) {
            setOnlineCount(data.count);
          }
        }
      } catch {
        // Silently tolerate initial connection establishment delays
      }
    };

    // Initial presence ping
    pingPresence();
    
    // Pulse/heartbeat every 20 seconds
    const interval = setInterval(pingPresence, 20 * 1000);
    
    // Subscribe to presence in Firestore
    const unsubscribePresence = subscribeToPresenceList((list) => {
      if (list && list.length > 0) {
        const liveCount = list.filter(s => s.isOnline).length;
        setOnlineCount(Math.max(liveCount, 1));
      } else {
        setOnlineCount(1);
      }
    });
    
    return () => {
      clearInterval(interval);
      if (unsubscribePresence) unsubscribePresence();
    };
  }, []);

  // 30-second inactivity timer for subtle breathing animation on Floating Sabo AI launcher
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      setIsSaboBreathing(false);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsSaboBreathing(true);
      }, 30000); // 30 seconds
    };

    // Initial 30-second timer
    resetInactivityTimer();

    // Listen to user interaction to reset timer
    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
    };
  }, [isSaboAiOpen]);

  const handleNavigate = (tab: string, extraData?: any) => {
    if (tab === 'tutorial' || tab === 'onboarding') {
      setIsOnboardingOpen(true);
      return;
    }
    if (tab === 'notifications') {
      setIsNotificationsModalOpen(true);
      return;
    }
    if (extraData) {
      setExtraViewData(extraData);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowPointsToast = (points: number, message: string) => {
    setPointsEarned(points);
    setPointsMessage(message);
  };

  const handleOpenAuthModal = (mode: 'signin' | 'signup' | 'admin' = 'signin') => {
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const SWIPEABLE_TABS = ['home', 'map', 'sabiers'];
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (Math.abs(info.offset.x) > swipeThreshold) {
      const currentIndex = SWIPEABLE_TABS.indexOf(activeTab);
      if (currentIndex === -1) return;

      if (info.offset.x < 0) {
        // Swiped left, go to next
        const nextIndex = Math.min(currentIndex + 1, SWIPEABLE_TABS.length - 1);
        if (nextIndex !== currentIndex) handleNavigate(SWIPEABLE_TABS[nextIndex]);
      } else {
        // Swiped right, go to previous
        const prevIndex = Math.max(currentIndex - 1, 0);
        if (prevIndex !== currentIndex) handleNavigate(SWIPEABLE_TABS[prevIndex]);
      }
    }
  };

  return (
    <div className={`min-h-screen flex flex-col selection:bg-[#FFD60A] selection:text-[#0A3D2E] transition-colors duration-200 ${
      isDarkMode ? 'dark bg-gray-950 text-gray-100' : 'bg-[#FDFBF7] text-gray-900'
    }`}>
      
      {/* Header */}
      <Header
        currentTab={activeTab}
        activeLocation={location}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onNavigate={handleNavigate}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenSaboAi={() => setIsSaboAiOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onOpenTutorial={() => setIsOnboardingOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onlineCount={onlineCount}
      />

      {/* Main Content Area */}
      <motion.main 
        className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        dragElastic={0.1}
      >
        {activeTab === 'home' && (
          <HomeView 
            onNavigate={handleNavigate} 
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onShowPointsToast={handleShowPointsToast}
          />
        )}

        {activeTab === 'report' && (
          <ReportView 
            onNavigate={handleNavigate} 
            onShowPointsToast={handleShowPointsToast}
          />
        )}

        {activeTab === 'verify' && (
          <VerifyView 
            initialTaskId={extraViewData?.taskId}
            onNavigate={handleNavigate}
            onShowPointsToast={handleShowPointsToast}
          />
        )}

        {activeTab === 'truth' && (
          <TruthView 
            initialTruthId={extraViewData?.truthId}
            onNavigate={handleNavigate}
          />
        )}

        {(activeTab === 'deepfake' || activeTab === 'xray') && (
          <TruthView 
            initialTab="xray"
            onNavigate={handleNavigate}
          />
        )}

        {(activeTab === 'image-authenticity' || activeTab === 'deluxe-image') && (
          <DeluxeForensicsContainer
            user={currentUser}
            initialTool="image"
            onNavigate={handleNavigate}
            onShowToast={handleShowPointsToast}
          />
        )}

        {(activeTab === 'video-analysis' || activeTab === 'deluxe-video') && (
          <DeluxeForensicsContainer
            user={currentUser}
            initialTool="video"
            onNavigate={handleNavigate}
            onShowToast={handleShowPointsToast}
          />
        )}

        {(activeTab === 'deluxe-forensics' || activeTab === 'forensics') && (
          <DeluxeForensicsContainer
            user={currentUser}
            initialTool="image"
            onNavigate={handleNavigate}
            onShowToast={handleShowPointsToast}
          />
        )}

        {activeTab === 'truth-detail' && (
          <TruthView 
            initialTruthId={extraViewData}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'market' && (
          <MarketView 
            initialItemId={extraViewData?.itemId}
            onNavigate={handleNavigate}
            onShowPointsToast={handleShowPointsToast}
          />
        )}

        {activeTab === 'sabiers' && (
          <SabiersChatView 
            onNavigate={handleNavigate}
            onShowPointsToast={handleShowPointsToast}
            onOpenSaboAi={() => setIsSaboAiOpen(true)}
            onlineCount={onlineCount}
          />
        )}

        {activeTab === 'sabiation' && (
          <SabiationView
            onNavigate={handleNavigate}
            onShowToast={handleShowPointsToast}
          />
        )}

        {activeTab === 'recipe' && (
          <RecipeView 
            onNavigate={handleNavigate}
            onShowPointsToast={handleShowPointsToast}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView 
            onNavigate={handleNavigate}
            onShowPointsToast={handleShowPointsToast}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView 
            onNavigate={handleNavigate}
            onShowToast={handleShowPointsToast}
            onExitAdmin={() => handleNavigate('home')}
          />
        )}

        {activeTab === 'about' && (
          <AboutView 
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'map' && (
          <RumorMapView 
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'stats' && (
          <RumorStatsDashboard 
            onNavigate={handleNavigate}
            onVerifyQuery={(query) => {
              setIsSaboAiOpen(true);
            }}
          />
        )}
      </motion.main>

      {/* Floating Sabo AI Quick Launcher with 30-second breathing pulse animation */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-30">
        <Tooltip content="Ask Sabo AI (SABI Fact-Checker & Price Guide)" position="left">
          <motion.div
            animate={
              isSaboBreathing
                ? {
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0px 0px 0px rgba(255,214,10,0.2)',
                      '0px 0px 24px rgba(255,214,10,0.85)',
                      '0px 0px 0px rgba(255,214,10,0.2)'
                    ]
                  }
                : { scale: 1, boxShadow: '0px 10px 25px -5px rgba(0,0,0,0.3)' }
            }
            transition={
              isSaboBreathing
                ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.2 }
            }
            className="rounded-full"
          >
            <button
              id="floating-sabo-ai-launcher"
              onClick={() => {
                setIsSaboBreathing(false);
                setIsSaboAiOpen(true);
              }}
              className={`bg-gradient-to-r from-[#0A3D2E] to-[#0d4a38] text-white hover:to-[#115d47] active:scale-95 shadow-xl hover:shadow-2xl rounded-full p-3.5 sm:px-4 sm:py-3 flex items-center gap-2 border-2 border-[#FFD60A] transition-all group ${
                isSaboBreathing ? 'ring-4 ring-[#FFD60A]/40' : ''
              }`}
            >
              <div className="relative">
                <Bot className="w-5 h-5 text-[#FFD60A]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FFD60A] animate-ping" />
              </div>
              <span className="hidden sm:inline font-black text-xs text-white font-display">
                Ask Sabo AI
              </span>
            </button>
          </motion.div>
        </Tooltip>
      </div>

      {/* Persistent Bottom Navigation for Mobile */}
      <BottomNav
        currentTab={activeTab}
        onNavigate={handleNavigate}
      />

      {/* Sabo AI Modal */}
      <SaboAiModal
        isOpen={isSaboAiOpen}
        onClose={() => setIsSaboAiOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Notifications / Info Bell Modal with Exit & Delete Controls */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Nigerian Location Selector Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={location}
        onSelectLocation={(loc) => {
          storageService.setLocation(loc);
          setLocation(loc);
          setIsLocationModalOpen(false);
          handleShowPointsToast(5, `Location updated to ${loc.area || loc.lga}, ${loc.state}! (+5 PTS)`);
        }}
      />

      {/* Sign In / Sign Up / Admin Passkey Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authInitialMode}
        onAuthSuccess={(msg) => handleShowPointsToast(msg.includes('Signed up') ? 100 : 0, msg)}
        onAdminSuccess={() => handleNavigate('admin')}
      />

      {/* Onboarding & Interactive Tutorial Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => {
          setIsOnboardingOpen(false);
          const user = storageService.getUser();
          storageService.updateUser({ ...user, hasSeenOnboarding: true });
        }}
        onNavigate={handleNavigate}
      />

      {/* Points Celebration Toast / Banner */}
      <PointsCelebration
        points={pointsEarned}
        message={pointsMessage}
        onClose={() => {
          setPointsEarned(null);
          setPointsMessage('');
        }}
      />

    </div>
  );
};

export default App;
