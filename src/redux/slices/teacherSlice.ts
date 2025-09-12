import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchTeacherStudents, TeacherDashboardData, TeacherInfo, TeacherStudent } from '@/services/teacherService';

interface TeacherState {
  teacherInfo: TeacherInfo | null;
  students: TeacherStudent[];
  totalStudents: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: TeacherState = {
  teacherInfo: null,
  students: [],
  totalStudents: 0,
  isLoading: false,
  error: null
};

export const fetchTeacherData = createAsyncThunk(
  'teacher/fetchTeacherData',
  async (teacherId: string, { rejectWithValue }) => {
    try {
      const data = await fetchTeacherStudents(teacherId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teacher data');
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
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeacherData.fulfilled, (state, action: PayloadAction<TeacherDashboardData>) => {
        state.isLoading = false;
        state.teacherInfo = action.payload.teacherInfo;
        state.students = action.payload.students;
        state.totalStudents = action.payload.totalStudents;
        state.error = null;
      })
      .addCase(fetchTeacherData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearTeacherData, clearError } = teacherSlice.actions;
export default teacherSlice.reducer;
