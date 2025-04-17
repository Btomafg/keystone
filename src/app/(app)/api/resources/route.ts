import isUserAuthenticated from '@/lib/api/isUserAuthenticated';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
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

    const { data, error } = await supabase
      .from('Resources')
      .select(
        `
      *,
    ResourceAvailabilityRules:ResourceAvailabilityRules_resource_id_fkey ( * ),
     ResourceBlockedTimes: ResourceBlockedTimes_resource_id_fkey ( * )
    `,
      )
      .eq('id', '520bbcd9-389c-450c-a20d-2dcd55df99cf');
    console.log('data', data);
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
    const { data, error } = await supabase.from('Resource').update(body).eq('id', body.id).select('id').single();

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
        user_message: 'Resource updated successfully.',
        developer_message: 'Resource updated successfully.',
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
