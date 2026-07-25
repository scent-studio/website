import React from 'react';
import { Lock } from 'lucide-react';
import PasswordForm from '../../components/user/PasswordForm';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function UserPasswordPage() {
  const { updateUserProfile, isLoading } = useAuth();

  const handleSubmit = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    try {
      await updateUserProfile({
        password: data.newPassword,
        currentPassword: data.currentPassword,
        passwordConfirm: data.confirmPassword,
      } as any);
      toast.success('Password updated successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update password');
    }
  };

  return (
    <div>
      <h2 className="text-lg font-serif text-luxury-charcoal mb-6">Change Password</h2>
      <div className="max-w-lg">
        <PasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
