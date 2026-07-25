import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';
import type { Product, FilterState, SortOption, PaginationState, PaginatedResponse } from '../../types';

interface ProductState {
  products: Product[];
  product: Product | null;
  featured: Product[];
  trending: Product[];
  bestSellers: Product[];
  newArrivals: Product[];
  related: Product[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
  pagination: PaginationState;
  sort: SortOption;
}

const initialPagination: PaginationState = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
};

const initialFilters: FilterState = {
  categories: [],
  brands: [],
  priceRange: [0, 100000],
  sizes: [],
  gender: [],
  rating: null,
  search: '',
  tags: [],
  inStock: null,
};

const initialState: ProductState = {
  products: [],
  product: null,
  featured: [],
  trending: [],
  bestSellers: [],
  newArrivals: [],
  related: [],
  loading: false,
  error: null,
  filters: initialFilters,
  pagination: initialPagination,
  sort: 'newest',
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: {
    page?: number;
    limit?: number;
    sort?: SortOption;
    search?: string;
    filters?: Partial<FilterState>;
  }, { rejectWithValue }) => {
    try {
      const data = await productService.getProducts({
        page: params.page || 1,
        limit: params.limit || 12,
        sort: params.sort,
        search: params.search || params.filters?.search,
        category: params.filters?.categories?.join(','),
        brand: params.filters?.brands?.join(','),
        minPrice: params.filters?.priceRange?.[0],
        maxPrice: params.filters?.priceRange?.[1],
        gender: params.filters?.gender?.join(','),
        inStock: params.filters?.inStock ?? undefined,
        tags: params.filters?.tags?.join(','),
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (idOrSlug: string, { rejectWithValue }) => {
    try {
      const isSlug = idOrSlug.includes('-') || isNaN(Number(idOrSlug));
      const response = isSlug
        ? await productService.getProductBySlug(idOrSlug)
        : await productService.getProduct(idOrSlug);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const fetchFeatured = createAsyncThunk(
  'products/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const data = await productService.getFeatured();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

export const fetchTrending = createAsyncThunk(
  'products/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const data = await productService.getTrending();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trending products');
    }
  }
);

export const fetchBestSellers = createAsyncThunk(
  'products/fetchBestSellers',
  async (_, { rejectWithValue }) => {
    try {
      const data = await productService.getBestSellers();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch best sellers');
    }
  }
);

export const fetchNewArrivals = createAsyncThunk(
  'products/fetchNewArrivals',
  async (_, { rejectWithValue }) => {
    try {
      const data = await productService.getNewArrivals();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch new arrivals');
    }
  }
);

export const fetchRelated = createAsyncThunk(
  'products/fetchRelated',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await productService.getRelated(productId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch related products');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<FilterState>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    clearFilters(state) {
      state.filters = initialFilters;
      state.pagination.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.pagination.page = action.payload;
    },
    setSort(state, action: PayloadAction<SortOption>) {
      state.sort = action.payload;
      state.pagination.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.pagination = {
          page: action.payload.pagination?.page ?? 1,
          limit: action.payload.pagination?.limit ?? 12,
          total: action.payload.pagination?.total ?? 0,
          totalPages: action.payload.pagination?.totalPages ?? 1,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload as Product;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFeatured.fulfilled, (state, action) => {
        state.featured = action.payload.data;
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.trending = action.payload.data;
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.bestSellers = action.payload.data;
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.newArrivals = action.payload.data;
      })
      .addCase(fetchRelated.fulfilled, (state, action) => {
        state.related = action.payload as unknown as Product[];
      });
  },
});

export const { setFilters, clearFilters, setPage, setSort } = productSlice.actions;
export default productSlice.reducer;
