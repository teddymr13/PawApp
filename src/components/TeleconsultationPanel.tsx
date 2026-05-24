'use client';

import { useState } from 'react';
import { Calendar, PhoneCall, Bookmark } from 'lucide-react';

interface Appointment {
  clinic: string;
  appointmentDate: string;
  consultationType: string;
  notes: string;
  confirmed: boolean;
}

interface TeleconsultationPanelProps {
  appointment: Appointment;
  setAppointment: (appointment: Appointment) => void;
  onSave: () => void;
}

export function TeleconsultationPanel({ appointment, setAppointment, onSave }: TeleconsultationPanelProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave();
    setIsSaving(false);
  };

  return (
    <section className="space-y-4 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text-main">Teleconsultasi</h3>
          <p className="text-xs text-slate-500">Booking & ringkasan kunjungan dokter hewan.</p>
        </div>
        <PhoneCall size={20} className="text-primary" />
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={appointment.clinic}
          onChange={(e) => setAppointment({ ...appointment, clinic: e.target.value })}
          placeholder="Klinik / dokter hewan"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <input
          type="datetime-local"
          value={appointment.appointmentDate}
          onChange={(e) => setAppointment({ ...appointment, appointmentDate: e.target.value })}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <select
          value={appointment.consultationType}
          onChange={(e) => setAppointment({ ...appointment, consultationType: e.target.value })}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Pilih jenis konsultasi</option>
          <option value="Telekonsultasi">Telekonsultasi</option>
          <option value="Kunjungan Klinik">Kunjungan Klinik</option>
          <option value="Darurat">Darurat</option>
        </select>
        <textarea
          value={appointment.notes}
          onChange={(e) => setAppointment({ ...appointment, notes: e.target.value })}
          placeholder="Catatan persiapan / keluhan singkat"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 h-24 resize-none"
        />
      </div>

      <button onClick={handleSave} type="button" disabled={isSaving} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50">
        <Bookmark size={16} /> Simpan Janji Temu
      </button>

      {appointment.confirmed && (
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
          <p className="font-semibold">Janji temu tersimpan</p>
          <p>{appointment.clinic} • {new Date(appointment.appointmentDate).toLocaleString('id-ID')}</p>
        </div>
      )}
    </section>
  );
}
