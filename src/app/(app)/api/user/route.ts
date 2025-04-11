import isUserAuthenticated from '@/lib/api/isUserAuthenticated';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const isAuthenticated = await isUserAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'User is not authenticated', type: 'error' }, { status: 401 });
    }
    const userId = isAuthenticated?.user?.id;
    const { data, error } = await supabase
      .from('Users')
      .select(
        'created_at, title, date_of_birth, email, first_name, active, last_name, phone, profile_img_url, mfa, is_admin, receive_email, receive_promotional, receive_push, receive_sms',
      )
      .eq('id', userId)
      .single();

    console.log('user', data);
    console.log('error', error);
    if (error) {
      if (error.code === 'PGRST116') {
        const { data: newUser, error: newUserError } = await supabase.from('Users').insert({
          id: data?.id,
          email: data?.email,
          active: true,
        });

        console.log('newUser', newUser);
        console.log('newUserError', newUserError);
      }
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err.message);
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
    const { error } = await supabase.from('Users').insert(body).eq('id', userId);

    if (error) {
      return NextResponse.json({ success: false, message: error.message, type: 'error' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'User created successfully', type: 'success' });
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ success: false, message: 'Server error', type: 'error' }, { status: 500 });
  }
}
export async function PATCH(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const isAuthenticated = await isUserAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'User is not authenticated', type: 'error' }, { status: 401 });
    }
    const userId = isAuthenticated?.user?.id;
    const body = await request.json();
    if (!body?.id) {
      body.id = userId;
    }
    const { error } = await supabase.from('Users').update(body).eq('id', userId);
    console.log('body', error);
    if (error) {
      return NextResponse.json({ success: false, message: error.message, type: 'error' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'User created successfully', type: 'success' });
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ success: false, message: 'Server error', type: 'error' }, { status: 500 });
  }
}
