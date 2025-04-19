'use client';
import ProjectDetailsPage from '@/components/app/dashboard/projects/details/ProjectDetailsPage';
import NewProjectPage from '@/components/app/dashboard/projects/new/NewProjectPage';
import { useGetProjectById, useUpdateProject } from '@/hooks/api/projects.queries';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ProjectPage() {
  const path = usePathname();
  const projectId = parseFloat(path.split('/')[3]);
  const { data: project, isLoading, isError, refetch } = useGetProjectById({ id: projectId });
  const { mutateAsync: updateProject } = useUpdateProject();

  useEffect(() => {
    if (!project) return;

    if (project.status == 4 && project?.drawings?.length > 0) {
      const drawing = project?.drawings[0];
      const drawingStatus = drawing?.status;
      if (drawingStatus == 'approved') {
        setTimeout(async () => {
          await updateProject({
            id: projectId,
            status: 5,
          });

          refetch();
        }, 2500);
      }
    }
  }, [project]);

  return (
    <>
      {project?.status == 0 || project?.status == null ? (
        <NewProjectPage project={project} isLoading={isLoading} />
      ) : (
        <ProjectDetailsPage project={project} isLoading={isLoading} />
      )}
    </>
  );
}
