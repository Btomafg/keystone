'use server';
import { createServerSupabaseClient } from '@/utils/supabase/server';

export default async function isUserAuthenticated() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser();
    console.log('isUserAuthenticated', data, error);

    if (data && !error) {
      return data;
    } else {
      return false;
    }
  } catch {
    return false;
  }
}
