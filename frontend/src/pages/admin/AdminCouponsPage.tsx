import React, { useEffect, useState, useCallback } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { couponService } from '../../services/couponService';
import { formatPrice } from '../../lib/utils';
import type { Coupon } from '../../types';
import toast from 'react-hot-toast';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState({ code: '', type: 'percentage' as 'percentage' | 'fixed', value: '', minOrder: '', maxDiscount: '', usageLimit: '', expiresAt: '' });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    couponService.getAll()
      .then((res) => setCoupons(res.data))
      .catch(() => toast.error('Failed to load coupons'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditing(null);
    setForm({ code: '', type: 'percentage', value: '', minOrder: '', maxDiscount: '', usageLimit: '', expiresAt: '' });
    setModalOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      type: c.type,
      value: String(c.value),
      minOrder: String(c.minOrder || ''),
      maxDiscount: String(c.maxDiscount || ''),
      usageLimit: String(c.usageLimit || ''),
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.code.trim() || !form.value) return toast.error('Code and value are required');
    if (!form.expiresAt) return toast.error('Expiry date is required');
    setSaving(true);
    try {
      const payload = {
        code: form.code.toUpperCase(),
        type: form.type,
        value: parseFloat(form.value),
        minOrder: form.minOrder ? parseFloat(form.minOrder) : 0,
        maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : 0,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : 0,
        expiresAt: new Date(form.expiresAt).toISOString(),
      };
      if (editing) {
        await couponService.update(editing._id, payload);
        toast.success('Coupon updated');
      } else {
        await couponService.create(payload);
        toast.success('Coupon created');
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await couponService.delete(deleteId);
      toast.success('Coupon deleted');
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'code', label: 'Code', render: (c: Coupon) => (
      <span className="text-sm font-mono text-luxury-gold bg-luxury-gold/10 px-2 py-1 rounded">{c.code}</span>
    )},
    { key: 'value', label: 'Discount', render: (c: Coupon) => (
      <span className="text-sm text-luxury-charcoal">{c.type === 'percentage' ? `${c.value}%` : formatPrice(c.value)}</span>
    )},
    { key: 'minOrder', label: 'Min Order', render: (c: Coupon) => <span className="text-xs text-luxury-steel">{c.minOrder ? formatPrice(c.minOrder) : '-'}</span> },
    { key: 'usageCount', label: 'Used', render: (c: Coupon) => <span className="text-xs text-luxury-steel">{c.usageCount}/{c.usageLimit || '\u221E'}</span> },
    { key: 'expiresAt', label: 'Expires', render: (c: Coupon) => <span className="text-xs text-luxury-steel">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '-'}</span> },
    { key: 'isActive', label: 'Status', render: (c: Coupon) => <Badge variant={c.isActive ? 'green' : 'red'} size="sm">{c.isActive ? 'Active' : 'Inactive'}</Badge> },
    { key: 'actions', label: 'Actions', render: (c: Coupon) => (
      <div className="flex items-center gap-2">
        <button onClick={() => openEdit(c)} className="h-8 w-8 flex items-center justify-center text-luxury-steel hover:text-luxury-gold transition-colors rounded-lg"><Edit2 size={14} /></button>
        <button onClick={() => setDeleteId(c._id)} className="h-8 w-8 flex items-center justify-center text-luxury-steel hover:text-red-400 transition-colors rounded-lg"><Trash2 size={14} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif text-luxury-charcoal tracking-wide">Coupons</h2>
        <Button variant="primary" size="sm" onClick={openCreate}><Plus size={16} /> Add Coupon</Button>
      </div>
      <DataTable columns={columns} data={coupons} isLoading={loading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Coupon' : 'New Coupon'}>
        <div className="space-y-4">
          <Input label="Coupon Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. SCENT20" />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Discount Type" options={[{ value: 'percentage', label: 'Percentage' }, { value: 'fixed', label: 'Fixed Amount' }]} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'percentage' | 'fixed' })} />
            <Input label="Discount Value" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Min Order Value" type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} />
            <Input label="Max Discount" type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
            <Input label="Usage Limit" type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
          </div>
          <Input label="Expiry Date" type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
          <div className="flex items-center gap-3 pt-2">
            <Button variant="primary" onClick={handleSave} isLoading={saving}>{editing ? 'Update' : 'Create'}</Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={deleting} />
    </div>
  );
}
