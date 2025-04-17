import isUserAuthenticated from '@/lib/api/isUserAuthenticated';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('Resources')
      .select(
        `
      *,
    ResourceAvailabilityRules:ResourceAvailabilityRules_resource_id_fkey ( * ),
     ResourceBlockedTimes: ResourceBlockedTimes_resource_id_fkey ( * )
    `,
      )
      .eq('id');

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

    return NextResponse.json(
      {
        data,
        user_message: 'Resources fetched successfully.',
        developer_message: 'Resource methods fetched successfully.',
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

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const isAuthenticated = await isUserAuthenticated();
    const userId = isAuthenticated.user.id;
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
    const body = await request.json();
    const start = new Date(body.start_time); // Parses ISO string
    console.log('start', start);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    console.log('end', end);
    const end_time = new Date(new Date(body.start_time).getTime() + 30 * 60 * 1000);
    console.log(end_time);
    body.end_time = end_time;
    body.user_id = userId;
    const { data, error } = await supabase.from('Appointments').upsert(body).eq('id', body.id).select('id').single();

    if (error) {
      return NextResponse.json(
        {
          data: null,
          user_message: error.message,
          developer_message: error.message,
        },
        { status: error.status || 400 },
      );
    }

    if (body.type === 0) {
      const { data: project, error: projectError } = await supabase
        .from('Projects')
        .update({ status: 2 })
        .eq('id', body.project_id)
        .select('id')
        .single();
      if (projectError) {
        return NextResponse.json(
          {
            data: null,
            user_message: projectError.message,
            developer_message: projectError.message,
          },
          { status: projectError.status || 400 },
        );
      }
    }

    return NextResponse.json(
      {
        data,
        user_message: 'Appointment created successfully.',
        developer_message: 'Appointment created successfully.',
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('ERROR', error);
    return NextResponse.json(
      {
        data: null,
        user_message: error.message,
        developer_message: 'An unexpected error occurred while processing the request.',
      },
      { status: error.status || 500 },
    );
  }
}

/**
 * DELETE: Delete a Resource record.
 * This mimics similar logic to a Django endpoint where the Resource is deleted.
 * This endpoint requires the user to be authenticated.
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const isAuthenticated = await isUserAuthenticated();

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

    const body = await request.json();
    // Assume body has an `id` field for the Resource to delete.
    const { data, error } = await supabase.from('Resource').delete().eq('id', body.id).select('id').single();

    if (error) {
      return NextResponse.json(
        {
          data: null,
          user_message: error.message,
          developer_message: error.message,
        },
        { status: error.status || 400 },
      );
    }

    return NextResponse.json(
      {
        data,
        user_message: 'Resource deleted successfully.',
        developer_message: 'Resource deleted successfully.',
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('ERROR', error);
    return NextResponse.json(
      {
        data: null,
        user_message: error.message,
        developer_message: 'An unexpected error occurred while processing the request.',
      },
      { status: error.status || 500 },
    );
  }
}
