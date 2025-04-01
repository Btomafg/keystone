// lib/api/browser.ts
import { createBrowserClient } from '@supabase/ssr';
import { createAPI } from './api';

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export const API = createAPI(supabase);
