"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Partner {
  id: string;
  company_name: string;
  address: string;
  estimated_volume_kg: string;
  status: string;
  tier_name: string | null;
  created_at: string;
  email: string;
  full_name: string;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/admin/partners");
      if (res.ok) {
        const data = await res.json();
        setPartners(data);
      } else {
        toast.error("Failed to load partners");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string, tier: string | null) => {
    if (status === 'approved' && !tier) {
      toast.error("Please select a tier before approving.");
      return;
    }

    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, tier_name: tier }),
      });

      if (res.ok) {
        toast.success(`Partner ${status} successfully!`);
        fetchPartners(); // Refresh list
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-fermion-french-blue" /></div>;

  return (
    <div className="space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase italic">
            Wholesale Partners.
          </h1>
          <p className="text-sm text-slate-500 font-medium max-w-xl">
            Review B2B applications and manage your wholesale network tiers.
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Details</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Volume</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Tier</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partners.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 text-sm font-medium">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  partners.map((partner) => (
                    <tr key={partner.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-6">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 uppercase tracking-tight">{partner.company_name}</p>
                          <p className="text-xs text-slate-500">{partner.address}</p>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-700 text-sm">{partner.full_name}</p>
                          <p className="text-xs text-slate-500">{partner.email}</p>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600">
                          {partner.estimated_volume_kg}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="space-y-2">
                          {partner.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700">
                              <Clock size={12} /> Pending
                            </span>
                          )}
                          {partner.status === 'approved' && (
                            <div className="flex flex-col gap-1">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 w-fit">
                                <CheckCircle2 size={12} /> Approved
                              </span>
                              <span className="text-[10px] font-bold text-fermion-french-blue">Tier: {partner.tier_name}</span>
                            </div>
                          )}
                          {partner.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-700">
                              <XCircle size={12} /> Rejected
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        {partner.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <Select onValueChange={(tier) => handleUpdateStatus(partner.id, 'approved', tier)}>
                              <SelectTrigger className="w-[120px] h-9 text-[10px] font-bold uppercase tracking-widest bg-white border-slate-200">
                                <SelectValue placeholder="Assign Tier" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Bronze">Bronze Tier</SelectItem>
                                <SelectItem value="Silver">Silver Tier</SelectItem>
                                <SelectItem value="Gold">Gold Tier</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Button 
                              variant="ghost" 
                              onClick={() => handleUpdateStatus(partner.id, 'rejected', null)}
                              className="h-9 px-3 text-red-500 hover:text-red-600 hover:bg-red-50 text-[10px] font-bold uppercase tracking-widest"
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                           <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                             Locked
                           </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
