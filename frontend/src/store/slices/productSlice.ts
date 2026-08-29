import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '../../types/product.types';
import { productService, ProductQuery } from '../../services/product.service';

interface ProductState {
  items: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: ProductState = {
  items: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 24,
    total: 0,
    totalPages: 1,
  },
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (query: ProductQuery | undefined, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(query);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch catalog products');
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  'products/fetchProductBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await productService.getProductBySlug(slug);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Product not found');
    }
  }
);

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        if (action.payload.meta) {
          state.pagination = action.payload.meta;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch By Slug
      .addCase(fetchProductBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
