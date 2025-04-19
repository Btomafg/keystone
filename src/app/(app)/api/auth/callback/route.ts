// app/auth/callback/route.ts
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new Response('Missing code', { status: 400 });
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('OAuth exchange error:', error);
    return new Response('Auth failed', { status: 401 });
  }

  // ✅ This must be a NextResponse so Supabase can attach Set-Cookie
  const response = NextResponse.redirect(new URL('/dashboard', request.url));

  // ✅ Most important: this is how Supabase writes cookies — through this Response
  return response;
}
