"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Loader2, Truck } from "lucide-react";

type TrackingEntry = {
  status: string;
  note: string;
  updated_at: string;
};

type OrderTrackingTimelineProps = {
  status: string;
  shippingCourier?: string | null;
  shippingAwb?: string | null;
  trackingHistory?: TrackingEntry[];
  isLoading?: boolean;
};

const STATUS_STEPS = [
  {
    key: "confirmed",
    title: "Pembayaran Dikonfirmasi",
    description: "Pesanan tercatat dan pembayaran telah diterima.",
    statuses: ["PAID", "ROASTING", "READY_TO_SHIP", "SHIPPED", "DELIVERED"],
  },
  {
    key: "roasting",
    title: "Masuk Proses Roasting",
    description: "Batch sedang disiapkan untuk dipanggang dan dikemas.",
    statuses: ["ROASTING", "READY_TO_SHIP", "SHIPPED", "DELIVERED"],
  },
  {
    key: "shipped",
    title: "Diserahkan ke Logistik",
    description: "Pesanan sudah dilepas ke kurir dan menunggu perjalanan.",
    statuses: ["SHIPPED", "DELIVERED"],
  },
  {
    key: "delivered",
    title: "Pesanan Tiba",
    description: "Pengiriman selesai dan pesanan diterima.",
    statuses: ["DELIVERED"],
  },
];

function findMatchingEntry(entries: TrackingEntry[], acceptedStatuses: string[]) {
  return entries.find((entry) => acceptedStatuses.includes(entry.status));
}

export function OrderTrackingTimeline({
  status,
  shippingCourier,
  shippingAwb,
  trackingHistory = [],
  isLoading = false,
}: OrderTrackingTimelineProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>("confirmed");

  const normalizedHistory = useMemo(
    () =>
      [...trackingHistory].sort(
        (left, right) => new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime(),
      ),
    [trackingHistory],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-sm border border-black/5 bg-stone-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Truck size={18} className="text-[#367F4D]" />
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Kurir & Resi</p>
            <p className="text-xs font-bold uppercase text-slate-900">
              {shippingCourier || "Menunggu Kurir"} • {shippingAwb || "Resi Belum Terbit"}
            </p>
          </div>
        </div>
        {isLoading ? <Loader2 size={14} className="animate-spin text-stone-300" /> : null}
      </div>

      <div className="relative space-y-4 pl-6 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-px before:bg-stone-200">
        {STATUS_STEPS.map((step) => {
          const active = step.statuses.includes(status);
          const matchedEntry = findMatchingEntry(normalizedHistory, step.statuses);
          const isExpanded = expandedStep === step.key;

          return (
            <div key={step.key} className="relative">
              <div className="relative flex items-start gap-4">
                <div
                  className={`z-10 mt-1.5 h-[11px] w-[11px] rounded-full border-2 border-white shadow-sm ${
                    active ? "bg-[#367F4D]" : "bg-stone-200"
                  }`}
                />
                <div className="min-w-0 flex-1 rounded-sm border border-black/5 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setExpandedStep(isExpanded ? null : step.key)}
                    className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-tight">
                        {step.title}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-stone-500">
                        {matchedEntry?.note || step.description}
                      </p>
                      {matchedEntry?.updated_at ? (
                        <p className="mt-2 text-[10px] text-stone-300">
                          {new Date(matchedEntry.updated_at).toLocaleString("id-ID")}
                        </p>
                      ) : null}
                    </div>
                    <ChevronDown
                      size={16}
                      className={`mt-0.5 shrink-0 text-stone-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-black/5"
                      >
                        <div className="space-y-3 px-4 py-4">
                          {matchedEntry ? (
                            <div className="rounded-sm bg-stone-50 px-4 py-3">
                              <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">
                                Update Sistem
                              </p>
                              <p className="mt-2 text-sm text-slate-700">{matchedEntry.note}</p>
                            </div>
                          ) : (
                            <div className="rounded-sm bg-stone-50 px-4 py-3">
                              <p className="text-sm text-stone-500">
                                Belum ada detail tambahan. Step ini akan aktif otomatis saat status bergerak.
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-sm border border-black/5 bg-white p-5 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Riwayat Event</p>
        <div className="mt-4 space-y-3">
          {normalizedHistory.length > 0 ? (
            normalizedHistory.map((entry, index) => (
              <div key={`${entry.updated_at}-${index}`} className="rounded-sm border border-black/5 px-4 py-3">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">{entry.status}</p>
                  <p className="text-[10px] text-stone-300">{new Date(entry.updated_at).toLocaleString("id-ID")}</p>
                </div>
                <p className="mt-2 text-sm text-stone-500">{entry.note}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-stone-500">Belum ada pembaruan tracking. Pesanan sedang diproses.</p>
          )}
        </div>
      </div>
    </div>
  );
}
