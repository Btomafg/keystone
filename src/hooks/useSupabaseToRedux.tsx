'use server';
import store from '@/store';
import { setIsAuthenticated, setRefreshTokenInterval, setToken, setUser } from '@/store/slices/authSlice';
import { createBrowserClient } from '@supabase/ssr';

import { cookies } from 'next/headers';
export async function useSyncSupabaseToRedux() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    { cookies: () => cookies() },
  );

  const syncSession = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    console.log('Session:', session);
    console.log('Error:', error);
    if (error) {
      console.error('Session fetch error:', error);
      return;
    }

    if (session) {
      store.dispatch(setToken(session.access_token));
      store.dispatch(setRefreshTokenInterval(new Date().toISOString()));
      store.dispatch(setIsAuthenticated(true));
      store.dispatch(setUser(session.user));
    }
  };

  syncSession();
}
