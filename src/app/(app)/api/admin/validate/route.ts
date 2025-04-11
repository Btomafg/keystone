import isUserAuthenticated from '@/lib/api/isUserAuthenticated';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const isAuthenticated = await isUserAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'User is not authenticated', type: 'error' }, { status: 401 });
    }
    const userId = isAuthenticated?.user?.id;
    const body = await request.json();

    //Validate user is Admin and Pin is correct
    const { data: user, error: userError } = await supabase
      .from('Users')
      .select('id, email, is_admin, admin_pin')
      .eq('id', userId)
      .single();
    console.log('user', user);
    if (userError) {
      return NextResponse.json({ success: false, message: userError.message, type: 'error' }, { status: 500 });
    }
    if (!user?.is_admin) {
      return NextResponse.json({ success: false, message: 'User is not admin', type: 'error' }, { status: 403 });
    }
    if (user?.admin_pin !== body?.admin_pin) {
      return NextResponse.json({ success: false, message: 'Admin pin is incorrect', type: 'error' }, { status: 403 });
    }

    //Generate Admin Session Key

    const { data: adminKey, error: adminKeyError } = await supabase
      .from('Users')
      .update({ admin_session_key: uuidv4(), admin_session_expires_at: new Date(Date.now() + 60 * 60 * 2000) })
      .eq('id', userId)
      .select('admin_session_key, admin_session_expires_at')
      .single();
    console.log('adminKey', adminKey);

    if (adminKeyError) {
      return NextResponse.json({ success: false, message: adminKeyError.message, type: 'error' }, { status: 500 });
    }
    return NextResponse.json({ success: true, data: { key: adminKey }, message: 'Admin Session Created', type: 'success' });
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ success: false, message: 'Server error', type: 'error' }, { status: 500 });
  }
}
