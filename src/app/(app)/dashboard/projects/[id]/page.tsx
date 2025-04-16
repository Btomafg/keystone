'use client';
import ProjectDenied from '@/components/app/dashboard/projects/ProjectDenied';
import ProjectReviewLoader from '@/components/app/dashboard/projects/ProjectReviewLoader';
import NewProjectPage from '@/components/app/dashboard/projects/new/NewProjectPage';
import ProjectDetailsPage from '@/components/app/dashboard/projects/new/ProjectReview';
import { Project } from '@/constants/models/object.types';
import { useGetProjects } from '@/hooks/api/projects.queries';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProjectPage() {
  const path = usePathname();
  const projectId = parseFloat(path.split('/')[3]);
  const { data: projects } = useGetProjects();
  const project = projects && projects?.find((project: Project) => project?.id == projectId);
  const [projectStatus, setProjectStatus] = useState(project?.status);
  console.log('projectStatus', projectStatus);

  const timeout = async () => {
    await new Promise((resolve) => setTimeout(resolve, 6500));
    setProjectStatus(99);
  };

  useEffect(() => {
    if (projectStatus == 1) {
      console.log('Send to review function');
      timeout();
    }
    setProjectStatus(project?.status || 0);
  }, [projectId, path]);

  const statusManager = () => {
    switch (projectStatus) {
      case 0:
        return <NewProjectPage />;
      case 1:
        return <ProjectReviewLoader />;
      case 2:
        return <ProjectDetailsPage project={project} />;
      case 3:
        return <ProjectDetailsPage project={project} />;
      case 4:
        return <ProjectDetailsPage project={project} />;
      case 5:
        return <ProjectDetailsPage project={project} />;
      case 6:
        return <ProjectDetailsPage project={project} />;

      case 99:
        return <ProjectDenied reason="out_of_area" />;
    }
  };

  return <div>{statusManager()}</div>;
}
