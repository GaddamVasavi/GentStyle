import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types/auth.types';
import { authService, LoginDto, RegisterDto } from '../../services/auth.service';

const getStoredUser = (): User | null => {
  try {
    const item = localStorage.getItem('gentstyle_user');
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getStoredUser(),
  accessToken: localStorage.getItem('gentstyle_access_token'),
  isAuthenticated: !!localStorage.getItem('gentstyle_access_token'),
  isLoading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterDto, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      localStorage.setItem('gentstyle_access_token', response.data.tokens.accessToken);
      localStorage.setItem('gentstyle_user', JSON.stringify(response.data.user));
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: LoginDto, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      localStorage.setItem('gentstyle_access_token', response.data.tokens.accessToken);
      localStorage.setItem('gentstyle_user', JSON.stringify(response.data.user));
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await authService.logout();
  } finally {
    localStorage.removeItem('gentstyle_access_token');
    localStorage.removeItem('gentstyle_user');
  }
});

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getMe();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Session expired');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('gentstyle_user', JSON.stringify(action.payload));
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })
      // Current User
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
