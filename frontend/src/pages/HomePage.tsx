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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await productService.getHomeData();
        if (!mounted) return;
        const data = res.data;
        setBundles(data.bundles || []);
        setNewArrivals(data.newArrivals || []);
        setNewArrivals100(data.newArrivals100 || []);
        setBestSellers(data.bestSellers || []);
        setWomen(data.women || []);
        setMen(data.men || []);
        setUnisex(data.unisex || []);
      } catch {
        if (!mounted) return;
      } finally {
        if (mounted) setReady(true);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <HeroSlider />

      {!ready && (
        <section className="py-10 bg-luxury-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="h-6 bg-luxury-border/50 rounded w-1/2 md:w-1/4 mb-2" />
              <div className="h-3 bg-luxury-border/40 rounded w-2/3 md:w-1/3" />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:snap-none">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-[78%] snap-center flex-shrink-0 sm:min-w-0 sm:flex-shrink animate-pulse">
                  <div className="aspect-[3/4] rounded-xl bg-luxury-border/50" />
                  <div className="mt-4 h-4 bg-luxury-border/50 rounded w-2/3" />
                  <div className="mt-2 h-3 bg-luxury-border/40 rounded w-1/3" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {ready && bundles.length > 0 && (
        <ProductGrid
          title="Perfume Bundles"
          subtitle="Curated gift sets for every occasion"
          products={bundles}
          viewAllLink="/shop?filters[tags]=bundle"
        />
      )}

      {ready && newArrivals100.length > 0 && (
        <ProductGrid
          title="New Arrivals of 100ML"
          subtitle="Full-size bottles, freshly landed"
          products={newArrivals100}
          viewAllLink="/shop?sort=newest"
        />
      )}

      {ready && newArrivals.length > 0 && (
        <ProductGrid
          title="New Arrival"
          subtitle="Discover the latest additions to our collection"
          products={newArrivals}
          viewAllLink="/shop?sort=newest"
        />
      )}

      {ready && bestSellers.length > 0 && (
        <ProductGrid
          title="Best Seller Perfumes"
          subtitle="Beloved by connoisseurs worldwide"
          products={bestSellers}
          viewAllLink="/shop?sort=popular"
        />
      )}

      {ready && women.length > 0 && (
        <ProductGrid
          title="Best Perfumes for Women in Pakistan"
          subtitle="Elegant, warm & layered florals"
          products={women}
          viewAllLink="/shop?gender=female"
        />
      )}

      {ready && men.length > 0 && (
        <ProductGrid
          title="Perfume Brands for Men in Pakistan"
          subtitle="Bold, confident & long-lasting"
          products={men}
          viewAllLink="/shop?gender=male"
        />
      )}

      {ready && unisex.length > 0 && (
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
