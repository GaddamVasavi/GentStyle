import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService, PlaceOrderPayload } from '../../services/order.service';
import { Order } from '../../types/order.types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
};

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (payload: PlaceOrderPayload, { rejectWithValue }) => {
    try {
      const res = await orderService.placeOrder(payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to place order');
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (params: { page?: number; limit?: number } | void, { rejectWithValue }) => {
    try {
      const page = params?.page;
      const limit = params?.limit;
      const res = await orderService.getUserOrders(page, limit);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load order history');
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await orderService.getOrderDetails(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Order details not found');
    }
  }
);

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.data;
        if (action.payload.meta) {
          state.pagination = action.payload.meta;
        }
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Order Details
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      });
  },
});

export default orderSlice.reducer;
