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
    console.log('BODY', body);
    body.user_id = userId;

    // determine distance from HQ
    const HQ = { lat: 40.56706, lng: -78.71982 }; // Example HQ coordinates
    const projectCoordinates = { lat: body.latitude, lng: body.longitude }; // Example project coordinates
    const distance = Math.sqrt(Math.pow(projectCoordinates.lat - HQ.lat, 2) + Math.pow(projectCoordinates.lng - HQ.lng, 2));
    body.distance_from_hq = distance;
    //distance in miles
    const milesPerDegree = 69; // Approximate miles per degree of latitude
    body.distance_from_hq = distance * milesPerDegree;
    const { data, error } = await supabase.from('Projects').insert(body).select('id').single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message, type: error.code }, { status: error.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('ERROR', error);
    return NextResponse.json({ success: false, message: error.message }, { status: error.status });
  }
}
