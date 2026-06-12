"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
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
    axios.get("http://localhost:3001/api/content/faqs")
      .then(res => setFaqs(res.data))
      .catch(err => console.error("Failed to load FAQs", err));
  }, []);

  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-12 text-[var(--color-fermion-french-blue)]">
          {strings[lang].faq.title}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <button 
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full text-left px-6 py-4 font-bold text-slate-800 flex justify-between items-center"
              >
                {lang === 'id' ? faq.question_id : faq.question_en}
                <span className="text-2xl text-slate-400">{openId === faq.id ? '-' : '+'}</span>
              </button>
              {openId === faq.id && (
                <div className="px-6 pb-4 text-slate-600 leading-relaxed">
                  {lang === 'id' ? faq.answer_id : faq.answer_en}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
