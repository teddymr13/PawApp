import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const catId = searchParams.get('catId');

  if (!catId) {
    return NextResponse.json({ error: 'catId query diperlukan' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('favorite_articles')
    .select('article_id')
    .eq('cat_id', catId);

  if (error) {
    console.error('Supabase GET favorites error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ favorites: data.map(d => d.article_id) });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { catId, articleId, isFavorite } = body;

    if (!catId || !articleId) {
      return NextResponse.json({ error: 'catId dan articleId diperlukan' }, { status: 400 });
    }

    if (isFavorite) {
      const { error } = await supabase
        .from('favorite_articles')
        .insert([{ cat_id: catId, article_id: articleId }]);
        
      if (error && error.code !== '23505') { // Abaikan error duplicate key
        throw error;
      }
    } else {
      const { error } = await supabase
        .from('favorite_articles')
        .delete()
        .match({ cat_id: catId, article_id: articleId });
        
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Favorites POST error', error);
    return NextResponse.json({ error: error.message || 'Gagal menyimpan favorit' }, { status: 500 });
  }
}
