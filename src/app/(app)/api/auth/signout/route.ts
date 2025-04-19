import { APP_ROUTES } from '@/constants/routes';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log(cookies().getAll());
  try {
    const supabase = createServerActionClient({ cookies });
    const { error } = await supabase.auth.signOut();
    if (error) {
      return NextResponse.json({ success: false, message: 'Failed to sign out.', type: 'error' }, { status: 400 });
    }
    await supabase.auth.signOut();
    const response = NextResponse.redirect(process.env.BASE_URL + APP_ROUTES.HOME.path);

    return response;
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error', type: 'error' }, { status: 500 });
  }
}
