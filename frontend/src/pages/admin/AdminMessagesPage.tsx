import React, { useEffect, useState, useCallback } from 'react';
import { Mail, Trash2, ChevronDown, Eye } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { contactService } from '../../services/contactService';
import type { ContactMessage } from '../../types';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    contactService.getAll()
      .then((res) => setMessages(res.data))
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRead = async (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.isRead) {
      try {
        await contactService.markAsRead(msg._id);
        fetchData();
      } catch { }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await contactService.delete(deleteId);
      toast.success('Message deleted');
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'name', label: 'From', render: (m: ContactMessage) => (
      <div>
        <p className="text-sm text-luxury-charcoal font-medium">{m.name}</p>
        <p className="text-xs text-luxury-steel">{m.email}</p>
      </div>
    )},
    { key: 'subject', label: 'Subject', render: (m: ContactMessage) => (
      <div className="flex items-center gap-2">
        {!m.isRead && <span className="h-2 w-2 bg-luxury-gold rounded-full flex-shrink-0" />}
        <span className={`text-sm ${m.isRead ? 'text-luxury-steel' : 'text-luxury-charcoal font-medium'}`}>{m.subject}</span>
      </div>
    )},
    { key: 'isRead', label: 'Status', render: (m: ContactMessage) => (
      <Badge variant={m.isRead ? 'charcoal' : 'gold'} size="sm">{m.isRead ? 'Read' : 'New'}</Badge>
    )},
    { key: 'createdAt', label: 'Date', render: (m: ContactMessage) => <span className="text-xs text-luxury-steel">{formatDate(m.createdAt, { month: 'short', day: 'numeric' } as any)}</span> },
    { key: 'actions', label: 'Actions', render: (m: ContactMessage) => (
      <div className="flex items-center gap-2">
        <button onClick={() => handleRead(m)} className="h-8 w-8 flex items-center justify-center text-luxury-steel hover:text-luxury-gold transition-colors rounded-lg"><Eye size={14} /></button>
        <button onClick={() => setDeleteId(m._id)} className="h-8 w-8 flex items-center justify-center text-luxury-steel hover:text-red-400 transition-colors rounded-lg"><Trash2 size={14} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <h2 className="text-xl font-serif text-luxury-charcoal tracking-wide mb-6">Messages</h2>
      <DataTable columns={columns} data={messages} isLoading={loading} />

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.subject || 'Message'} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm border-b border-luxury-border pb-4">
              <div>
                <p className="text-luxury-charcoal font-medium">{selected.name}</p>
                <p className="text-luxury-steel">{selected.email}</p>
                {selected.phone && <p className="text-luxury-steel">{selected.phone}</p>}
              </div>
              <p className="text-xs text-luxury-steel">{formatDate(selected.createdAt)}</p>
            </div>
            <p className="text-sm text-luxury-charcoal font-medium">{selected.subject}</p>
            <p className="text-sm text-luxury-steel leading-relaxed whitespace-pre-wrap">{selected.message}</p>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={deleting} />
    </div>
  );
}
