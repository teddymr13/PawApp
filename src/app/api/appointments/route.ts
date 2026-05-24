import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const catId = searchParams.get('catId');

  if (!catId) {
    return NextResponse.json({ error: 'catId query diperlukan' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('cat_id', catId)
    .order('created_at', { ascending: false })
    .limit(1); // Ambil appointment terbaru saja untuk simpelnya

  if (error) {
    console.error('Supabase GET appointments error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ appointment: data?.[0] || null });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { catId, clinic, appointmentDate, consultationType, notes, confirmed } = body;

    if (!catId) {
      return NextResponse.json({ error: 'catId diperlukan' }, { status: 400 });
    }

    // Upsert atau Insert baru
    const { data, error } = await supabase
      .from('appointments')
      .insert([{ 
        cat_id: catId, 
        clinic, 
        appointment_date: appointmentDate, 
        consultation_type: consultationType, 
        notes, 
        confirmed 
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase POST appointments error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ appointment: data });
  } catch (error) {
    console.error('Appointments POST error', error);
    return NextResponse.json({ error: 'Gagal membuat janji temu' }, { status: 500 });
  }
}
