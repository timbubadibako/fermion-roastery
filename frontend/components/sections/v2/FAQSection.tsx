"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Beaker, ChevronRight } from "lucide-react";
import { strings } from "@/lib/strings";

interface FAQ {
  id: string;
  question_id: string;
  answer_id: string;
  question_en: string;
  answer_en: string;
}

export function FAQSection() {
  const lang = 'id';
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    // Optimization: Fetch only once, consider SWR or React Query for larger apps
    axios.get("http://localhost:3001/api/content/faqs")
      .then(res => setFaqs(res.data))
      .catch(err => console.error("Failed to load FAQs", err));
  }, []);

  return (
    <section className="py-32 px-6 bg-white relative overflow-hidden">
      {/* Subtle Background Detail - Technical Laboratory Feel */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
        <div className="absolute top-20 left-10 w-64 h-64 border border-[var(--color-fermion-french-blue)] rounded-full" />
        <div className="absolute bottom-40 right-20 w-96 h-96 border border-[var(--color-fermion-sea-green)] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24">
          
          {/* Section Header: Editorial Style */}
          <div className="md:w-1/3 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-[var(--color-fermion-french-blue)]"
            >
              <div className="w-10 h-[1px] bg-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Knowledge Base</span>
            </motion.div>
            
            <h2 className="text-5xl font-display font-black leading-[0.9] text-[var(--color-fermion-black)] italic tracking-tighter">
              {strings[lang].faq.title.split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </h2>
            
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-[240px]">
              Scientific clarity behind every roast. Find answers to our most common operational inquiries.
            </p>

            <div className="pt-8">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-fermion-french-blue)]/5 flex items-center justify-center text-[var(--color-fermion-french-blue)]">
                <Beaker size={24} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Accordion: Minimalist Laboratory Style */}
          <div className="md:w-2/3 space-y-0 divide-y divide-slate-100 border-t border-b border-slate-100">
            {faqs.map((faq, idx) => (
              <motion.div 
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <button 
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full text-left py-8 flex items-start justify-between group-hover:pl-4 transition-all duration-500 ease-out"
                >
                  <div className="flex gap-6 items-start">
                    <span className="text-[10px] font-black text-slate-300 mt-1.5 tabular-nums">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <h3 className={`text-xl font-bold transition-colors duration-300 ${openId === faq.id ? 'text-[var(--color-fermion-french-blue)]' : 'text-slate-800 group-hover:text-[var(--color-fermion-black)]'}`}>
                      {lang === 'id' ? faq.question_id : faq.question_en}
                    </h3>
                  </div>
                  <div className={`mt-1 transition-transform duration-500 ${openId === faq.id ? 'rotate-180' : ''}`}>
                    {openId === faq.id ? (
                      <Minus size={18} className="text-[var(--color-fermion-french-blue)]" />
                    ) : (
                      <Plus size={18} className="text-slate-300 group-hover:text-[var(--color-fermion-black)]" />
                    )}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="pl-16 pr-12 pb-10 text-slate-500 text-sm leading-relaxed font-medium italic border-l-2 border-[var(--color-fermion-french-blue)]/20 ml-[70px]">
                        {lang === 'id' ? faq.answer_id : faq.answer_en}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
