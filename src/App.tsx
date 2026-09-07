import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewMode, UserProfileData } from './types';
import { fetchSupabaseCommunityPosts } from './services/supabaseService';
import { useAuth } from './hooks/useAuth';
import { supabase } from './lib/supabaseClient';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { LearnModule } from './components/modules/LearnModule';
import { JournalModule } from './components/modules/JournalModule';
import { AnalyticsModule } from './components/modules/AnalyticsModule';
import { FluxAiModule } from './components/modules/FluxAiModule';
import { AlertModule } from './components/modules/AlertModule';
import { ProfileModule } from './components/modules/ProfileModule';
import { CommunityModule } from './components/modules/CommunityModule';
import { MissionsModule } from './components/modules/MissionsModule';
import { DashboardModule } from './components/modules/DashboardModule';
import { OnboardingModal } from './components/common/OnboardingModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { soundEngine } from './utils/audioSynth';

const DEFAULT_USER_PROFILE: UserProfileData = {
  name: 'Usuario FluxGlow',
  email: 'usuario@fluxglow.com',
  ageGroup: '19 - 24 años',
  memberSince: '28 de Agosto, 2026',
  avatarUrl: '/user.png', // Official user profile image
  goals: [
    { id: 'stress', label: 'Gestión del Estrés', checked: true },
    { id: 'mindfulness', label: 'Atención Plena', checked: true },
    { id: 'productivity', label: 'Productividad', checked: true },
    { id: 'growth', label: 'Crecimiento Personal', checked: true },
  ],
  isLoggedIn: false,
  points: 120,
  level: 1,
};

export default function App() {
  const { user, authLoading, signOut } = useAuth();

  // Starts on the Home / Landing page as requested
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [onboardingInitialMode, setOnboardingInitialMode] = useState<'ask_first_time' | 'tutorial' | 'update_notes'>('ask_first_time');
  const [activeGuideId, setActiveGuideId] = useState<string | undefined>(undefined);

  // Sincronizar el perfil del usuario desde Supabase cuando detecta una sesión activa
  useEffect(() => {
    if (!user) return;
    let isCancelled = false;

    const loadProfile = async () => {
      try {
        const { data, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (isCancelled) return;

        if (profileErr) {
          console.warn('Aviso al consultar perfil del usuario:', profileErr.message);
        }

        if (data) {
          setUserProfile(prev => ({
            ...prev,
            name: data.name || user.user_metadata?.name || user.email?.split('@')[0] || 'Miembro de FluxGlow',
            ageGroup: data.age_group || prev.ageGroup,
            goals: data.goals || prev.goals,
            avatarUrl: data.avatar_url || prev.avatarUrl || '/user.png',
            points: typeof data.points === 'number' ? data.points : (prev.points ?? 120),
            level: typeof data.level === 'number' ? data.level : (prev.level ?? 1),
            isLoggedIn: true,
          }));
        } else {
          // Si el perfil aún se está procesando o no existe fila, proveer fallback seguro sin romper la app
          const fallbackName = user.user_metadata?.name || user.email?.split('@')[0] || 'Miembro de FluxGlow';
          setUserProfile(prev => ({
            ...prev,
            name: prev.name && prev.name !== 'Invitado' ? prev.name : fallbackName,
            isLoggedIn: true,
          }));
        }
      } catch (err) {
        console.warn('Error no crítico recuperando perfil:', err);
      }
    };

    loadProfile();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  // Listen for global custom events to open onboarding or update notes
  useEffect(() => {
    const handleOpenUpdateNotes = () => {
      setOnboardingInitialMode('update_notes');
      setShowOnboarding(true);
    };
    const handleOpenTutorial = () => {
      setOnboardingInitialMode('tutorial');
      setShowOnboarding(true);
    };
    window.addEventListener('fluxglow_open_update_notes', handleOpenUpdateNotes);
    window.addEventListener('fluxglow_open_tutorial', handleOpenTutorial);
    return () => {
      window.removeEventListener('fluxglow_open_update_notes', handleOpenUpdateNotes);
      window.removeEventListener('fluxglow_open_tutorial', handleOpenTutorial);
    };
  }, []);

  // Al cargar la app, consulta (select) a la tabla community_posts en Supabase
  useEffect(() => {
    fetchSupabaseCommunityPosts().then(dbPosts => {
      if (dbPosts && dbPosts.length > 0) {
        try {
          localStorage.setItem('fluxglow_community_posts', JSON.stringify(dbPosts));
        } catch (e) {
          console.error(e);
        }
      }
    }).catch(err => {
      console.warn('Consulta inicial a community_posts en Supabase:', err);
    });
  }, []);

  // Persistent user profile state connected across register, login & profile personalization
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => {
    try {
      const saved = localStorage.getItem('fluxglow_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.avatarUrl || parsed.avatarUrl.includes('unsplash.com') || parsed.avatarUrl === '') {
          parsed.avatarUrl = '/user.png';
        }
        if (parsed.email === 'yahiremmanuel235@gmail.com') {
          parsed.email = 'usuario@fluxglow.com';
        }
        return { ...DEFAULT_USER_PROFILE, ...parsed };
      }
    } catch (e) {
      console.error('Error loading saved profile:', e);
    }
    return DEFAULT_USER_PROFILE;
  });

  // Scroll to top when changing views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Auto-launch onboarding check after skipping landing or on initial module entry
  const triggerOnboardingCheck = () => {
    const asked = localStorage.getItem('fluxglow_first_time_asked');
    if (!asked) {
      setShowOnboarding(true);
    }
  };

  const handleNavigate = (view: ViewMode) => {
    // If navigating away from landing for the first time, check tutorial
    if (currentView === 'landing' && view !== 'landing') {
      triggerOnboardingCheck();
    }
    setCurrentView(view);
  };

  const handleOpenGuideById = (guideId: string) => {
    setActiveGuideId(guideId);
    setCurrentView('learn');
  };

  const handleAuthSuccess = (targetView: ViewMode, updatedProfile?: Partial<UserProfileData>) => {
    if (updatedProfile) {
      setUserProfile(prev => {
        const next = { ...prev, ...updatedProfile, isLoggedIn: true };
        try {
          localStorage.setItem('fluxglow_user_profile', JSON.stringify(next));
        } catch (e) {
          console.error('Error saving profile:', e);
        }
        return next;
      });
    }
    setCurrentView(targetView || 'dashboard');
  };

  const handleUpdateProfile = (updated: Partial<UserProfileData>) => {
    setUserProfile(prev => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('fluxglow_user_profile', JSON.stringify(next));
      } catch (e) {
        console.error('Error updating profile:', e);
      }
      return next;
    });
  };

  const handleToggleAmbientAudio = () => {
    if (isAudioPlaying) {
      soundEngine.stopAmbient();
      setIsAudioPlaying(false);
    } else {
      soundEngine.toggleAmbient('zen');
      setIsAudioPlaying(true);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
    }
    setUserProfile({
      ...DEFAULT_USER_PROFILE,
      isLoggedIn: false,
    });
    try {
      localStorage.removeItem('fluxglow_user_profile');
    } catch (e) {
      console.error('Error limpiando sesión en localStorage:', e);
    }
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-sand-50 font-sans antialiased text-stone-800 selection:bg-brand-sage-200 selection:text-brand-sage-900">
      
      {/* Show full modules navbar when inside any application module */}
      {currentView !== 'landing' && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={handleToggleAmbientAudio}
          isLoggedIn={userProfile.isLoggedIn}
          onSignOut={handleSignOut}
          userPoints={userProfile.points}
          userLevel={userProfile.level}
        />
      )}

      {/* Main Dynamic View Content with smooth motion transition */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-full h-full"
          >
            {currentView === 'landing' && (
              <ErrorBoundary fallbackTitle="Inconveniente en la Página de Inicio">
                <LandingPage 
                  onNavigate={handleNavigate} 
                  currentUser={userProfile}
                  onAuthSuccess={handleAuthSuccess}
                  onSignOut={handleSignOut}
                />
              </ErrorBoundary>
            )}

            {currentView === 'dashboard' && (
              <ErrorBoundary fallbackTitle="Inconveniente en el Centro de Control">
                <DashboardModule 
                  onNavigate={handleNavigate} 
                  onOpenGuideById={handleOpenGuideById}
                  userProfile={userProfile}
                  onUpdateProfile={handleUpdateProfile}
                />
              </ErrorBoundary>
            )}

            {currentView === 'learn' && (
              <ErrorBoundary fallbackTitle="Inconveniente en el Centro de Aprendizaje">
                <LearnModule 
                  onNavigate={handleNavigate} 
                  initialGuideId={activeGuideId} 
                />
              </ErrorBoundary>
            )}

            {currentView === 'journal' && (
              <ErrorBoundary fallbackTitle="Inconveniente en el Diario Emocional">
                <JournalModule 
                  onNavigate={handleNavigate} 
                />
              </ErrorBoundary>
            )}

            {currentView === 'missions' && (
              <ErrorBoundary fallbackTitle="Inconveniente en el Panel de Misiones">
                <MissionsModule 
                  onNavigate={handleNavigate} 
                  onOpenGuideById={handleOpenGuideById} 
                  userProfile={userProfile}
                  onUpdateProfile={handleUpdateProfile}
                />
              </ErrorBoundary>
            )}

            {currentView === 'analytics' && (
              <ErrorBoundary fallbackTitle="Inconveniente en el Análisis Predictivo">
                <AnalyticsModule onNavigate={handleNavigate} />
              </ErrorBoundary>
            )}

            {currentView === 'ai' && (
              <ErrorBoundary fallbackTitle="Inconveniente en Flux AI">
                <FluxAiModule userProfile={userProfile} />
              </ErrorBoundary>
            )}

            {currentView === 'alert' && (
              <ErrorBoundary fallbackTitle="Inconveniente en Alerta Emocional">
                <AlertModule />
              </ErrorBoundary>
            )}

            {currentView === 'profile' && (
              <ErrorBoundary fallbackTitle="Inconveniente en el Perfil">
                <ProfileModule 
                  userProfile={userProfile} 
                  onUpdateProfile={handleUpdateProfile} 
                  onNavigate={handleNavigate}
                  onSignOut={handleSignOut}
                />
              </ErrorBoundary>
            )}

            {currentView === 'community' && (
              <ErrorBoundary fallbackTitle="Inconveniente en la Comunidad">
                <CommunityModule userProfile={userProfile} />
              </ErrorBoundary>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Onboarding and Platform Tour Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onNavigate={handleNavigate}
        initialMode={onboardingInitialMode}
      />

    </div>
  );
}
