import { useState, useEffect, useCallback } from 'react';
import { UserProfileData } from '../types';

export const DEFAULT_USER_PROFILE: UserProfileData = {
  name: 'Usuario FluxGlow',
  email: 'usuario@fluxglow.com',
  ageGroup: '19 - 24 años',
  memberSince: '28 de Agosto, 2026',
  avatarUrl: '/user.png',
  goals: [
    { id: 'stress', label: 'Gestión del Estrés', checked: true },
    { id: 'mindfulness', label: 'Atención Plena', checked: true },
    { id: 'productivity', label: 'Productividad', checked: true },
    { id: 'growth', label: 'Crecimiento Personal', checked: true },
  ],
  isLoggedIn: false,
};

const STORAGE_KEY = 'fluxglow_user_profile';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfileData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Normalize any old unsplash or test placeholders
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

  const updateProfile = useCallback((updates: Partial<UserProfileData>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Error updating profile in localStorage:', e);
      }
      return next;
    });
  }, []);

  const login = useCallback((userData?: Partial<UserProfileData>) => {
    setProfile(prev => {
      const next = { ...prev, ...(userData || {}), isLoggedIn: true };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Error saving login state:', e);
      }
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    setProfile(prev => {
      const next = { ...prev, isLoggedIn: false };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Error logging out:', e);
      }
      return next;
    });
  }, []);

  // Sync back to storage if needed
  useEffect(() => {
    if (!profile.avatarUrl || profile.avatarUrl.includes('unsplash.com')) {
      updateProfile({ avatarUrl: '/user.png' });
    }
  }, [profile.avatarUrl, updateProfile]);

  return {
    profile,
    updateProfile,
    login,
    logout,
  };
}
