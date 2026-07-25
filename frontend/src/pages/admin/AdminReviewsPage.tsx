import React, { useEffect, useState, useCallback } from 'react';
import { Check, X, Star } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import Badge from '../../components/ui/Badge';
import { reviewService } from '../../services/reviewService';
import api from '../../services/api';
import type { Review } from '../../types';
import { formatDate, getInitials } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    api.get('/reviews', { params: { limit: 50 } })
      .then((res: any) => setReviews(res.data.data || res.data))
      .catch(() => toast.error('Failed to load reviews'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleApprove = async (id: string) => {
    try {
      await reviewService.updateReview(id, { rating: 5 } as any);
      toast.success('Review approved');
      fetchData();
    } catch (err: any) {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await reviewService.deleteReview(id);
      toast.success('Review rejected and removed');
      fetchData();
    } catch {
      toast.error('Failed to reject');
    }
  };

  const columns = [
    { key: 'user', label: 'Customer', render: (r: Review) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 flex items-center justify-center bg-luxury-gold/10 text-luxury-gold text-xs font-medium rounded-lg">
          {getInitials((r.user as any)?.name || 'A')}
        </div>
        <span className="text-sm text-luxury-charcoal">{(r.user as any)?.name || 'Anonymous'}</span>
      </div>
    )},
    { key: 'rating', label: 'Rating', render: (r: Review) => (
      <div className="flex items-center gap-1">
        <Star size={12} className="text-luxury-gold fill-luxury-gold" />
        <span className="text-sm text-luxury-charcoal">{r.rating}</span>
      </div>
    )},
    { key: 'comment', label: 'Review', render: (r: Review) => (
      <div className="max-w-xs">
        {r.title && <p className="text-sm text-luxury-charcoal font-medium">{r.title}</p>}
        <p className="text-xs text-luxury-steel truncate">{r.comment}</p>
      </div>
    )},
    { key: 'isApproved', label: 'Status', render: (r: Review) => (
      <Badge variant={r.isApproved ? 'green' : 'gold'} size="sm">{r.isApproved ? 'Approved' : 'Pending'}</Badge>
    )},
    { key: 'createdAt', label: 'Date', render: (r: Review) => <span className="text-xs text-luxury-steel">{formatDate(r.createdAt, { month: 'short', day: 'numeric' } as any)}</span> },
    { key: 'actions', label: 'Actions', render: (r: Review) => (
      <div className="flex items-center gap-2">
        {!r.isApproved && (
          <>
            <button onClick={() => handleApprove(r._id)} className="h-8 w-8 flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors rounded-lg"><Check size={14} /></button>
            <button onClick={() => handleReject(r._id)} className="h-8 w-8 flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors rounded-lg"><X size={14} /></button>
          </>
        )}
      </div>
    )},
  ];

  return (
    <div>
      <h2 className="text-xl font-serif text-luxury-charcoal tracking-wide mb-6">Reviews</h2>
      <DataTable columns={columns} data={reviews} isLoading={loading} />
    </div>
  );
}
