import isUserAuthenticated from '@/lib/api/isUserAuthenticated';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const isAuthenticated = await isUserAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'User is not authenticated', type: 'error' }, { status: 401 });
    }
    const userId = isAuthenticated?.user?.id;
    const { data, error } = await supabase
      .from('Users')
      .select(
        'created_at, title, date_of_birth, email, first_name, is_active, last_name, phone, profile_picture_url, mfa, receive_email, receive_promotional, receive_push, receive_sms',
      )
      .eq('id', userId)
      .single();

    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ success: false, message: 'Server error', type: 'error' }, { status: 500 });
  }
}
