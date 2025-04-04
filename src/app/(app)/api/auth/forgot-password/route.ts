import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
// Adjust this import if your routes constants are defined elsewhere
import { APP_ROUTES } from '@/constants/routes';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const supabase = createServerActionClient({ cookies });
    const redirectTo = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}${APP_ROUTES.AUTH.RESET_PASSWORD.path}`
      : `http://localhost:3000${APP_ROUTES.AUTH.RESET_PASSWORD.path}`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      return NextResponse.json({ success: false, message: 'Could not reset password', type: 'error' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "We've sent a password reset link.",
      type: 'success',
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error', type: 'error' }, { status: 500 });
  }
}
