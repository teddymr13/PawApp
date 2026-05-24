import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const catId = searchParams.get('catId');

  if (!catId) {
    return NextResponse.json({ error: 'catId query diperlukan' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('cat_id', catId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Supabase GET chat history error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ history: data });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const catId = searchParams.get('catId');

  if (!catId) {
    return NextResponse.json({ error: 'catId query diperlukan' }, { status: 400 });
  }

  const { error } = await supabase
    .from('chat_history')
    .delete()
    .eq('cat_id', catId);

  if (error) {
    console.error('Supabase DELETE chat history error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
