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

interface TopicsState {
  topics: Topic[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TopicsState = {
  topics: [],
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
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch topics');
      }
      return rejectWithValue(error.message || 'Failed to fetch topics');
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
      });
  }
});

export const { clearTopics, clearError } = topicsSlice.actions;
export default topicsSlice.reducer;