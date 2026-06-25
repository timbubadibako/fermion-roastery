"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  Loader2, 
  Share2, 
  Clock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface JournalPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  status: string;
  category: string;
  title_en?: string;
  content_en?: string;
  excerpt_en?: string;
  published_at: string;
  created_at: string;
}

export default function JournalReadPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<JournalPost | null>(null);
  const [otherPosts, setOtherPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"id" | "en">("id");

  useEffect(() => {
    Promise.all([
      fetch(`/api/journal/${id}`).then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      }),
      fetch(`/api/journal`).then(res => {
        if (!res.ok) return [];
        return res.json();
      })
    ])
      .then(([postData, allPostsData]) => {
        setPost(postData);
        if (Array.isArray(allPostsData)) {
           // Filter out current post and get max 3
           const others = allPostsData.filter(p => p.id !== postData.id && p.slug !== postData.slug).slice(0, 3);
           setOtherPosts(others);
        }
      })
      .catch(() => {
        toast.error("Artikel tidak ditemukan.");
        router.push("/journal");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FAF9F6] text-stone-500">
        <Loader2 size={40} className="animate-spin text-stone-800" />
        <p className="text-xs font-black uppercase tracking-[0.3em]">Memuat Artikel...</p>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 pt-32 pb-24 selection:bg-stone-800 selection:text-white">
      <div className="container max-w-4xl mx-auto px-4">
        
        {/* Navigation */}
        <div className="mb-12">
          <Link href="/journal">
            <Button variant="ghost" className="hover:bg-transparent hover:text-stone-500 transition-colors p-0">
              <ArrowLeft size={16} className="mr-2" />
              Kembali ke Jurnal
            </Button>
          </Link>
        </div>

        {/* Header */}
        <header className="mb-12 text-center">
          <Badge variant="outline" className="mb-6 font-cloude text-xl px-4 py-1 border-stone-300">
            {post.category || "Jurnal"}
          </Badge>
          
          <div className="flex justify-center mb-6">
            <div className="flex bg-stone-100 rounded-full p-1 border border-stone-200">
              <button 
                onClick={() => setLang('id')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${lang === 'id' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
              >
                ID
              </button>
              <button 
                onClick={() => setLang('en')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${lang === 'en' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
              >
                EN
              </button>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-stone-900 leading-tight mb-8">
            {lang === 'en' && post.title_en ? post.title_en : post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-stone-500 uppercase tracking-widest font-semibold">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              {post.published_at ? format(new Date(post.published_at), "dd MMMM yyyy", { locale: localeId }) : "Draft"}
            </div>
            <div className="flex items-center gap-2">
              <User size={14} />
              Fermion Team
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              {Math.max(1, Math.ceil(post.content?.length / 800))} min read
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative w-full aspect-video md:aspect-[21/9] mb-16 rounded-xl overflow-hidden shadow-2xl">
            <Image 
              src={post.featured_image} 
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content Body */}
        <article className="prose prose-stone prose-lg max-w-3xl mx-auto">
          <div 
            className="first-letter:text-7xl first-letter:font-display first-letter:text-stone-900 first-letter:mr-3 first-letter:float-left font-sans leading-relaxed text-stone-700"
            dangerouslySetInnerHTML={{ __html: (lang === 'en' && post.content_en) ? post.content_en : post.content }} 
          />
        </article>

        <Separator className="my-16" />

        {/* Footer Actions */}
        <div className="flex items-center gap-4 max-w-3xl mx-auto mb-16">
          <span className="text-sm uppercase tracking-widest font-semibold text-stone-500">Bagikan:</span>
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Tautan artikel berhasil disalin!");
          }}>
            <Share2 size={16} />
          </Button>
        </div>

        {/* Read Other Articles */}
        {otherPosts.length > 0 && (
          <div className="mt-20">
            <h3 className="text-2xl font-display font-black uppercase italic text-stone-900 mb-8 border-b border-stone-200 pb-4">
              Baca Artikel Lainnya
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherPosts.map((other) => (
                <Link href={`/journal/${other.slug}`} key={other.id} className="group block bg-white rounded-xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="aspect-video relative overflow-hidden bg-stone-100">
                    {other.featured_image ? (
                      <Image 
                        src={other.featured_image} 
                        alt={other.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300 font-cloude text-3xl">{other.category}</div>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    <p className="text-[10px] font-black text-[#A288E3] uppercase tracking-widest">
                      {other.published_at ? format(new Date(other.published_at), "dd MMM yyyy", { locale: localeId }) : "Draft"}
                    </p>
                    <h4 className="font-display font-bold text-stone-900 leading-tight group-hover:text-[#A288E3] transition-colors line-clamp-2">
                      {other.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
               <Link href="/journal">
                 <Button variant="outline" className="rounded-full px-8 uppercase tracking-widest text-xs h-12 font-bold hover:bg-stone-100 transition-all">
                   Lihat Semua Arsip
                 </Button>
               </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
