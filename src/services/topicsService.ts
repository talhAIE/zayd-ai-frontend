import apiClient from '@/config/ApiConfig';
import { Topic } from '@/redux/slices/topicsSlice';
import { ChapterTopicsResponse, Chapter } from '@/types/chapter.types';

// Update interface to match backend response structure
export interface TopicsResponse {
  statusMessage: string;
  data: {
    topics?: Topic[];
    chapters?: Chapter[];
    isChapterBased: boolean;
  };
}

export interface AvailableMode {
  mode: string;
  topicMode: string;
  displayName: string;
  isAvailable: boolean;
  isChapterBased: boolean;
  totalItems: number;
  children?: AvailableMode[];
}

export interface AvailableModesResponse {
  statusMessage: string;
  data: {
    modes: AvailableMode[];
  };
}

export const TopicService = {
  getAvailableModes: (userId: string) => {
    return apiClient.get<AvailableModesResponse>(`/topic/available-modes?userId=${userId}`);
  },

  getTopics: (userId: string, topicMode: string) => {
    return apiClient.post<TopicsResponse>('/topic/search', {
      userId,
      topicMode
    });
  },

  getTopicById: (topicId: string) => {
    return apiClient.get<{ status: string; data: Topic }>(`/topics/${topicId}`);
  },

  getChapterTopics: (chapterId: string, userId: string) => {
    return apiClient.get<ChapterTopicsResponse>(`/topic/chapter/${chapterId}/topics?userId=${userId}`);
  },

};

export default TopicService;