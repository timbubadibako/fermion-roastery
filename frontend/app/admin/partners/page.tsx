"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  ShieldAlert, 
  Loader2,
  ExternalLink,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

interface Partner {
  id: string;
  company_name: string;
  address: string;
  estimated_volume_kg: string;
  status: string;
  tier_name: string;
  email: string;
  full_name: string;
}

export default function PartnerManagement() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [partnerToReject, setPartnerToReject] = useState<string | null>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/admin/partners");
      if (res.ok) setPartners(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string, tier: string | null) => {
    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, tier_name: tier })
      });
      if (res.ok) {
        toast.success(`Partner ${status} successfully`);
        fetchPartners();
      }
    } catch (error) {
      toast.error("Failed to update partner protocol");
    }
  };

  const openReject = (id: string) => {
    setPartnerToReject(id);
    setIsRejectModalOpen(true);
  };

  const confirmReject = () => {
    if (partnerToReject) {
      handleUpdateStatus(partnerToReject, 'rejected', null);
      setPartnerToReject(null);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Querying Partner Database...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="space-y-2 text-left">
        <h1 className="display-font text-6xl font-black tracking-tighter uppercase italic text-slate-950 leading-none">Partner <br/> Relations.</h1>
        <p className="text-sm font-medium text-slate-500">Verify contracts and manage B2B partnership lifecycles.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-[3.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-8">Entity Details</th>
                <th className="p-8">Contract Phase</th>
                <th className="p-8">Protocol Target</th>
                <th className="p-8">System Status</th>
                <th className="p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {partners.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs italic">No partnership records found.</td></tr>
              ) : (
                partners.map((partner, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={partner.id} 
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-8">
                      <div className="space-y-1">
                        <p className="font-black uppercase italic text-slate-900 tracking-tight">{partner.company_name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{partner.email}</p>
                      </div>
                    </td>
                    <td className="p-8">
                      <button className="flex items-center gap-2 text-periwinkle group">
                         <FileText size={16} />
                         <span className="text-[10px] font-black uppercase underline decoration-periwinkle/30 group-hover:decoration-periwinkle transition-all">Review_Agreement.pdf</span>
                      </button>
                    </td>
                    <td className="p-8 font-bold text-xs">
                      {partner.estimated_volume_kg} <span className="text-slate-300 font-medium">KG / MO</span>
                    </td>
                    <td className="p-8">
                      <div className="space-y-2">
                        {partner.status === 'onboarding' && (
                          <span className="status-badge bg-blue-50 text-blue-500 uppercase">En_Route</span>
                        )}
                        {partner.status === 'awaiting_contract_review' && (
                          <span className="status-badge bg-purple-50 text-purple-600 uppercase border border-purple-100">Pending_Verification</span>
                        )}
                        {partner.status === 'approved' && (
                          <div className="flex flex-col gap-1">
                            <span className="status-badge bg-emerald-50 text-emerald-600 uppercase">Authorized_Partner</span>
                            <span className="text-[9px] font-black text-periwinkle uppercase tracking-widest">{partner.tier_name} Tier</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      {['onboarding', 'awaiting_contract_review', 'pending'].includes(partner.status) ? (
                        <div className="flex items-center justify-end gap-3">
                          <Select onValueChange={(tier) => handleUpdateStatus(partner.id, 'approved', tier)}>
                            <SelectTrigger className="w-[140px] h-10 text-[9px] font-black uppercase tracking-widest bg-white border-slate-200 rounded-xl">
                              <SelectValue placeholder="Authorize Tier" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Bronze" className="text-[10px] font-bold uppercase">Bronze Protocol</SelectItem>
                              <SelectItem value="Silver" className="text-[10px] font-bold uppercase">Silver Protocol</SelectItem>
                              <SelectItem value="Gold" className="text-[10px] font-bold uppercase">Gold Negotiation</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            onClick={() => openReject(partner.id)}
                            variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-red-50 text-red-400"
                          >
                            <XCircle size={18} />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300"><MoreVertical size={18} /></Button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={confirmReject}
        title="Tolak Partner?"
        description="Tindakan ini akan menolak aplikasi kemitraan cafe ini. Mereka tidak akan mendapatkan akses ke harga grosir."
        confirmText="Tolak Partner"
        cancelText="Batal"
        variant="danger"
      />
    </div>
  );
}
