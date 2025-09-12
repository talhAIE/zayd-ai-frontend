import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import coursesReducer from './slices/coursesSlice';
import topicsReducer from './slices/topicsSlice';
import leaderBoardReducer from './slices/leaderboardSlice';
import dashboardReducer from './slices/dashboardSlice';
import teacherReducer from './slices/teacherSlice';
import studentProfileReducer from './slices/studentProfileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    topics: topicsReducer,
    leaderboard: leaderBoardReducer,
    dashboard: dashboardReducer,
    teacher: teacherReducer,
    studentProfile: studentProfileReducer
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;