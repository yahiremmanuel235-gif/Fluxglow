import { STORAGE_KEYS, getDynamicStorageKey } from './constants/storageKeys';
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ViewMode, UserProfileData } from './types';
import { fetchSupabaseCommunityPosts } from './services/supabaseService';
import { useAuth } from './hooks/useAuth';
import { supabase } from './lib/supabaseClient';
import { migrateGuestDataToSupabase } from './services/migrationService';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingModal } from './components/common/OnboardingModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { soundEngine } from './utils/audioSynth';

const LearnModule = React.lazy(() => import('./components/modules/LearnModule').then(m => ({ default: m.LearnModule })));
const JournalModule = React.lazy(() => import('./components/modules/JournalModule').then(m => ({ default: m.JournalModule })));
const AnalyticsModule = React.lazy(() => import('./components/modules/AnalyticsModule').then(m => ({ default: m.AnalyticsModule })));
const FluxAiModule = React.lazy(() => import('./components/modules/FluxAiModule').then(m => ({ default: m.FluxAiModule })));
const AlertModule = React.lazy(() => import('./components/modules/AlertModule').then(m => ({ default: m.AlertModule })));
const ProfileModule = React.lazy(() => import('./components/modules/ProfileModule').then(m => ({ default: m.ProfileModule })));
const CommunityModule = React.lazy(() => import('./components/modules/CommunityModule').then(m => ({ default: m.CommunityModule })));
const MissionsModule = React.lazy(() => import('./components/modules/MissionsModule').then(m => ({ default: m.MissionsModule })));
const DashboardModule = React.lazy(() => import('./components/modules/DashboardModule').then(m => ({ default: m.DashboardModule })));
const FluxFlowModule = React.lazy(() => import('./components/modules/FluxFlowModule').then(m => ({ default: m.FluxFlowModule })));
const AdminPanel = React.lazy(() => import('./components/modules/AdminPanel').then(m => ({ default: m.AdminPanel })));

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
  points: 0,
  level: 1,
};

const PageTransition = () => (
  <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-brand-sand-50">
    <div className="w-12 h-12 border-4 border-brand-sage-200 border-t-brand-sage-500 rounded-full animate-spin"></div>
    <p className="mt-4 text-brand-sage-700 font-medium">Cargando módulo...</p>
  </div>
);

export default function App() {
  const { user, authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [onboardingInitialMode, setOnboardingInitialMode] = useState<'ask_first_time' | 'tutorial'>('ask_first_time');
  const [activeGuideId, setActiveGuideId] = useState<string | undefined>(undefined);

  // Derive currentView from location.pathname for compatibility with components expecting ViewMode string
  const currentView = location.pathname === '/' ? 'landing' : location.pathname.substring(1) as ViewMode;

  // Sincronizar el perfil del usuario desde Supabase cuando detecta una sesión activa
  useEffect(() => {
    if (!user) return;
    let isCancelled = false;

    const loadProfile = async () => {
      try {
        // Migración silenciosa de datos creados en modo invitado a la cuenta del usuario
        migrateGuestDataToSupabase(user.id).catch(() => {});

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
          setUserProfile(prev => {
            const resolvedRole = data.role || user.user_metadata?.role || (user.email?.toLowerCase().includes('admin') ? 'admin' : (prev.role || 'user'));
            return {
              ...prev,
              name: data.name || user.user_metadata?.name || user.email?.split('@')[0] || 'Miembro de FluxGlow',
              ageGroup: data.age_group || prev.ageGroup,
              goals: data.goals || prev.goals,
              avatarUrl: data.avatar_url || prev.avatarUrl || '/user.png',
              points: typeof data.points === 'number' ? data.points : (prev.points ?? 0),
              level: typeof data.level === 'number' ? data.level : (prev.level ?? 1),
              role: resolvedRole,
              isLoggedIn: true,
            };
          });
        } else {
          // Si el perfil aún no existe en profiles (ej. confirmación diferida de correo),
          // intentamos crearlo de manera transparente y proveemos fallback seguro
          const fallbackName = user.user_metadata?.name || user.email?.split('@')[0] || 'Miembro de FluxGlow';
          const fallbackRole = user.user_metadata?.role || (user.email?.toLowerCase().includes('admin') ? 'admin' : 'user');
          try {
            await supabase.from('profiles').upsert({
              id: user.id,
              name: fallbackName,
              age_group: user.user_metadata?.age_group || '19 - 24 años',
              goals: user.user_metadata?.goals || 'Gestión del Estrés, Atención Plena',
              role: fallbackRole
            }, { onConflict: 'id' });
          } catch {}

          setUserProfile(prev => ({
            ...prev,
            name: prev.name && prev.name !== 'Invitado' ? prev.name : fallbackName,
            role: fallbackRole,
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

  // Listen for global custom events to open onboarding
  useEffect(() => {
    const handleOpenTutorial = () => {
      setOnboardingInitialMode('tutorial');
      setShowOnboarding(true);
    };
    window.addEventListener('fluxglow_open_tutorial', handleOpenTutorial);
    return () => {
      window.removeEventListener('fluxglow_open_tutorial', handleOpenTutorial);
    };
  }, []);

  // Al cargar la app, consulta (select) a la tabla community_posts en Supabase
  useEffect(() => {
    fetchSupabaseCommunityPosts().then(dbPosts => {
      if (dbPosts && dbPosts.length > 0) {
        try {
          localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(dbPosts));
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
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
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
  }, [location.pathname]);

  const handleNavigate = (view: ViewMode) => {
    if (view === 'landing') {
      navigate('/');
    } else {
      navigate(`/${view}`);
    }
  };

  const handleOpenGuideById = (guideId: string) => {
    setActiveGuideId(guideId);
    handleNavigate('learn');
  };

  const handleAuthSuccess = (targetView: ViewMode, updatedProfile?: Partial<UserProfileData>) => {
    if (updatedProfile) {
      setUserProfile(prev => {
        const next = { ...prev, ...updatedProfile, isLoggedIn: true };
        try {
          localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(next));
        } catch (e) {
          console.error('Error saving profile:', e);
        }
        return next;
      });
    }
    handleNavigate(targetView || 'dashboard');
  };

  const handleUpdateProfile = (updated: Partial<UserProfileData>) => {
    setUserProfile(prev => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(next));
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
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    } catch (e) {
      console.error('Error limpiando sesión en localStorage:', e);
    }
    handleNavigate('landing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-sand-50 font-sans antialiased text-stone-800 selection:bg-brand-sage-200 selection:text-brand-sage-900">
      
      {/* Show full modules navbar when inside any application module */}
      {location.pathname !== '/' && (
        <>
          <Navbar
            currentView={currentView}
            onNavigate={handleNavigate}
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={handleToggleAmbientAudio}
            isLoggedIn={userProfile.isLoggedIn}
            onSignOut={handleSignOut}
            userPoints={userProfile.points}
            userLevel={userProfile.level}
            isAdmin={userProfile.role === 'admin'}
          />
        </>
      )}

      {/* Main Dynamic View Content with smooth motion transition */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <React.Suspense fallback={<PageTransition />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ErrorBoundary fallbackTitle="Inconveniente en la Página de Inicio">
                  <LandingPage 
                    onNavigate={handleNavigate} 
                    currentUser={userProfile}
                    onAuthSuccess={handleAuthSuccess}
                    onSignOut={handleSignOut}
                  />
                </ErrorBoundary>
              </motion.div>
            } />

            <Route path="/dashboard" element={
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ErrorBoundary fallbackTitle="Inconveniente en el Centro de Control">
                  <DashboardModule 
                    onNavigate={handleNavigate} 
                    onOpenGuideById={handleOpenGuideById}
                    userProfile={userProfile}
                    onUpdateProfile={handleUpdateProfile}
                  />
                </ErrorBoundary>
              </motion.div>
            } />

            <Route path="/flux" element={
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ErrorBoundary fallbackTitle="Inconveniente en el Flujo Flux">
                  <FluxFlowModule onNavigate={handleNavigate} />
                </ErrorBoundary>
              </motion.div>
            } />

            {/* Rutas de Aprendizaje / Explora (compatibilidad dual /learn y /explora, además de /explora/:slug) */}
            <Route path="/learn" element={
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ErrorBoundary fallbackTitle="Inconveniente en el Centro de Aprendizaje">
                  <LearnModule 
                    onNavigate={handleNavigate} 
                    initialGuideId={activeGuideId} 
                    userProfile={userProfile}
                  />
                </ErrorBoundary>
              </motion.div>
            } />

            <Route path="/explora" element={
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ErrorBoundary fallbackTitle="Inconveniente en Explora y Aprende">
                  <LearnModule 
                    onNavigate={handleNavigate} 
                    initialGuideId={activeGuideId} 
                    userProfile={userProfile}
                  />
                </ErrorBoundary>
              </motion.div>
            } />

            <Route path="/explora/:slug" element={
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ErrorBoundary fallbackTitle="Inconveniente cargando la Guía">
                  <LearnModule 
                    onNavigate={handleNavigate} 
                    userProfile={userProfile}
                  />
                </ErrorBoundary>
              </motion.div>
            } />

            {/* Diario Emocional (compatibilidad /journal y /diario) */}
            <Route path="/journal" element={
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ErrorBoundary fallbackTitle="Inconveniente en el Diario Emocional">
                  <JournalModule 
                    onNavigate={handleNavigate} 
                  />
                </ErrorBoundary>
              </motion.div>
            } />

            <Route path="/diario" element={
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ErrorBoundary fallbackTitle="Inconveniente en el Diario Emocional">
                  <JournalModule 
                    onNavigate={handleNavigate} 
                  />
                </ErrorBoundary>
              </motion.div>
            } />

            {/* Misiones Diarias (compatibilidad /missions y /misiones) */}
            <Route path="/missions" element={
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ErrorBoundary fallbackTitle="Inconveniente en el Panel de Misiones">
                  <MissionsModule 
                    onNavigate={handleNavigate} 
                    onOpenGuideById={handleOpenGuideById} 
                    userProfile={userProfile}
                    onUpdateProfile={handleUpdateProfile}
                  />
                </ErrorBoundary>
              </motion.div>
            } />

            <Route path="/misiones" element={
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ErrorBoundary fallbackTitle="Inconveniente en el Panel de Misiones">
                  <MissionsModule 
                    onNavigate={handleNavigate} 
                    onOpenGuideById={handleOpenGuideById} 
                    userProfile={userProfile}
                    onUpdateProfile={handleUpdateProfile}
                  />
                </ErrorBoundary>
              </motion.div>
            } />

            <Route path="/analytics" element={
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ErrorBoundary fallbackTitle="Inconveniente en el Análisis Preventivo">
                  <AnalyticsModule onNavigate={handleNavigate} />
                </ErrorBoundary>
              </motion.div>
            } />

            {/* Flux AI (compatibilidad /ai y /flux-ai) */}
            <Route path="/ai" element={
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ErrorBoundary fallbackTitle="Inconveniente en Flux AI">
                  <FluxAiModule userProfile={userProfile} />
                </ErrorBoundary>
              </motion.div>
            } />

            <Route path="/flux-ai" element={
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ErrorBoundary fallbackTitle="Inconveniente en Flux AI">
                  <FluxAiModule userProfile={userProfile} />
                </ErrorBoundary>
              </motion.div>
            } />

            <Route path="/alert" element={
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ErrorBoundary fallbackTitle="Inconveniente en Alerta Emocional">
                  <AlertModule />
                </ErrorBoundary>
              </motion.div>
            } />

            {/* Perfil (compatibilidad /profile y /perfil) */}
            <Route path="/profile" element={
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ErrorBoundary fallbackTitle="Inconveniente en el Perfil">
                  <ProfileModule 
                    userProfile={userProfile} 
                    onUpdateProfile={handleUpdateProfile} 
                    onNavigate={handleNavigate}
                    onSignOut={handleSignOut}
                  />
                </ErrorBoundary>
              </motion.div>
            } />

            <Route path="/perfil" element={
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ErrorBoundary fallbackTitle="Inconveniente en el Perfil">
                  <ProfileModule 
                    userProfile={userProfile} 
                    onUpdateProfile={handleUpdateProfile} 
                    onNavigate={handleNavigate}
                    onSignOut={handleSignOut}
                  />
                </ErrorBoundary>
              </motion.div>
            } />

            {/* Comunidad (compatibilidad /community y /comunidad) */}
            <Route path="/community" element={
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ErrorBoundary fallbackTitle="Inconveniente en la Comunidad">
                  <CommunityModule userProfile={userProfile} />
                </ErrorBoundary>
              </motion.div>
            } />

            <Route path="/comunidad" element={
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full h-full"
              >
                <ErrorBoundary fallbackTitle="Inconveniente en la Comunidad">
                  <CommunityModule userProfile={userProfile} />
                </ErrorBoundary>
              </motion.div>
            } />

            {/* Panel de Administración (Solo usuarios con rol === 'admin') */}
            <Route path="/admin" element={
              userProfile.role === 'admin' ? (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="w-full h-full"
                >
                  <ErrorBoundary fallbackTitle="Inconveniente en el Panel Admin">
                    <AdminPanel 
                      userProfile={userProfile} 
                      onNavigate={handleNavigate} 
                    />
                  </ErrorBoundary>
                </motion.div>
              ) : (
                <div className="w-full px-4 sm:px-6 md:px-10 py-16 text-center max-w-lg mx-auto">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-black text-stone-900 mb-2">Acceso Restringido</h2>
                  <p className="text-sm text-stone-600 mb-6">
                    Esta sección está reservada exclusivamente para administradores con el rol <code className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded text-xs font-mono font-bold">admin</code>.
                  </p>
                  <button
                    onClick={() => handleNavigate('dashboard')}
                    className="px-6 py-2.5 rounded-full bg-[#5F927B] text-white text-xs font-bold shadow-md hover:bg-[#4d7864] transition-colors cursor-pointer"
                  >
                    Volver al Centro de Control
                  </button>
                </div>
              )
            } />

            {/* Ruta de captura (404) que redirige al inicio para evitar pantalla blanca */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </React.Suspense>
        </AnimatePresence>
      </main>

      {/* Global Footer (Marketing on landing, compact on internal views) */}
      <Footer onNavigate={handleNavigate} variant={location.pathname === '/' ? 'full' : 'compact'} />

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
