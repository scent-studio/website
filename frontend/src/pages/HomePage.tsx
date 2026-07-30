import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchFeatured, fetchBestSellers, fetchNewArrivals, fetchProducts } from '../store/slices/productSlice';
import HeroSlider from '../components/home/HeroSlider';
import FeaturedCollections from '../components/home/FeaturedCollections';
import CategoryShowcase from '../components/home/CategoryShowcase';
import ProductGrid from '../components/home/ProductGrid';
import BannerPromo from '../components/home/BannerPromo';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import FAQSection from '../components/home/FAQSection';
import CategoriesGrid from '../components/home/CategoriesGrid';
import HowToPickSection from '../components/home/HowToPickSection';
import NewsletterSection from '../components/home/NewsletterSection';
import { FullPageLoader } from '../components/ui/Loader';

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { featured, bestSellers, newArrivals, loading } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchFeatured());
    dispatch(fetchBestSellers());
    dispatch(fetchNewArrivals());
    dispatch(fetchProducts({ gender: 'female', limit: 4 }));
    dispatch(fetchProducts({ gender: 'male', limit: 4 }));
    dispatch(fetchProducts({ gender: 'unisex', limit: 4 }));
  }, [dispatch]);

  if (loading && featured.length === 0) return <FullPageLoader text="Welcome to Scent Studio" />;

  return (
    <div>
      <HeroSlider />
      <FeaturedCollections />
      <CategoryShowcase />
      <ProductGrid
        title="Featured Fragrances"
        subtitle="Our most exquisite selections"
        products={featured}
      />
      <BannerPromo />
      <ProductGrid
        title="Best Sellers"
        subtitle="Beloved by connoisseurs worldwide"
        products={bestSellers}
      />
      <HowToPickSection />
      <ProductGrid
        title="New Arrivals"
        subtitle="Fresh additions to our collection"
        products={newArrivals}
      />
      <CategoriesGrid />
      <WhyChooseUs />
      <Testimonials />
      <FAQSection />
      <NewsletterSection />
    </div>
  );
}
