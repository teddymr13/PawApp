'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface HealthLogFormProps {
  onSave: (entry: { log_date: string; weight_kg: number | null; symptom_summary: string; medication_adherence: boolean; notes: string }) => Promise<void>;
}

export function HealthLogForm({ onSave }: HealthLogFormProps) {
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const [symptomSummary, setSymptomSummary] = useState('');
  const [adherence, setAdherence] = useState(false);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    setSaving(true);
    await onSave({
      log_date: date,
      weight_kg: weight ? parseFloat(weight) : null,
      symptom_summary: symptomSummary,
      medication_adherence: adherence,
      notes,
    });
    setDate('');
    setWeight('');
    setSymptomSummary('');
    setAdherence(false);
    setNotes('');
    setSaving(false);
  };

  return (
    <section className="space-y-3 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text-main">Catatan Kesehatan</h3>
          <p className="text-xs text-slate-500">Tambah entri harian untuk memantau tren.</p>
        </div>
        <PlusCircle size={18} className="text-primary" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <input
            type="number"
            step="0.1"
            placeholder="Berat badan (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <textarea
            rows={3}
            placeholder="Ringkasan gejala / catatan"
            value={symptomSummary}
            onChange={(e) => setSymptomSummary(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={adherence} onChange={(e) => setAdherence(e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary/50" />
          Obat & perawatan sesuai jadwal
        </label>
        <textarea
          rows={2}
          placeholder="Catatan tambahan"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
        <button type="submit" disabled={saving} className="w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50">
          Simpan Catatan
        </button>
      </form>
    </section>
  );
}
