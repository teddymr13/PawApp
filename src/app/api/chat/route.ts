import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'placeholder',
});

function parseBase64(dataUrl: string) {
  const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    return {
      inlineData: {
        mimeType: matches[1],
        data: matches[2]
      }
    };
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { message, imageBase64, catProfile, history } = await req.json();

    const { name, breed, age, weight, isNeutered, allergies, medicalHistory } = catProfile;

    const profileContext = `==== PROFIL KLINIS KUCING ====
Nama: ${name || 'Belum diisi'}
Ras: ${breed || 'Belum diisi'}
Usia: ${age || 'Belum diisi'}
Berat Badan: ${weight ? weight + ' kg' : 'Belum diisi'}
Status Steril: ${isNeutered ? 'Sudah Steril' : 'Belum Steril'}
Riwayat Alergi: ${allergies || 'Tidak ada/Belum diisi'}
Riwayat Medis: ${medicalHistory || 'Tidak ada/Belum diisi'}
===============================`;

    const systemInstruction = `Kamu adalah PawDoc, asisten AI dokter hewan yang khusus menjawab pertanyaan seputar kesehatan, nutrisi, dan perawatan kucing.
Gunakan bahasa Indonesia kasual, ramah, dan sering menggunakan emoji kucing/hewan (🐾, 😸, 😿, dll).
Jika pengguna menanyakan hal di luar konteks kucing (seperti politik, otomotif, pemrograman, dll), tolak dengan halus dan arahkan kembali ke topik kucing.
Jika pengguna mengunggah gambar, analisis gejalanya dan berikan rekomendasi, tapi selalu tekankan bahwa ini bukan diagnosis medis pasti.
PENTING: Gunakan informasi Profil Klinis Kucing dengan seksama. Contoh: jika pengguna menanyakan porsi makanan, hitung kalori harian berdasarkan BERAT BADAN dan STATUS STERIL yang ada di profil klinis.`;

    const internalPromptText = `${profileContext}\n\nPertanyaan pemilik: ${message || 'Tolong analisis gambar ini berdasarkan profil klinisku.'}`;
    
    const userParts: any[] = [{ text: internalPromptText }];

    if (imageBase64) {
      const imgPart = parseBase64(imageBase64);
      if (imgPart) {
        userParts.push(imgPart);
      }
    }

    const formattedHistory = history.map((msg: any) => {
      const parts: any[] = [{ text: msg.content }];
      if (msg.imageBase64) {
         const p = parseBase64(msg.imageBase64);
         if (p) parts.push(p);
      }
      return {
        role: msg.role === 'user' ? 'user' : 'model',
        parts: parts
      }
    });

    const contents = [
      ...formattedHistory,
      { role: 'user', parts: userParts }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    let botReply = response.text || "Maaf, aku tidak bisa menjawab pertanyaan itu saat ini.";

    const disclaimer = "\n\n**Perhatian:** *Saran ini bersifat edukatif dan bukan pengganti diagnosis medis. Jika kucingmu menunjukkan gejala darurat, segera bawa ke dokter hewan.*";
    
    botReply += disclaimer;

    return NextResponse.json({ reply: botReply });

  } catch (error) {
    console.error("PawDoc API Error:", error);
    return NextResponse.json({ error: "Gagal memproses permintaan" }, { status: 500 });
  }
}
