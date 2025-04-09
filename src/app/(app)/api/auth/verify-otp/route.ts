import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();
    const supabase = createServerActionClient({ cookies });
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      return NextResponse.json({ success: false, message: 'OTP verification failed', type: 'error' }, { status: 400 });
    }

    const session = data.session;
    const user = data.user;
    console.log('session', session);
    console.log('user', user);
    if (session) {
      const { data: newUser, error: newUserError } = await supabase.from('Users').insert({
        id: user?.id,
        email: user?.email,
        first_name: '',
        last_name: '',
        active: true,
      });

      return NextResponse.json({
        success: true,
        message: 'OTP verified',
        type: 'success',
        data: session.user,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'No session returned after OTP verification',
        type: 'error',
      },
      { status: 400 },
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error', type: 'error' }, { status: 500 });
  }
}
