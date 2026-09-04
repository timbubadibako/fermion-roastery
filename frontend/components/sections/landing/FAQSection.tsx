"use client";

import React, { useState, memo } from "react";
import { Plus, Minus } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useLangStore } from "@/lib/store";

interface FAQ {
  id: string;
  question_id: string;
  answer_id: string;
  question_en: string;
  answer_en: string;
}

interface FAQSectionProps {
  initialFaqs: FAQ[];
}

function FAQSectionComponent({ initialFaqs }: FAQSectionProps) {
  const { language: lang } = useLangStore();
  const t = useI18n();
  const [faqs] = useState<FAQ[]>(initialFaqs);
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section 
      id="faq"
      className="py-24 px-6 bg-[#1D3E26] text-white relative z-20 overflow-hidden font-sans border-b border-black/10"
    >
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          
          {/* Section Header */}
          <div className="lg:w-1/3 space-y-4">
            <span className="inline-block px-3.5 py-1.5 bg-[#F1B941] text-black text-[9px] font-black uppercase tracking-[0.35em] rounded-sm shadow-sm">
              PERTANYAAN UMUM
            </span>
            <h2 className="text-5xl md:text-6xl font-cloude text-[#FAF9F6] leading-[0.95] relative">
              {t.landing.faq.title || "Frequently Asked Questions"}
            </h2>
            <p className="text-xs text-emerald-100/80 font-medium leading-relaxed pt-2 max-w-sm">
              {t.landing.faq.subtitle || "Jawaban atas pertanyaan seputar pemesanan, pengiriman, dan kemitraan B2B."}
            </p>
          </div>

          {/* Tilted Scrapbook Accordion Cards */}
          <div className="lg:w-2/3 space-y-5">
            {faqs.map((faq, idx) => {
              const isOpen = openId === faq.id;
              return (
                <div 
                  key={faq.id}
                  className={`group bg-[#FAF9F6] text-slate-900 border border-black/10 p-6 relative transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                    isOpen ? 'shadow-xl bg-[#FFFDF9] border-black/25' : 'shadow-md hover:shadow-lg'
                  }`}
                  style={{
                    borderRadius: `4px 2px 6px 3px`,
                    transform: `rotate(${idx % 2 === 0 ? 1 : -1}deg)`
                  }}
                  onClick={() => handleToggle(faq.id)}
                >
                  {/* Masking Tape Accent on top of each card */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/70 border border-black/15 rotate-2 backdrop-blur-sm shadow-sm opacity-90 pointer-events-none" />

                  <div className="flex gap-4 items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <span aria-hidden="true" className="text-3xl font-cloude text-[#367F4D] shrink-0">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <h3 className="font-display font-bold text-lg md:text-xl uppercase tracking-tight text-slate-900 group-hover:text-[#367F4D] transition-colors">
                        {lang === 'id' ? faq.question_id : faq.question_en}
                      </h3>
                    </div>
                    <div className={`transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-[#367F4D]' : 'text-stone-400'}`}>
                      {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                    </div>
                  </div>
                  
                  {/* Accordion Content */}
                  <div 
                    className="grid transition-all duration-300 ease-in-out"
                    style={{
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      opacity: isOpen ? 1 : 0
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="pt-4 pl-12 pr-4 text-stone-600 text-xs md:text-sm leading-relaxed font-medium border-t border-black/10 border-dashed mt-4">
                        {lang === 'id' ? faq.answer_id : faq.answer_en}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

export const FAQSection = memo(FAQSectionComponent);
