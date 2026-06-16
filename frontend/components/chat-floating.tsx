"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, Loader2, Sparkles } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export function ChatFloating() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; time: string }[]>([
    { text: "Hello! Welcome to Fermion Roastery. How can we help you today?", isUser: false, time: "Now" }
  ]);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isWaving, setIsWaving] = useState(false);

  // Pop & Wave Animation after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 3000);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = { text: inputText, isUser: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMessage]);
    setInputText("");

    // Simulate Admin Response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Thanks for your message! Our team will get back to you shortly.",
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[80]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-24 right-0 w-[350px] h-[550px] bg-[#FDFBF7] backdrop-blur-[20px] rounded-2xl shadow-[12px_12px_0px_rgba(0,0,0,0.04)] border border-black/10 flex flex-col overflow-hidden"
          >
            {/* Header: Scrapbook Style */}
            <div className="bg-[#2B4031] p-8 flex items-center justify-between relative">
               {/* Tape */}
               <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-16 h-4 bg-white/20 border border-white/5 rotate-[-2deg] z-20 backdrop-blur-sm"></div>

               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F1B941] border border-black/10 rounded-lg flex items-center justify-center text-black font-cloude shadow-sm text-lg rotate-[-5deg]">F</div>
                  <div>
                    <h4 className="text-white text-sm font-cloude tracking-widest leading-none">Fermion Lab</h4>
                    <p className="text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Live Support
                    </p>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
                 <X size={16} />
               </button>
            </div>

            {/* Messages: Floating on Paper */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F4F0E6]/30">
               {messages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-5 rounded-xl text-[11px] font-medium leading-relaxed shadow-sm border transition-all ${msg.isUser ? 'bg-[#1A2B20] text-white border-black/10' : 'bg-white text-stone-700 border-black/5'}`}>
                       {msg.text}
                       <p className={`text-[8px] mt-2 font-black uppercase tracking-widest opacity-40 italic`}>{msg.time}</p>
                    </div>
                 </div>
               ))}
            </div>

            {/* Input: Integrated Notebook Form */}
            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-black/5 flex gap-3">
               <Input 
                 placeholder="Type your question..." 
                 className="flex-1 h-12 bg-stone-50 border border-black/5 rounded-xl text-[11px] font-display italic px-5 focus:ring-1 focus:ring-[#367F4D]/20 transition-all shadow-inner"
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
               />
               <Button type="submit" className="w-12 h-12 bg-[#367F4D] text-white rounded-xl flex items-center justify-center hover:bg-[#2B4031] transition-all shadow-sm">
                 <Send size={16} />
               </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (The Sticker Bot) */}
      <motion.button 
        onClick={() => setIsOpen(!isOpen)}
        animate={isWaving ? { 
          rotate: [0, 10, -10, 10, 0],
          scale: [1, 1.1, 1]
        } : {}}
        transition={{ duration: 1.5, repeat: isWaving ? 2 : 0 }}
        className={`
          w-16 h-16 bg-white text-stone-900 rounded-2xl shadow-[6px_6px_0px_rgba(0,0,0,0.04)] flex items-center justify-center 
          hover:scale-110 transition-transform active:scale-95 group relative border border-black/5
          ${isOpen ? 'bg-[#F4F0E6] rotate-0' : 'rotate-3'}
        `}
      >
        {/* Fake Tape on button */}
        <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-8 h-3 bg-[#367F4D]/20 border border-black/5 rotate-[-5deg] z-20 backdrop-blur-sm opacity-60 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#EC625D] border border-white rounded-full flex items-center justify-center z-30">
           <Sparkles size={10} className="text-white" />
        </div>
        {isOpen ? <X size={24} strokeWidth={2.2} /> : <MessageCircle size={24} className="text-[#367F4D] group-hover:rotate-12 transition-transform" strokeWidth={2.2} />}
      </motion.button>
    </div>
  );
}
