import isUserAuthenticated from '@/lib/api/isUserAuthenticated';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const isAuthenticated = await isUserAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, message: 'User is not authenticated', type: 'error' }, { status: 401 });
    }
    const userId = isAuthenticated?.user?.id;

    const body = await request.json();
    console.log('Cabinets:', body);

    const { data: getProjectId, error: getProjectIdError } = await supabase
      .from('Cabinets')
      .select(
        `
id,
wall:Cabinets_wall_id_fkey (
  id,
  room:Walls_room_id_fkey (
    id,
    project:Rooms_project_fkey (
      id
    )
  )
)
`,
      )
      .eq('id', body[0])
      .single();

    for (const cabinetId of body) {
      console.log('Deleting cabinet with ID:', cabinetId);
      const { data, error } = await supabase.from('Cabinets').delete().eq('id', cabinetId).select('id').single();
      console.log('Deleted cabinet:', data, error);
    }

    console.log('Get Project ID:', getProjectId, getProjectIdError);

    const { data: project, error: projectError } = await supabase
      .from('Projects')
      .select(
        `
      id,
      name,
      description,
      status,
      type,
      estimate,
      rooms:Rooms_project_fkey (
        id,
        estimate,
        walls:Walls_room_id_fkey (
          id,
          estimate,
          cabinets:Cabinets_wall_id_fkey (
            id,
            estimate
          )
        )
      )
    `,
      )
      .eq('id', getProjectId.wall.room.project.id)
      .single();

    console.log('Project:', project, projectError);

    if (!project) {
      return NextResponse.json({ success: false, message: 'Project not found', type: 'error' }, { status: 404 });
    }

    // Roll up estimates from cabinets -> walls -> rooms -> project
    let totalProjectEstimate = 0;

    const updatedRooms = project.rooms.map((room) => {
      let roomEstimate = 0;

      const updatedWalls = room.walls.map((wall) => {
        let wallEstimate = 0;

        const updatedCabinets = wall.cabinets.map((cabinet) => {
          wallEstimate += cabinet.estimate || 0;
          return cabinet;
        });

        roomEstimate += wallEstimate;

        return {
          ...wall,
          cabinets: updatedCabinets,
          estimate: wallEstimate,
        };
      });

      totalProjectEstimate += roomEstimate;

      return {
        ...room,
        walls: updatedWalls,
        estimate: roomEstimate,
      };
    });

    const updatedProject = {
      ...project,
      estimate: totalProjectEstimate,
      rooms: updatedRooms,
    };

    await supabase.from('Projects').update({ estimate: totalProjectEstimate }).eq('id', project.id);

    for (const room of updatedRooms) {
      await supabase.from('Rooms').update({ estimate: room.estimate }).eq('id', room.id);

      for (const wall of room.walls) {
        await supabase.from('Walls').update({ estimate: wall.estimate }).eq('id', wall.id);
      }
    }

    console.log('Updated Project:', updatedProject);

    if (error) {
      return NextResponse.json({ success: false, message: error.message, type: error.code }, { status: error?.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('ERROR', error);
    return NextResponse.json({ success: false, message: error.message }, { status: error.status });
  }
}
