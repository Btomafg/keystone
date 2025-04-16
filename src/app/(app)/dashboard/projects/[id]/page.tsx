'use client';
import ProjectDetailsPage from '@/components/app/dashboard/projects/details/ProjectDetailsPage';
import NewProjectPage from '@/components/app/dashboard/projects/new/NewProjectPage';
import { Project } from '@/constants/models/object.types';
import { useGetProjects } from '@/hooks/api/projects.queries';
import { usePathname } from 'next/navigation';

export default function ProjectPage() {
  const path = usePathname();
  const projectId = parseFloat(path.split('/')[3]);
  const { data: projects } = useGetProjects();
  const project = projects && projects?.find((project: Project) => project?.id == projectId);

  return <>{project?.status == 0 || project?.status == null ? <NewProjectPage /> : <ProjectDetailsPage project={project} />}</>;
}
