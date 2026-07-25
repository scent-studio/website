import React, { useEffect, useState, useCallback } from 'react';
import { Edit2, Trash2, Plus, Eye } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { bannerService } from '../../services/bannerService';
import type { Banner } from '../../types';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', description: '', link: '', order: '0', isActive: 'true' });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    bannerService.getAll()
      .then((res) => setBanners(res.data))
      .catch(() => toast.error('Failed to load banners'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', subtitle: '', description: '', link: '', order: '0', isActive: 'true' });
    setModalOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({ title: b.title, subtitle: b.subtitle || '', description: b.description || '', link: b.link || '', order: String(b.order || 0), isActive: b.isActive ? 'true' : 'false' });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Title is required');
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        link: form.link,
        order: parseInt(form.order),
        isActive: form.isActive === 'true',
      } as any;
      if (editing) {
        await bannerService.update(editing._id, payload);
        toast.success('Banner updated');
      } else {
        await bannerService.create(payload);
        toast.success('Banner created');
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
      await bannerService.delete(deleteId);
      toast.success('Banner deleted');
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'title', label: 'Banner', render: (b: Banner) => (
      <div className="flex items-center gap-3">
        <div className="h-12 w-20 border border-luxury-border overflow-hidden flex-shrink-0 rounded-lg">
          <img src={b.image || 'https://placehold.co/160x96/1a1a1a/d4a853?text=Banner'} alt={b.title} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-sm text-luxury-charcoal font-medium">{b.title}</p>
          {b.subtitle && <p className="text-xs text-luxury-steel">{b.subtitle}</p>}
        </div>
      </div>
    )},
    { key: 'order', label: 'Position' },
    { key: 'isActive', label: 'Status', render: (b: Banner) => <Badge variant={b.isActive ? 'green' : 'red'} size="sm">{b.isActive ? 'Active' : 'Inactive'}</Badge> },
    { key: 'actions', label: 'Actions', render: (b: Banner) => (
      <div className="flex items-center gap-2">
        <button onClick={() => setPreviewUrl(b.image)} className="h-8 w-8 flex items-center justify-center text-luxury-steel hover:text-luxury-gold transition-colors rounded-lg"><Eye size={14} /></button>
        <button onClick={() => openEdit(b)} className="h-8 w-8 flex items-center justify-center text-luxury-steel hover:text-luxury-gold transition-colors rounded-lg"><Edit2 size={14} /></button>
        <button onClick={() => setDeleteId(b._id)} className="h-8 w-8 flex items-center justify-center text-luxury-steel hover:text-red-400 transition-colors rounded-lg"><Trash2 size={14} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif text-luxury-charcoal tracking-wide">Banners</h2>
        <Button variant="primary" size="sm" onClick={openCreate}><Plus size={16} /> Add Banner</Button>
      </div>
      <DataTable columns={columns} data={banners} isLoading={loading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Banner' : 'New Banner'}>
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Link URL" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/shop" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Position" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-luxury-charcoal font-sans">Active</label>
              <select value={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.value })} className="w-full px-4 py-3 bg-luxury-white border border-luxury-border text-luxury-charcoal outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20 rounded-lg transition-all duration-300">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button variant="primary" onClick={handleSave} isLoading={saving}>{editing ? 'Update' : 'Create'}</Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!previewUrl} onClose={() => setPreviewUrl(null)} title="Banner Preview" size="lg">
        {previewUrl && <img src={previewUrl} alt="Banner preview" className="w-full rounded-lg" />}
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={deleting} />
    </div>
  );
}
