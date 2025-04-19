import isUserAuthenticated from '@/lib/api/isUserAuthenticated';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const isAuthenticated = await isUserAuthenticated();
    console.log('IS AUTHENTICATED', isAuthenticated);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'User is not authenticated', type: 'error' }, { status: 401 });
    }
    const userId = isAuthenticated?.user?.id;
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');
    console.log('PROJECT ID', parseFloat(projectId));
    const { data, error } = await supabase
      .from('Projects')
      .select(
        `
    id,
    name,
    description,
    status,
    type,
    estimate,
    target_install_date,
    qualification,
    first_custom,
    street,
    city,
    state,
    zip,
    longitude,
    latitude,
    rooms:Rooms_project_fkey (
      id,
      name,
      type,
      construction_method,
      crown,
      door_material,
      light_rail,
      sub_material,
      toe_style,
      layout,
      height,
      estimate,
      walls:Walls_room_id_fkey (
        id,
        name,
        wall_number,
        length,
        estimate,
        cabinets:Cabinets_wall_id_fkey (
          id,
          wall_id,
          length,
          width,
          height,
          sqft,
          name,
          type,
          estimate,
          grid_start_x,
          grid_start_y,
          grid_end_x,
          grid_end_y,
          createStep
        )
      )
    ),
    drawings:Drawings_project_id_fkey (
      id,
      name,
     updated_by,
     updated_at,
     status,
     revision_notes,
     file: Drawings_file_id_fkey (
        id,
      name,
      url,
      type,
      created_at
      )
    ),
    files:Files_project_id_fkey (
      id,
      name,
      url,
      type,
      created_at
    ),
    appointments:appointments_project_id_fkey (
      id,
      type,
      status,
      start_time,
      end_time,
      created_at,
      updated_at
    )
  `,
      )
      .eq('id', projectId)
      .single();

    console.log('PROJECTS', data, error);
    if (error) {
      return NextResponse.json({ success: false, message: error.message, type: error.code }, { status: error.status });
    }
    if (data == null) {
      return NextResponse.json({ success: false, message: 'Project not found', type: 'error' }, { status: 404 });
    }
    return NextResponse.json({ data: data });
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
    const { data, error } = await supabase.from('Projects').update(body).eq('id', body.id).select('id, status').single();

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
