import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const supabase = createServerActionClient({ cookies });
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      return NextResponse.json({ success: false, message: 'OTP resend failed', type: 'error' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'OTP resent',
      type: 'success',
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error', type: 'error' }, { status: 500 });
  }
}
