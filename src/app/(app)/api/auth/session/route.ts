'use server';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log({ cookies });
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser();
    console.log('Session data:', data);
    console.log('Session error:', error);
    if (error || !data.session) {
      return NextResponse.json({ success: false, message: 'No active session', type: 'error' }, { status: 401 });
    }

    return NextResponse.json({ success: true, data: data.session });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error', type: 'error' }, { status: 500 });
  }
}
