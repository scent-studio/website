const ProductCard = require('../models/ProductCard');
const Brand = require('../models/Brand');

const syncProductCard = async (product: any) => {
  if (!product?._id) return;

  let brand: { _id?: any; name?: string } | null = null;
  if (product.brand) {
    if (typeof product.brand === 'object' && product.brand.name) {
      brand = { _id: product.brand._id, name: product.brand.name };
    } else {
      const b = await Brand.findById(product.brand).select('name').lean();
      if (b) brand = { _id: b._id, name: b.name };
    }
  }

  await ProductCard.findByIdAndUpdate(
    product._id,
    {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      thumbnail: product.thumbnail || null,
      price: product.price,
      discount: product.discount || 0,
      discountedPrice: product.discountedPrice,
      sizes: (product.sizes || []).map((s: any) => ({
        size: s.size,
        price: s.price,
        stock: s.stock,
        sku: s.sku,
      })),
      rating: product.rating || 0,
      numReviews: product.numReviews || 0,
      gender: product.gender,
      isNewArrival: !!product.isNewArrival,
      isBestSeller: !!product.isBestSeller,
      isGiftSet: !!product.isGiftSet,
      isVisible: product.isVisible !== false,
      brand,
      createdAt: product.createdAt || new Date(),
    },
    { upsert: true, setDefaultsOnInsert: true }
  );
};

const deleteProductCard = async (productId: any) => {
  await ProductCard.findByIdAndDelete(productId);
};

module.exports = { syncProductCard, deleteProductCard };
export {};
