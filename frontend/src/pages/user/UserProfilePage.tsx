import React, { useState } from 'react';
import { User } from 'lucide-react';
import ProfileForm from '../../components/user/ProfileForm';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function UserProfilePage() {
  const { user, updateUserProfile, isLoading } = useAuth();

  const handleSubmit = async (data: { name: string; email: string; phone?: string }) => {
    try {
      await updateUserProfile(data as any);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update profile');
    }
  };

  return (
    <div>
      <h2 className="text-lg font-serif text-luxury-charcoal mb-6">My Profile</h2>
      <div className="max-w-lg">
        <ProfileForm
          initialData={{
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            avatar: user?.avatar,
          }}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
