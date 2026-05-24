import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const catId = searchParams.get('catId');

  if (!catId) {
    return NextResponse.json({ error: 'catId query diperlukan' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('care_reminders')
    .select('*')
    .eq('cat_id', catId)
    .order('scheduled_at', { ascending: false });

  if (error) {
    console.error('Supabase GET reminders error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ reminders: data });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { catId, title, reminder_type, scheduled_at, repeat_interval, notes } = body;

    if (!catId || !title || !scheduled_at) {
      return NextResponse.json({ error: 'catId, title, dan scheduled_at diperlukan' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('care_reminders')
      .insert([{ cat_id: catId, title, reminder_type, scheduled_at, repeat_interval, notes }])
      .select()
      .single();

    if (error) {
      console.error('Supabase POST reminders error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ reminder: data });
  } catch (error) {
    console.error('Reminders POST error', error);
    return NextResponse.json({ error: 'Gagal membuat pengingat' }, { status: 500 });
  }
}
