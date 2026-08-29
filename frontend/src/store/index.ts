import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import productReducer from './slices/productSlice';
import wishlistReducer from './slices/wishlistSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import bespokeReducer from './slices/bespokeSlice';
import supplyChainReducer from './slices/supplyChainSlice';
import crmAnalyticsReducer from './slices/crmAnalyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    products: productReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    orders: orderReducer,
    bespoke: bespokeReducer,
    supplyChain: supplyChainReducer,
    crmAnalytics: crmAnalyticsReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
