import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import {
  fetchProducts,
  fetchProduct,
  fetchFeatured,
  fetchTrending,
  fetchBestSellers,
  fetchNewArrivals,
  fetchRelated,
  setFilters,
  clearFilters,
  setPage,
  setSort,
} from '../store/slices/productSlice';
import type { FilterState, SortOption } from '../types';

export function useProducts() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    products,
    product,
    featured,
    trending,
    bestSellers,
    newArrivals,
    related,
    loading,
    error,
    filters,
    pagination,
    sort,
  } = useSelector((state: RootState) => state.products);

  const getProducts = useCallback(
    (params?: { page?: number; limit?: number; sort?: SortOption; filters?: Partial<FilterState> }) =>
      dispatch(fetchProducts(params || {})).unwrap(),
    [dispatch]
  );

  const getProduct = useCallback(
    (idOrSlug: string) => dispatch(fetchProduct(idOrSlug)).unwrap(),
    [dispatch]
  );

  const getFeaturedProducts = useCallback(
    () => dispatch(fetchFeatured()).unwrap(),
    [dispatch]
  );

  const getTrendingProducts = useCallback(
    () => dispatch(fetchTrending()).unwrap(),
    [dispatch]
  );

  const getBestSellersProducts = useCallback(
    () => dispatch(fetchBestSellers()).unwrap(),
    [dispatch]
  );

  const getNewArrivalsProducts = useCallback(
    () => dispatch(fetchNewArrivals()).unwrap(),
    [dispatch]
  );

  const getRelatedProducts = useCallback(
    (productId: string) => dispatch(fetchRelated(productId)).unwrap(),
    [dispatch]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<FilterState>) => dispatch(setFilters(newFilters)),
    [dispatch]
  );

  const resetFilters = useCallback(() => dispatch(clearFilters()), [dispatch]);

  const changePage = useCallback(
    (page: number) => dispatch(setPage(page)),
    [dispatch]
  );

  const changeSort = useCallback(
    (sortOption: SortOption) => dispatch(setSort(sortOption)),
    [dispatch]
  );

  useEffect(() => {
    if (products.length === 0 && !loading) {
      getProducts();
    }
  }, []);

  return {
    products,
    product,
    featured,
    trending,
    bestSellers,
    newArrivals,
    related,
    loading,
    error,
    filters,
    pagination,
    sort,
    getProducts,
    getProduct,
    getFeaturedProducts,
    getTrendingProducts,
    getBestSellersProducts,
    getNewArrivalsProducts,
    getRelatedProducts,
    updateFilters,
    resetFilters,
    changePage,
    changeSort,
  };
}
