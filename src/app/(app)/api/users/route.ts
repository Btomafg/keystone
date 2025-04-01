// app/api/projects/route.ts
import { createProject } from '@/api/projects.api';
import { getCurrentUser } from '@/api/user.api';
import { NextResponse } from 'next/server';

// A factory that creates a POST handler given a function to run
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createProject(body);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET handler for projects; no extra parameter allowed.
export async function GET(request: Request) {
  try {
    const projects = await getCurrentUser();
    return NextResponse.json(projects, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
