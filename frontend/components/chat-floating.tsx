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
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-24 right-0 w-[350px] h-[550px] bg-white/40 backdrop-blur-[40px] rounded-[3rem] shadow-2xl border border-white/60 flex flex-col overflow-hidden"
          >
            {/* Header: Glass Style */}
            <div className="bg-slate-900/90 p-8 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-fermion-french-blue rounded-2xl flex items-center justify-center text-white italic font-black shadow-lg shadow-fermion-french-blue/30 text-lg">F</div>
                  <div>
                    <h4 className="text-white text-xs font-black uppercase tracking-widest leading-none">Fermion Lab</h4>
                    <p className="text-emerald-400 text-[9px] font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Live Support
                    </p>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
                 <X size={16} />
               </button>
            </div>

            {/* Messages: Floating in Glass */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
               {messages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-5 rounded-[1.5rem] text-[11px] font-medium leading-relaxed shadow-sm border transition-all ${msg.isUser ? 'bg-slate-900 text-white border-slate-800 rounded-tr-none' : 'bg-white/80 text-slate-700 border-white/60 rounded-tl-none'}`}>
                       {msg.text}
                       <p className={`text-[8px] mt-2 font-black uppercase tracking-widest opacity-40`}>{msg.time}</p>
                    </div>
                 </div>
               ))}
            </div>

            {/* Input: Integrated Glass Form */}
            <form onSubmit={handleSendMessage} className="p-6 bg-white/60 border-t border-white/60 flex gap-3">
               <Input 
                 placeholder="Type your question..." 
                 className="flex-1 h-12 bg-white/50 border-none rounded-2xl text-[11px] font-bold px-5 focus:ring-2 focus:ring-fermion-french-blue/20 transition-all"
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
               />
               <Button type="submit" className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-fermion-french-blue transition-all shadow-xl">
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
          w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] shadow-2xl flex items-center justify-center 
          hover:scale-110 transition-transform active:scale-95 group relative border-4 border-white
          ${isOpen ? 'bg-fermion-french-blue rotate-0' : ''}
        `}
      >
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
           <Sparkles size={10} className="text-white" />
        </div>
        {isOpen ? <X size={24} strokeWidth={2.5} /> : <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />}
      </motion.button>
    </div>
  );
}
