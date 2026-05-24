import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(req: Request, context: any) {
  try {
    const { params } = context;
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const body = await req.json();
    const { completed, title, scheduled_at, repeat_interval, notes } = body;
    const updates: any = {};
    if (completed !== undefined) updates.completed = completed;
    if (title !== undefined) updates.title = title;
    if (scheduled_at !== undefined) updates.scheduled_at = scheduled_at;
    if (repeat_interval !== undefined) updates.repeat_interval = repeat_interval;
    if (notes !== undefined) updates.notes = notes;

    const { data, error } = await supabase
      .from('care_reminders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase PATCH reminder error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ reminder: data });
  } catch (error) {
    console.error('Reminders PATCH error', error);
    return NextResponse.json({ error: 'Gagal memperbarui pengingat' }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  const { params } = context;
  const resolvedParams = params instanceof Promise ? await params : params;
  const { id } = resolvedParams;

  const { error } = await supabase
    .from('care_reminders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Supabase DELETE reminder error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
