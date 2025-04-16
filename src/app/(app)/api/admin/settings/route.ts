import isUserAuthenticated from '@/lib/api/isUserAuthenticated';
import { verifyAdminSession } from '@/lib/api/verifyAdminSession';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
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

    const userId = isAuthenticated?.user?.id;

    // fetch room options, custom options, and cabinet types
    const { data: roomOptions, error: roomOptionsError } = await supabase.from('RoomOptions').select('*').limit(1000);
    if (roomOptionsError) {
      return NextResponse.json({ success: false, message: 'Failed to fetch room options', type: 'error' }, { status: 400 });
    }
    const { data: customOptions, error: customOptionsError } = await supabase.from('CustomOptions').select('*').limit(1000);

    if (customOptionsError) {
      return NextResponse.json({ success: false, message: 'Failed to fetch custom options', type: 'error' }, { status: 400 });
    }
    const { data: cabinetTypes, error: cabinetTypesError } = await supabase.from('CabinetTypes').select('*').limit(1000);
    if (cabinetTypesError) {
      return NextResponse.json({ success: false, message: 'Failed to fetch cabinet types', type: 'error' }, { status: 400 });
    }
    // combine data into a single object
    const data = {
      roomOptions,
      customOptions,
      cabinetTypes,
    };

    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err);
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

    const updateType: 'RoomOptions' | 'CustomOptions' | 'CabinetTypes' = body.updateType;

    const updateData = body.updateData;
    console.log('Update Type', updateData);
    const { data, error } = await supabase.from(updateType).insert(updateData).select('id').single();
    console.log('Data', data);
    console.log('Error', error);
    if (error) {
      return NextResponse.json({ success: false, message: 'Failed to create record', type: 'error' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Record created successfully', type: 'success' });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error', type: 'error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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

    const updateType: 'RoomOptions' | 'CustomOptions' | 'CabinetTypes' = body.updateType;
    console.log('Update Type', updateType);
    const updateData = body.updateData;
    console.log('Update Data', updateData);

    const { data, error } = await supabase.from(updateType).update(updateData).eq('id', updateData.id).select('id').single();
    console.log('Data', data);
    console.log('Error', error);
    if (error) {
      return NextResponse.json({ success: false, message: 'Failed to update data', type: 'error' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Data updated successfully', type: 'success' });
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

    const updateType: 'RoomOptions' | 'CustomOptions' | 'CabinetTypes' = body.updateType;

    const updateData = body.updateData;
    console.log('Update Type', updateType);
    console.log('Update Data', updateData);
    const { data, error } = await supabase.from(updateType).delete().eq('id', updateData.id).select('id').single();
    console.log('Data', data);
    console.log('Error', error);
    if (error) {
      return NextResponse.json({ success: false, message: 'Failed to delete data', type: 'error' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `${updateData?.name} deleted successfully`, type: 'success' });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error', type: 'error' }, { status: 500 });
  }
}
