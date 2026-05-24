import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'placeholder',
});

// Data default jika database masih kosong
const DEFAULT_LIBRARY = [
  {
    title: 'Diare pada Kucing',
    category: 'Kesehatan Umum',
    severity_level: 'Sedang',
    summary: 'Diare bisa disebabkan makanan tiba-tiba, stres, atau infeksi. Pastikan kucing tetap terhidrasi dan evaluasi makanan.',
    content: ''
  },
  {
    title: 'Mata Merah dan Berair',
    category: 'Skin & Coat',
    severity_level: 'Ringan',
    summary: 'Bisa jadi iritasi ringan atau alergi. Bersihkan dengan kain lembut dan konsultasikan jika memburuk.',
    content: ''
  },
  {
    title: 'Lesu dan Nafsu Makan Turun',
    category: 'Nutrisi',
    severity_level: 'Sedang',
    summary: 'Perubahan kebiasaan makan bisa menunjukkan stres atau gangguan pencernaan. Observasi 24 jam dan konsultasi jika berlanjut.',
    content: ''
  },
  {
    title: 'Gatal Berlebihan / Kulit Kering',
    category: 'Skin & Coat',
    severity_level: 'Ringan',
    summary: 'Periksa kemungkinan alergi makanan atau kutu. Berikan minyak ikan dan lotion khusus kucing.',
    content: ''
  },
];

export async function GET() {
  const { data, error } = await supabase
    .from('knowledge_articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase GET articles error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Jika tabel kosong, kita kembalikan data default untuk fallback
  if (!data || data.length === 0) {
    return NextResponse.json({ articles: DEFAULT_LIBRARY.map((item, i) => ({ id: `default-${i}`, ...item })) });
  }

  return NextResponse.json({ articles: data });
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query pencarian diperlukan' }, { status: 400 });
    }

    const systemInstruction = `Anda adalah ahli medis hewan (kucing).
Buatlah sebuah artikel ensiklopedia medis mini mengenai "${query}".
Kembalikan dalam format JSON murni TANPA markdown formatting block (\`\`\`json) dengan struktur sebagai berikut:
{
  "title": "Judul artikel (spesifik dan jelas)",
  "category": "Kategori (contoh: Kesehatan Umum, Nutrisi, Skin & Coat, Perilaku, Darurat)",
  "severity_level": "Tingkat Keparahan (Ringan / Sedang / Tinggi)",
  "summary": "Ringkasan cepat (maksimal 2 kalimat)",
  "content": "Konten detail tentang penyebab, gejala, dan rekomendasi perawatan mandiri / rujukan dokter hewan. Gunakan format paragraf."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: `Buat artikel tentang: ${query}` }] }],
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
      }
    });

    let rawJson = response.text || '{}';
    let articleData;
    
    try {
      articleData = JSON.parse(rawJson.trim());
    } catch (e) {
      // Fallback regex extraction if mimeType somehow fails
      const match = rawJson.match(/\{[\s\S]*\}/);
      if (match) {
        articleData = JSON.parse(match[0]);
      } else {
        throw new Error('Gagal mem-parsing format JSON dari AI');
      }
    }

    // Insert to Supabase
    const { data: newArticle, error } = await supabase
      .from('knowledge_articles')
      .insert([{
        title: articleData.title,
        category: articleData.category,
        severity_level: articleData.severity_level,
        summary: articleData.summary,
        content: articleData.content,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase Insert Error:', error);
      throw new Error(`Database Error: ${error.message}`);
    }

    return NextResponse.json({ article: newArticle });

  } catch (error: any) {
    console.error('Library POST error:', error);
    return NextResponse.json({ error: error.message || 'Gagal men-generate artikel dari AI' }, { status: 500 });
  }
}
