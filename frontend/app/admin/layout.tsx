import React from 'react';
import type { Metadata } from 'next';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const metadata: Metadata = {
  title: 'Fermion Admin — Command Center',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminRouteGuard>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-[#367F4D] selection:text-white antialiased">
        {/* Full-Width Top Header Navigation Strip */}
        <AdminHeader />
        
        {/* Main Content Area - Full Canvas Width */}
        <main className="flex-1 p-6 md:p-10 max-w-[1700px] w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </AdminRouteGuard>
  );
}
