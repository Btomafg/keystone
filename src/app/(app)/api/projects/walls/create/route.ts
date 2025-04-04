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
    console.log(request.body);
    const body = await request.json();
    console.log('BODY', body);

    //get walls from room
    const { data: walls, error } = await supabase
      .from('Walls')
      .select('id, wall_number')
      .eq('room_id', body.room)
      .order('wall_number', { ascending: false })
      .limit(1)
      .single();

    //designate wall number - last wall number + 1

    const wallData = {
      room_id: body.room,
      wall_number: walls.wall_number + 1,
      name: `Wall ${walls.wall_number + 1}`,
    };

    await supabase.from('Walls').insert(wallData);

    if (error) {
      return NextResponse.json({ success: false, message: error.message, type: error.code }, { status: error?.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('ERROR', error);
    return NextResponse.json({ success: false, message: error.message }, { status: error.status });
  }
}
