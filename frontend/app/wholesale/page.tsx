"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Zap, 
  ArrowRight,
  ShieldCheck, 
  Truck, 
  Settings, 
  BarChart3, 
  Globe, 
  Award,
  Package,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FooterSection } from "@/components/sections/footer-section";

const benefits = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Quality Guarantee",
    desc: "Setiap batch dipanggang dengan standar kontrol kualitas yang ketat."
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: "Custom Roast",
    desc: "Sesuaikan profil sangrai untuk mencocokkan karakter unik brand cafe Anda."
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Tiered Pricing",
    desc: "Dapatkan harga yang semakin kompetitif seiring bertambahnya volume Anda."
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Reliable Logistics",
    desc: "Pengiriman terjadwal untuk memastikan stok Anda tidak pernah kosong."
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Direct Sourcing",
    desc: "Akses langsung ke kebun kopi terbaik di seluruh nusantara."
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Partner Support",
    desc: "Konsultasi menu dan kalibrasi rutin dari tim roaster ahli kami."
  }
];

export default function WholesalePage() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-32 relative">
      
      {/* SECTION 1: HERO & VALUE PROPS */}
      <section className="max-w-6xl mx-auto px-12 text-center space-y-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <p className="text-[10px] font-black text-fermion-blue tracking-[0.5em] uppercase">Partnership Program</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
            Scale Your Coffee <br/> Experience with Us.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            Fermion Roastery menyediakan solusi kopi hulu-ke-hilir untuk bisnis yang mengutamakan kualitas, konsistensi, dan cerita di balik setiap biji.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 pt-8">
           <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-slate-100 shadow-sm">
              <Zap size={18} className="text-fermion-yellow" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-900">Fast Roasting</span>
           </div>
           <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-slate-100 shadow-sm">
              <Package size={18} className="text-fermion-blue" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-900">Bulk Options</span>
           </div>
           <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-slate-100 shadow-sm">
              <Calendar size={18} className="text-fermion-lilac" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-900">Weekly Delivery</span>
           </div>
        </div>
      </section>

      {/* SECTION 2: 6 CARD BENEFITS */}
      <section className="bg-white py-24 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#FAF9F6] p-10 rounded-[2.5rem] border border-slate-100 hover:border-fermion-blue transition-all duration-500 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-900 group-hover:bg-fermion-blue group-hover:text-white transition-colors duration-500 mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: MOQ & CTA */}
      <section className="py-32 bg-[#FDFBF7]">
        <div className="max-w-4xl mx-auto px-12 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">Minimum Order Quantity</h2>
            <p className="text-slate-500 font-medium">
              Kami mendukung bisnis dari berbagai skala. Mulai langkah besar Anda dengan komitmen yang fleksibel.
            </p>
          </div>

          <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left space-y-2">
              <span className="text-[10px] font-black text-fermion-blue tracking-[0.4em] uppercase">Starting From</span>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-slate-900 italic">5</span>
                <span className="text-xl font-black text-slate-400 uppercase italic">KG / Month</span>
              </div>
            </div>
            
            <Link href="/b2b/register" className="w-full md:w-auto">
              <Button className="w-full md:w-auto h-20 px-12 bg-slate-900 text-white font-black tracking-[0.2em] rounded-2xl hover:bg-fermion-blue transition-all duration-700 uppercase italic text-lg shadow-2xl shadow-slate-900/20">
                Join Wholesale <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
