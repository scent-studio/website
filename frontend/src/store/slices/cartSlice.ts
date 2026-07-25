import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cartService } from '../../services/cartService';
import type { CartItem } from '../../types';

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  coupon: { code: string; discount: number; discountType: 'percentage' | 'fixed' } | null;
  discount: number;
  shipping: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  coupon: null,
  discount: 0,
  shipping: 0,
  isLoading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addItem = createAsyncThunk(
  'cart/addItem',
  async (data: { product: string; quantity: number; size?: string }, { rejectWithValue }) => {
    try {
      const response = await cartService.addToCart(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
    }
  }
);

export const updateItem = createAsyncThunk(
  'cart/updateItem',
  async ({ itemId, data }: { itemId: string; data: { quantity: number; size?: string } }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateCartItem(itemId, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
    }
  }
);

export const removeItem = createAsyncThunk(
  'cart/removeItem',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const response = await cartService.removeFromCart(itemId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart');
    }
  }
);

export const clearCartItems = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.clearCart();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    applyCoupon(state, action: PayloadAction<{ code: string; discount: number; discountType: 'percentage' | 'fixed' }>) {
      state.coupon = action.payload;
      if (action.payload.discountType === 'percentage') {
        state.discount = (state.totalPrice * action.payload.discount) / 100;
      } else {
        state.discount = action.payload.discount;
      }
    },
    removeCoupon(state) {
      state.coupon = null;
      state.discount = 0;
    },
    setShipping(state, action: PayloadAction<number>) {
      state.shipping = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items.map((item: any) => ({
          product: item.product,
          quantity: item.quantity,
          size: item.size,
        }));
        state.totalQuantity = action.payload.totalQuantity;
        state.totalPrice = action.payload.totalPrice;
        if (action.payload.coupon) {
          state.coupon = {
            code: action.payload.coupon.code,
            discount: action.payload.coupon.discount,
            discountType: action.payload.coupon.discountType,
          };
          state.discount = action.payload.discount;
        }
        state.shipping = action.payload.shipping || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items = action.payload.items.map((item: any) => ({
          product: item.product,
          quantity: item.quantity,
          size: item.size,
        }));
        state.totalQuantity = action.payload.totalQuantity;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.items = action.payload.items.map((item: any) => ({
          product: item.product,
          quantity: item.quantity,
          size: item.size,
        }));
        state.totalQuantity = action.payload.totalQuantity;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = action.payload.items.map((item: any) => ({
          product: item.product,
          quantity: item.quantity,
          size: item.size,
        }));
        state.totalQuantity = action.payload.totalQuantity;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(clearCartItems.fulfilled, (state) => {
        state.items = [];
        state.totalQuantity = 0;
        state.totalPrice = 0;
        state.coupon = null;
        state.discount = 0;
        state.shipping = 0;
      });
  },
});

export const { applyCoupon, removeCoupon, setShipping } = cartSlice.actions;
export default cartSlice.reducer;
