'use client';
import NewCabinetInputs from '@/components/app/dashboard/projects/new/NewCabinetInputs';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Project } from '@/constants/models/object.types';
import { useGetCabinetTypes, useGetProjects } from '@/hooks/api/projects.queries';

import { ChevronLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Projects() {
  const path = usePathname();
  const projectId = parseFloat(path.split('/')[3]);
  const roomId = parseFloat(path.split('/')[5]);
  const wallId = parseFloat(path.split('/')[7]);
  const router = useRouter();
  const { data: cabinetTypes, isLoading } = useGetCabinetTypes();
  const { data: projects } = useGetProjects();
  const [backOpen, setBackOpen] = useState(false);

  const project = projects && projects?.find((project: Project) => project?.id == projectId);
  const room = project?.rooms && project?.rooms.find((room) => room.id == roomId);
  const wall = room?.walls && room?.walls.find((wall) => wall.id == wallId);
  useEffect(() => {
    if (!projectId || !roomId) {
      router.back();
    }
  }, [projectId, roomId]);

  return (
    <div className="container max-w-lg mx-auto">
      <div className="flex flex-row items-center mb-4 text-blue-500">
        <Popover open={backOpen} onOpenChange={setBackOpen}>
          <PopoverTrigger asChild>
            <div className="flex gap-2 cursor-pointer">
              <ChevronLeft className="text-2xl cursor-pointer my-auto" />
              <h1 className="text-sm font-bold my-auto">Back to Project</h1>
            </div>
          </PopoverTrigger>
          <PopoverContent className="bg-white">
            <div className="flex flex-col text-xs">
              You may lose unsaved changes if you leave this page without saving. Continue?
              <div className="flex flex-row justify-between gap-2 mt-4">
                <Button size="xs" variant="outline" onClick={() => setBackOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-red-400 hover:bg-red-500" size="xs" onClick={() => window.history.back()}>
                  Continue
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <NewCabinetInputs />
    </div>
  );
}
