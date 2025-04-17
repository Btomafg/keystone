import isUserAuthenticated from '@/lib/api/isUserAuthenticated';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const isAuthenticated = await isUserAuthenticated();
    console.log('isAuthenticated', isAuthenticated);
    if (!isAuthenticated) {
      return NextResponse.json(
        {
          data: null,
          user_message: 'User is not authenticated',
          developer_message: 'User is not authenticated',
        },
        { status: 401 },
      );
    }

    const userId = isAuthenticated.user.id;
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');
    console.log('projectId', projectId);
    if (!projectId) {
      return NextResponse.json(
        {
          data: null,
          user_message: 'project_id is required.',
          developer_message: 'Missing query parameter: project_id',
        },
        { status: 400 },
      );
    }

    // Fetch the most recent feedback (if any) for this user, faq and version.
    const { data, error } = await supabase
      .from('Appointments')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          data: null,
          user_message: error.message,
          developer_message: error.message,
        },
        { status: 400 },
      );
    }
    console.log('data', data);
    return NextResponse.json(
      {
        data,
        user_message: 'Appointment fetched successfully.',
        developer_message: 'Appointment fetched successfully.',
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      {
        data: null,
        user_message: 'Something went wrong!',
        developer_message: 'Server error: ' + err.message,
      },
      { status: 500 },
    );
  }
}
