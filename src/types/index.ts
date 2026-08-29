export type ViewMode = 
  | 'landing'
  | 'learn'
  | 'missions'
  | 'journal'
  | 'analytics'
  | 'ai'
  | 'alert'
  | 'profile'
  | 'community';

export type MoodType = 
  | 'Feliz'
  | 'Tranquilo'
  | 'Motivado'
  | 'Ansioso'
  | 'Estresado'
  | 'Triste'
  | 'Enojado'
  | 'Abrumado'
  | 'feliz'
  | 'tranquilo'
  | 'ansioso'
  | 'triste'
  | 'enojado';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  time?: string;
  mood: MoodType;
  intensity: number;
  notes: string;
  triggers: string[];
  habits?: {
    sleepHours?: number;
    waterGlasses?: number;
    exercised?: boolean;
    energyLevel?: number;
  };
  aiFeedback?: string;
}

export interface EmotionEntry {
  id: string;
  date: string;
  timestamp: string;
  mood: MoodType;
  intensity: number; // 1 to 10
  tags: string[];
  notes: string;
  voiceTranscript?: string;
  sleepHours: number;
  waterGlasses: number;
  physicalActivity: string;
  energyLevel: number; // 1 to 5
  aiAnalysis?: {
    dominantEmotion: string;
    sentimentScore: number;
    keywords: string[];
    aiInsight: string;
    suggestedAction: string;
  };
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface GuideExplainedSection {
  heading: string;
  text: string;
  bulletPoints?: string[];
}

export interface GuideDailyMission {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  xp: number;
}

export interface GuideItem {
  id: string;
  badge: string;
  title: string;
  image: string;
  isFavorite?: boolean;
  category: string;
  author: string;
  readTime: string;
  isDemoContent?: boolean;
  simpleSummary: string;
  demoNotice?: string;
  explainedContent: GuideExplainedSection[];
  glossary?: GlossaryItem[];
  extraTips: string[];
  dailyMissions: GuideDailyMission[];
  content?: string[]; // Legacy fallback
}

export interface UserDailyMissionRecord {
  id: string;
  missionId: string;
  guideId: string;
  guideTitle: string;
  title: string;
  description: string;
  category: string;
  xp: number;
  timeEstimate: string;
  status: 'pending' | 'completed' | 'expired';
  createdAt: string;
  completedAt?: string;
}

export interface VideoPodcastItem {
  id: string;
  title: string;
  author: string;
  duration: string;
  views: string;
  timeAgo: string;
  image: string;
  type: 'video' | 'podcast';
  category: string;
  url?: string;
  description: string;
}

export interface InstantPracticeItem {
  id: string;
  title: string;
  shortDesc: string;
  badge: string;
  category: string;
  duration: string;
  type: 'breathing' | 'focus_timer' | 'grounding' | 'stress_release' | 'gratitude_express';
  image: string;
  benefits: string[];
}

export interface LearnResource {
  id: string;
  category: 'articulos' | 'videos' | 'podcasts' | 'guias' | 'tests' | 'libros';
  title: string;
  author: string;
  durationOrPages: string;
  difficultyOrAge: string;
  tags: string[];
  summary: string;
  fullContent?: string;
  audioUrlOrLength?: string;
  rating: number;
  badge?: string;
}

export interface PsychologicalTest {
  id: string;
  title: string;
  subtitle?: string;
  shortDesc: string;
  duration: string;
  questionsCount: number;
  category: string;
  instructions?: string;
  questions: {
    id: number;
    text: string;
    options: { label?: string; text?: string; value?: number; score?: number }[];
  }[];
  interpretations: {
    minScore: number;
    maxScore: number;
    level: string;
    color?: string;
    description: string;
    recommendation?: string;
    recommendations?: string[];
  }[];
}

export interface CommunityPost {
  id: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  avatarColor?: string;
  timeAgo: string;
  content: string;
  category: string;
  tags?: string[];
  likes: number;
  hugs: number;
  commentsCount?: number;
  comments: {
    id: string;
    author: string;
    text: string;
    timeAgo: string;
  }[];
}

export interface WellnessChallenge {
  id: string;
  title: string;
  description: string;
  daysTotal: number;
  participantsCount: number;
  category: string;
}

export interface WellnessGoal {
  id: string;
  title: string;
  category: string;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
}

export interface UserBadge {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlockedAt: string;
}

export interface UserProfileData {
  name: string;
  email: string;
  ageGroup?: string;
  memberSince?: string;
  avatarUrl?: string;
  goals: { id: string; label: string; checked: boolean }[];
  isLoggedIn?: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  streakDays: number;
  wellnessScore: number;
  goals: WellnessGoal[];
  badges: UserBadge[];
  aiPersonalityInsight?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  notifyOnAlert: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  subtitle: string;
  avatar: string;
  bio: string;
  functions: string[];
  accentColor: string;
}
