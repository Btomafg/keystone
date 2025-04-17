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
      project_id: number;
      room_data: {
        id: number;
        name: string;
        type: number;
        height: number;
        length: number;
        construction_method: number;
        crown: number;
        door_material: number;
        light_rail: number;
        sub_material: number;
        toe_style: number;
      };
      cabinets: [
        {
          id?: string | number;
          name: string;
          type: string;
          start: { x: number; y: number };
          end: { x: number; y: number };
          color: string;
          isSelected: boolean;
          typeInfo: {
            id: number;
            name: string;
            min_height: number | null;
            max_height: number | null;
            min_width: number | null;
            max_width: number | null;
            base_y_lock: number | null;
            img_url: string;
            color?: string;
          };
        },
      ];
    };
    console.log(body.cabinets);
    let cabinetIds: number[] = [];
    for (const cabinet of body.cabinets) {
      // 1 square = .5ft
      const length = (cabinet.end.x - cabinet.start.x + 1) * 0.5;
      const height = (cabinet.end.y - cabinet.start.y + 1) * 0.5;

      const lxh = length * height;
      const constructionMethodPrice = (options?.find((option) => option.id === body.room_data.construction_method)?.value || 0) * lxh;
      console.log(
        'Construction Method Price:',
        options?.find((option) => option.id === body.room_data.construction_method)?.value,
        constructionMethodPrice,
      );
      const crownPrice = (options?.find((option) => option.id === body.room_data.crown)?.value || 0) * lxh;
      console.log('Crown Price:', options?.find((option) => option.id === body.room_data.crown)?.value, crownPrice);
      const doorMaterialPrice = (options?.find((option) => option.id === body.room_data.door_material)?.value || 0) * lxh;
      console.log('Door Material Price:', options?.find((option) => option.id === body.room_data.door_material)?.value, doorMaterialPrice);
      const lightRailPrice = (options?.find((option) => option.id === body.room_data.light_rail)?.value || 0) * lxh;
      console.log('Light Rail Price:', options?.find((option) => option.id === body.room_data.light_rail)?.value, lightRailPrice);
      const subMaterialPrice = (options?.find((option) => option.id === body.room_data.sub_material)?.value || 0) * lxh;
      console.log('Sub Material Price:', options?.find((option) => option.id === body.room_data.sub_material)?.value, subMaterialPrice);
      const toeStylePrice = (options?.find((option) => option.id === body.room_data.toe_style)?.value || 0) * lxh;
      console.log('Toe Style Price:', options?.find((option) => option.id === body.room_data.toe_style)?.value, toeStylePrice);
      //ADD CABINET FINISH

      const totalPrice = constructionMethodPrice + crownPrice + doorMaterialPrice + lightRailPrice + subMaterialPrice + toeStylePrice;
      console.log('Total Price:', totalPrice);
      const cabinetData = {
        ceilingHeight: body.room_data.height,
        estimate: totalPrice,
        length,
        height,
        sqft: length * height,
        name: cabinet.name,
        type: cabinet.type,
        wall_id: cabinet.wall_id,
        grid_start_x: cabinet.start.x,
        grid_start_y: cabinet.start.y,
        grid_end_x: cabinet.end.x,
        grid_end_y: cabinet.end.y,
      };
      if (cabinet.id) {
        cabinetData.id = cabinet.id;
      }
      console.log(cabinetData);
      const { data, error } = await supabase.from('Cabinets').upsert(cabinetData).select('id').single();
      if (data) {
        cabinetIds.push(data.id);
      }
      console.log('Cabinet created:', data, error);
    }

    const projectId = body.project_id;

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

    const updatedRooms = project?.rooms.map((room) => {
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

    await supabase.from('Projects').update({ estimate: totalProjectEstimate }).eq('id', project?.id);

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
