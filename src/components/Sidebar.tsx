import { Cat, PawPrint, Calendar, Printer, Weight, ShieldAlert, Activity, CheckSquare, Square } from "lucide-react";

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
  isSyncing
}: SidebarProps) {
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
            <h1 className="text-xl font-bold text-text-main">PawDoc</h1>
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
              <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5"><Cat size={14}/> Info Dasar</label>
              
              <input
                type="text"
                placeholder="Nama Kucing (Misal: Ciko)"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Ras"
                  value={catBreed}
                  onChange={(e) => setCatBreed(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Usia (Bulan/Tahun)"
                  value={catAge}
                  onChange={(e) => setCatAge(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Clinical Metrices */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5"><Activity size={14}/> Metrik Klinis</label>
              
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
              </div>

              <button
                onClick={() => setIsNeutered(!isNeutered)}
                className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-lg text-sm transition-colors ${isNeutered ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-white border-slate-200 text-slate-600'}`}
              >
                <span className="font-medium">Status Steril</span>
                {isNeutered ? <CheckSquare size={18} /> : <Square size={18} className="text-slate-400" />}
              </button>
            </div>

            <hr className="border-slate-200" />

            {/* Medical History */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5"><ShieldAlert size={14}/> Riwayat & Alergi</label>
              
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
              {isSyncing ? "Menyimpan..." : "Simpan Profil ke Database"}
            </button>
          </div>
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
          onClick={onReset}
          className="w-full py-2.5 px-4 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          Reset Sesi Obrolan
        </button>
      </div>
    </aside>
  );
}
