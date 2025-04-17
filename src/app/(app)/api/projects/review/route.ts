import { ProjectQualification } from '@/constants/enums/project.enums';
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
    const { id } = body;

    const { data: project, error: projectError } = await supabase
      .from('Projects')
      .select(
        `id,
        name,
        estimate,
        distance_from_hq,
        status,
        qualification`,
      )
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    if (projectError) {
      return NextResponse.json({ success: false, message: projectError.message, type: projectError.code }, { status: projectError.status });
    }
    if (!project) {
      return NextResponse.json({ success: false, message: 'Project not found', type: 'error' }, { status: 404 });
    }
    const estimate = project?.estimate;
    const distance_from_hq = project?.distance_from_hq;
    const status = project?.status;

    if (estimate === null || estimate === undefined) {
      return NextResponse.json({ success: false, message: 'Project estimate not found', type: 'error' }, { status: 404 });
    }
    if (status === 1) {
      return NextResponse.json({ success: false, message: 'Project already reviewed', type: 'error' }, { status: 400 });
    }
    if (distance_from_hq === null || distance_from_hq === undefined) {
      return NextResponse.json({ success: false, message: 'Project distance from HQ not found', type: 'error' }, { status: 404 });
    }
    if (estimate < 10000) {
      project.qualification = ProjectQualification.DISQUALIFIED;
    } else if (distance_from_hq < 30) {
      project.qualification = ProjectQualification.DELIVERY_INSTALLATION;
    } else {
      project.qualification = ProjectQualification.SHIPPING;
    }

    const { data, error } = await supabase
      .from('Projects')
      .update({
        qualification: project.qualification,
        status: 1,
      })
      .eq('id', id)
      .select(`id`)
      .single();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('ERROR', error);
    return NextResponse.json({ success: false, message: error.message }, { status: error.status });
  }
}
