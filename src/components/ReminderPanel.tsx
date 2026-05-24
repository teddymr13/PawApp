'use client';

import { useState } from 'react';
import { Plus, CheckCircle2, Trash2 } from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  reminder_type: string;
  scheduled_at: string;
  repeat_interval: string;
  notes: string;
  completed: boolean;
}

interface ReminderPanelProps {
  catId: string | null;
  reminders: Reminder[];
  onCreateReminder: (payload: Omit<Reminder, 'id' | 'completed'>) => Promise<void>;
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
  onDeleteReminder: (id: string) => Promise<void>;
}

export function ReminderPanel({ catId, reminders, onCreateReminder, onToggleComplete, onDeleteReminder }: ReminderPanelProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Obat');
  const [scheduledAt, setScheduledAt] = useState('');
  const [repeatInterval, setRepeatInterval] = useState('Sekali');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catId || !title || !scheduledAt) return;
    setIsSaving(true);
    await onCreateReminder({
      title,
      reminder_type: type,
      scheduled_at: scheduledAt,
      repeat_interval: repeatInterval,
      notes,
    });
    setTitle('');
    setNotes('');
    setScheduledAt('');
    setType('Obat');
    setRepeatInterval('Sekali');
    setIsSaving(false);
  };

  return (
    <section className="space-y-4 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-text-main">Care Scheduler</h3>
          <p className="text-xs text-slate-500">Pengingat obat & perawatan untuk kucingmu.</p>
        </div>
        <div className="rounded-full bg-primary/10 text-primary px-3 py-1 text-[11px] font-semibold">{reminders.filter((item) => !item.completed).length} Aktif</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tugas perawatan (misal: Obat antibiotik)"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <div className="grid grid-cols-2 gap-3">
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>Obat</option>
            <option>Vaksin</option>
            <option>Diet</option>
            <option>Grooming</option>
            <option>Check-up</option>
          </select>
          <select value={repeatInterval} onChange={(e) => setRepeatInterval(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>Sekali</option>
            <option>Harian</option>
            <option>Mingguan</option>
            <option>Bulanan</option>
          </select>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan tambahan"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-20"
          />
        </div>
        <button type="submit" disabled={!catId || isSaving} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50">
          <Plus size={16} /> Tambah Pengingat
        </button>
      </form>

      <div className="space-y-3">
        {reminders.length === 0 ? (
          <p className="text-xs text-slate-500">Belum ada pengingat. Simpan profil kucing dulu agar bisa menambahkan.</p>
        ) : (
          reminders.map((reminder) => (
            <div key={reminder.id} className={`rounded-2xl border px-3 py-3 ${reminder.completed ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text-main">{reminder.title}</p>
                  <p className="text-[11px] text-slate-500">{reminder.reminder_type} • {new Date(reminder.scheduled_at).toLocaleString('id-ID')}</p>
                </div>
                <button onClick={() => onDeleteReminder(reminder.id)} type="button" className="text-slate-400 hover:text-rose-500">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-[12px] text-slate-600">
                <span>{reminder.repeat_interval}</span>
                <button onClick={() => onToggleComplete(reminder.id, !reminder.completed)} type="button" className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 transition">
                  <CheckCircle2 size={14} /> {reminder.completed ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
                </button>
              </div>
              {reminder.notes && <p className="mt-2 text-xs text-slate-500">{reminder.notes}</p>}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
