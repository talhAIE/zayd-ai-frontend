import apiClient from '@/config/ApiConfig';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define types
export interface Topic {
  id: string;
  topicName: string;
  attachmentUrl: string;
  description?: string;
  unlocksAt?: string | null;
  isCompleted?: boolean;
}

import { AvailableMode } from '@/services/topicsService';

interface TopicsState {
  topics: Topic[];
  availableModes: AvailableMode[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TopicsState = {
  topics: [],
  availableModes: [],
  isLoading: false,
  error: null
};

// Async thunk for fetching topics
export const fetchTopics = createAsyncThunk(
  'topics/fetchTopics',
  async ({ userId, topicMode }: { userId: string; topicMode: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/topic/search', {
        userId,
        topicMode
      });
      
      return response.data.data.topics as Topic[];
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch topics');
      }
      return rejectWithValue(error.message || 'Failed to fetch topics');
    }
  }
);

export const fetchAvailableModes = createAsyncThunk(
  'topics/fetchAvailableModes',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/topic/available-modes?userId=${userId}`);
      return response.data.data.modes as AvailableMode[];
    } catch (error: any) {
      if (error.response?.status === 404) {
        return [];
      }
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch available modes');
      }
      return rejectWithValue(error.message || 'Failed to fetch available modes');
    }
  }
);

// Topics slice
const topicsSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {
    clearTopics: (state) => {
      state.topics = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchTopics
      .addCase(fetchTopics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action: PayloadAction<Topic[]>) => {
        state.isLoading = false;
        state.topics = action.payload;
        state.error = null;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchAvailableModes
      .addCase(fetchAvailableModes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableModes.fulfilled, (state, action: PayloadAction<AvailableMode[]>) => {
        state.isLoading = false;
        state.availableModes = action.payload;
        state.error = null;
      })
      .addCase(fetchAvailableModes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearTopics, clearError } = topicsSlice.actions;
export default topicsSlice.reducer;