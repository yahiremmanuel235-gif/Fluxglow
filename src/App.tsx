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
  
  // Persistent user profile state connected across register, login & profile personalization
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => {
    try {
      const saved = localStorage.getItem('fluxglow_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Replace legacy unsplash, old test credentials, or missing avatars with clean official defaults
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

  // Ensure legacy cached avatars or emails in localStorage are migrated
  useEffect(() => {
    if (!userProfile.avatarUrl || userProfile.avatarUrl.includes('unsplash.com') || userProfile.email === 'yahiremmanuel235@gmail.com') {
      setUserProfile(prev => {
        const next = { 
          ...prev, 
          avatarUrl: '/user.png',
          email: prev.email === 'yahiremmanuel235@gmail.com' ? 'usuario@fluxglow.com' : prev.email
        };
        try {
          localStorage.setItem('fluxglow_user_profile', JSON.stringify(next));
        } catch (e) {
          console.error('Error updating profile storage:', e);
        }
        return next;
      });
    }
  }, []);

  // Scroll to top when changing views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
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
          <LearnModule />
        )}

        {currentView === 'journal' && (
          <JournalModule />
        )}

        {currentView === 'analytics' && (
          <AnalyticsModule />
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

    </div>
  );
}

