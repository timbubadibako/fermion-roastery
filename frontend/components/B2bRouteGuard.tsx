"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Loader2 } from "lucide-react";

export default function B2bRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !pathname.includes("/register")) {
      if (!user) {
        router.replace("/auth?redirect=" + encodeURIComponent(pathname));
      } else if (user.role !== "b2b_partner" && user.role !== "admin") {
        router.replace("/");
      }
    }
  }, [user, mounted, router, pathname]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 text-stone-500">
        <Loader2 size={40} className="animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Memeriksa Akses Mitra...</p>
      </div>
    );
  }

  // Pass-through for register page so unauthenticated users can apply
  if (pathname.includes("/register")) {
    return <>{children}</>;
  }

  if (!user || (user.role !== "b2b_partner" && user.role !== "admin")) {
    return null; // Will be redirected by useEffect
  }

  return <>{children}</>;
}
