'use client';

import { useMemo, useState, useEffect } from 'react';
import { Search, Star, Share2, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/components/Toast';

interface Article {
  id: string;
  title: string;
  category: string;
  severity_level: string;
  summary: string;
  content: string;
}

interface SymptomLibraryProps {
  catId: string | null;
}

export function SymptomLibrary({ catId }: SymptomLibraryProps) {
  const [library, setLibrary] = useState<Article[]>([]);
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchLibrary();
  }, []);

  useEffect(() => {
    if (catId) {
      fetchFavorites();
    }
  }, [catId]);

  const fetchLibrary = async () => {
    try {
      const res = await fetch('/api/library');
      const data = await res.json();
      if (data.articles) setLibrary(data.articles);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`/api/library/favorite?catId=${catId}`);
      const data = await res.json();
      if (data.favorites) setFavorites(data.favorites);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return library.filter((item) => item.title.toLowerCase().includes(term) || item.summary.toLowerCase().includes(term) || item.category.toLowerCase().includes(term));
  }, [query, library]);

  const toggleFavorite = async (id: string) => {
    if (!catId) {
      showToast('Silakan simpan profil kucing terlebih dahulu untuk menyimpan favorit.', 'warning');
      return;
    }
    
    const isFavorite = !favorites.includes(id);
    
    // Optimistic UI update
    setFavorites((current) => isFavorite ? [...current, id] : current.filter((item) => item !== id));

    try {
      await fetch('/api/library/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catId, articleId: id, isFavorite })
      });
    } catch (err) {
      console.error("Gagal update favorit", err);
      // Revert if error
      setFavorites((current) => !isFavorite ? [...current, id] : current.filter((item) => item !== id));
    }
  };

  const generateArticle = async () => {
    if (!query.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.article) {
        setLibrary((prev) => [data.article, ...prev]);
        setQuery('');
      } else {
        showToast(`Gagal membuat artikel: ${data.error || 'Unknown error'}`, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan saat memanggil AI.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="space-y-4 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text-main">Symptom Library</h3>
          <p className="text-xs text-slate-500">Cari referensi gejala kucing dengan cepat.</p>
        </div>
        <Search size={18} className="text-slate-400" />
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-3 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari gejala atau kondisi..."
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-text-main">{item.title}</p>
                <p className="text-[11px] text-slate-500">{item.category} • Tingkat {item.severity_level}</p>
              </div>
              <button type="button" onClick={() => toggleFavorite(item.id)} className={`rounded-full p-2 transition ${favorites.includes(item.id) ? 'bg-primary/10 text-primary' : 'bg-white text-slate-500 hover:bg-slate-100'}`}>
                <Star size={16} />
              </button>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-600">{item.summary}</p>
            <button type="button" className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100">
              <Share2 size={14} /> Salin Ringkasan
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center">
            <div className="mx-auto w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm mb-3">
              <Sparkles size={20} />
            </div>
            <p className="text-sm font-semibold text-text-main mb-1">Artikel Tidak Ditemukan</p>
            <p className="text-xs text-slate-500 mb-4 max-w-[200px] mx-auto leading-relaxed">
              PawDoc AI bisa membuatkan artikel medis khusus tentang "{query}" untuk ensiklopedia ini.
            </p>
            <button
              onClick={generateArticle}
              disabled={isGenerating || !query}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50 mx-auto"
            >
              {isGenerating ? (
                <><Loader2 size={16} className="animate-spin" /> Menulis Artikel...</>
              ) : (
                <><Sparkles size={16} /> Tanya AI Sekarang</>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
