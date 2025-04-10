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

    //UPDATE PRICING LOGIC

    const { data: options, error: optionsError } = await supabase.from('CustomOptions').select('*').eq('active', true);

    type Body = {
      name: string;
      wall_id: number;
      constructionMethod: number;
      crown: number;
      doorMaterial: number;
      lightRail: number;
      subMaterial: number;
      toeStyle: number;
      length: number;
      grid_start_x: number;
      grid_start_y: number;
      grid_end_x: number;
      grid_end_y: number;
    };

    // 1 square = .5ft
    const length = (body.grid_end_x - body.grid_start_x + 1) * 0.5;
    const height = (body.grid_end_y - body.grid_start_y + 1) * 0.5;

    const lxh = length * height;
    const constructionMethodPrice = (options?.find((option) => option.id === body.constructionMethod)?.value || 0) * lxh;
    const crownPrice = (options?.find((option) => option.id === body.crown)?.value || 0) * lxh;
    const doorMaterialPrice = (options?.find((option) => option.id === body.doorMaterial)?.value || 0) * lxh;
    const lightRailPrice = (options?.find((option) => option.id === body.lightRail)?.value || 0) * lxh;
    const subMaterialPrice = (options?.find((option) => option.id === body.subMaterial)?.value || 0) * lxh;
    const toeStylePrice = (options?.find((option) => option.id === body.toeStyle)?.value || 0) * lxh;
    const totalPrice = constructionMethodPrice + crownPrice + doorMaterialPrice + lightRailPrice + subMaterialPrice + toeStylePrice;

    const cabinetData = {
      ...body,
      estimate: totalPrice,
      length,
      height,
      sqft: length * height,
    };

    const { data, error } = await supabase.from('Cabinets').insert(cabinetData).select('id').single();

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
      .eq('id', data.id)
      .single();

    const projectId = getProjectId?.wall?.room?.project?.id;

    const { data: project, error: projectError } = await supabase
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
      .eq('id', projectId)
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
