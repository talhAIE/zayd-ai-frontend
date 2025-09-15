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

export interface TeacherDashboardFilters {
  grade?: string;
  topicStatus?: 'completed' | 'incomplete' | 'all';
  sortBy?: 'points' | 'streak' | 'usage' | 'name' | 'completedTopics';
  sortOrder?: 'asc' | 'desc';
  minCompletedTopics?: number;
  maxCompletedTopics?: number;
}


export interface FilterOption {
  value: string;
  label: string;
}

export interface TeacherDashboardFilterValues {
  grades: string[];
  topicStatusOptions: FilterOption[];
  sortByOptions: FilterOption[];
  sortOrderOptions: FilterOption[];
}

export const fetchTeacherStudents = async (
  teacherId: string, 
  filters?: TeacherDashboardFilters
): Promise<TeacherDashboardData> => {
  try {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.grade) params.append('grade', filters.grade);
      if (filters.topicStatus && filters.topicStatus !== 'all') {
        params.append('topicStatus', filters.topicStatus);
      }
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.minCompletedTopics !== undefined) {
        params.append('minCompletedTopics', filters.minCompletedTopics.toString());
      }
      if (filters.maxCompletedTopics !== undefined) {
        params.append('maxCompletedTopics', filters.maxCompletedTopics.toString());
      }
    }
    
    const queryString = params.toString();
    const url = `/teacher-dashboard/${teacherId}${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get(url);
    
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


export const fetchTeacherDashboardFilters = async (
  teacherId: string
): Promise<TeacherDashboardFilterValues> => {
  try {
    const response = await apiClient.get(`/teacher-dashboard/${teacherId}/filters`);
    
    if (response.data.status && response.data.data) {
      return response.data.data as TeacherDashboardFilterValues;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to fetch teacher dashboard filters');
    }
    throw new Error(error.message || 'Failed to fetch teacher dashboard filters');
  }
};
