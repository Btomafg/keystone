import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthStep = 'none' | 'login' | 'otp' | 'profile';

interface AuthState {
  step: AuthStep;
  email: string;
  isAuthenticated: boolean;
  token: string;
  refreshTokenInterval: string | null;
  user: Record<string, any> | null; // If you want a strict type, replace `Record<string, any>` with a `User` type from Supabase
}

const initialState: AuthState = {
  step: 'none',
  email: '',
  isAuthenticated: false,
  token: '',
  refreshTokenInterval: null,
  user: null,
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
    logout: (state) => {
      state.email = '';
      state.token = '';
      state.refreshTokenInterval = null;
      state.step = 'none';
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { setStep, setEmail, setIsAuthenticated, setToken, setRefreshTokenInterval, setUser, logout } = authSlice.actions;

export default authSlice.reducer;
