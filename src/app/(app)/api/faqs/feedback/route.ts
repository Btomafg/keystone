import isUserAuthenticated from '@/lib/api/isUserAuthenticated';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
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

    const userId = isAuthenticated.user.id;
    const { searchParams } = new URL(request.url);
    const faq_id = searchParams.get('faq_id');
    const faq_version = searchParams.get('faq_version') || null;
    console.log('faq_id', faq_id);
    console.log('faq_version', faq_version);
    if (!faq_id) {
      return NextResponse.json(
        {
          data: null,
          user_message: 'faq_id is required.',
          developer_message: 'Missing query parameter: faq_id',
        },
        { status: 400 },
      );
    }

    // Fetch the most recent feedback (if any) for this user, faq and version.
    const { data: faqFeedback, error } = await supabase
      .from('FaqFeedback')
      .select('*')
      .eq('faq_id', faq_id)
      .eq('user_id', userId)
      .eq('faq_version', faq_version)
      .order('created_at', { ascending: false })
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

    return NextResponse.json(
      {
        data: faqFeedback, // may be null if no feedback exists
        user_message: 'Feedback fetched successfully.',
        developer_message: 'Feedback fetched successfully.',
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
    console.log('request', request);
    const userId = isAuthenticated.user.id;
    console.log('userId', userId);
    const body = await request.json();
    const { result, faq_id, faq_version } = body;
    console.log('body', body);
    if (!result || !faq_id || !faq_version) {
      return NextResponse.json(
        {
          data: null,
          user_message: 'Missing required fields.',
          developer_message: 'Missing required fields: result, faq_id, faq_version are required.',
        },
        { status: 400 },
      );
    }

    // Check if feedback already exists for this user, FAQ and version.
    const { data: existingFeedback, error: fetchError } = await supabase
      .from('FaqFeedback')
      .select('*')
      .eq('faq_id', faq_id)
      .eq('user_id', userId)
      .eq('faq_version', faq_version)
      .maybeSingle();
    console.log('existingFeedback', existingFeedback);
    console.log(fetchError);
    let feedback;
    if (existingFeedback) {
      // Update the existing feedback result
      const { data, error: updateError } = await supabase
        .from('FaqFeedback')
        .update({ result })
        .eq('id', existingFeedback.id)
        .select('*')
        .single();
      if (updateError) {
        return NextResponse.json(
          {
            data: null,
            user_message: updateError.message,
            developer_message: updateError.message,
          },
          { status: updateError.status || 400 },
        );
      }
      feedback = data;
    } else {
      // Create a new feedback record
      const { data, error: insertError } = await supabase
        .from('FaqFeedback')
        .insert({ faq_id, user_id: userId, faq_version, result })
        .select('*')
        .single();
      console.log('insertError', insertError);
      console.log('data', data);
      if (insertError) {
        return NextResponse.json(data, { status: insertError.status || 400 });
      }
      feedback = data;
    }

    return NextResponse.json(
      {
        data: feedback,
        user_message: 'Feedback created successfully.',
        developer_message: 'Feedback created successfully.',
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      {
        data: null,
        user_message: err.message,
        developer_message: 'An unexpected error occurred while processing the request.',
      },
      { status: err.status || 500 },
    );
  }
}
