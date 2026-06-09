# Admin Dashboard & Middleware Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a secure, multi-departmental Admin Panel with server-side role verification and a minimalist analytics dashboard.

**Architecture:** Use a dual-gate security model where Next.js Middleware intercepts requests to `/admin` and validates the user's role against the Express backend. The dashboard will use a layout-based approach with a persistent sidebar.

**Tech Stack:** Next.js 15, Express v5, PostgreSQL, Tailwind CSS, Lucide Icons, Recharts.

---

### Task 1: Backend Security & Verification

**Files:**
- Modify: `backend/controllers/authController.js`
- Modify: `backend/routes/authRoutes.js`

- [ ] **Step 1: Implement verifyAdmin controller**

```javascript
// backend/controllers/authController.js

export const verifyAdmin = async (req, res) => {
  const { id } = req.query;
  
  if (!id) return res.status(400).json({ isAdmin: false, message: "Profile ID required" });

  try {
    const result = await query('SELECT role FROM profiles WHERE id = $1', [id]);
    const profile = result.rows[0];

    if (profile && profile.role === 'ADMIN') {
      return res.status(200).json({ isAdmin: true });
    }

    res.status(200).json({ isAdmin: false });
  } catch (error) {
    console.error('Verify Admin Error:', error);
    res.status(500).json({ isAdmin: false, error: error.message });
  }
};
```

- [ ] **Step 2: Register verify-admin route**

```javascript
// backend/routes/authRoutes.js

router.get('/verify-admin', verifyAdmin);
```

- [ ] **Step 3: Test verification endpoint**

Run: `curl "http://localhost:3001/api/auth/verify-admin?id=[VALID_ADMIN_ID]"`
Expected: `{"isAdmin": true}`

- [ ] **Step 4: Commit backend changes**

```bash
git add backend/controllers/authController.js backend/routes/authRoutes.js
git commit -m "feat(backend): add verify-admin endpoint for middleware security"
```

---

### Task 2: Frontend Middleware & Gatekeeping

**Files:**
- Create: `frontend/middleware.ts` (if uninstalled)
- Modify: `frontend/app/layout.tsx`

- [ ] **Step 1: Implement role-based middleware**

```typescript
// frontend/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    // In a real app, use a secure cookie. For prototype, we'll try to find a session indicator.
    // NOTE: LocalStorage is not accessible in Middleware. We'll use a cookie named 'fermion_profile_id'.
    const profileId = request.cookies.get('fermion_profile_id')?.value;

    if (!profileId) {
      return NextResponse.redirect(new URL('/account/register', request.url));
    }

    try {
      const res = await fetch(`http://localhost:3001/api/auth/verify-admin?id=${profileId}`);
      const data = await res.json();

      if (!data.isAdmin) {
        return NextResponse.redirect(new URL('/our-coffee', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/our-coffee', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

- [ ] **Step 2: Update AuthForm to set security cookie**

```typescript
// frontend/components/auth-form.tsx - Add this in the success handler

if (response.ok) {
  document.cookie = `fermion_profile_id=${data.profile.id}; path=/; max-age=86400; SameSite=Lax`;
  toast.success(data.message);
  onSuccess(data.profile);
}
```

- [ ] **Step 3: Test middleware redirection**

Try navigating to `/admin/dashboard` without being logged in as Admin.
Expected: Redirect to `/account/register` or `/our-coffee`.

- [ ] **Step 4: Commit middleware changes**

```bash
git add frontend/middleware.ts frontend/components/auth-form.tsx
git commit -m "feat(frontend): implement server-side middleware gatekeeper for admin routes"
```

---

### Task 3: Admin Layout & Navigation (Sidebar)

**Files:**
- Create: `frontend/app/admin/layout.tsx`
- Create: `frontend/components/admin/sidebar.tsx`

- [ ] **Step 1: Create minimalist Sidebar component**

```typescript
// frontend/components/admin/sidebar.tsx

import Link from "next/link";
import { LayoutDashboard, Coffee, Package, Users, ShoppingCart, Truck, BookOpen, Settings, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

const menuItems = [
  { group: "Overview", items: [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  ]},
  { group: "Commerce", items: [
    { name: "Products", href: "/admin/products", icon: Coffee },
    { name: "Inventory", href: "/admin/inventory", icon: Package },
    { name: "B2B Partners", href: "/admin/partners", icon: Users },
  ]},
  { group: "Operational", items: [
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Shipping", icon: Truck },
  ]},
  { group: "Content", items: [
    { name: "Journal", icon: BookOpen },
    { name: "Settings", icon: Settings },
  ]}
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#101828] h-screen fixed left-0 top-0 text-white p-8 flex flex-col">
      <div className="mb-12">
        <h2 className="text-2xl font-black italic tracking-tighter uppercase">Fermion.</h2>
        <p className="text-[8px] font-bold text-slate-500 tracking-[0.3em] uppercase">Command Center</p>
      </div>

      <nav className="flex-1 space-y-10 overflow-y-auto scrollbar-hide">
        {menuItems.map((group) => (
          <div key={group.group} className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{group.group}</h4>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href || "#"} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    pathname === item.href ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <button className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors font-bold text-sm">
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
```

- [ ] **Step 2: Implement Admin Layout Shell**

```typescript
// frontend/app/admin/layout.tsx

import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <AdminSidebar />
      <main className="pl-64">
        <div className="p-12 md:p-20">
          {children}
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Commit Layout**

```bash
git add frontend/components/admin/sidebar.tsx frontend/app/admin/layout.tsx
git commit -m "feat(frontend): build admin sidebar navigation and layout shell"
```

---

### Task 4: Analytics Dashboard (Home)

**Files:**
- Create: `frontend/app/admin/dashboard/page.tsx` (Overwrite existing to follow new layout)
- Modify: `backend/controllers/adminController.js`
- Modify: `backend/routes/adminRoutes.js`

- [ ] **Step 1: Implement stats aggregation endpoint**

```javascript
// backend/controllers/adminController.js

export const getAdminStats = async (req, res) => {
  try {
    // Mocking aggregation for now, in real app these would be SUM() and COUNT() queries
    const stats = {
      revenue: 45250000,
      volume: 124,
      pendingB2B: 3,
      activeSubs: 18,
      revenueTrends: [
        { date: '01 Jun', amount: 1200000 },
        { date: '02 Jun', amount: 2100000 },
        { date: '03 Jun', amount: 1800000 },
        { date: '04 Jun', amount: 3400000 },
        { date: '05 Jun', amount: 2900000 },
      ],
      volumeTrends: [
        { name: 'Espresso', kg: 45 },
        { name: 'Filter', kg: 62 },
        { name: 'Micro-lots', kg: 17 },
      ]
    };
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};
```

- [ ] **Step 2: Register stats route**

```javascript
// backend/routes/adminRoutes.js
router.get('/stats', getAdminStats);
```

- [ ] **Step 3: Create the Dashboard Home UI**

```typescript
// frontend/app/admin/dashboard/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Package, Users, Zap, Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader2 className="animate-spin text-fermion-blue" />;

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">Overview</h1>
        <p className="text-slate-500 font-medium text-sm">Real-time performance metrics for Fermion Roastery.</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", val: `Rp ${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "text-green-500" },
          { label: "Volume Sold", val: `${stats.volume} Kg`, icon: Package, color: "text-fermion-blue" },
          { label: "Pending B2B", val: stats.pendingB2B, icon: Users, color: "text-amber-500" },
          { label: "Active Subs", val: stats.activeSubs, icon: Zap, color: "text-fermion-lilac" },
        ].map(s => (
          <div key={s.label} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</span>
                <s.icon size={16} className={s.color} />
             </div>
             <p className="text-2xl font-black tracking-tight">{s.val}</p>
          </div>
        ))}
      </div>

      {/* CHARTS PLACEHOLDER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm h-80 flex flex-col">
            <h4 className="text-xs font-black uppercase tracking-widest mb-8">Revenue Trends</h4>
            <div className="flex-1 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">[ Line Chart Component ]</p>
            </div>
         </div>
         <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm h-80 flex flex-col">
            <h4 className="text-xs font-black uppercase tracking-widest mb-8">Volume by Category</h4>
            <div className="flex-1 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">[ Bar Chart Component ]</p>
            </div>
         </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit and finalize phase**

```bash
git add .
git commit -m "feat(admin): complete minimalist analytics dashboard with department navigation"
```
