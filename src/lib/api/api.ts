// lib/api/api.ts
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Returns an API object with methods to interact with Supabase.
 * Must be called inside a valid request context (e.g. inside a route handler).
 */
export async function getAPI() {
  // Create the Supabase client in the current request context using cookies.
  const supabase: SupabaseClient = createServerActionClient({ cookies });

  return {
    async getOne<T = any>(table: string, select: string, column: string, value: any): Promise<T | null> {
      const { data, error } = await supabase.from(table).select(select).eq(column, value).single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }
      return data;
    },

    async getAll<T = any>(table: string, select: string, column: string, value: any): Promise<T | null> {
      const { data, error } = await supabase.from(table).select(select).eq(column, value);

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }
      return data;
    },

    async insert<T = any>(table: string, payload: T): Promise<T> {
      const { data, error } = await supabase.from(table).insert([payload]).select('id').single();

      if (error) throw new Error(error.message);
      return data as T;
    },

    async upsert<T = any>(table: string, payload: T): Promise<T> {
      const { data, error } = await supabase.from(table).upsert([payload]).select('id').single();

      if (error) throw new Error(error.message);
      return data as T;
    },

    async update<T = any>(table: string, payload: Partial<T> & { id: string }): Promise<T> {
      const { data, error } = await supabase.from(table).update(payload).eq('id', payload.id).select().single();

      if (error) throw new Error(error.message);
      return data;
    },

    async delete<T = any>(table: string, column: string, value: any): Promise<void> {
      const { error } = await supabase.from(table).delete().eq(column, value);
      if (error) throw new Error(error.message);
    },
  };
}
