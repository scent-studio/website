import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { productService } from '../../services/productService';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    productService.getProducts({ page, limit: 10, search: search || undefined })
      .then((res) => {
        setProducts(res.data);
        setTotalPages(res.pagination?.totalPages ?? 1);
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await productService.deleteProduct(deleteId);
      toast.success('Product deleted');
      setDeleteId(null);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Product', sortable: true, render: (p: Product) => (
      <div className="flex items-center gap-3">
        <img src={p.images?.[0] || ''} alt={p.name} className="h-10 w-10 object-cover border border-luxury-border rounded-lg" />
        <div>
          <p className="text-sm text-luxury-charcoal font-medium">{p.name}</p>
          <p className="text-xs text-luxury-steel">{p.slug}</p>
        </div>
      </div>
    ) },
    { key: 'price', label: 'Price', render: (p: Product) => <span className="font-serif text-luxury-gold">{formatPrice(p.price)}</span> },
    { key: 'stock', label: 'Stock', render: (p: Product) => {
      const stock = p.stock ?? p.stockQuantity ?? 0;
      const inStock = p.inStock ?? stock > 0;
      return (
        <Badge variant={inStock ? (stock < 5 ? 'gold' : 'green') : 'red'} size="sm">
          {inStock ? `${stock} in stock` : 'Out of stock'}
        </Badge>
      );
    } },
    { key: 'totalSales', label: 'Sold' },
    { key: 'isVisible', label: 'Status', render: (p: Product) => (
      <Badge variant={(p.isVisible ?? p.isActive) ? 'green' : 'red'} size="sm">{(p.isVisible ?? p.isActive) ? 'Active' : 'Inactive'}</Badge>
    ) },
    { key: 'actions', label: 'Actions', render: (p: Product) => (
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(`/admin/products/edit/${p._id}`)} className="h-8 w-8 flex items-center justify-center text-luxury-steel hover:text-luxury-gold hover:bg-luxury-gold/10 transition-colors rounded-lg"><Edit2 size={14} /></button>
        <button onClick={() => setDeleteId(p._id)} className="h-8 w-8 flex items-center justify-center text-luxury-steel hover:text-red-400 hover:bg-red-500/10 transition-colors rounded-lg"><Trash2 size={14} /></button>
      </div>
    ) },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif text-luxury-charcoal tracking-wide">Products</h2>
        <Button variant="primary" size="sm" onClick={() => navigate('/admin/products/new')}>
          <Plus size={16} /> Add Product
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={products}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onSearch={setSearch}
        searchPlaceholder="Search products..."
        isLoading={loading}
      />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={deleting} />
    </div>
  );
}
