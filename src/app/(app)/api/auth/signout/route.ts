import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createServerActionClient({ cookies });
    const { error } = await supabase.auth.signOut();
    if (error) {
      return NextResponse.json({ success: false, message: 'Failed to sign out.', type: 'error' }, { status: 400 });
    }
    return NextResponse.json({
      success: true,
      message: "You've been signed out.",
      type: 'success',
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error', type: 'error' }, { status: 500 });
  }
}
