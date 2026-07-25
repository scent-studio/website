import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus } from 'lucide-react';
import AddressCard from '../../components/user/AddressCard';
import AddressForm from '../../components/user/AddressForm';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import type { Address } from '../../types';
import toast from 'react-hot-toast';

export default function UserAddressesPage() {
  const { user, updateUserProfile } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>(user?.addresses || []);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (user?.addresses) setAddresses(user.addresses);
  }, [user]);

  const handleSaveAddress = async (data: any) => {
    setLoading(true);
    try {
      let newAddresses: Address[];
      if (editingIndex !== null) {
        newAddresses = [...addresses];
        newAddresses[editingIndex] = data;
      } else {
        newAddresses = [...addresses, data];
      }
      await updateUserProfile({ addresses: newAddresses } as any);
      setAddresses(newAddresses);
      toast.success(editingIndex !== null ? 'Address updated!' : 'Address added!');
      setModalOpen(false);
      setEditingIndex(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index: number) => {
    setLoading(true);
    try {
      const newAddresses = addresses.filter((_, i) => i !== index);
      await updateUserProfile({ addresses: newAddresses } as any);
      setAddresses(newAddresses);
      toast.success('Address deleted');
    } catch (err: any) {
      toast.error('Failed to delete address');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-serif text-luxury-charcoal">My Addresses</h2>
        <Button variant="primary" size="sm" onClick={() => { setEditingIndex(null); setModalOpen(true); }}>
          <Plus size={14} /> Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState icon={<MapPin size={40} />} title="No addresses" description="Add a shipping address to your account." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr, idx) => (
            <AddressCard
              key={idx}
              address={addr}
              isDefault={!!addr.isDefault}
              onEdit={() => handleEdit(idx)}
              onDelete={() => handleDelete(idx)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingIndex(null); }} title={editingIndex !== null ? 'Edit Address' : 'Add Address'}>
        <AddressForm
          initialData={editingIndex !== null ? addresses[editingIndex] : undefined}
          onSubmit={handleSaveAddress}
          isLoading={loading}
        />
      </Modal>
    </div>
  );
}
