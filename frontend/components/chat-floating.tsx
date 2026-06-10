"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import * as Ably from 'ably';

export function ChatFloating() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; time: string }[]>([
    { text: "Hello! Welcome to Fermion Roastery. How can we help you today?", isUser: false, time: "Now" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Ably logic placeholder (requires ABLY_API_KEY in backend)
  // For now, we'll simulate the "Admin" responding

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
            className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 p-6 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-fermion-blue rounded-2xl flex items-center justify-center text-white italic font-black">F</div>
                  <div>
                    <h4 className="text-white text-sm font-black uppercase tracking-widest leading-none">Fermion Support</h4>
                    <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Online
                    </p>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                 <X size={20} />
               </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
               {messages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${msg.isUser ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'}`}>
                       {msg.text}
                       <p className={`text-[8px] mt-1 font-bold uppercase tracking-widest ${msg.isUser ? 'text-slate-400' : 'text-slate-300'}`}>{msg.time}</p>
                    </div>
                 </div>
               ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
               <Input 
                 placeholder="Type your question..." 
                 className="flex-1 h-12 bg-slate-50 border-none rounded-xl text-xs font-bold"
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
               />
               <Button type="submit" className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-fermion-blue transition-all">
                 <Send size={16} />
               </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-slate-900 text-white rounded-3xl shadow-xl flex items-center justify-center hover:scale-105 transition-transform active:scale-95 group relative"
      >
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full" />
        {isOpen ? <X size={24} /> : <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />}
      </button>
    </div>
  );
}
