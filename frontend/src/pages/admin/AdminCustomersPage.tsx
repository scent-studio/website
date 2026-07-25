import React, { useEffect, useState, useCallback } from 'react';
import DataTable from '../../components/admin/DataTable';
import Badge from '../../components/ui/Badge';
import { formatDate, formatPrice } from '../../lib/utils';
import api from '../../services/api';
import type { User, Order, PaginatedResponse } from '../../types';
import toast from 'react-hot-toast';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    api.get<PaginatedResponse<User>>('/auth/users', { params: { page, limit: 15, search: search || undefined } })
      .then((res: any) => {
        setCustomers(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      })
      .catch(() => toast.error('Failed to load customers'))
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const viewCustomerOrders = (user: User) => {
    setSelectedCustomer(user);
    setOrdersLoading(true);
    api.get<PaginatedResponse<Order>>('/orders', { params: { user: user._id, limit: 10 } })
      .then((res: any) => setCustomerOrders(res.data.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setOrdersLoading(false));
  };

  const columns = [
    { key: 'name', label: 'Customer', render: (u: User) => (
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 flex items-center justify-center bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold text-sm font-medium rounded-lg">
          {u.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <p className="text-sm text-luxury-charcoal font-medium">{u.name}</p>
          <p className="text-xs text-luxury-steel">{u.email}</p>
        </div>
      </div>
    )},
    { key: 'role', label: 'Role', render: (u: User) => (
      <Badge variant={u.role === 'admin' ? 'gold' : 'charcoal'} size="sm">{u.role}</Badge>
    )},
    { key: 'isVerified', label: 'Verified', render: (u: User) => (
      <Badge variant={u.isVerified ? 'green' : 'red'} size="sm">{u.isVerified ? 'Yes' : 'No'}</Badge>
    )},
    { key: 'createdAt', label: 'Joined', render: (u: User) => (
      <span className="text-xs text-luxury-steel">{formatDate(u.createdAt, { month: 'short', day: 'numeric', year: 'numeric' } as any)}</span>
    )},
    { key: 'actions', label: 'Actions', render: (u: User) => (
      <button onClick={() => viewCustomerOrders(u)} className="text-xs text-luxury-gold hover:text-luxury-gold transition-colors font-medium">
        View Orders
      </button>
    )},
  ];

  return (
    <div>
      <h2 className="text-xl font-serif text-luxury-charcoal tracking-wide mb-6">Customers</h2>
      <DataTable
        columns={columns}
        data={customers}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onSearch={setSearch}
        searchPlaceholder="Search customers..."
        isLoading={loading}
      />

      {selectedCustomer && (
        <div className="mt-8 bg-luxury-white border border-luxury-border rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-luxury-border flex items-center justify-between">
            <h3 className="text-sm font-serif text-luxury-charcoal tracking-wider uppercase">
              Orders by {selectedCustomer.name}
            </h3>
            <button onClick={() => setSelectedCustomer(null)} className="text-xs text-luxury-steel hover:text-luxury-gold transition-colors">Close</button>
          </div>
          {ordersLoading ? (
            <div className="p-8 text-center text-sm text-luxury-steel">Loading orders...</div>
          ) : customerOrders.length === 0 ? (
            <div className="p-8 text-center text-sm text-luxury-steel">No orders found.</div>
          ) : (
            <div className="divide-y divide-luxury-border">
              {customerOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-luxury-charcoal font-mono">#{order._id.slice(-8).toUpperCase()}</span>
                  <span className="text-luxury-gold font-serif">{formatPrice(order.total)}</span>
                  <span className="text-xs text-luxury-steel capitalize">{order.status || order.orderStatus}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
