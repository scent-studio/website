import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { orderService } from '../../services/orderService';
import type { Order, OrderStatus } from '../../types';
import { formatPrice, formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(() => {
    setLoading(true);
    orderService.adminGetOrders({
      page,
      limit: 15,
      status: status ? (status as OrderStatus) : undefined,
      search: search || undefined,
    })
      .then((res) => {
        setOrders(res.data);
        setTotalPages(res.pagination?.totalPages ?? 1);
      })
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [page, search, status]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await orderService.adminUpdateOrderStatus(orderId, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    }
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'packed', label: 'Packed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivering', label: 'Delivering' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' },
  ];

  const columns = [
    { key: '_id', label: 'Order', render: (o: Order) => (
      <span className="text-sm text-luxury-charcoal font-mono">#{o._id.slice(-8).toUpperCase()}</span>
    )},
    { key: 'user', label: 'Customer', render: (o: Order) => (
      <div>
        <span className="text-sm text-luxury-charcoal">
          {(o.user as any)?.name || o.guestInfo?.name || 'Guest'}
        </span>
        {!o.user && (
          <span className="ml-2 text-[10px] uppercase tracking-wider text-luxury-steel border border-luxury-border px-1.5 py-0.5">
            Guest
          </span>
        )}
      </div>
    )},
    { key: 'total', label: 'Total', render: (o: Order) => (
      <span className="font-serif text-luxury-charcoal">{formatPrice(o.total)}</span>
    )},
    { key: 'status', label: 'Status', render: (o: Order) => <StatusBadge status={o.status || o.orderStatus || 'pending'} /> },
    { key: 'paymentStatus', label: 'Payment', render: (o: Order) => (
      <span className={`text-xs font-medium ${o.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{o.paymentStatus}</span>
    )},
    { key: 'createdAt', label: 'Date', render: (o: Order) => <span className="text-xs text-luxury-steel">{formatDate(o.createdAt, { month: 'short', day: 'numeric', year: 'numeric' } as any)}</span> },
    { key: 'actions', label: 'Actions', render: (o: Order) => {
      const currentStatus = (o.status || o.orderStatus || 'pending') as OrderStatus;
      return (
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(`/admin/orders/${o._id}`)} className="h-8 w-8 flex items-center justify-center text-luxury-steel hover:text-luxury-gold hover:bg-luxury-gold/10 transition-colors rounded-lg"><Eye size={14} /></button>
        <Select
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirm' },
            { value: 'packed', label: 'Pack' },
            { value: 'shipped', label: 'Ship' },
            { value: 'delivering', label: 'Delivering' },
            { value: 'delivered', label: 'Deliver' },
            { value: 'cancelled', label: 'Cancel' },
            { value: 'refunded', label: 'Refund' },
          ]}
          value={currentStatus}
          onChange={(e) => handleUpdateStatus(o._id, e.target.value as OrderStatus)}
          containerClassName="w-28"
        />
      </div>
    );
    }},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif text-luxury-charcoal tracking-wide">Orders</h2>
        <div className="flex items-center gap-3">
          <Select options={statusOptions} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} containerClassName="w-40" />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={orders}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onSearch={setSearch}
        searchPlaceholder="Search by order ID or customer..."
        isLoading={loading}
      />
    </div>
  );
}
