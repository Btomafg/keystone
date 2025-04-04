import isUserAuthenticated from '@/lib/api/isUserAuthenticated';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const isAuthenticated = await isUserAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'User is not authenticated', type: 'error' }, { status: 401 });
    }
    const userId = isAuthenticated?.user?.id;
    console.log(request.body);
    const body = await request.json();
    console.log('BODY', body);
    const { data, error } = await supabase.from('Rooms').insert(body).select('id').single();

    const { data: layout, error: layoutError } = await supabase.from('Layouts').select('walls').eq('id', body.layout).single();

    console.log('LAYOUT', layout, layoutError);
    console.log('PROJECTS', data, error);

    if (error) {
      return NextResponse.json({ success: false, message: error.message, type: error.code }, { status: error?.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('ERROR', error);
    return NextResponse.json({ success: false, message: error.message }, { status: error.status });
  }
}
