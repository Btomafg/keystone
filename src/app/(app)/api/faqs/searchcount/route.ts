import isUserAuthenticated from '@/lib/api/isUserAuthenticated';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

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
    const { faq_id } = body;

    if (!faq_id) {
      return NextResponse.json(
        {
          data: null,
          user_message: 'faq_id is required.',
          developer_message: 'Missing required field: faq_id',
        },
        { status: 400 },
      );
    }

    // Retrieve the FAQ record.
    const { data: faqItem, error: faqError } = await supabase.from('Faq').select('*').eq('id', faq_id).maybeSingle();

    if (faqError) {
      return NextResponse.json(
        {
          data: null,
          user_message: faqError.message,
          developer_message: faqError.message,
        },
        { status: faqError.status || 400 },
      );
    }
    if (!faqItem) {
      return NextResponse.json(
        {
          data: null,
          user_message: 'Invalid FAQ ID.',
          developer_message: 'Invalid FAQ ID.',
        },
        { status: 404 },
      );
    }

    // Increment the search count.
    const updatedSearchCount = (faqItem.search_count || 0) + 1;
    const { data: updatedFaq, error: updateError } = await supabase
      .from('Faq')
      .update({ search_count: updatedSearchCount })
      .eq('id', faq_id)
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

    return NextResponse.json(
      {
        data: updatedFaq,
        user_message: 'Search count updated successfully.',
        developer_message: 'Search count updated successfully.',
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
