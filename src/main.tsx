import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ToastProvider } from './components/common/Toast.tsx';
import './index.css';

// Clean legacy preview interaction data once to guarantee fresh initial state
try {
  const PREVIEW_CLEAN_KEY = 'fluxglow_preview_cleaned_v2';
  if (!localStorage.getItem(PREVIEW_CLEAN_KEY)) {
    localStorage.removeItem('fluxglow_daily_missions');
    localStorage.removeItem('fluxglow_missions_streak');
    localStorage.removeItem('fluxglow_chat_messages');
    localStorage.removeItem('fluxglow_chat_history_archive');
    localStorage.removeItem('fluxglow_journal_entries');
    localStorage.removeItem('fluxglow_user_profile');
    localStorage.removeItem('fluxglow_first_time_asked');
    localStorage.removeItem('fluxglow_onboarding_completed');
    localStorage.removeItem('fluxglow_guide_tutorial_seen');
    localStorage.setItem(PREVIEW_CLEAN_KEY, 'true');
  }
} catch (e) {
  console.error(e);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
);

