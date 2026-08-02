import React, { useEffect, useState } from 'react';
import HeroSlider from '../components/home/HeroSlider';
import FeaturedCollections from '../components/home/FeaturedCollections';
import CategoryShowcase from '../components/home/CategoryShowcase';
import ProductGrid from '../components/home/ProductGrid';
import WhyChooseUs from '../components/home/WhyChooseUs';
import FAQSection from '../components/home/FAQSection';
import CategoriesGrid from '../components/home/CategoriesGrid';
import HowToPickSection from '../components/home/HowToPickSection';
import NewsletterSection from '../components/home/NewsletterSection';
import { productService } from '../services/productService';
import type { Product } from '../types';

export default function HomePage() {
  const [bundles, setBundles] = useState<Product[]>([]);
  const [newArrivals100, setNewArrivals100] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [women, setWomen] = useState<Product[]>([]);
  const [men, setMen] = useState<Product[]>([]);
  const [unisex, setUnisex] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [bundlesRes, newArrRes, bestRes, womenRes, menRes, unisexRes] = await Promise.all([
          productService.getProducts({ isGiftSet: true, limit: 4 }),
          productService.getProducts({ isNewArrival: true, limit: 8 }),
          productService.getProducts({ isBestSeller: true, limit: 4 }),
          productService.getProducts({ gender: 'female', limit: 4 }),
          productService.getProducts({ gender: 'male', limit: 4 }),
          productService.getProducts({ gender: 'unisex', limit: 4 }),
        ]);

        if (!mounted) return;

        const allNew = newArrRes.data || [];
        setBundles(bundlesRes.data || []);
        setNewArrivals100(allNew.filter((p) => p.sizes?.some((s) => s.size.includes('100'))).slice(0, 4));
        setNewArrivals(allNew.slice(0, 4));
        setBestSellers(bestRes.data || []);
        setWomen(womenRes.data || []);
        setMen(menRes.data || []);
        setUnisex(unisexRes.data || []);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div>
        <HeroSlider />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] rounded-xl bg-luxury-border/50" />
              <div className="mt-4 h-4 bg-luxury-border/50 rounded w-2/3" />
              <div className="mt-2 h-3 bg-luxury-border/40 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeroSlider />

      {bundles.length > 0 && (
        <ProductGrid
          title="Perfume Bundles"
          subtitle="Curated gift sets for every occasion"
          products={bundles}
          viewAllLink="/shop?filters[tags]=bundle"
        />
      )}

      {newArrivals100.length > 0 && (
        <ProductGrid
          title="New Arrivals of 100ML"
          subtitle="Full-size bottles, freshly landed"
          products={newArrivals100}
          viewAllLink="/shop?sort=newest"
        />
      )}

      {newArrivals.length > 0 && (
        <ProductGrid
          title="New Arrival"
          subtitle="Discover the latest additions to our collection"
          products={newArrivals}
          viewAllLink="/shop?sort=newest"
        />
      )}

      {bestSellers.length > 0 && (
        <ProductGrid
          title="Best Seller Perfumes"
          subtitle="Beloved by connoisseurs worldwide"
          products={bestSellers}
          viewAllLink="/shop?sort=popular"
        />
      )}

      {women.length > 0 && (
        <ProductGrid
          title="Best Perfumes for Women in Pakistan"
          subtitle="Elegant, warm & layered florals"
          products={women}
          viewAllLink="/shop?gender=female"
        />
      )}

      {men.length > 0 && (
        <ProductGrid
          title="Perfume Brands for Men in Pakistan"
          subtitle="Bold, confident & long-lasting"
          products={men}
          viewAllLink="/shop?gender=male"
        />
      )}

      {unisex.length > 0 && (
        <ProductGrid
          title="Unisex Perfumes in Pakistan"
          subtitle="Clean musks, light woods & balanced florals"
          products={unisex}
          viewAllLink="/shop?gender=unisex"
        />
      )}

      <HowToPickSection />
      {/* <FeaturedCollections /> */}
      {/* <CategoryShowcase /> */}
      {/* <CategoriesGrid /> */}
      <WhyChooseUs />
      <FAQSection />
      <NewsletterSection />
    </div>
  );
}
