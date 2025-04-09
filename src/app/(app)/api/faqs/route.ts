import isUserAuthenticated from '@/lib/api/isUserAuthenticated';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.from('Faq').select('*').eq('active', true);

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
        user_message: 'FAQs fetched successfully.',
        developer_message: 'FAQ methods fetched successfully.',
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
    const { data, error } = await supabase.from('Faq').update(body).eq('id', body.id).select('id').single();

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
        user_message: 'FAQ updated successfully.',
        developer_message: 'FAQ updated successfully.',
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
 * DELETE: Delete a FAQ record.
 * This mimics similar logic to a Django endpoint where the FAQ is deleted.
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
    // Assume body has an `id` field for the FAQ to delete.
    const { data, error } = await supabase.from('Faq').delete().eq('id', body.id).select('id').single();

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
        user_message: 'FAQ deleted successfully.',
        developer_message: 'FAQ deleted successfully.',
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
