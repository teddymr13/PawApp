'use client';

interface NutritionPlan {
  calories: number;
  dryFoodGrams: number;
  wetFoodGrams: number;
  note: string;
  badge: string;
}

interface NutritionPanelProps {
  catName: string;
  weightKg: number | null;
  age: string;
  isNeutered: boolean;
  allergies: string;
}

function buildNutritionPlan(weightKg: number | null, age: string, isNeutered: boolean) {
  if (!weightKg) {
    return {
      calories: 0,
      dryFoodGrams: 0,
      wetFoodGrams: 0,
      note: 'Isi berat badan untuk melihat rekomendasi nutrisi yang lebih akurat.',
      badge: 'Info Lengkap Diperlukan',
    };
  }

  const baseCalories = weightKg * (isNeutered ? 45 : 55);
  const calories = Math.round(baseCalories);
  const dryFoodGrams = Math.round((calories * 0.55) / 3.5);
  const wetFoodGrams = Math.round((calories * 0.45) / 1.2);
  const badge = calories < 220 ? 'Kebutuhan Ringan' : calories < 320 ? 'Kebutuhan Normal' : 'Kebutuhan Tinggi';
  const note = `Disarankan porsi harian ${dryFoodGrams}g dry food + ${wetFoodGrams}g wet food berdasarkan berat ${weightKg}kg.`;

  return { calories, dryFoodGrams, wetFoodGrams, note, badge };
}

export function NutritionPanel({ catName, weightKg, age, isNeutered, allergies }: NutritionPanelProps) {
  const plan = buildNutritionPlan(weightKg, age, isNeutered);

  return (
    <section className="space-y-3 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text-main">Rencana Nutrisi</h3>
          <p className="text-xs text-slate-500">Rekomendasi makanan harian untuk {catName || 'kucingmu'}.</p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-700">{plan.badge}</span>
      </div>

      <div className="rounded-3xl bg-slate-50 p-4">
        <p className="text-5xl font-bold text-text-main">{plan.calories ? `${plan.calories} kkal` : '—'}</p>
        <p className="mt-2 text-xs text-slate-500">Kalori harian estimasi.</p>
      </div>

      <div className="grid gap-2 text-sm text-slate-600">
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-xs uppercase text-slate-400">Dry Food</p>
          <p className="mt-1 font-semibold text-text-main">{plan.dryFoodGrams} gram</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-xs uppercase text-slate-400">Wet Food</p>
          <p className="mt-1 font-semibold text-text-main">{plan.wetFoodGrams} gram</p>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">{plan.note}</p>
      {allergies && <p className="text-xs text-rose-600">Alergi terdeteksi: {allergies}</p>}
    </section>
  );
}
