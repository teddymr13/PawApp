'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatInterface } from '@/components/ChatInterface';
import { supabase } from '@/lib/supabase';

export interface Message {
  role: 'user' | 'bot';
  content: string;
  imageBase64?: string;
}

export default function Home() {
  const [catId, setCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catBreed, setCatBreed] = useState('');
  const [catAge, setCatAge] = useState('');
  
  // Phase 3 Extensions
  const [catWeight, setCatWeight] = useState('');
  const [isNeutered, setIsNeutered] = useState(false);
  const [allergies, setAllergies] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  const [messages, setMessages] = useState<Message[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleReset = () => {
    setMessages([]);
    // Cat profile remains intact, just clear chat
  };

  const handleSync = async () => {
    if (!catName) {
      alert("Nama kucing wajib diisi untuk menyimpan profil.");
      return;
    }
    
    setIsSyncing(true);
    try {
      const payload = {
        name: catName,
        breed: catBreed,
        age: catAge,
        weight_kg: catWeight ? parseFloat(catWeight) : null,
        is_neutered: isNeutered,
        allergies: allergies,
        medical_history: medicalHistory,
        updated_at: new Date().toISOString()
      };

      if (catId) {
        // Update existing
        const { error } = await supabase
          .from('cats')
          .update(payload)
          .eq('id', catId);
          
        if (error) throw error;
        alert("Profil berhasil diperbarui di database!");
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('cats')
          .insert([payload])
          .select()
          .single();
          
        if (error) throw error;
        if (data) {
          setCatId(data.id);
          alert("Profil baru berhasil disimpan ke database!");
        }
      }
    } catch (error: any) {
      console.error("Supabase Error:", error);
      alert("Gagal menyimpan ke database. Pastikan konfigurasi NEXT_PUBLIC_SUPABASE_URL & ANON_KEY benar di .env.local");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <main className="flex h-screen w-full overflow-hidden bg-slate-50 md:flex-row flex-col print:h-auto print:block">
      <Sidebar
        catName={catName} setCatName={setCatName}
        catBreed={catBreed} setCatBreed={setCatBreed}
        catAge={catAge} setCatAge={setCatAge}
        catWeight={catWeight} setCatWeight={setCatWeight}
        isNeutered={isNeutered} setIsNeutered={setIsNeutered}
        allergies={allergies} setAllergies={setAllergies}
        medicalHistory={medicalHistory} setMedicalHistory={setMedicalHistory}
        onReset={handleReset}
        onSync={handleSync}
        isSyncing={isSyncing}
      />
      <ChatInterface
        catName={catName}
        catBreed={catBreed}
        catAge={catAge}
        catWeight={catWeight}
        isNeutered={isNeutered}
        allergies={allergies}
        medicalHistory={medicalHistory}
        messages={messages}
        setMessages={setMessages}
      />
    </main>
  );
}
