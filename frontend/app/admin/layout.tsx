import React from "react";
import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Sidebar - Fixed to the left */}
      <AdminSidebar />
      
      {/* Content Area - Shifted to the right */}
      <main className="pl-64 min-h-screen">
        <div className="max-w-[1600px] mx-auto p-12 md:p-16 lg:p-20">
          {children}
        </div>
      </main>
    </div>
  );
}
