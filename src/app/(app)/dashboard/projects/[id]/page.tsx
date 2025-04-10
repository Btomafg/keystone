'use client';
import NewProjectPage from '@/components/app/dashboard/projects/new/NewProjectPage';
import Projects from '../page';
import { useGetProjects } from '@/hooks/api/projects.queries';
import { Project } from '@/constants/models/object.types';
import { usePathname } from 'next/navigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';
import { MultiStepLoader as Loader } from '@/components/ui/multi-step-loader';
import { IoCloseCircle } from 'react-icons/io5';
import ProjectReviewLoader from '@/components/app/dashboard/projects/ProjectReviewLoader';
import ProjectDenied from '@/components/app/dashboard/projects/ProjectDenied';

export default function ProjectPage() {
  const path = usePathname();
  const projectId = path.split('/')[3];
  const { data: projects } = useGetProjects();
  const project = projects && projects?.find((project: Project) => project?.id == projectId);
  const [projectStatus, setProjectStatus] = useState(project?.status || 0);
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
  }, [projectStatus]);

  const StatusManager = () => {
    switch (projectStatus) {
      case 0:
        return <NewProjectPage />;
      case 1:
        return <ProjectReviewLoader />;
      case 2:
        return 'dd';
      case 99:
        return <ProjectDenied reason="out_of_area" />;
    }
  };

  return (
    <div>
      <StatusManager />
    </div>
  );
}
