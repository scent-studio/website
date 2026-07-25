import React, { useEffect, useState, useCallback } from 'react';
import { Download, Mail, X } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import type { Newsletter, PaginatedResponse } from '../../types';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(() => {
    setLoading(true);
    api.get<PaginatedResponse<Newsletter>>('/newsletter', { params: { page, limit: 15, search: search || undefined } })
      .then((res: any) => {
        setSubscribers(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      })
      .catch(() => toast.error('Failed to load subscribers'))
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleExport = () => {
    const csv = subscribers.map((s) => `${s.email},${s.isSubscribed ? 'Active' : 'Unsubscribed'},${formatDate(s.subscribedAt)}`).join('\n');
    const blob = new Blob([`Email,Status,Subscribed At\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  const handleRemove = async (email: string) => {
    try {
      await api.delete(`/newsletter/${email}`);
      toast.success('Subscriber removed');
      fetchData();
    } catch {
      toast.error('Failed to remove');
    }
  };

  const columns = [
    { key: 'email', label: 'Email', render: (s: Newsletter) => (
      <div className="flex items-center gap-2">
        <Mail size={14} className="text-luxury-gold" />
        <span className="text-sm text-luxury-charcoal">{s.email}</span>
      </div>
    )},
    { key: 'isSubscribed', label: 'Status', render: (s: Newsletter) => (
      <Badge variant={s.isSubscribed ? 'green' : 'red'} size="sm">{s.isSubscribed ? 'Active' : 'Unsubscribed'}</Badge>
    )},
    { key: 'subscribedAt', label: 'Subscribed', render: (s: Newsletter) => (
      <span className="text-xs text-luxury-steel">{formatDate(s.subscribedAt, { month: 'short', day: 'numeric', year: 'numeric' } as any)}</span>
    )},
    { key: 'actions', label: 'Actions', render: (s: Newsletter) => (
      <button onClick={() => handleRemove(s.email)} className="h-8 w-8 flex items-center justify-center text-luxury-steel hover:text-red-400 transition-colors rounded-lg"><X size={14} /></button>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif text-luxury-charcoal tracking-wide">Newsletter Subscribers</h2>
        <Button variant="secondary" size="sm" onClick={handleExport}>
          <Download size={14} /> Export CSV
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={subscribers}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onSearch={setSearch}
        searchPlaceholder="Search by email..."
        isLoading={loading}
      />
    </div>
  );
}
