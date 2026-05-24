'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatInterface } from '@/components/ChatInterface';
import { useToast } from '@/components/Toast';
import { supabase } from '@/lib/supabase';

export interface Message {
  role: 'user' | 'bot';
  content: string;
  imageBase64?: string;
}

interface Reminder {
  id: string;
  title: string;
  reminder_type: string;
  scheduled_at: string;
  repeat_interval: string;
  notes: string;
  completed: boolean;
}

interface HealthLog {
  id: string;
  log_date: string;
  weight_kg: number | null;
  symptom_summary: string;
  medication_adherence: boolean;
  notes: string;
}

interface Appointment {
  clinic: string;
  appointmentDate: string;
  consultationType: string;
  notes: string;
  confirmed: boolean;
}

export default function Home() {
  const { showToast } = useToast();
  const [catId, setCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catBreed, setCatBreed] = useState('');
  const [catAge, setCatAge] = useState('');
  const [catWeight, setCatWeight] = useState('');
  const [isNeutered, setIsNeutered] = useState(false);
  const [allergies, setAllergies] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  const [messages, setMessages] = useState<Message[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([]);
  const [appointment, setAppointment] = useState<Appointment>({ clinic: '', appointmentDate: '', consultationType: '', notes: '', confirmed: false });

  useEffect(() => {
    if (!catId) return;
    loadReminders();
    loadHealthLogs();
    loadAppointment();
    loadChatHistory();
  }, [catId]);

  const loadAppointment = async () => {
    if (!catId) return;
    const response = await fetch(`/api/appointments?catId=${encodeURIComponent(catId)}`);
    const data = await response.json();
    if (response.ok && data.appointment) {
      setAppointment(data.appointment);
    }
  };

  const loadChatHistory = async () => {
    if (!catId) return;
    const response = await fetch(`/api/chat-history?catId=${encodeURIComponent(catId)}`);
    const data = await response.json();
    if (response.ok && data.history) {
      setMessages(data.history);
    }
  };

  const handleReset = async () => {
    setMessages([]);
    if (catId) {
      await fetch(`/api/chat-history?catId=${encodeURIComponent(catId)}`, { method: 'DELETE' });
    }
  };

  const handleSync = async () => {
    if (!catName) {
      showToast('Nama kucing wajib diisi untuk menyimpan profil.', 'warning');
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
        allergies,
        medical_history: medicalHistory,
        updated_at: new Date().toISOString(),
      };

      if (catId) {
        const { error } = await supabase.from('cats').update(payload).eq('id', catId);
        if (error) throw error;
        showToast('Profil berhasil diperbarui di database!', 'success');
      } else {
        const { data, error } = await supabase.from('cats').insert([payload]).select().single();
        if (error) throw error;
        if (data) {
          setCatId(data.id);
          showToast('Profil baru berhasil disimpan ke database!', 'success');
        }
      }
    } catch (error: any) {
      const errMsg = error?.message || error?.error_description || JSON.stringify(error) || 'Unknown error';
      const errCode = error?.code ? ` (code: ${error.code})` : '';
      console.error('Supabase Error:', errMsg + errCode, error);
      showToast(`Gagal menyimpan: ${errMsg}${errCode}`, 'error', 6000);
    } finally {
      setIsSyncing(false);
    }
  };

  const loadReminders = async () => {
    if (!catId) return;
    const response = await fetch(`/api/reminders?catId=${encodeURIComponent(catId)}`);
    const data = await response.json();
    if (response.ok) {
      setReminders(data.reminders || []);
    }
  };

  const loadHealthLogs = async () => {
    if (!catId) return;
    const response = await fetch(`/api/health-logs?catId=${encodeURIComponent(catId)}`);
    const data = await response.json();
    if (response.ok) {
      setHealthLogs(data.healthLogs || []);
    }
  };

  const createReminder = async (payload: Omit<Reminder, 'id' | 'completed'>) => {
    if (!catId) return;
    const response = await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ catId, ...payload }),
    });

    if (response.ok) {
      const data = await response.json();
      setReminders((prev) => [data.reminder, ...prev]);
    } else {
      const errData = await response.json();
      showToast(`Gagal menyimpan pengingat: ${errData.error}`, 'error');
    }
  };

  const toggleReminderComplete = async (id: string, completed: boolean) => {
    const response = await fetch(`/api/reminders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });

    if (response.ok) {
      setReminders((prev) => prev.map((item) => (item.id === id ? { ...item, completed } : item)));
    }
  };

  const deleteReminder = async (id: string) => {
    const response = await fetch(`/api/reminders/${id}`, { method: 'DELETE' });
    if (response.ok) {
      setReminders((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const saveHealthLog = async (entry: Omit<HealthLog, 'id'>) => {
    if (!catId) return;
    const response = await fetch('/api/health-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ catId, ...entry }),
    });
    if (response.ok) {
      const data = await response.json();
      setHealthLogs((prev) => [data.healthLog, ...prev]);
    } else {
      const errData = await response.json();
      showToast(`Gagal menyimpan catatan kesehatan: ${errData.error}`, 'error');
    }
  };

  const saveAppointment = async () => {
    if (!catId) return;
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ catId, ...appointment, confirmed: true }),
    });
    if (response.ok) {
      const data = await response.json();
      setAppointment(data.appointment);
      showToast('Janji temu berhasil disimpan ke database!', 'success');
    } else {
      const errData = await response.json();
      showToast(`Gagal menyimpan janji temu: ${errData.error}`, 'error');
    }
  };

  return (
    <main className="flex h-screen w-full overflow-hidden bg-slate-50 md:flex-row flex-col print:h-auto print:block">
      <Sidebar
        catId={catId}
        catName={catName}
        setCatName={setCatName}
        catBreed={catBreed}
        setCatBreed={setCatBreed}
        catAge={catAge}
        setCatAge={setCatAge}
        catWeight={catWeight}
        setCatWeight={setCatWeight}
        isNeutered={isNeutered}
        setIsNeutered={setIsNeutered}
        allergies={allergies}
        setAllergies={setAllergies}
        medicalHistory={medicalHistory}
        setMedicalHistory={setMedicalHistory}
        onReset={handleReset}
        onSync={handleSync}
        isSyncing={isSyncing}
        reminders={reminders}
        onCreateReminder={createReminder}
        onToggleReminderComplete={toggleReminderComplete}
        onDeleteReminder={deleteReminder}
        healthLogs={healthLogs}
        onSaveHealthLog={saveHealthLog}
        appointment={appointment}
        setAppointment={setAppointment}
        onSaveAppointment={saveAppointment}
      />
      <ChatInterface
        catId={catId}
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
