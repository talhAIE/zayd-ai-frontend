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
