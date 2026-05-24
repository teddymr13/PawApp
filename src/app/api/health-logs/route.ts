import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const catId = searchParams.get('catId');

  if (!catId) {
    return NextResponse.json({ error: 'catId query diperlukan' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('health_logs')
    .select('*')
    .eq('cat_id', catId)
    .order('log_date', { ascending: false });

  if (error) {
    console.error('Supabase GET health logs error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ healthLogs: data });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { catId, log_date, weight_kg, symptom_summary, medication_adherence, notes } = body;

    if (!catId || !log_date) {
      return NextResponse.json({ error: 'catId dan log_date diperlukan' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('health_logs')
      .insert([{ cat_id: catId, log_date, weight_kg, symptom_summary, medication_adherence, notes }])
      .select()
      .single();

    if (error) {
      console.error('Supabase POST health logs error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ healthLog: data });
  } catch (error) {
    console.error('HealthLog POST error', error);
    return NextResponse.json({ error: 'Gagal menyimpan catatan kesehatan' }, { status: 500 });
  }
}
