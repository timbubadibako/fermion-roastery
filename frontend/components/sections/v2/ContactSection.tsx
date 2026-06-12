"use client";

import React, { useState } from "react";
import axios from "axios";
import { strings } from "@/lib/strings";

export function ContactSection() {
  const lang = 'id';
  const content = strings[lang].contact;
  const [formData, setFormData] = useState({ full_name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await axios.post("http://localhost:3001/api/content/contact", formData);
      setStatus("success");
      setFormData({ full_name: "", email: "", message: "" });
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-12 text-[var(--color-fermion-black)]">
          {content.title}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{content.name}</label>
            <input 
              type="text" required
              value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})}
              className="w-full bg-transparent border-b-2 border-slate-200 py-3 focus:border-[var(--color-fermion-sea-green)] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{content.email}</label>
            <input 
              type="email" required
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-transparent border-b-2 border-slate-200 py-3 focus:border-[var(--color-fermion-sea-green)] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{content.message}</label>
            <textarea 
              required rows={4}
              value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
              className="w-full bg-transparent border-b-2 border-slate-200 py-3 focus:border-[var(--color-fermion-sea-green)] outline-none transition-colors resize-none"
            />
          </div>
          
          {status === 'error' && <p className="text-red-500 text-sm">{errorMessage}</p>}
          {status === 'success' && <p className="text-green-600 text-sm font-bold">Message sent successfully!</p>}

          <button 
            type="submit" disabled={status === 'loading'}
            className="w-full bg-[var(--color-fermion-black)] text-white font-bold py-4 rounded-xl hover:bg-[var(--color-fermion-french-blue)] transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Sending...' : content.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
