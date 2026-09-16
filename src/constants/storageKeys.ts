export const STORAGE_KEYS = {
  USER_PROFILE: 'fluxglow_user_profile',
  FLUX_STREAK: 'fluxglow_flux_streak',
  LAST_FLUX_DATE: 'fluxglow_last_flux_date',
  LEARNING_STREAK: 'fluxglow_learning_streak',
  READ_GUIDES: 'fluxglow_read_guides',
  GUIDE_FAVORITES: 'fluxglow_guide_favorites',
  GUIDE_TUTORIAL_SEEN: 'fluxglow_guide_tutorial_seen',
  GUIDE_READING_PROGRESS: 'fluxglow_guide_reading_progress',
  GUIDE_RATINGS: 'fluxglow_guide_ratings',
  MISSION_SCHEDULES: 'fluxglow_mission_schedules',
  MISSION_REJECTED: 'fluxglow_mission_rejected',
  MISSION_NOTIFIED: 'fluxglow_mission_notified',
  CHAT_MESSAGES: 'fluxglow_chat_messages',
  CHAT_HISTORY_ARCHIVE: 'fluxglow_chat_history_archive',
  ONBOARDING_COMPLETED: 'fluxglow_onboarding_completed',
  FIRST_TIME_ASKED: 'fluxglow_first_time_asked',
  COMMUNITY_POSTS: 'fluxglow_community_posts',
  JOINED_GROUPS: 'fluxglow_joined_groups',
  JOURNAL_ENTRIES: 'fluxglow_journal_entries',
  DAILY_MISSIONS: 'fluxglow_daily_missions',
};

// Functions to generate dynamic keys based on userId or dynamic strings
export const getDynamicStorageKey = {
  likedPosts: (userId: string) => `fluxglow_liked_posts_${userId}`,
  journalUser: (userId: string) => `fluxglow_journal_${userId}`,
  journalMigrated: (userId: string) => `fluxglow_journal_migrated_${userId}`,
  missionsMigrated: (userId: string) => `fluxglow_missions_migrated_${userId}`,
  courseProgress: (courseId: string) => `fluxglow_course_progress_${courseId}`,
};
