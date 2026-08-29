import React, { useState, useEffect } from 'react';
import { ViewMode, UserProfileData } from './types';
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
import { OnboardingModal } from './components/common/OnboardingModal';
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
};

export default function App() {
  // Starts on the Home / Landing page as requested
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [activeGuideId, setActiveGuideId] = useState<string | undefined>(undefined);

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
    setCurrentView(targetView || 'learn');
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

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] font-sans antialiased text-stone-800 selection:bg-[#8DB596]/30 selection:text-[#2d6a4f]">
      
      {/* Show full modules navbar when inside any application module */}
      {currentView !== 'landing' && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={handleToggleAmbientAudio}
        />
      )}

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage 
            onNavigate={handleNavigate} 
            currentUser={userProfile}
            onAuthSuccess={handleAuthSuccess}
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={handleToggleAmbientAudio}
          />
        )}

        {currentView === 'learn' && (
          <LearnModule 
            onNavigate={handleNavigate} 
            initialGuideId={activeGuideId} 
          />
        )}

        {currentView === 'journal' && (
          <JournalModule 
            onNavigate={handleNavigate} 
          />
        )}

        {currentView === 'missions' && (
          <MissionsModule 
            onNavigate={handleNavigate} 
            onOpenGuideById={handleOpenGuideById} 
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsModule onNavigate={handleNavigate} />
        )}

        {currentView === 'ai' && (
          <FluxAiModule userProfile={userProfile} />
        )}

        {currentView === 'alert' && (
          <AlertModule />
        )}

        {currentView === 'profile' && (
          <ProfileModule 
            userProfile={userProfile} 
            onUpdateProfile={handleUpdateProfile} 
          />
        )}

        {currentView === 'community' && (
          <CommunityModule />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Onboarding and Platform Tour Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onNavigate={handleNavigate}
      />

    </div>
  );
}

