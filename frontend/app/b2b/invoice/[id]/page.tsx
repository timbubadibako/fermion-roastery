"use client";

import { useEffect, useRef, useState, use } from "react";
import { useCartStore } from "@/lib/store";
import Link from "next/link";
import { Printer, Download, ArrowLeft, CreditCard } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function InvoiceTemplate({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ paymentUrl?: string }> }) {
  const unwrappedParams = use(params);
  const unwrappedSearchParams = use(searchParams);
  const { removeItems } = useCartStore();
  const [order, setOrder] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    const initializePage = async () => {
      const purchasedIds = localStorage.getItem('purchasedLineItemIds');
      if (purchasedIds) {
        try {
          removeItems(JSON.parse(purchasedIds));
          localStorage.removeItem('purchasedLineItemIds');
        } catch (e) {}
      }

      try {
        const [orderRes, invoiceRes] = await Promise.all([
          apiFetch(`/api/orders/${unwrappedParams.id}`),
          apiFetch(`/api/orders/${unwrappedParams.id}/invoice`)
        ]);

        if (orderRes.ok) {
          setOrder(await orderRes.json());
        }

        if (invoiceRes.ok) {
          const blob = await invoiceRes.blob();
          objectUrl = window.URL.createObjectURL(blob);
          setPdfUrl(objectUrl);
          setPdfPreviewUrl(`${objectUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    initializePage();

    return () => {
      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }
    };
  }, [removeItems, unwrappedParams.id]);

  const handleDownloadInvoice = async () => {
    try {
      const res = await apiFetch(`/api/orders/${unwrappedParams.id}/invoice`);
      if (!res.ok) {
        throw new Error('Failed to download invoice');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `INV-${unwrappedParams.id.slice(0, 8).toUpperCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrintInvoice = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
      return;
    }

    if (pdfUrl) {
      const printWindow = window.open(pdfUrl, '_blank');
      printWindow?.focus();
      printWindow?.print();
    }
  };

  if (loading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center">Loading Invoice...</div>;
  if (!order || !pdfUrl || !pdfPreviewUrl) return <div className="min-h-screen bg-stone-50 flex items-center justify-center">Invoice not found.</div>;

  return (
    <div className="font-sans text-slate-900 w-full">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center print:hidden">
          <Link href="/b2b">
            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
              <ArrowLeft size={16} /> Kembali ke Dashboard
            </button>
          </Link>
          <div className="flex gap-4">
            {unwrappedSearchParams?.paymentUrl && order.status === 'UNPAID' && (
              <a href={unwrappedSearchParams.paymentUrl} className="flex items-center gap-2 px-6 py-3 bg-[#367F4D] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-sm">
                <CreditCard size={16} /> Bayar via Xendit
              </a>
            )}
            <button onClick={handlePrintInvoice} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:border-slate-400 transition-all shadow-sm cursor-pointer">
              <Printer size={16} /> Cetak
            </button>
            <button onClick={handleDownloadInvoice} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-periwinkle transition-all shadow-sm cursor-pointer">
              <Download size={16} /> Unduh PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-sm border border-slate-100 shadow-2xl overflow-hidden print:shadow-none print:border-none">
          <iframe
            ref={iframeRef}
            src={pdfPreviewUrl}
            title={`Invoice ${unwrappedParams.id}`}
            className="w-full min-h-[85vh] bg-white"
          />
        </div>
      </div>
    </div>
  );
}
