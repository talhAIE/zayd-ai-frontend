import apiClient from '@/config/ApiConfig';

export interface TeacherInfo {
  id: string;
  name: string;
  username: string;
}

export interface TeacherStudent {
  id: string;
  studentName: string;
  grade: string;
  cefrLevel: string;
  currentStreak: number;
  usage: number;
  totalPoints: number;
  completedTopics: number;
}

export interface TeacherDashboardData {
  teacherInfo: TeacherInfo;
  students: TeacherStudent[];
  totalStudents: number;
}

export interface UsageGraphData {
  date: string;
  duration: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  pointValue: number;
  awardedAt: string;
  iconUrl: string;
  category: string;
}

export interface TopicsByMode {
  completed: number;
  incomplete: number;
  total: number;
}

export type TopicsCompletedPerMode = Record<string, TopicsByMode>;

export interface StudentProfileData {
  id: string;
  studentName: string;
  grade: string;
  schoolName: string;
  cefrLevel: string;
  totalPoints: number;
  usage: number;
  currentStreak: number;
  longestStreak: number;
  totalLoginDays: number;
  usageGraphData: UsageGraphData[];
  achievements: Achievement[];
  topicsByMode: TopicsCompletedPerMode;
}

export const fetchTeacherStudents = async (teacherId: string): Promise<TeacherDashboardData> => {
  try {
    const response = await apiClient.get(`/teacher-dashboard/${teacherId}`);
    
    if (response.data.status && response.data.data) {
      return response.data.data as TeacherDashboardData;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to fetch teacher students');
    }
    throw new Error(error.message || 'Failed to fetch teacher students');
  }
};

export const fetchStudentProfile = async (teacherId: string, studentId: string): Promise<StudentProfileData> => {
  try {
    const response = await apiClient.get(`/teacher-dashboard/${teacherId}/student/${studentId}`);
    
    if (response.data.status && response.data.data) {
      return response.data.data as StudentProfileData;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to fetch student profile');
    }
    throw new Error(error.message || 'Failed to fetch student profile');
  }
};
