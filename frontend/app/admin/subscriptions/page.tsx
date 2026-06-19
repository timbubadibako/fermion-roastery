"use client";

import React, { useState, useEffect } from "react";
import { Plus, Coffee, Check, Edit3, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
}

export default function SubscriptionPlansManagement() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [featureInput, setFeatureInput] = useState("");
    const [features, setFeatures] = useState<string[]>([]);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await fetch("/api/subscription/plans");
            if (res.ok) {
                const data = await res.json();
                setPlans(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditingId(null);
        setName("");
        setPrice("");
        setDescription("");
        setFeatures([]);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (plan: SubscriptionPlan) => {
        setEditingId(plan.id);
        setName(plan.name);
        setPrice(plan.price.toString());
        setDescription(plan.description);
        setFeatures(plan.features || []);
        setIsModalOpen(true);
    };

    const handleAddFeature = () => {
        if (!featureInput.trim()) return;
        setFeatures([...features, featureInput.trim()]);
        setFeatureInput("");
    };

    const handleRemoveFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || !description) {
            toast.error("Semua field utama wajib diisi.");
            return;
        }

        const payload = {
            name,
            price: Number(price),
            description,
            features
        };

        try {
            const url = editingId ? `/api/subscription/plans/${editingId}` : "/api/subscription/plans";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success(editingId ? "Paket langganan diperbarui." : "Paket langganan baru dibuat.");
                setIsModalOpen(false);
                fetchPlans();
            } else {
                toast.error("Gagal menyimpan data paket.");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah anda yakin ingin menghapus paket hemat bulanan ini?")) return;
        try {
            const res = await fetch(`/api/subscription/plans/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Paket berhasil dihapus.");
                fetchPlans();
            }
        } catch (error) {
            toast.error("Gagal menghapus paket.");
        }
    };

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-stone-400">
            <div className="w-10 h-10 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Mengonfigurasi Paket Hemat...</p>
        </div>
    );

    return (
        <div className="space-y-12">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 pb-10 text-left">
                <div className="space-y-3">
                    <h1 className="text-5xl md:text-7xl font-display italic font-bold tracking-tighter text-slate-900 leading-none">Paket <br /> Langganan.</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Konfigurasi nilai & benefit diskon recurring coffee box pembeli.</p>
                </div>
                <Button
                    onClick={handleOpenCreate}
                    className="bg-[#367F4D] text-white rounded-sm text-[10px] font-black uppercase tracking-widest h-12 px-8 self-start md:self-end border-none shadow-lg hover:bg-emerald-800 transition-all"
                >
                    <Plus size={14} className="mr-2" strokeWidth={3} /> Buat Paket Baru
                </Button>
            </div>

            {/* LISTING PLANS BRUTALIST GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {plans.length === 0 ? (
                    <div className="col-span-full bg-white p-16 border border-black/5 text-center text-stone-400 font-bold uppercase tracking-widest text-xs italic rounded-sm shadow-sm">
                        Belum ada paket langganan aktif yang terdaftar di database.
                    </div>
                ) : (
                    plans.map((plan) => (
                        <div key={plan.id} className="bg-white border border-black/10 p-8 flex flex-col justify-between relative rounded-sm shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="absolute top-[-8px] left-8 w-16 h-3 bg-[#F1B941]/20 border border-black/5" />

                            <div className="space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-stone-900 tracking-tight">{plan.name}</h3>
                                        <p className="text-[11px] font-mono font-bold text-[#367F4D]">Rp {Number(plan.price).toLocaleString('id-ID')} / Bulan</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-sm bg-stone-50 flex items-center justify-center border border-black/5 text-stone-400"><Coffee size={14} /></div>
                                </div>

                                <p className="text-xs text-stone-600 font-medium bg-stone-50 p-4 border-l-2 border-stone-300 italic">"{plan.description}"</p>

                                <ul className="space-y-2.5">
                                    {plan.features?.map((feat, idx) => (
                                        <li key={idx} className="flex items-center gap-2.5 text-[9px] font-black text-stone-700 uppercase tracking-wider">
                                            <Check size={11} strokeWidth={4} className="text-[#367F4D]" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-black/5">
                                <button onClick={() => handleOpenEdit(plan)} className="h-10 border border-black/10 hover:bg-stone-50 rounded-sm text-[9px] font-black uppercase tracking-widest text-stone-600 flex items-center justify-center gap-2">
                                    <Edit3 size={12} /> Edit Detail
                                </button>
                                <button onClick={() => handleDelete(plan.id)} className="h-10 border border-red-100 hover:bg-red-50 rounded-sm text-[9px] font-black uppercase tracking-widest text-red-600 flex items-center justify-center gap-2">
                                    <Trash2 size={12} /> Hapus Paket
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* FORM MODAL (ADD / EDIT) */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-sm w-full max-w-lg p-10 space-y-8 shadow-2xl border border-black/5"
                        >
                            <div className="flex justify-between items-center border-b border-black/5 pb-4">
                                <h2 className="font-display text-3xl italic font-bold text-slate-950 leading-none">
                                    {editingId ? "Edit Subscription Plan" : "New Subscription Plan"}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-900"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-400">Nama Paket Langganan</label>
                                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: The Discovery Box" className="h-11 rounded-sm border-black/10 font-bold text-xs" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-400">Harga Per Bulan (IDR)</label>
                                    <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Contoh: 150000" className="h-11 rounded-sm border-black/10 font-mono text-xs font-bold" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-400">Deskripsi Ringkas</label>
                                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Tulis penawaran estetik di sini..." className="w-full p-4 text-xs font-bold border border-black/10 rounded-sm h-20 focus:outline-none focus:ring-1 focus:ring-[#367F4D]" />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-400">Daftar Benefit / Keuntungan</label>
                                    <div className="flex gap-2">
                                        <Input value={featureInput} onChange={e => setFeatureInput(e.target.value)} placeholder="Contoh: Potongan 10% All Retail Items" className="h-10 rounded-sm border-black/10 text-xs font-bold" />
                                        <Button type="button" onClick={handleAddFeature} className="bg-slate-900 text-white rounded-sm h-10 px-4 text-xs font-bold">Add</Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {features.map((feat, index) => (
                                            <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 border border-black/5 text-[9px] font-black uppercase tracking-widest text-stone-700 rounded-sm">
                                                {feat}
                                                <button type="button" onClick={() => handleRemoveFeature(index)} className="text-red-500 hover:text-red-700"><X size={10} strokeWidth={3} /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-black/5 grid grid-cols-2 gap-4">
                                    <Button type="button" onClick={() => setIsModalOpen(false)} className="h-12 border border-black/10 bg-white hover:bg-stone-50 rounded-sm text-[10px] font-black uppercase tracking-widest text-stone-600">Batal</Button>
                                    <Button type="submit" className="h-12 bg-[#367F4D] text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 border-none shadow-md">Simpan Paket</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}