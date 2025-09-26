import apiClient from '@/config/ApiConfig';

export interface TeacherInfo {
  id: string;
  name: string;
  username: string;
}

export interface TeacherStudent {
  id: string;
  studentName: string;
  class: string;
  cefrLevel: string;
  currentStreak: number;
  usage: number;
  totalPoints: number;
  completedTopics: number;
  totalTopics: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface TeacherDashboardData {
  teacherInfo: TeacherInfo;
  students: TeacherStudent[];
  totalStudents: number;
  pagination: PaginationInfo;
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
  class: string;
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
  class?: string;
  topicStatus?: 'completed' | 'incomplete' | 'all';
  sortBy?: 'points' | 'streak' | 'usage' | 'name' | 'completedTopics';
  sortOrder?: 'asc' | 'desc';
  minCompletedTopics?: number;
  maxCompletedTopics?: number;
  timeFilter?: 'daily' | 'weekly' | 'monthly' | 'all';
  page?: number;
  limit?: number;
  search?: string;
}


export interface FilterOption {
  value: string;
  label: string;
}

export interface TeacherDashboardFilterValues {
  classes: string[];
  topicStatusOptions: FilterOption[];
  sortByOptions: FilterOption[];
  sortOrderOptions: FilterOption[];
}

export interface BulkReportStudent {
  id: string;
  studentName: string;
  class: string;
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

export interface BulkReportData {
  teacherInfo: TeacherInfo;
  students: BulkReportStudent[];
}

export const fetchTeacherStudents = async (
  teacherId: string, 
  filters?: TeacherDashboardFilters
): Promise<TeacherDashboardData> => {
  try {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.class) params.append('class', filters.class);
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
      if (filters.timeFilter && filters.timeFilter !== 'all') {
        params.append('timeFilter', filters.timeFilter);
      }
      if (filters.page !== undefined) {
        params.append('page', filters.page.toString());
      }
      if (filters.limit !== undefined) {
        params.append('limit', filters.limit.toString());
      }
      if (filters.search) {
        params.append('search', filters.search);
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

export const fetchBulkStudentReports = async (
  teacherId: string,
  studentIds?: string[]
): Promise<BulkReportData> => {
  try {
    const params = new URLSearchParams();
    if (studentIds && studentIds.length > 0) {
      params.append('studentIds', studentIds.join(','));
    }
    
    const queryString = params.toString();
    const url = `/teacher-dashboard/${teacherId}/students/bulk-report${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get(url);
    
    if (response.data.status && response.data.data) {
      return response.data.data as BulkReportData;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to fetch bulk reports');
    }
    throw new Error(error.message || 'Failed to fetch bulk reports');
  }
};

export const fetchAllTeacherStudents = async (
  teacherId: string, 
  filters?: Omit<TeacherDashboardFilters, 'page' | 'limit'>
): Promise<TeacherStudent[]> => {
  try {
    const allStudents: TeacherStudent[] = [];
    let currentPage = 1;
    let hasMore = true;
    const pageSize = 100;
    
    while (hasMore) {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.class) params.append('class', filters.class);
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
        if (filters.timeFilter && filters.timeFilter !== 'all') {
          params.append('timeFilter', filters.timeFilter);
        }
        if (filters.search) {
          params.append('search', filters.search);
        }
      }
      
      params.append('limit', pageSize.toString());
      params.append('page', currentPage.toString());
      
      const queryString = params.toString();
      const url = `/teacher-dashboard/${teacherId}${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(url);
      
      if (response.data.status && response.data.data) {
        const pageData = response.data.data as TeacherDashboardData;
        const students = pageData.students;
        
        if (students && students.length > 0) {
          allStudents.push(...students);
          currentPage++;
          
          hasMore = pageData.pagination?.hasNext || false;
        } else {
          hasMore = false;
        }
      } else {
        throw new Error('Invalid response format');
      }
    }
    
    return allStudents;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to fetch all teacher students');
    }
    throw new Error(error.message || 'Failed to fetch all teacher students');
  }
};

export const downloadIndividualStudentReport = async (
  teacherId: string,
  studentId: string
): Promise<StudentProfileData> => {
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
