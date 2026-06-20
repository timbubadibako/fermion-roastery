"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import axios from "axios";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus, Minus } from "lucide-react";
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

function FAQSectionComponent() {
  const { language: lang } = useLangStore();
  const t = useI18n();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const qnaRef = useRef<HTMLDivElement>(null);

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
    axios.get("/api/content/faqs")
      .then(res => setFaqs(res.data))
      .catch(err => console.error("Failed to load FAQs", err));
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    let ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });

      const qnaItems = gsap.utils.toArray<HTMLElement>('.faq-item');
      if(qnaItems.length > 0) {
        gsap.from(qnaItems, {
          y: 30,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          force3D: true,
          scrollTrigger: {
            trigger: qnaRef.current,
            start: "top 80%",
          }
        });
      }

      // Pin the section to create a delayed curtain effect ONLY on desktop
      let mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=500", // Hold the screen for 500px of scrolling
          pin: true,
          pinSpacing: false, // Don't push the next section down; let it slide over
        });
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, [faqs]);

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section 
      ref={sectionRef}
      className={`min-h-screen pt-32 pb-32 px-6 bg-[#2B4031] text-white relative z-40 overflow-hidden font-sans flex flex-col justify-center ${isScrolling ? "pointer-events-none" : ""}`} 
    >
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="max-w-7xl mx-auto relative z-10 pt-10">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24">
          
          {/* Section Header */}
          <div ref={titleRef} className="md:w-1/3 space-y-6 relative">
            <Sticker rotate={-12} className="-top-8 -left-4 hidden md:block border border-black/10 shadow-sm" color="#E2DACB" variant="solid">
              FAQ
            </Sticker>
            
            <h2 className="text-5xl md:text-7xl font-cloude leading-[0.9] text-[#E2DACB] relative">
              {t.landing.faq.title}
              <svg className="absolute -bottom-4 left-0 w-3/4 h-6 text-[#F1B941]/60 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 10 Q 50 20 100 0" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </h2>
            
            <p className="text-sm text-[#E2DACB]/80 font-bold tracking-widest uppercase mt-8 border-l-2 border-[#F1B941] pl-4">
              Scientific clarity behind every roast.
            </p>
          </div>

          {/* Accordion / Scrapbook Cards */}
          <div ref={qnaRef} className="md:w-2/3 space-y-6">
            {faqs.map((faq, idx) => {
              const isOpen = openId === faq.id;
              return (
                <div 
                  key={faq.id}
                  className={`faq-item group bg-[#FAFAFA] border border-black/5 p-6 relative transition-transform duration-300 hover:-translate-y-1 cursor-pointer will-change-transform
                    ${isOpen ? 'shadow-[6px_6px_0px_rgba(0,0,0,0.05)] bg-[#FFFDF9]' : 'shadow-[4px_4px_0px_rgba(0,0,0,0.03)]'}
                  `}
                  style={{
                    borderRadius: `4px 2px 6px 3px`,
                    transform: `rotate(${idx % 2 === 0 ? 1 : -1}deg)`
                  }}
                  onClick={() => handleToggle(faq.id)}
                >
                  {/* Small pin/tape on the card */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-4 bg-white/60 border border-black/20 rotate-3 backdrop-blur-sm shadow-sm opacity-90 pointer-events-none"></div>

                  <div className="flex gap-4 items-start justify-between">
                    <div className="flex gap-4 items-start">
                      <span className="text-2xl font-cloude text-black/20 mt-1 pointer-events-none">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <h3 className="text-xl font-display font-bold text-black group-hover:text-[#367F4D] transition-colors pointer-events-none">
                        {lang === 'id' ? faq.question_id : faq.question_en}
                      </h3>
                    </div>
                    <div className={`mt-1 transition-transform duration-300 pointer-events-none ${isOpen ? 'rotate-180' : ''}`}>
                      {isOpen ? (
                        <Minus size={20} className="text-[#EBA294]" />
                      ) : (
                        <Plus size={20} className="text-[#367F4D]" />
                      )}
                    </div>
                  </div>
                  
                  {/* Optimized Accordion Animation using CSS Grid */}
                  <div 
                    className="grid transition-all duration-300 ease-in-out"
                    style={{
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      opacity: isOpen ? 1 : 0
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="pt-4 pl-12 pr-4 pb-2 text-stone-700 text-sm leading-relaxed font-sans mt-2 border-t border-black/10 border-dashed pointer-events-none">
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
