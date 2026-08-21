import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  completeLesson as completeLearningLesson,
  completeLessonMode as completeLearningLessonMode,
  fetchCourseUnits,
  fetchCourses,
  fetchLessonModes,
  fetchUnitLessons,
  LearningCourse,
  LearningLesson,
  LearningLessonMode,
  LearningUnit,
  startLesson as startLearningLesson,
  startLessonMode as startLearningLessonMode,
} from '@/services/learningService';

interface LearningState {
  courses: LearningCourse[];
  units: LearningUnit[];
  lessons: LearningLesson[];
  modes: LearningLessonMode[];
  loading: boolean;
  error: string | null;
}

const initialState: LearningState = {
  courses: [],
  units: [],
  lessons: [],
  modes: [],
  loading: false,
  error: null,
};

// Async Thunks
export const getCourses = createAsyncThunk(
  'learning/getCourses',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCourses();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const getUnits = createAsyncThunk(
  'learning/getUnits',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const data = await fetchCourseUnits(courseId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch units');
    }
  }
);

export const getLessons = createAsyncThunk(
  'learning/getLessons',
  async (unitId: string, { rejectWithValue }) => {
    try {
      const data = await fetchUnitLessons(unitId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lessons');
    }
  }
);

export const getLessonModes = createAsyncThunk(
  'learning/getLessonModes',
  async (lessonId: string, { rejectWithValue }) => {
    try {
      const data = await fetchLessonModes(lessonId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lesson modes');
    }
  }
);

export const startLesson = createAsyncThunk(
  'learning/startLesson',
  async (lessonId: string, { rejectWithValue }) => {
    try {
      await startLearningLesson(lessonId);
      return lessonId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start lesson');
    }
  }
);

export const startLessonMode = createAsyncThunk(
  'learning/startLessonMode',
  async (
    { lessonModeId, resumeModeSessionId }: { lessonModeId: string; resumeModeSessionId?: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await startLearningLessonMode(lessonModeId, resumeModeSessionId);
      return { lessonModeId, ...data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start lesson mode');
    }
  }
);

export const completeLessonMode = createAsyncThunk(
  'learning/completeLessonMode',
  async (
    {
      lessonModeId,
      payload,
    }: {
      lessonModeId: string;
      payload?: {
        modeSessionId?: string;
        legacyChatId?: string;
        score?: number;
        timeSpentSec?: number;
        metadataJson?: Record<string, any>;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      await completeLearningLessonMode(lessonModeId, payload);
      return { lessonModeId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete lesson mode');
    }
  }
);

export const completeLesson = createAsyncThunk(
  'learning/completeLesson',
  async (
    {
      lessonId,
      payload,
    }: {
      lessonId: string;
      payload?: { score?: number; timeSpentSec?: number };
    },
    { rejectWithValue }
  ) => {
    try {
      await completeLearningLesson(lessonId, payload);
      return { lessonId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete lesson');
    }
  }
);

const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    clearLearningState: (state) => {
      state.courses = [];
      state.units = [];
      state.lessons = [];
      state.modes = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // getCourses
      .addCase(getCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCourses.fulfilled, (state, action: PayloadAction<LearningCourse[]>) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(getCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // getUnits
      .addCase(getUnits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUnits.fulfilled, (state, action: PayloadAction<LearningUnit[]>) => {
        state.loading = false;
        state.units = action.payload;
      })
      .addCase(getUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getLessons
      .addCase(getLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLessons.fulfilled, (state, action: PayloadAction<LearningLesson[]>) => {
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(getLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getLessonModes
      .addCase(getLessonModes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLessonModes.fulfilled, (state, action: PayloadAction<LearningLessonMode[]>) => {
        state.loading = false;
        state.modes = action.payload;
      })
      .addCase(getLessonModes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // startLesson
      .addCase(startLesson.pending, (state) => {
        state.error = null;
      })
      .addCase(startLesson.fulfilled, (state, action) => {
        // Find the lesson and mark it as in_progress if it was not_started
        const lesson = state.lessons.find(l => l.id === action.payload);
        if (lesson && lesson.status === 'not_started') {
          lesson.status = 'in_progress';
        }
      })
      .addCase(startLesson.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearLearningState } = learningSlice.actions;
export default learningSlice.reducer;
