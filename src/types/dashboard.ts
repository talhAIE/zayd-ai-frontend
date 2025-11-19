export interface UserInfo {
  firstName: string;
  lastName: string;
  schoolName: string;
  class: string;
  cefrLevel: string;
  aiCefrLevel: string;
}

export interface UsageRecord {
  date: string;
  duration: number;
}

export interface CompletedTopics {
  [key: string]: number;
}

export interface TopicsByMode {
  completed: number;
  incomplete: number;
  total: number;
}

export interface AssessmentAverages {
  averageAccuracy: number;
  averageFluency: number;
  averagePronunciation: number;
  totalAssessmentScore: number;
}

export interface AssessmentGraphData {
  date: string;
  averageAccuracy: number;
  averageFluency: number;
  averagePronunciation: number;
  totalAssessmentScore: number;
}

export interface DashboardData {
  userInfo: UserInfo;
  dailyUsage: number;
  usageRecords: UsageRecord[];
  streak: number;
  longestStreak: number;
  completedTopics: CompletedTopics;
  topicsByMode?: {
    [key: string]: TopicsByMode;
  };
  assessmentAverages?: AssessmentAverages;
  assessmentGraphData?: AssessmentGraphData[];
}

export interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
}