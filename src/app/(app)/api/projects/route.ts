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
      .from('Projects')
      .select(
        `id,
    name,
    description,
    status,
    type,
      estimate,
    rooms: Rooms_project_fkey (
      id,
      name,
      type,
      layout,
      height,
        estimate,
      walls: Walls_room_id_fkey (
        id,
        name,
        wall_number,
        length,
          estimate,
        cabinets: Cabinets_wall_id_fkey (
          id,
          wall_id,
          ceilingHeight,
          constructionMethod,
          crown,
          doorMaterial,
          lightRail,
          subMaterial,
          toeStyle,
          length,
          width,
          height,
          sqft,
          name,
            estimate,
          grid_start_x,
          grid_start_y,
          grid_end_x,
          grid_end_y,
          createStep
        )
      )
    )
  `,
      )
      .eq('user_id', userId);

    console.log('PROJECTS', data);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err);
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
    const { data, error } = await supabase.from('Projects').update(body).eq('id', body.id).select('id, step').single();
    console.log('PROJECTS', data, error);
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
