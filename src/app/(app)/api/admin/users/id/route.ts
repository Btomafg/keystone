import isUserAuthenticated from '@/lib/api/isUserAuthenticated';
import { verifyAdminSession } from '@/lib/api/verifyAdminSession';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const isAuthenticated = await isUserAuthenticated();
    console.log('AUTH', isAuthenticated);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'User is not authenticated', type: 'error' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    console.log('SEARCH PARAMS', searchParams);
    const adminKey = searchParams.get('admin_key');
    const userId = searchParams.get('user_id');
    console.log('USER ID', userId);
    const adminCheck = await verifyAdminSession(supabase, isAuthenticated.user.id, adminKey);
    if (!adminCheck.success) {
      return NextResponse.json({ success: false, message: adminCheck.errorMessage, type: 'error' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('Users')
      .select(
        `id,
        first_name,
        last_name,
        email,
        phone,
        profile_img_url,
        created_at,
        date_of_birth,
        title`,
      )
      .eq('id', userId)
      .single();

    console.log(data, error);
    if (error) {
      return NextResponse.json({ success: false, message: error.message, type: 'error' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Server error', err);
    return NextResponse.json({ success: false, message: 'Server error', type: 'error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const isAuthenticated = await isUserAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'User is not authenticated', type: 'error' }, { status: 401 });
    }
    const userId = isAuthenticated?.user?.id;
    const body = await request.json();
    console.log('BODY', body);
    body.user_id = userId;
    const { data, error } = await supabase.from('Projects').update(body).eq('id', body.id).select('id, status').single();

    if (data == null) {
      return NextResponse.json({ success: false, message: 'Project not updated', type: 'error' }, { status: 404 });
    }

    if (error) {
      return NextResponse.json({ success: false, message: error.message, type: error.code }, { status: error.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('ERROR', error);
    return NextResponse.json({ success: false, message: error.message }, { status: error.status });
  }
}
