import { STORAGE_KEYS, getDynamicStorageKey } from './constants/storageKeys';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ToastProvider } from './components/common/Toast.tsx';
import './index.css';

// Clean legacy preview interaction data once to guarantee fresh initial state
try {
  const PREVIEW_CLEAN_KEY = 'fluxglow_preview_cleaned_v2';
  if (!localStorage.getItem(PREVIEW_CLEAN_KEY)) {
    localStorage.removeItem(STORAGE_KEYS.DAILY_MISSIONS);
    localStorage.removeItem('fluxglow_missions_streak');
    localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY_ARCHIVE);
    localStorage.removeItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.FIRST_TIME_ASKED);
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    localStorage.removeItem(STORAGE_KEYS.GUIDE_TUTORIAL_SEEN);
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

