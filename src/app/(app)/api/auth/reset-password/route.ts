import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password, confirmPassword } = await request.json();
    if (!password || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password and confirm password are required',
          type: 'error',
        },
        { status: 400 },
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, message: 'Passwords do not match', type: 'error' }, { status: 400 });
    }

    const supabase = createServerActionClient({ cookies });
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return NextResponse.json({ success: false, message: 'Password update failed', type: 'error' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Your password has been updated.',
      type: 'success',
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error', type: 'error' }, { status: 500 });
  }
}
