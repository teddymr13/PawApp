'use client';

interface HealthLog {
  id: string;
  log_date: string;
  weight_kg: number | null;
  symptom_summary: string;
  medication_adherence: boolean;
}

interface HealthTrendPanelProps {
  healthLogs: HealthLog[];
}

export function HealthTrendPanel({ healthLogs }: HealthTrendPanelProps) {
  const sortedLogs = [...healthLogs].sort((a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime());
  const latest = sortedLogs[0];
  const last7 = sortedLogs.slice(0, 7);
  const adherenceScore = last7.length ? Math.round((last7.filter((log) => log.medication_adherence).length / last7.length) * 100) : 0;

  return (
    <section className="space-y-4 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text-main">Health Trend Dashboard</h3>
          <p className="text-xs text-slate-500">Melihat perkembangan berat dan kepatuhan perawatan.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">{healthLogs.length} catatan</span>
      </div>

      {latest ? (
        <div className="grid gap-3">
          <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
            <p className="text-[11px] uppercase text-slate-400">Entri Terakhir</p>
            <p className="mt-2 font-semibold text-text-main">{new Date(latest.log_date).toLocaleDateString('id-ID')}</p>
            <p className="text-xs mt-1 text-slate-500">Berat: {latest.weight_kg ?? '—'} kg • Kepatuhan obat: {latest.medication_adherence ? 'Ya' : 'Tidak'}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl bg-white border border-slate-200 p-3 text-sm">
              <p className="text-[11px] uppercase text-slate-400">Skor Kepatuhan</p>
              <p className="mt-2 text-2xl font-semibold text-text-main">{adherenceScore}%</p>
              <p className="text-xs text-slate-500 mt-1">dari 7 hari terakhir</p>
            </div>
            <div className="rounded-3xl bg-white border border-slate-200 p-3 text-sm">
              <p className="text-[11px] uppercase text-slate-400">Perubahan Berat</p>
              <p className="mt-2 text-2xl font-semibold text-text-main">{last7.length ? `${Math.round((latest.weight_kg ?? 0) - (last7[last7.length - 1].weight_kg ?? 0))} kg` : '—'}</p>
              <p className="text-xs text-slate-500 mt-1">selama 7 hari terakhir</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-500">Belum ada catatan kesehatan. Tambahkan entri harian agar tren bisa ditampilkan.</p>
      )}
    </section>
  );
}
