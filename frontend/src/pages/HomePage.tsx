import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchFeatured, fetchBestSellers, fetchNewArrivals } from '../store/slices/productSlice';
import HeroSlider from '../components/home/HeroSlider';
import FeaturedCollections from '../components/home/FeaturedCollections';
import CategoryShowcase from '../components/home/CategoryShowcase';
import ProductGrid from '../components/home/ProductGrid';
import BannerPromo from '../components/home/BannerPromo';
import WhyChooseUs from '../components/home/WhyChooseUs';
// import Testimonials from '../components/home/Testimonials';
// import InstagramGallery from '../components/home/InstagramGallery';
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
      <WhyChooseUs />
      {/* <Testimonials /> */}
      {/* <InstagramGallery /> */}
      <NewsletterSection />
    </div>
  );
}
