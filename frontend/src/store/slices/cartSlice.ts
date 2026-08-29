import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services/cart.service';
import { CartItem, CartSummary } from '../../types/cart.types';

interface CartState {
  items: CartItem[];
  summary: CartSummary;
  isLoading: boolean;
  isDrawerOpen: boolean;
  error: string | null;
}

const initialSummary: CartSummary = {
  subtotal: 0,
  taxTotal: 0,
  shippingFee: 0,
  discountTotal: 0,
  grandTotal: 0,
  itemCount: 0,
};

const initialState: CartState = {
  items: [],
  summary: initialSummary,
  isLoading: false,
  isDrawerOpen: false,
  error: null,
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const res = await cartService.getCart();
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    payload: { productId: string; variantId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await cartService.addItem(payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async ({ itemId, quantity }: { itemId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const res = await cartService.updateQuantity(itemId, quantity);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update item quantity');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const res = await cartService.removeItem(itemId);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove item');
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCartDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    openCartDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isDrawerOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload?.cart?.items || [];
        state.summary = action.payload?.summary || initialSummary;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add To Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload?.cart?.items || [];
        state.summary = action.payload?.summary || initialSummary;
        state.isDrawerOpen = true;
      })
      // Update Quantity
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.items = action.payload?.cart?.items || [];
        state.summary = action.payload?.summary || initialSummary;
      })
      // Remove Item
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = action.payload?.cart?.items || [];
        state.summary = action.payload?.summary || initialSummary;
      });
  },
});

export const { toggleCartDrawer, openCartDrawer, closeCartDrawer } = cartSlice.actions;
export default cartSlice.reducer;
