"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        if (!session) throw new Error("No session found");

        // Sync with backend to ensure profile exists
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            role: 'RETAIL' // Default role
          })
        });

        if (!res.ok) throw new Error("Failed to sync profile");
        
        const data = await res.json();
        const profile = data.profile;
        
        document.cookie = `fermion_profile_id=${profile.id}; path=/; max-age=86400; SameSite=Lax`;
        setUser(profile);
        
        toast.success("Login successful!");
        
        if (profile.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        
      } catch (e: any) {
        console.error("Callback Error:", e);
        toast.error("Failed to authenticate.");
        router.push('/auth');
      }
    };

    handleCallback();
  }, [router, setUser]);

  return (
    <div className="min-h-screen bg-[#F4F0E6] flex flex-col items-center justify-center p-6 text-stone-500 gap-4">
      <Loader2 className="animate-spin w-10 h-10 text-stone-900" />
      <p className="font-black uppercase tracking-widest text-[10px]">Menyinkronkan sesi kredensial...</p>
    </div>
  );
}
