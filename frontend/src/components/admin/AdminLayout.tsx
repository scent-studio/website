import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import NewOrderModal from './NewOrderModal';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title = 'Dashboard' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-luxury-ivory flex">
      <NewOrderModal />
      <AdminSidebar isMobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader title={title} onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
