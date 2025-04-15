'use client';
import NewCabinetInputs from '@/components/app/dashboard/projects/new/NewCabinetInputs';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Project } from '@/constants/models/object.types';
import { useGetCabinetTypes, useGetProjects } from '@/hooks/api/projects.queries';

import { ChevronLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Projects() {
  const path = usePathname();
  const projectId = parseFloat(path.split('/')[3]);
  const { data: cabinetTypes, isLoading } = useGetCabinetTypes();

  const { data: projects } = useGetProjects();

  const project = projects && projects?.find((project: Project) => project?.id == projectId);
  return (
    <div className="container max-w-lg mx-auto">
      <div className="flex flex-row items-center justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <ChevronLeft className="text-2xl cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="bg-white">
            <div className="flex flex-col text-xs">
              You may lose unsaved changes if you leave this page without saving. Continue?
              <div className="flex flex-row justify-between gap-2 mt-4">
                <Button size="xs" variant="outline">
                  Cancel
                </Button>
                <Button size="xs" onClick={() => window.history.back()}>
                  Continue
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <h1 className="text-2xl font-bold mb-4">Cabinets</h1>
      </div>
      <NewCabinetInputs room={project?.rooms[0]} wall={project?.rooms[0]?.walls[0]} setOpen={() => {}} />
    </div>
  );
}
