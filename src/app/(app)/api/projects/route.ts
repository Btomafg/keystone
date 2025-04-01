// app/api/projects/route.ts
import { createProject, getProjects } from '@/api/projects.api';
import { getAPI } from '@/lib/api/api';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const api = await getAPI();
    // You might call getProjects() directly from your imported function,
    // which would internally call methods from `api`
    const projects = await getProjects(api); // Update your function signatures if needed
    return NextResponse.json({ data: projects }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/projects:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const api = await getAPI();
    const result = await createProject(api, body); // Pass the API object if needed
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error: any) {
    console.error('Error in POST /api/projects:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
