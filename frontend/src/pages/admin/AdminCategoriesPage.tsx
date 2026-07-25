import React, { useEffect, useState, useCallback } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../types';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    categoryService.getAll()
      .then((res) => setCategories(res.data))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => { setEditing(null); setName(''); setDescription(''); setModalOpen(true); };
  const openEdit = (cat: Category) => { setEditing(cat); setName(cat.name); setDescription(cat.description || ''); setModalOpen(true); };

  const handleSave = async () => {
    if (!name.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      if (editing) {
        await categoryService.update(editing._id, { name, description } as any);
        toast.success('Category updated');
      } else {
        await categoryService.create({ name, description, slug: name.toLowerCase().replace(/\s+/g, '-'), isActive: true } as any);
        toast.success('Category created');
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
      await categoryService.delete(deleteId);
      toast.success('Category deleted');
      setDeleteId(null);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (c: Category) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 border border-luxury-border overflow-hidden rounded-lg">
          <img src={c.image || 'https://placehold.co/40x40/1a1a1a/d4a853?text=' + c.name.charAt(0)} alt={c.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-sm text-luxury-charcoal font-medium">{c.name}</p>
          <p className="text-xs text-luxury-steel">{c.slug}</p>
        </div>
      </div>
    ) },
    { key: 'description', label: 'Description', render: (c: Category) => <span className="text-xs text-luxury-steel">{c.description || '-'}</span> },
    { key: 'order', label: 'Order' },
    { key: 'isActive', label: 'Status', render: (c: Category) => (
      <Badge variant={c.isActive ? 'green' : 'red'} size="sm">{c.isActive ? 'Active' : 'Inactive'}</Badge>
    ) },
    { key: 'actions', label: 'Actions', render: (c: Category) => (
      <div className="flex items-center gap-2">
        <button onClick={() => openEdit(c)} className="h-8 w-8 flex items-center justify-center text-luxury-steel hover:text-luxury-gold hover:bg-luxury-gold/10 transition-colors rounded-lg"><Edit2 size={14} /></button>
        <button onClick={() => setDeleteId(c._id)} className="h-8 w-8 flex items-center justify-center text-luxury-steel hover:text-red-400 hover:bg-red-500/10 transition-colors rounded-lg"><Trash2 size={14} /></button>
      </div>
    ) },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif text-luxury-charcoal tracking-wide">Categories</h2>
        <Button variant="primary" size="sm" onClick={openCreate}><Plus size={16} /> Add Category</Button>
      </div>
      <DataTable columns={columns} data={categories} isLoading={loading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'New Category'}>
        <div className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
          <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Category description" />
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
