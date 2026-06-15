"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Beaker } from "lucide-react";
import { strings } from "@/lib/strings";
import { Sticker } from "@/components/ui/sticker";

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
    axios.get("/api/content/faqs")
      .then(res => setFaqs(res.data))
      .catch(err => console.error("Failed to load FAQs", err));
  }, []);

  return (
    <section className="py-32 px-6 bg-black text-white relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24">
          
          {/* Section Header */}
          <div className="md:w-1/3 space-y-6 relative">
            <Sticker rotate={10} className="-top-12 -left-12 hidden md:block" color="#fbbf24" variant="solid">
              FAQ
            </Sticker>
            <h2 className="text-5xl font-display font-black leading-[0.9] italic tracking-tighter text-white">
              {strings[lang].faq.title.split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </h2>
            
            <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-[240px]">
              Scientific clarity behind every roast. Find answers to our most common operational inquiries.
            </p>

            <div className="pt-8">
              <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center text-white">
                <Beaker size={24} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Accordion */}
          <div className="md:w-2/3 space-y-0 divide-y divide-gray-800 border-t border-b border-gray-800">
            {faqs.map((faq, idx) => (
              <motion.div 
                key={faq.id}
                className="group"
              >
                <button 
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full text-left py-8 flex items-start justify-between group-hover:pl-4 transition-all duration-500 ease-out"
                >
                  <div className="flex gap-6 items-start">
                    <span className="text-[10px] font-black text-gray-600 mt-1.5 tabular-nums">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <h3 className={`text-xl font-display font-bold transition-colors duration-300 ${openId === faq.id ? 'text-gray-200' : 'text-white group-hover:text-gray-300'}`}>
                      {lang === 'id' ? faq.question_id : faq.question_en}
                    </h3>
                  </div>
                  <div className={`mt-1 transition-transform duration-500 ${openId === faq.id ? 'rotate-180' : ''}`}>
                    {openId === faq.id ? (
                      <Minus size={18} className="text-gray-400" />
                    ) : (
                      <Plus size={18} className="text-gray-600 group-hover:text-white" />
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
                      <div className="pl-16 pr-12 pb-10 text-gray-400 text-sm leading-relaxed font-sans italic border-l border-gray-700 ml-[70px]">
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
