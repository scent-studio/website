import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { wishlistService } from '../../services/wishlistService';
import {
  addToLocalWishlist,
  getLocalWishlist,
  removeFromLocalWishlist,
  saveLocalWishlist,
  type WishlistItem,
} from '../../lib/wishlistStorage';
import type { Product } from '../../types';

interface WishlistState {
  items: Product[];
  wishlistIds: string[];
  isLoading: boolean;
  error: string | null;
}

function loadLocalWishlistIds(): string[] {
  return getLocalWishlist().map((item) => item._id);
}

function toWishlistItems(products: Product[]): WishlistItem[] {
  return products.map((p) => ({
    _id: p._id,
    name: p.name,
    slug: p.slug,
    images: p.images || [],
    price: p.price,
    discount: p.discount,
    discountedPrice: p.discountedPrice,
    rating: p.rating,
    numReviews: p.numReviews,
    brand: typeof p.brand === 'object' && p.brand ? { name: p.brand.name } : p.brand,
  }));
}

const initialState: WishlistState = {
  items: [],
  wishlistIds: typeof window !== 'undefined' ? loadLocalWishlistIds() : [],
  isLoading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistService.getWishlist();
      const products = response.data?.products || [];
      saveLocalWishlist(toWishlistItems(products));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await wishlistService.addToWishlist(productId);
      const products = response.data?.products || [];
      const added = products.find((p: Product) => p._id === productId);
      if (added) addToLocalWishlist(added);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await wishlistService.removeFromWishlist(productId);
      removeFromLocalWishlist(productId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlistLocal(state, action: PayloadAction<Product>) {
      const exists = state.wishlistIds.includes(action.payload._id);
      if (exists) {
        state.wishlistIds = state.wishlistIds.filter((id) => id !== action.payload._id);
        state.items = state.items.filter((item) => item._id !== action.payload._id);
        removeFromLocalWishlist(action.payload._id);
      } else {
        state.wishlistIds.push(action.payload._id);
        state.items.push(action.payload);
        addToLocalWishlist(action.payload);
      }
    },
    clearWishlist(state) {
      state.items = [];
      state.wishlistIds = [];
      saveLocalWishlist([]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.products || [];
        state.wishlistIds = (action.payload.products || []).map((p: Product) => p._id);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload.products || [];
        state.wishlistIds = (action.payload.products || []).map((p: Product) => p._id);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload.products || [];
        state.wishlistIds = (action.payload.products || []).map((p: Product) => p._id);
      });
  },
});

export const { toggleWishlistLocal, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
