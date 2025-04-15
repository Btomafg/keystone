import isUserAuthenticated from '@/lib/api/isUserAuthenticated';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const isAuthenticated = await isUserAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'User is not authenticated', type: 'error' }, { status: 401 });
    }
    const userId = isAuthenticated?.user?.id;
    const body = await request.json();

    const newRoom = {
      type: body.type,
      project: body.project,
      layout: body.layout,
      name: body.name,
      height: body.height,
      construction_method: body.construction_method,
      crown: body.crown,
      door_material: body.door_material,
      light_rail: body.light_rail,
      sub_material: body.sub_material,
      toe_style: body.toe_style,
    };
    let wallCount;
    const { data, error } = await supabase.from('Rooms').insert(newRoom).select('id').single();

    if (newRoom.layout != 9) {
      const { data: layout, error: layoutError } = await supabase.from('Layouts').select('walls').eq('id', body.layout).single();
      wallCount = layout.walls;
    } else {
      wallCount = body.wallCount || 1;
    }

    for (let i = 0; i < wallCount; i++) {
      const wallData = {
        room_id: data?.id,
        wall_number: i + 1,
        name: `Wall ${i + 1}`,
      };

      await supabase.from('Walls').insert(wallData);
    }

    console.log('ROOM', data, error);

    if (error) {
      return NextResponse.json({ success: false, message: error.message, type: error.code }, { status: error?.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('ERROR', error);
    return NextResponse.json({ success: false, message: error.message }, { status: error.status });
  }
}
