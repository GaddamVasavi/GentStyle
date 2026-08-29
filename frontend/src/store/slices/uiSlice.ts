import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface UiState {
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'forgot-password';
  isMobileNavOpen: boolean;
  isCartDrawerOpen: boolean;
  toasts: Toast[];
}

const initialState: UiState = {
  isAuthModalOpen: false,
  authModalMode: 'login',
  isMobileNavOpen: false,
  isCartDrawerOpen: false,
  toasts: [],
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAuthModal: (state, action: PayloadAction<'login' | 'register' | 'forgot-password'>) => {
      state.authModalMode = action.payload;
      state.isAuthModalOpen = true;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    toggleMobileNav: (state) => {
      state.isMobileNavOpen = !state.isMobileNavOpen;
    },
    closeMobileNav: (state) => {
      state.isMobileNavOpen = false;
    },
    toggleCartDrawer: (state) => {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = Date.now().toString();
      state.toasts.push({ ...action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  openAuthModal,
  closeAuthModal,
  toggleMobileNav,
  closeMobileNav,
  toggleCartDrawer,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
