import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import ImageUpload from '../../components/admin/ImageUpload';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import type { Category, Gender, PerformanceLevel } from '../../types';
import toast from 'react-hot-toast';
const GENDERS: Gender[] = ['male', 'female', 'unisex'];
const PERFORMANCE: PerformanceLevel[] = [
  'Very Poor',
  'Poor',
  'Moderate',
  'Good',
  'Very Good',
  'Excellent',
];
const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter', 'All Seasons'];
const OCCASIONS = ['Casual', 'Formal', 'Evening', 'Office', 'Special Occasion', 'Everyday', 'Romantic'];

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  originalPrice: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  gender: z.string().min(1, 'Gender is required'),
  stock: z.string().optional(),
  topNotes: z.string().optional(),
  middleNotes: z.string().optional(),
  baseNotes: z.string().optional(),
  longevity: z.string().optional(),
  projection: z.string().optional(),
  sillage: z.string().optional(),
  season: z.string().optional(),
  occasion: z.string().optional(),
  tags: z.string().optional(),
  isFeatured: z.string().optional(),
  isTrending: z.string().optional(),
  isBestSeller: z.string().optional(),
  isNewArrival: z.string().optional(),
  isLimitedEdition: z.string().optional(),
  isGiftSet: z.string().optional(),
  isVisible: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

type SizeRow = { size: string; price: string; stock: string; sku: string };

function parseList(value?: string): string[] {
  if (!value?.trim()) return [];
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

function idOf(ref: Category | string | undefined): string {
  if (!ref) return '';
  return typeof ref === 'object' ? ref._id : ref;
}

const emptySize = (): SizeRow => ({ size: '50ml', price: '', stock: '0', sku: '' });

export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [sizeRows, setSizeRows] = useState<SizeRow[]>([
    { size: '50ml', price: '', stock: '0', sku: '' },
    { size: '100ml', price: '', stock: '0', sku: '' },
  ]);
  const [sizeError, setSizeError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      originalPrice: '',
      stock: '0',
      isFeatured: 'false',
      isTrending: 'false',
      isBestSeller: 'false',
      isNewArrival: 'false',
      isLimitedEdition: 'false',
      isGiftSet: 'false',
      isVisible: 'true',
    },
  });

  useEffect(() => {
    categoryService.getAll({ isActive: true })
      .then((catRes) => {
        setCategories(catRes.data ?? []);
      })
      .catch(() => {});

    if (isEdit && id) {
      productService
        .getProduct(id)
        .then((res) => {
          const p = res.data;
          reset({
            name: p.name,
            description: p.description,
            shortDescription: p.shortDescription || '',
            price: String((p.discountedPrice || p.price) ?? ''),
            originalPrice: String(p.price ?? ''),
            category: idOf(p.category),
            gender: p.gender || '',
            stock: String(p.stock ?? p.stockQuantity ?? 0),
            topNotes: p.topNotes?.join(', ') || '',
            middleNotes: p.middleNotes?.join(', ') || '',
            baseNotes: p.baseNotes?.join(', ') || '',
            longevity: p.longevity || '',
            projection: p.projection || '',
            sillage: p.sillage || '',
            season: p.season || '',
            occasion: p.occasion || '',
            tags: p.tags?.join(', ') || '',
            isFeatured: p.isFeatured ? 'true' : 'false',
            isTrending: p.isTrending ? 'true' : 'false',
            isBestSeller: p.isBestSeller ? 'true' : 'false',
            isNewArrival: p.isNewArrival ? 'true' : 'false',
            isLimitedEdition: p.isLimitedEdition ? 'true' : 'false',
            isGiftSet: p.isGiftSet ? 'true' : 'false',
            isVisible: p.isVisible !== false ? 'true' : 'false',
            metaTitle: p.metaTitle || '',
            metaDescription: p.metaDescription || '',
          });
          if (p.sizes?.length) {
            setSizeRows(
              p.sizes.map((s) => ({
                size: s.size || '',
                price: String(s.price ?? ''),
                stock: String(s.stock ?? 0),
                sku: s.sku || '',
              }))
            );
          }
          setImageUrls(p.images || []);
        })
        .catch(() => toast.error('Failed to load product'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, reset]);

  const updateSizeRow = (index: number, field: keyof SizeRow, value: string) => {
    setSizeRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const addSizeRow = () => {
    setSizeRows((prev) => [...prev, emptySize()]);
  };

  const removeSizeRow = (index: number) => {
    setSizeRows((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const onSubmit = async (data: ProductForm) => {
    const validSizes = sizeRows
      .map((row) => ({
        size: row.size.trim(),
        price: parseFloat(row.price),
        stock: row.stock ? parseInt(row.stock, 10) : 0,
        sku: row.sku.trim(),
      }))
      .filter((s) => s.size && s.sku && !Number.isNaN(s.price) && s.price > 0);

    if (!validSizes.length) {
      setSizeError('Add at least one size with size, price, and SKU (e.g. 50ml and 100ml)');
      return;
    }
    setSizeError('');

    setSubmitting(true);
    try {
      const sellingPrice = parseFloat(data.price);
      const originalPrice = data.originalPrice ? parseFloat(data.originalPrice) : 0;
      const mrp = originalPrice > sellingPrice ? originalPrice : sellingPrice;
      const discount = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
      const stock = data.stock
        ? parseInt(data.stock, 10)
        : validSizes.reduce((sum, s) => sum + (s.stock || 0), 0);

      const payload = {
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription || undefined,
        price: mrp,
        discountedPrice: sellingPrice,
        discount,
        category: data.category,
        gender: data.gender as Gender,
        stock,
        images: imageUrls,
        sizes: validSizes,
        topNotes: parseList(data.topNotes),
        middleNotes: parseList(data.middleNotes),
        baseNotes: parseList(data.baseNotes),
        longevity: (data.longevity || undefined) as PerformanceLevel | undefined,
        projection: (data.projection || undefined) as PerformanceLevel | undefined,
        sillage: (data.sillage || undefined) as PerformanceLevel | undefined,
        season: data.season || undefined,
        occasion: data.occasion || undefined,
        tags: parseList(data.tags),
        isFeatured: data.isFeatured === 'true',
        isTrending: data.isTrending === 'true',
        isBestSeller: data.isBestSeller === 'true',
        isNewArrival: data.isNewArrival === 'true',
        isLimitedEdition: data.isLimitedEdition === 'true',
        isGiftSet: data.isGiftSet === 'true',
        isVisible: data.isVisible !== 'false',
        metaTitle: data.metaTitle || undefined,
        metaDescription: data.metaDescription || undefined,
      };

      if (isEdit && id) {
        await productService.updateProduct(id, payload);
        toast.success('Product updated!');
      } else {
        await productService.createProduct(payload);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader size="lg" text="Loading product..." />;

  const boolOptions = [
    { value: 'false', label: 'No' },
    { value: 'true', label: 'Yes' },
  ];

  const optionalSelect = (opts: string[]) => [
    { value: '', label: '—' },
    ...opts.map((v) => ({ value: v, label: v })),
  ];

  return (
    <div>
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-luxury-gold hover:text-luxury-gold mb-6"
      >
        <ArrowLeft size={14} /> Back to Products
      </Link>
      <h2 className="text-xl font-serif text-luxury-charcoal tracking-wide mb-6">
        {isEdit ? 'Edit Product' : 'New Product'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
        <div className="bg-luxury-white border border-luxury-border rounded-xl p-6 space-y-5 shadow-sm">
          <h3 className="text-sm font-serif text-luxury-gold tracking-wider uppercase">
            Basic Information
          </h3>
          <Input label="Product Name" error={errors.name?.message} {...register('name')} />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (PKR)"
              type="number"
              step="0.01"
              placeholder="e.g. 5199"
              error={errors.price?.message}
              {...register('price')}
            />
            <Input
              label="Original Price / MRP (PKR)"
              type="number"
              step="0.01"
              placeholder="e.g. 5500 (optional)"
              error={errors.originalPrice?.message}
              {...register('originalPrice')}
            />
          </div>
          <p className="text-xs text-luxury-steel">
            Discount % is calculated automatically from the two prices. Leave Original Price empty if there is no discount.
          </p>
          <Textarea label="Short Description" {...register('shortDescription')} />
          <Textarea
            label="Full Description"
            error={errors.description?.message}
            {...register('description')}
          />
        </div>

        <div className="bg-luxury-white border border-luxury-border rounded-xl p-6 space-y-5 shadow-sm">
          <h3 className="text-sm font-serif text-luxury-gold tracking-wider uppercase">
            Classification
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categories.map((c) => ({ value: c._id, label: c.name }))}
              placeholder="Select category"
              error={errors.category?.message}
              {...register('category')}
            />
            <Select
              label="Gender"
              options={GENDERS.map((g) => ({
                value: g,
                label: g.charAt(0).toUpperCase() + g.slice(1),
              }))}
              placeholder="Select"
              error={errors.gender?.message}
              {...register('gender')}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Stock" type="number" min="0" {...register('stock')} />
            <Select
              label="Season"
              options={optionalSelect(SEASONS)}
              {...register('season')}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Occasion"
              options={optionalSelect(OCCASIONS)}
              {...register('occasion')}
            />
          </div>
        </div>

        <div className="bg-luxury-white border border-luxury-border rounded-xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-serif text-luxury-gold tracking-wider uppercase">
              Sizes & Prices
            </h3>
            <button
              type="button"
              onClick={addSizeRow}
              className="inline-flex items-center gap-1.5 text-xs text-luxury-gold-dark hover:text-luxury-charcoal transition-colors"
            >
              <Plus size={14} /> Add size
            </button>
          </div>
          <p className="text-xs text-luxury-steel">
            Add each bottle size with its own price (e.g. 50ml and 100ml). Leave a row blank to skip it.
          </p>
          <div className="space-y-4">
            {sizeRows.map((row, index) => (
              <div key={index} className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
                <Input
                  label="Size"
                  placeholder="100ml"
                  value={row.size}
                  onChange={(e) => updateSizeRow(index, 'size', e.target.value)}
                />
                <Input
                  label="Price (PKR)"
                  type="number"
                  step="0.01"
                  placeholder="2999"
                  value={row.price}
                  onChange={(e) => updateSizeRow(index, 'price', e.target.value)}
                />
                <Input
                  label="Stock"
                  type="number"
                  min="0"
                  value={row.stock}
                  onChange={(e) => updateSizeRow(index, 'stock', e.target.value)}
                />
                <Input
                  label="SKU"
                  placeholder={`SKU-${index + 1}`}
                  value={row.sku}
                  onChange={(e) => updateSizeRow(index, 'sku', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeSizeRow(index)}
                  disabled={sizeRows.length <= 1}
                  className="mb-1 h-11 w-11 flex items-center justify-center border border-luxury-border rounded-lg text-luxury-steel hover:text-red-600 hover:border-red-300 disabled:opacity-30"
                  aria-label="Remove size"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          {sizeError && <p className="text-xs text-red-600">{sizeError}</p>}
        </div>

        <div className="bg-luxury-white border border-luxury-border rounded-xl p-6 space-y-5 shadow-sm">
          <h3 className="text-sm font-serif text-luxury-gold tracking-wider uppercase">
            Fragrance Notes
          </h3>
          <Input
            label="Top Notes (comma separated)"
            placeholder="Saffron, Bergamot, Black Pepper"
            {...register('topNotes')}
          />
          <Input
            label="Middle Notes (comma separated)"
            placeholder="Rose, Jasmine, Cinnamon"
            {...register('middleNotes')}
          />
          <Input
            label="Base Notes (comma separated)"
            placeholder="Oud, Amber, Musk"
            {...register('baseNotes')}
          />
          <Input
            label="Tags (comma separated)"
            placeholder="oud, luxury, woody"
            {...register('tags')}
          />
        </div>

        <div className="bg-luxury-white border border-luxury-border rounded-xl p-6 space-y-5 shadow-sm">
          <h3 className="text-sm font-serif text-luxury-gold tracking-wider uppercase">
            Performance
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Longevity"
              options={optionalSelect(PERFORMANCE)}
              {...register('longevity')}
            />
            <Select
              label="Projection"
              options={optionalSelect(PERFORMANCE)}
              {...register('projection')}
            />
            <Select
              label="Sillage"
              options={optionalSelect(PERFORMANCE)}
              {...register('sillage')}
            />
          </div>
        </div>

        <div className="bg-luxury-white border border-luxury-border rounded-xl p-6 space-y-5 shadow-sm">
          <h3 className="text-sm font-serif text-luxury-gold tracking-wider uppercase">
            Product Images
          </h3>
          <ImageUpload maxFiles={5} onChange={setImageUrls} initialUrls={imageUrls} />
        </div>

        <div className="bg-luxury-white border border-luxury-border rounded-xl p-6 space-y-5 shadow-sm">
          <h3 className="text-sm font-serif text-luxury-gold tracking-wider uppercase">Flags</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Select label="Featured" options={boolOptions} {...register('isFeatured')} />
            <Select label="Trending" options={boolOptions} {...register('isTrending')} />
            <Select label="Best Seller" options={boolOptions} {...register('isBestSeller')} />
            <Select label="New Arrival" options={boolOptions} {...register('isNewArrival')} />
            <Select
              label="Limited Edition"
              options={boolOptions}
              {...register('isLimitedEdition')}
            />
            <Select label="Gift Set" options={boolOptions} {...register('isGiftSet')} />
            <Select label="Visible" options={boolOptions} {...register('isVisible')} />
          </div>
        </div>

        <div className="bg-luxury-white border border-luxury-border rounded-xl p-6 space-y-5 shadow-sm">
          <h3 className="text-sm font-serif text-luxury-gold tracking-wider uppercase">SEO</h3>
          <Input label="Meta Title" {...register('metaTitle')} />
          <Textarea label="Meta Description" {...register('metaDescription')} />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" variant="primary" size="lg" isLoading={submitting}>
            <Save size={16} /> {isEdit ? 'Update Product' : 'Create Product'}
          </Button>
          <Link to="/admin/products">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
