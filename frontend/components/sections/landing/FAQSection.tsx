"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus, Minus } from "lucide-react";
import { PlasterTape } from "@/components/ui/plaster-tape";
import { useI18n } from "@/lib/i18n";
import { useLangStore } from "@/lib/store";
import { Sticker } from "@/components/ui/sticker";

gsap.registerPlugin(ScrollTrigger);

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

const DEFAULT_FAQS: FAQ[] = [
  {
    id: "faq-1",
    question_id: "What is Fermion Roastery?",
    answer_id: "Fermion Roastery adalah specialty coffee roastery dari Indonesia yang fokus pada presisi roasting, transparansi asal-usul biji kopi, dan karakter rasa yang bersih.",
    question_en: "What is Fermion Roastery?",
    answer_en: "Fermion Roastery is a specialty coffee roastery from Indonesia focused on precision roasting, bean origin transparency, and clean flavor profiles."
  },
  {
    id: "faq-2",
    question_id: "How often do you release new beans?",
    answer_id: "Seluruh kopi disangrai segar sesuai pesanan. Kami merilis batch single origin kurasi baru secara berkala setiap 2-3 minggu.",
    question_en: "How often do you release new beans?",
    answer_en: "All coffee is freshly roasted to order. We release newly curated single origin lots regularly every 2-3 weeks."
  },
  {
    id: "faq-3",
    question_id: "How do I become a B2B partner?",
    answer_id: "Anda dapat mendaftar akun B2B langsung melalui halaman Grosir atau menghubungi tim kami melalui WhatsApp untuk penawaran harga bertingkat dan kalibrasi bar.",
    question_en: "How do I become a B2B partner?",
    answer_en: "You can register a B2B account directly through the Wholesale page or contact our team via WhatsApp for tiered pricing and bar calibration support."
  },
  {
    id: "faq-4",
    question_id: "What is the minimum purchase for wholesale?",
    answer_id: "Minimal pemesanan wholesale dimulai dari 5 KG per bulan dengan fleksibilitas pilihan blend dan single origin.",
    question_en: "What is the minimum purchase for wholesale?",
    answer_en: "Minimum wholesale order starts from 5 KG per month with flexible blend and single origin selections."
  },
  {
    id: "faq-5",
    question_id: "Do you ship internationally?",
    answer_id: "Saat ini pengiriman reguler melayani seluruh wilayah Indonesia. Untuk pengiriman internasional, silakan hubungi tim kami langsung.",
    question_en: "Do you ship internationally?",
    answer_en: "Currently regular shipping serves all regions across Indonesia. For international shipping inquiries, please contact our team directly."
  }
];

function FAQSectionComponent({ initialFaqs }: FAQSectionProps) {
  const { language: lang } = useLangStore();
  const t = useI18n();
  const faqs = initialFaqs && initialFaqs.length > 0 ? initialFaqs : DEFAULT_FAQS;
  
  // Always keep exactly ONE item open by default (first item open)
  const [openId, setOpenId] = useState<string>(faqs[0]?.id || "faq-1");
  const [isScrolling, setIsScrolling] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const qnaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openId && faqs.length > 0) {
      setOpenId(faqs[0].id);
    }
  }, [faqs, openId]);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        x: -40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      });

      const qnaItems = gsap.utils.toArray<HTMLElement>('.faq-item');
      if (qnaItems.length > 0) {
        gsap.from(qnaItems, {
          y: 24,
          stagger: 0.08,
          duration: 0.7,
          ease: "power2.out",
          force3D: true,
          scrollTrigger: {
            trigger: qnaRef.current,
            start: "top 85%",
          }
        });
      }
    }, sectionRef.current);

    return () => ctx.revert();
  }, [faqs]);

  // Strict Accordion Toggle: Always keeps 1 item open, opening another closes previous
  const handleToggle = (id: string) => {
    if (openId !== id) {
      setOpenId(id);
    }
  };

  return (
    <section 
      id="faq"
      ref={sectionRef}
      className={`py-20 md:py-24 px-6 bg-[#1D3E26] text-white relative z-40 overflow-hidden font-sans ${isScrolling ? "pointer-events-none" : ""}`} 
    >
      {/* Background Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{ backgroundImage: `url("/textures/grain-noise.svg")` }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          
          {/* Section Header */}
          <div ref={titleRef} className="md:w-1/3 space-y-4 relative">
            <Sticker rotate={-10} className="mb-2 hidden md:inline-block border border-black/10 shadow-sm" color="#E2DACB" variant="solid">
              FAQ
            </Sticker>
            
            <h2 className="text-5xl md:text-7xl font-cloude leading-[0.92] text-[#FAF9F6] relative drop-shadow-md">
              {t.landing.faq.title}
              <svg className="absolute -bottom-3 left-0 w-3/4 h-5 text-[#F1B941] -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 10 Q 50 20 100 0" stroke="currentColor" strokeWidth="7" fill="none" />
              </svg>
            </h2>
            
            <p className="text-xs md:text-sm text-[#E2DACB]/80 font-bold tracking-widest uppercase mt-6 border-l-2 border-[#F1B941] pl-4 leading-relaxed">
              {t.landing.faq.subtitle}
            </p>
          </div>

          {/* Accordion Cards Stack — Balanced Spacing & Comfortable Margin */}
          <div ref={qnaRef} className="md:w-2/3 space-y-4 sm:space-y-5 w-full">
            {faqs.map((faq, idx) => {
              const isOpen = openId === faq.id;
              return (
                <div 
                  key={faq.id}
                  className={`faq-item group bg-[#FAFAFA] border border-black/5 pt-4 pb-4 px-5 sm:px-6 relative transition-all duration-300 cursor-pointer will-change-transform rounded-none
                    ${isOpen ? 'shadow-[6px_6px_0px_rgba(0,0,0,0.06)] bg-[#FFFDF9]' : 'shadow-[3px_3px_0px_rgba(0,0,0,0.03)] hover:-translate-y-0.5'}
                  `}
                  style={{
                    transform: `rotate(${idx % 2 === 0 ? 0.8 : -0.8}deg)`
                  }}
                  onClick={() => handleToggle(faq.id)}
                >
                  {/* Patterned Plaster Tape — Sleek Compact Size 50% Outside & 50% Inside Overlapping Top Border */}
                  <PlasterTape 
                    width={56} 
                    height={18} 
                    rotate={idx % 2 === 0 ? 2.5 : -3} 
                    pattern={idx % 2 === 0 ? "dots" : "cross"} 
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" 
                  />

                  <div className="flex gap-4 items-center justify-between">
                    <div className="flex gap-3.5 items-center">
                      <span aria-hidden="true" className="text-xl font-cloude text-black/50 pointer-events-none shrink-0">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <h3 className="text-base sm:text-lg font-display font-bold text-black group-hover:text-[#367F4D] transition-colors pointer-events-none leading-snug">
                        {lang === 'id' ? faq.question_id : faq.question_en}
                      </h3>
                    </div>
                    <div className={`transition-transform duration-300 pointer-events-none shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                      {isOpen ? (
                        <Minus size={18} className="text-[#EBA294]" />
                      ) : (
                        <Plus size={18} className="text-[#367F4D]" />
                      )}
                    </div>
                  </div>
                  
                  {/* Pure Constant CSS Grid Accordion Transition */}
                  <div 
                    className="grid transition-all duration-300 ease-out"
                    style={{
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      opacity: isOpen ? 1 : 0
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="pt-3 pl-9 pr-2 pb-1 text-stone-700 text-xs sm:text-sm leading-relaxed font-sans mt-2 border-t border-black/10 border-dashed pointer-events-none">
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
