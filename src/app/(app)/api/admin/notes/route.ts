import isUserAuthenticated from '@/lib/api/isUserAuthenticated';
import { verifyAdminSession } from '@/lib/api/verifyAdminSession';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const isAuthenticated = await isUserAuthenticated();

    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'User is not authenticated', type: 'error' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const adminKey = searchParams.get('admin_key');
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ success: false, message: 'Missing type or id', type: 'error' }, { status: 400 });
    }

    const adminCheck = await verifyAdminSession(supabase, isAuthenticated.user.id, adminKey);
    if (!adminCheck.success) {
      return NextResponse.json({ success: false, message: adminCheck.errorMessage, type: 'error' }, { status: 401 });
    }

    const column = type === 'leads' ? 'lead_id' : type === 'users' ? 'user_id' : null;
    if (!column) {
      return NextResponse.json({ success: false, message: 'Invalid type parameter', type: 'error' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('Notes')
      .select(
        `
    id,
    note,
    created_at,
    created_by (
      first_name,
      last_name,
      profile_img_url
    )
  `,
      )
      .eq(column, id);

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
  const { searchParams } = new URL(request.url);
  const body = await request.json();
  console.log('Body', body);
  try {
    const supabase = await createServerSupabaseClient();
    const isAuthenticated = await isUserAuthenticated();

    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'User is not authenticated', type: 'error' }, { status: 401 });
    }

    const adminKey = searchParams.get('admin_key');

    const admin = await verifyAdminSession(supabase, isAuthenticated?.user?.id, adminKey);
    console.log('Admin', admin);
    const { data: adminKeyData, error: adminKeyError } = await supabase
      .from('Users')
      .select('admin_session_key, admin_session_expires_at')
      .eq('id', isAuthenticated.user.id)
      .single();

    if (adminKeyError) {
      return NextResponse.json({ success: false, message: 'Admin key verification failed', type: 'error' }, { status: 400 });
    }
    if (adminKeyData.admin_session_key !== adminKey) {
      return NextResponse.json({ success: false, message: 'Admin key is invalid', type: 'error' }, { status: 401 });
    }
    if (new Date(adminKeyData.admin_session_expires_at) < new Date()) {
      return NextResponse.json({ success: false, message: 'Admin key has expired', type: 'error' }, { status: 401 });
    }
    body.created_by = isAuthenticated.user.id;
    const { data, error } = await supabase.from('Notes').insert(body).select('id').single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message, type: 'error' }, { status: 400 });
    }
    console.log('Notes', body);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error', type: 'error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const body = await request.json();
  console.log('Body', body);
  try {
    const supabase = await createServerSupabaseClient();
    const isAuthenticated = await isUserAuthenticated();

    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'User is not authenticated', type: 'error' }, { status: 401 });
    }

    const adminKey = searchParams.get('admin_key');

    const admin = await verifyAdminSession(supabase, isAuthenticated?.user?.id, adminKey);
    console.log('Admin', admin);
    const { data: adminKeyData, error: adminKeyError } = await supabase
      .from('Users')
      .select('admin_session_key, admin_session_expires_at')
      .eq('id', isAuthenticated.user.id)
      .single();

    if (adminKeyError) {
      return NextResponse.json({ success: false, message: 'Admin key verification failed', type: 'error' }, { status: 400 });
    }
    if (adminKeyData.admin_session_key !== adminKey) {
      return NextResponse.json({ success: false, message: 'Admin key is invalid', type: 'error' }, { status: 401 });
    }
    if (new Date(adminKeyData.admin_session_expires_at) < new Date()) {
      return NextResponse.json({ success: false, message: 'Admin key has expired', type: 'error' }, { status: 401 });
    }

    const { data, error } = await supabase.from('Notes').delete().eq('id', body.id).select('id').single();
    console.log('Notes', body);
    return NextResponse.json('data');
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error', type: 'error' }, { status: 500 });
  }
}
