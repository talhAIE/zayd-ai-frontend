import apiClient from '@/config/ApiConfig';

export interface Section1Course {
  id: string;
  code: string;
  title: string;
  description: string;
  subject: string;
  grade: string | null;
  language: string;
  orderIndex: number;
  status: string;
  enrollmentStatus: string;
  progressPct: number;
  progressStatus: string;
  isLocked: boolean;
  totalUnits: number;
  totalLessons: number;
  completedLessons: number;
}

export interface Section1Unit {
  id: string;
  courseId: string;
  title: string;
  description: string;
  orderIndex: number;
  status: 'locked' | 'not_started' | 'in_progress' | 'completed';
  progressPct: number;
  completedLessonCount: number;
  totalLessonCount: number;
  isLocked: boolean;
}

export interface Section1Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string | null;
  lessonType: string;
  orderIndex: number;
  status: 'locked' | 'not_started' | 'in_progress' | 'completed';
  progressPct: number;
  completedRequiredModeCount: number;
  requiredModeCount: number;
  isLocked: boolean;
}

export interface Section1LessonMode {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  modeKey: string;
  modeSource: string;
  legacyTopicId: string;
  contentId: string;
  modeSessionId: string | null;
  status: 'locked' | 'not_started' | 'in_progress' | 'completed';
  isRequired: boolean;
  isLocked: boolean;
  orderIndex: number;
}

export const fetchSection1Courses = async (): Promise<Section1Course[]> => {
  const response = await apiClient.get('/learning/courses');
  return response.data.data.courses;
};

export const fetchSection1Units = async (courseId: string): Promise<Section1Unit[]> => {
  const response = await apiClient.get(`/learning/courses/${courseId}/units`);
  return response.data.data.units;
};

export const fetchSection1Lessons = async (unitId: string): Promise<Section1Lesson[]> => {
  const response = await apiClient.get(`/learning/units/${unitId}/lessons`);
  return response.data.data.lessons;
};

export const fetchSection1LessonModes = async (lessonId: string): Promise<Section1LessonMode[]> => {
  const response = await apiClient.get(`/learning/lessons/${lessonId}/modes`);
  return response.data.data.modes;
};

export const startSection1Lesson = async (lessonId: string): Promise<void> => {
  await apiClient.post(`/learning/lessons/${lessonId}/start`, {});
};

export const startSection1LessonMode = async (
  lessonModeId: string,
  resumeModeSessionId?: string
): Promise<{ modeSessionId?: string }> => {
  const response = await apiClient.post(`/learning/lesson-modes/${lessonModeId}/start`, { resumeModeSessionId });
  return response.data?.data || {};
};

export const completeSection1LessonMode = async (
  lessonModeId: string,
  payload?: { modeSessionId?: string; score?: number; timeSpentSec?: number }
): Promise<void> => {
  await apiClient.post(`/learning/lesson-modes/${lessonModeId}/complete`, payload || {});
};

export const completeSection1Lesson = async (
  lessonId: string,
  payload?: { score?: number; timeSpentSec?: number }
): Promise<void> => {
  await apiClient.post(`/learning/lessons/${lessonId}/complete`, payload || {});
};

export interface LearningComponentOption {
  label: string;
  value?: string;
  isCorrect?: boolean;
  metadata?: Record<string, any>;
}

export interface LearningComponentMatchingPair {
  leftValue: string;
  rightValue: string;
  metadata?: Record<string, any>;
}

export interface LearningComponent {
  id: string;
  lessonModeId?: string;
  componentType: string;
  title: string;
  description?: string;
  orderIndex: number;
  isRequired?: boolean;
  points?: number;
  maxAttempts?: number | null;
  feedbackPolicy?: string;
  completionRule?: string;
  content: Record<string, any>;
  options?: LearningComponentOption[];
  matchingPairs?: LearningComponentMatchingPair[];
  myAttempt?: {
    id: string;
    status: 'in_progress' | 'submitted' | 'completed' | 'exhausted';
    attemptCount: number;
    response?: Record<string, any>;
    isCorrect?: boolean | null;
    score?: number | null;
    feedback?: string | null;
  };
}

export const fetchLessonModeComponents = async (lessonModeId: string): Promise<LearningComponent[]> => {
  const response = await apiClient.get(`/learning/lesson-modes/${lessonModeId}/components`);
  return response.data.data.components;
};

export const startLearningComponent = async (componentId: string): Promise<any> => {
  const response = await apiClient.post(`/learning/components/${componentId}/start`, {});
  return response.data.data;
};

export const saveComponentAttempt = async (
  componentId: string,
  responsePayload: Record<string, any>,
  idempotencyKey?: string
): Promise<any> => {
  const formattedResponse =
    typeof responsePayload === 'object' && responsePayload !== null
      ? responsePayload
      : { value: responsePayload };

  const response = await apiClient.post(`/learning/components/${componentId}/attempt`, {
    response: formattedResponse,
    idempotencyKey:
      idempotencyKey ||
      `attempt-${componentId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
  });
  return response.data.data;
};

export const submitComponentAttempt = async (
  componentId: string,
  payload: {
    response?: Record<string, any>;
    finalResponse?: Record<string, any>;
    timeSpentSec?: number;
    idempotencyKey?: string;
  }
): Promise<any> => {
  const rawResponse = payload.finalResponse ?? payload.response ?? {};
  const formattedResponse =
    typeof rawResponse === 'object' && rawResponse !== null
      ? rawResponse
      : { value: rawResponse };

  const response = await apiClient.post(`/learning/components/${componentId}/submit`, {
    response: formattedResponse,
    finalResponse: formattedResponse,
    idempotencyKey:
      payload.idempotencyKey ||
      `submit-${componentId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    timeSpentSec: payload.timeSpentSec || 1,
  });
  return response.data.data;
};

export const revealApprovedAnswers = async (componentId: string): Promise<any> => {
  const response = await apiClient.post(`/learning/components/${componentId}/reveal-answer`, {});
  return response.data.data;
};

