import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { set } from 'date-fns';

type AuthStep = 'none' | 'login' | 'otp' | 'profile';

interface AuthState {
  step: AuthStep;
  email: string;
  isAuthenticated: boolean;
  token: string;
  refreshTokenInterval: string | null;
  user: Record<string, any> | null; // If you want a strict type, replace `Record<string, any>` with a `User` type from Supabase
  is_admin: boolean;
  admin_session_key: string | null;
  admin_session_expires_at: string | null;
}

const initialState: AuthState = {
  step: 'none',
  email: '',
  isAuthenticated: false,
  token: '',
  refreshTokenInterval: null,
  user: null,
  is_admin: false,
  admin_session_key: null,
  admin_session_expires_at: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<AuthStep>) => {
      state.step = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setRefreshTokenInterval: (state, action: PayloadAction<string>) => {
      state.refreshTokenInterval = action.payload;
    },
    setUser: (state, action: PayloadAction<Record<string, any>>) => {
      state.user = action.payload;
    },
    setAdminSession: (state, action: PayloadAction<{ admin_session_key: string; admin_session_expires_at: string }>) => {
      state.admin_session_key = action.payload.admin_session_key;
      state.admin_session_expires_at = action.payload.admin_session_expires_at;
      state.is_admin = true;
    },
    logoutAdmin: (state) => {
      state.admin_session_key = null;
      state.admin_session_expires_at = null;
      state.is_admin = false;
    },
    logout: (state) => {
      state.email = '';
      state.token = '';
      state.refreshTokenInterval = null;
      state.step = 'none';
      state.isAuthenticated = false;
      state.user = null;
      state.is_admin = false;
      state.admin_session_key = null;
      state.admin_session_expires_at = null;
    },
  },
});

export const { setStep, setEmail, setIsAuthenticated, setToken, logoutAdmin, setRefreshTokenInterval, setUser, setAdminSession, logout } =
  authSlice.actions;

export default authSlice.reducer;
