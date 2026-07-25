import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import OrderCard from '../../components/user/OrderCard';
import Select from '../../components/ui/Select';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Pagination from '../../components/ui/Pagination';
import { orderService } from '../../services/orderService';
import type { Order, OrderStatus } from '../../types';

const statusOptions = [
  { value: '', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'packed', label: 'Packed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivering', label: 'Delivering' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

export default function UserOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    orderService.getOrders({ page, limit: 10, status: status ? (status as OrderStatus) : undefined })
      .then((res) => {
        setOrders(res.data);
        setTotalPages(res.pagination?.totalPages ?? 1);
      })
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, [page, status]);

  if (loading) return <div className="flex items-center justify-center min-h-[40vh]"><Loader size="md" text="Loading orders..." /></div>;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <div>
      <h2 className="text-lg font-serif text-luxury-charcoal mb-6">My Orders</h2>
      <div className="mb-6">
        <Select
          options={statusOptions}
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          containerClassName="max-w-xs"
        />
      </div>
      {orders.length === 0 ? (
        <EmptyState icon={<Package size={40} />} title="No orders found" description={status ? 'Try a different filter.' : 'You haven\'t placed any orders yet.'} />
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order as any} onView={(id) => navigate(`/account/order/${id}`)} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-8" />
        </>
      )}
    </div>
  );
}
