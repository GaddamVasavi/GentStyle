import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistService } from '../../services/wishlist.service';
import { Product } from '../../types/product.types';

interface WishlistState {
  items: Array<{ id: string; product: Product }>;
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistService.getWishlist();
      return response.data?.items || [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load wishlist');
    }
  }
);

export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggleWishlistItem',
  async ({ productId, isWishlisted }: { productId: string; isWishlisted: boolean }, { rejectWithValue }) => {
    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(productId);
        return { productId, action: 'removed' };
      } else {
        const res = await wishlistService.addToWishlist(productId);
        return { item: res.data, action: 'added' };
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error updating wishlist');
    }
  }
);

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action: any) => {
        if (action.payload.action === 'removed') {
          state.items = state.items.filter((i) => i.product.id !== action.payload.productId);
        } else if (action.payload.item) {
          state.items.unshift(action.payload.item);
        }
      });
  },
});

export default wishlistSlice.reducer;
