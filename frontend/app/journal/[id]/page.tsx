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
  published_at: string;
  created_at: string;
}

export default function JournalReadPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<JournalPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/journal/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setPost(data);
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-stone-900 leading-tight mb-8">
            {post.title}
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
          <div className="relative w-full aspect-[21/9] mb-16 rounded-xl overflow-hidden shadow-2xl">
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
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </article>

        <Separator className="my-16" />

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="text-sm uppercase tracking-widest font-semibold text-stone-500">Bagikan:</span>
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Tautan artikel berhasil disalin!");
            }}>
              <Share2 size={16} />
            </Button>
          </div>
          <Link href="/journal">
            <Button className="bg-stone-900 text-white rounded-full px-8 uppercase tracking-widest text-xs h-12 font-bold hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              Baca Artikel Lainnya
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
