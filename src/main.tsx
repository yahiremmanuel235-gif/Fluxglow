import { STORAGE_KEYS, getDynamicStorageKey } from './constants/storageKeys';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ToastProvider } from './components/common/Toast.tsx';
import './index.css';

// Mark onboarding and first-time prompts as permanently dismissed so no initial tutorial pops up
try {
  localStorage.setItem(STORAGE_KEYS.FIRST_TIME_ASKED, 'true');
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
} catch (e) {}

// Clean legacy preview interaction data once to guarantee fresh initial state
try {
  const PREVIEW_CLEAN_KEY = 'fluxglow_preview_cleaned_v3';
  if (!localStorage.getItem(PREVIEW_CLEAN_KEY)) {
    localStorage.removeItem(STORAGE_KEYS.DAILY_MISSIONS);
    localStorage.removeItem('fluxglow_missions_streak');
    localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY_ARCHIVE);
    localStorage.removeItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.setItem(STORAGE_KEYS.FIRST_TIME_ASKED, 'true');
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    localStorage.setItem(PREVIEW_CLEAN_KEY, 'true');
  }
} catch (e) {
  console.error(e);
}

if (import.meta.env.PROD) {
  console.log = () => {};
  console.warn = () => {};
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);

