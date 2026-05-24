import { Cat, PawPrint, Printer, Weight, ShieldAlert, Activity, CheckSquare, Square, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ReminderPanel } from '@/components/ReminderPanel';
import { NutritionPanel } from '@/components/NutritionPanel';
import { TeleconsultationPanel } from '@/components/TeleconsultationPanel';
import { HealthTrendPanel } from '@/components/HealthTrendPanel';
import { HealthLogForm } from '@/components/HealthLogForm';
import { SymptomLibrary } from '@/components/SymptomLibrary';

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

interface SidebarProps {
  catName: string;
  setCatName: (name: string) => void;
  catBreed: string;
  setCatBreed: (breed: string) => void;
  catAge: string;
  setCatAge: (age: string) => void;

  catWeight: string;
  setCatWeight: (weight: string) => void;
  isNeutered: boolean;
  setIsNeutered: (status: boolean) => void;
  allergies: string;
  setAllergies: (text: string) => void;
  medicalHistory: string;
  setMedicalHistory: (text: string) => void;

  onReset: () => void;
  onSync: () => void;
  isSyncing: boolean;
  catId: string | null;
  reminders: Reminder[];
  onCreateReminder: (payload: Omit<Reminder, 'id' | 'completed'>) => Promise<void>;
  onToggleReminderComplete: (id: string, completed: boolean) => Promise<void>;
  onDeleteReminder: (id: string) => Promise<void>;
  healthLogs: HealthLog[];
  onSaveHealthLog: (entry: Omit<HealthLog, 'id'>) => Promise<void>;
  appointment: Appointment;
  setAppointment: (appointment: Appointment) => void;
  onSaveAppointment: () => void;
}

export function Sidebar({
  catName, setCatName,
  catBreed, setCatBreed,
  catAge, setCatAge,
  catWeight, setCatWeight,
  isNeutered, setIsNeutered,
  allergies, setAllergies,
  medicalHistory, setMedicalHistory,
  onReset,
  onSync,
  isSyncing,
  catId,
  reminders,
  onCreateReminder,
  onToggleReminderComplete,
  onDeleteReminder,
  healthLogs,
  onSaveHealthLog,
  appointment,
  setAppointment,
  onSaveAppointment,
}: SidebarProps) {
  const [breeds, setBreeds] = useState<any[]>([]);
  const [selectedBreedDetails, setSelectedBreedDetails] = useState<any>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  // Fetch breeds on mount
  useEffect(() => {
    fetch('https://api.thecatapi.com/v1/breeds')
      .then(res => res.json())
      .then(data => setBreeds(data))
      .catch(err => console.error("Error fetching breeds:", err));
  }, []);

  // Watch selected breed
  useEffect(() => {
    if (catBreed) {
      const found = breeds.find(b => b.name === catBreed);
      if (found) {
        if (found.image?.url) {
          setSelectedBreedDetails(found);
        } else if (found.reference_image_id) {
          fetch(`https://api.thecatapi.com/v1/images/${found.reference_image_id}`)
            .then(res => res.json())
            .then(data => setSelectedBreedDetails({ ...found, image: { url: data.url } }))
            .catch(() => setSelectedBreedDetails(found));
        } else {
          setSelectedBreedDetails(found);
        }
      } else {
        setSelectedBreedDetails(null);
      }
    } else {
      setSelectedBreedDetails(null);
    }
  }, [catBreed, breeds]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <aside className="w-full md:w-80 bg-background-soft border-r border-slate-200 flex flex-col h-full shadow-sm z-10 shrink-0 print:hidden">
      <div className="p-5 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <PawPrint size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-main">Paw</h1>
            <p className="text-xs font-medium text-text-muted">Dashboard Klinis AI</p>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold text-text-main uppercase tracking-wider">
              Rekam Medis (Konteks)
            </h2>
          </div>

          <div className="space-y-4">
            {/* Basic Info */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5"><Cat size={14} /> Info Dasar</label>

              <input
                type="text"
                placeholder="Nama Kucing (Misal: Ciko)"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />

              <select
                value={catBreed}
                onChange={(e) => setCatBreed(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              >
                <option value="">Pilih Ras Kucing...</option>
                {breeds.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
                <option value="Lainnya/Campuran (Domestik)">Lainnya/Campuran (Domestik)</option>
              </select>

              {/* [REQ-12] Encyclopedia Mini Card */}
              {selectedBreedDetails && selectedBreedDetails.id && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-top-2">
                  {selectedBreedDetails.image?.url && (
                    <div className="h-32 w-full bg-slate-200 relative group">
                      <img src={selectedBreedDetails.image.url} alt={selectedBreedDetails.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm">
                        <Info size={14} />
                      </div>
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-bold text-sm text-text-main mb-1">{selectedBreedDetails.name}</h3>
                    <p className="text-[11px] text-text-muted leading-relaxed mb-2 line-clamp-3">
                      {selectedBreedDetails.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedBreedDetails.temperament?.split(',').slice(0, 3).map((t: string) => (
                        <span key={t} className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-medium">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <input
                type="text"
                placeholder="Usia (Bulan/Tahun)"
                value={catAge}
                onChange={(e) => setCatAge(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            <hr className="border-slate-200" />

            {/* Clinical Metrices */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5"><Activity size={14} /> Metrik Klinis</label>

              <div className="relative group">
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                  <Weight size={16} className="text-slate-400" />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Berat (kg)"
                    value={catWeight}
                    onChange={(e) => setCatWeight(e.target.value)}
                    className="w-full text-sm focus:outline-none"
                  />
                  <span className="text-xs text-slate-400 font-medium">kg</span>
                  <div className="text-slate-400 hover:text-primary transition-colors cursor-help"><Info size={14} /></div>
                </div>
                <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg shadow-lg z-50 pointer-events-none">
                  Berat badan presisi dalam kg digunakan AI untuk mengalkulasi takaran kalori harian dan dosis aman obat darurat.
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                </div>
              </div>

              <div className="relative group">
                <button
                  onClick={() => setIsNeutered(!isNeutered)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-lg text-sm transition-colors ${isNeutered ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-white border-slate-200 text-slate-600'}`}
                >
                  <span className="font-medium flex items-center gap-2">Status Steril <Info size={14} className="text-slate-400 hover:text-primary transition-colors" /></span>
                  {isNeutered ? <CheckSquare size={18} /> : <Square size={18} className="text-slate-400" />}
                </button>
                <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg shadow-lg z-50 pointer-events-none">
                  Status kebiri/sterilisasi memengaruhi perhitungan metabolisme basal (BMR) dan kecenderungan fluktuasi hormon perilaku.
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                </div>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Medical History */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5"><ShieldAlert size={14} /> Riwayat & Alergi</label>

              <textarea
                placeholder="Alergi (Obat/Makanan)..."
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none h-20"
              />

              <textarea
                placeholder="Riwayat penyakit terdahulu..."
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none h-24"
              />
            </div>

            <button
              onClick={onSync}
              disabled={isSyncing}
              className="w-full py-2 px-4 text-xs font-bold uppercase tracking-wide text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSyncing ? "Menyimpan..." : "Simpan Data Kucing"}
            </button>
          </div>

          <NutritionPanel
            catName={catName}
            weightKg={catWeight ? parseFloat(catWeight) : null}
            age={catAge}
            isNeutered={isNeutered}
            allergies={allergies}
          />

          <ReminderPanel
            catId={catId}
            reminders={reminders}
            onCreateReminder={onCreateReminder}
            onToggleComplete={onToggleReminderComplete}
            onDeleteReminder={onDeleteReminder}
          />

          <HealthLogForm onSave={onSaveHealthLog} />
          <HealthTrendPanel healthLogs={healthLogs} />
          <TeleconsultationPanel appointment={appointment} setAppointment={setAppointment} onSave={onSaveAppointment} />
          <SymptomLibrary catId={catId} />
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 bg-white space-y-2">
        <button
          onClick={handlePrint}
          className="w-full py-2.5 px-4 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Printer size={16} />
          Cetak Laporan
        </button>
        <button
          onClick={() => setShowResetModal(true)}
          className="w-full py-2.5 px-4 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          Reset Sesi Obrolan
        </button>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Riwayat Konsultasi?</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Aksi ini akan menghapus seluruh salinan percakapan aktif dari database secara permanen. Rekam medis profil kucing di sidebar akan tetap aman.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  onReset();
                  setShowResetModal(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
