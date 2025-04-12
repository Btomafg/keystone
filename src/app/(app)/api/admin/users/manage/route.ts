import isUserAuthenticated from '@/lib/api/isUserAuthenticated';
import { verifyAdminSession } from '@/lib/api/verifyAdminSession';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const body = await request.json();
  console.log('Body', body);
  try {
    const supabase = await createServerSupabaseClient();
    const isAuthenticated = await isUserAuthenticated();

    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'User is not authenticated', type: 'error' }, { status: 401 });
    }

    const adminKey = searchParams.get('admin_key');

    const admin = await verifyAdminSession(supabase, isAuthenticated?.user?.id, adminKey);
    console.log('Admin on manage users', admin);
    const { data: adminKeyData, error: adminKeyError } = await supabase
      .from('Users')
      .select('admin_session_key, admin_session_expires_at')
      .eq('id', isAuthenticated.user.id)
      .single();

    if (adminKeyError) {
      return NextResponse.json({ success: false, message: 'Admin key verification failed', type: 'error' }, { status: 400 });
    }
    if (adminKeyData.admin_session_key !== adminKey) {
      return NextResponse.json({ success: false, message: 'Admin key is invalid', type: 'error' }, { status: 401 });
    }
    if (new Date(adminKeyData.admin_session_expires_at) < new Date()) {
      return NextResponse.json({ success: false, message: 'Admin key has expired', type: 'error' }, { status: 401 });
    }

    const type: 'magic' | 'reset' | 'deactivate' = body.type;

    if (type === 'magic') {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: body.email,
        options: {
          // set this to false if you do not want the user to be automatically signed up
          shouldCreateUser: false,
          emailRedirectTo: 'localhost:3000/dashboard',
        },
      });
      console.log('Magic link sent', data);
      return NextResponse.json({ success: true, message: 'Magic link sent', type: 'success' });
    }
    if (type === 'reset') {
      await supabase.auth.resetPasswordForEmail(body.email, {
        redirectTo: 'localhost:3000/auth/reset-password',
      });
      return NextResponse.json({ success: true, message: 'Reset Password Link Sent', type: 'success' });
    }
    if (type === 'deactivate') {
    }

    return NextResponse.json('data');
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error', type: 'error' }, { status: 500 });
  }
}
