import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '@/types/auth';

export type UserRole = 'student' | 'teacher';

export interface AuthResponse {
  status: string;
  message: string;
  user: User;
  token?: string; // Optional token if API provides it
}

export interface LoginCredentials {
  username: string;
}

export interface PhoneNumberCredentials {
  username: string;
  phoneNumber: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Initialize state from localStorage
const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('AiTutorUser') || 'null'),
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  isAuthenticated: Boolean(localStorage.getItem('AiTutorUser')),
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`, credentials);
      
      const data = response.data as AuthResponse;
      
      const userWithRole = {
        ...data.user,
        role: 'student' as UserRole
      };
      
      localStorage.setItem('AiTutorUser', JSON.stringify(userWithRole));
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return {
        user: userWithRole,
        token: data.token || null,
        message: data.message
      };
    } catch (error: any) {
      // Handle errors from the API
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'An unknown error occurred');
      }
      return rejectWithValue(error.message || 'An unknown error occurred');
    }
  }
);

// Add phone number thunk
export const addPhoneNumber = createAsyncThunk(
  'auth/addPhoneNumber',
  async (credentials: PhoneNumberCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/add-phone`,
        credentials
      );
      
      const data = response.data as AuthResponse;
      
      const userWithRole = {
        ...data.user,
        role: 'student' as UserRole
      };
      
      localStorage.setItem('AiTutorUser', JSON.stringify(userWithRole));
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return {
        user: userWithRole,
        token: data.token || null,
        message: data.message
      };
    } catch (error: any) {
      // Handle errors from the API
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'An unknown error occurred');
      }
      return rejectWithValue(error.message || 'An unknown error occurred');
    }
  }
);

// Logout thunk
export const logout = createAsyncThunk('auth/logout', async (_, { }) => {
  // Clear localStorage
  localStorage.removeItem('AiTutorUser');
  localStorage.removeItem('token');
  
  return null;
});

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Add phone number
      .addCase(addPhoneNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPhoneNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(addPhoneNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;