'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Image as ImageIcon, X, AlertTriangle } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { Message } from '@/app/page';

interface ChatInterfaceProps {
  catId: string | null;
  catName: string;
  catBreed: string;
  catAge: string;
  catWeight: string;
  isNeutered: boolean;
  allergies: string;
  medicalHistory: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const EMERGENCY_KEYWORDS = ['keracunan', 'darurat', 'darah', 'patah', 'kejang', 'pingsan', 'tertabrak', 'emergency'];

export function ChatInterface({ 
  catId, catName, catBreed, catAge, catWeight, isNeutered, allergies, medicalHistory, messages, setMessages 
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEmergency, setIsEmergency] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const isEmerg = EMERGENCY_KEYWORDS.some(keyword => input.toLowerCase().includes(keyword));
    setIsEmergency(isEmerg);
  }, [input]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const currentInput = input;
    const isEmerg = EMERGENCY_KEYWORDS.some(keyword => currentInput.toLowerCase().includes(keyword));

    const userMessage: Message = { 
      role: 'user', 
      content: currentInput.trim(),
      imageBase64: selectedImage || undefined
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsEmergency(false);

    // [REQ-10] Local Emergency Intercept
    if (isEmerg) {
      const p3kMessage: Message = {
        role: 'bot',
        content: `🚨 **MODE DARURAT LOKAL DIAKTIFKAN** 🚨\n\nPaw Cats mendeteksi kemungkinan kondisi **Kritis/Darurat** dari pesan Anda.\nMohon jangan panik. Berikut panduan P3K instan:\n\n1. **Amankan Kucing**: Pindahkan kucing ke tempat yang aman, sepi, dan datar. Jangan dikerubungi.\n2. **Jangan Asal Beri Minum/Obat**: Jika kucing kejang atau pingsan, JANGAN memaksa memasukkan makanan/air karena bisa tersedak ke paru-paru.\n3. **Hubungi Dokter Hewan**: Kondisi seperti ini memerlukan tindakan medis profesional. Segera hubungi klinik terdekat!\n\n*(Pesan ini dihasilkan seketika secara lokal tanpa jeda server untuk menghemat waktu emas. Harap segera meluncur ke klinik hewan!)*`
      };
      setMessages((prev) => [...prev, p3kMessage]);
      return; // Memotong jalur API (Tidak call Gemini)
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          imageBase64: userMessage.imageBase64,
          catProfile: {
            name: catName,
            breed: catBreed,
            age: catAge,
            weight: catWeight,
            isNeutered: isNeutered,
            allergies: allergies,
            medicalHistory: medicalHistory,
          },
          history: messages,
          catId: catId,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi Paw Cats API');
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: data.reply },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'Maaf, terjadi kesalahan saat mencoba menghubungi server Paw Cats. Mohon coba lagi. 😿' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const bgClass = isEmergency ? 'bg-emergency-bg border-emergency' : 'bg-slate-50 border-slate-200';
  const buttonClass = isEmergency ? 'bg-emergency hover:bg-emergency-hover' : 'bg-primary hover:bg-primary-hover';

  return (
    <div className={`flex-1 flex flex-col h-full transition-colors duration-500 ${isEmergency ? 'bg-emergency-bg/50' : 'bg-slate-50/50'}`}>
      {/* Header Mobile / Title Area */}
      <div className={`md:hidden p-4 border-b flex items-center justify-between shadow-sm z-10 transition-colors ${isEmergency ? 'bg-emergency-bg border-emergency-bg text-emergency' : 'bg-white border-slate-200 text-primary'}`}>
        <div className="flex items-center gap-2">
          {isEmergency ? <AlertTriangle size={24} /> : <span className="text-xl">🐾</span>}
          <h1 className="text-lg font-bold text-text-main">Paw Chat</h1>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-2 chat-container">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-500">
            <div className="text-6xl mb-6 bg-white p-6 rounded-full shadow-sm">🐾</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Halo! Aku Paw Cats.</h2>
            <p className="text-sm text-slate-500 max-w-md leading-relaxed">
              Asisten AI yang siap membantu kamu merawat si meong. Silakan isi profil dan metrik klinis kucingmu di sidebar, lalu tanyakan apa saja!
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((msg, index) => (
              <ChatMessage key={index} role={msg.role} content={msg.content} imageBase64={msg.imageBase64} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-6 animate-in fade-in">
                <div className="flex max-w-[80%] gap-3">
                  <div className="shrink-0 h-8 w-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shadow-sm">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                  <div className={`px-5 py-3.5 rounded-2xl border text-text-main rounded-bl-none shadow-sm flex items-center gap-2 ${isEmergency ? 'bg-emergency-bg border-emergency' : 'bg-white border-slate-100'}`}>
                    <span className="text-sm text-slate-500 font-medium">Paw Cats sedang menganalisis klinis...</span>
                    <span className="animate-pulse">🐾</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] transition-colors no-print ${isEmergency ? 'bg-emergency-bg border-emergency/30' : 'bg-white border-slate-200'}`}>
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex flex-col gap-2">
          {isEmergency && (
            <div className="text-emergency text-xs font-bold flex items-center gap-1 mb-1 animate-pulse">
              <AlertTriangle size={14} /> Mode Darurat Terdeteksi! Intersep Lokal Aktif.
            </div>
          )}
          
          {selectedImage && (
            <div className="relative inline-block w-fit mb-2 animate-in fade-in zoom-in duration-300">
              <img src={selectedImage} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-slate-200 shadow-sm" />
              <button 
                type="button" 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 hover:bg-slate-700 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <div className="relative flex items-end gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              title="Unggah Foto (Maks 5MB)"
            >
              <ImageIcon size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan gejala atau tips perawatan di sini..."
              className={`w-full border rounded-2xl py-3.5 px-4 pr-14 text-sm focus:outline-none focus:ring-2 transition-all resize-none min-h-[52px] max-h-[120px] ${bgClass} ${isEmergency ? 'focus:ring-emergency/50 text-emergency font-medium' : 'focus:ring-primary/50 text-text-main'}`}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={(!input.trim() && !selectedImage) || isLoading}
              className={`absolute right-2 bottom-1 p-2.5 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 ${buttonClass}`}
            >
              <Send size={18} />
            </button>
          </div>
        </form>
        <p className="text-center text-[11px] text-slate-400 mt-3">
          Paw Cats dapat membuat kesalahan. Harap konsultasikan masalah medis serius ke dokter hewan.
        </p>
      </div>
    </div>
  );
}
