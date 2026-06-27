import React from 'react';
import type { Metadata } from 'next';
import AdminRouteGuard from '@/components/AdminRouteGuard';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminRouteGuard>
      {children}
    </AdminRouteGuard>
  );
}
