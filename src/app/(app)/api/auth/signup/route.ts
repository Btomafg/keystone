import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    // Build a redirect URL (adjust as needed)
    const redirectTo = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      : 'http://localhost:3000/auth/callback';
    const supabase = createServerActionClient({ cookies });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    });
    const { user, session } = data || {};
    if (error) {
      return NextResponse.json({ success: false, message: error.message, type: 'error' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Thanks for signing up! Please check your email for a verification link.',
      type: 'success',
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error', type: 'error' }, { status: 500 });
  }
}
