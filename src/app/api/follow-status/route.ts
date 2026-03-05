import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const user = url.searchParams.get('user');
  const target = url.searchParams.get('target');

  if (!user || !target) {
    return NextResponse.json({ error: 'missing params' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('follows')
    .select('*')
    .match({ follower_id: user, following_id: target })
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 means no rows
    console.error('follow status error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ isFollowing: !!data });
}
