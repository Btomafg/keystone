// lib/api/api.ts

import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export const API = {
  async getOne<T = any>(table: string, select: string, column: string, value: any): Promise<T | null> {
    console.log('GETONE');
    const { data, error } = await supabase.from(table).select(select).eq(column, value).single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data ?? error ?? null;
  },
  async getAll<T = any>(table: string, select: string, column: string, value: any): Promise<T | null> {
    console.log('GETALL');
    const { data, error } = await supabase.from(table).select(select).eq(column, value);

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data ?? error ?? null;
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
