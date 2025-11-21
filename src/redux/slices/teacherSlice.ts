import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchTeacherStudents, TeacherDashboardData, TeacherInfo, TeacherStudent, TeacherDashboardFilters, fetchTeacherDashboardFilters, TeacherDashboardFilterValues, PaginationInfo, TeacherDashboardSummary } from '@/services/teacherService';

interface TeacherState {
  teacherInfo: TeacherInfo | null;
  students: TeacherStudent[];
  totalStudents: number;
  pagination: PaginationInfo | null;
  summary: TeacherDashboardSummary | null;
  isLoading: boolean;
  error: string | null;
  currentFilters: TeacherDashboardFilters;
  filterValues: TeacherDashboardFilterValues | null;
  filterValuesLoading: boolean;
  filterValuesError: string | null;
}

const initialState: TeacherState = {
  teacherInfo: null,
  students: [],
  totalStudents: 0,
  pagination: null,
  summary: null,
  isLoading: false,
  error: null,
  currentFilters: {
    sortBy: 'points',
    sortOrder: 'desc'
  },
  filterValues: null,
  filterValuesLoading: false,
  filterValuesError: null
};

export const fetchTeacherData = createAsyncThunk(
  'teacher/fetchTeacherData',
  async ({ teacherId, filters }: { teacherId: string; filters?: TeacherDashboardFilters }, { rejectWithValue }) => {
    try {
      const data = await fetchTeacherStudents(teacherId, filters);
      return { data, filters: filters || {} };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teacher data');
    }
  }
);

export const fetchTeacherFilterValues = createAsyncThunk(
  'teacher/fetchTeacherFilterValues',
  async (teacherId: string, { rejectWithValue }) => {
    try {
      const data = await fetchTeacherDashboardFilters(teacherId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teacher filter values');
    }
  }
);

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    clearTeacherData: (state) => {
      state.teacherInfo = null;
      state.students = [];
      state.totalStudents = 0;
      state.pagination = null;
      state.summary = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearFilterValuesError: (state) => {
      state.filterValuesError = null;
    },
    updateFilters: (state, action: PayloadAction<Partial<TeacherDashboardFilters>>) => {
      state.currentFilters = { ...state.currentFilters, ...action.payload };
    },
    resetFilters: (state) => {
      state.currentFilters = {
        sortBy: 'points',
        sortOrder: 'desc'
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeacherData.fulfilled, (state, action: PayloadAction<{ data: TeacherDashboardData; filters: TeacherDashboardFilters }>) => {
        state.isLoading = false;
        state.teacherInfo = action.payload.data.teacherInfo;
        state.students = action.payload.data.students;
        state.totalStudents = action.payload.data.totalStudents;
        state.pagination = action.payload.data.pagination;
        state.summary = action.payload.data.summary || null;
        state.currentFilters = action.payload.filters;
        state.error = null;
      })
      .addCase(fetchTeacherData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTeacherFilterValues.pending, (state) => {
        state.filterValuesLoading = true;
        state.filterValuesError = null;
      })
      .addCase(fetchTeacherFilterValues.fulfilled, (state, action: PayloadAction<TeacherDashboardFilterValues>) => {
        state.filterValuesLoading = false;
        state.filterValues = action.payload;
        state.filterValuesError = null;
      })
      .addCase(fetchTeacherFilterValues.rejected, (state, action) => {
        state.filterValuesLoading = false;
        state.filterValuesError = action.payload as string;
      });
  }
});

export const { clearTeacherData, clearError, clearFilterValuesError, updateFilters, resetFilters } = teacherSlice.actions;
export default teacherSlice.reducer;
