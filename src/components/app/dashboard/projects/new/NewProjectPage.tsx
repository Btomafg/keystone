// pages/projects/[id]/edit.tsx
'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { useGetLayoutOptions, useGetRoomOptions, useReviewProject } from '@/hooks/api/projects.queries';
import { toUSD } from '@/utils/common';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ProjectReviewLoader from '../ProjectReviewLoader';
import NewProjectHeader from './NewProjectHeader';
import NewRoomModal from './NewRoomModal';
import NewRoomRow from './NewRoomRow';
import { WallsSection } from './NewWalls';

interface NewProjectPageProps {
  project: any;
  isLoading: boolean;
}
export default function NewProjectPage({ project, isLoading }: NewProjectPageProps) {
  const path = usePathname();
  const projectId = parseFloat(path.split('/')[3]);
  const router = useRouter();
  // Track open walls per room by room ID.
  const [openWalls, setOpenWalls] = React.useState<Record<number, boolean>>({});

  const { data: layouts } = useGetLayoutOptions();
  const { data: roomOptions } = useGetRoomOptions();

  const { mutateAsync: submitProject, isPending: submitting } = useReviewProject();

  useEffect(() => {
    if (!projectId) {
      router.back();
    }
  }, [projectId]);
  const toggleWalls = (roomId: number) => {
    setOpenWalls((prev) => ({ ...prev, [roomId]: !prev[roomId] }));
  };

  const wallImage = (roomId: number, wallNumber: number) => {
    const room = project?.rooms?.find((room) => room.id === roomId);
    const layout = layouts?.find((layout) => layout.id === room?.layout);
    const wall = room?.walls?.find((wall) => wall.wall_number === wallNumber);
    if (room && wall) {
      switch (wall.wall_number) {
        case 1:
          return layout?.wall_one_image_url;
        case 2:
          return layout?.wall_two_image_url;
        case 3:
          return layout?.wall_three_image_url;

        default:
          return '';
      }
    }
    return '';
  };

  const SubmitDisclaimer = () => {
    const [open, setOpen] = useState(false);
    const [reviewOpen, setReviewOpen] = useState(false);

    const handleSubmitProject = async () => {
      try {
        setReviewOpen(true);
        await new Promise((resolve) => setTimeout(resolve, 4000));
        await submitProject({ id: projectId });
      } catch (error) {
        console.error('Error submitting project:', error);
      }
    };

    return (
      <>
        {reviewOpen ? (
          <ProjectReviewLoader />
        ) : (
          <Dialog open={open}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="w-1/4 ms-auto hover:bg-green-600 hover:text-white"
                disabled={project?.estimate == 0 || project?.estimate == null}
              >
                Submit Project for Review
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[400px]">
              <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-700">
                  <strong>Disclaimer:</strong> All project estimates generated through this tool are preliminary and based solely on the
                  information you’ve provided. These are not final quotes.
                </p>
                <p className="text-sm text-gray-700">
                  Keystone Woodworx will carefully review each qualified submission and work with you directly to finalize a quote before
                  any work or engagement begins.
                </p>
                <p className="text-sm text-red-600">Are you sure you want to submit this project for review?</p>
                <div className="flex flex-row justify-between">
                  <Button className="w-1/3 " variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="w-1/3 hover:bg-green-600 hover:text-white" onClick={handleSubmitProject} loading={submitting}>
                    Confirm
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <NewProjectHeader project={project} />
      <div className="flex flex-col ">
        <div className="flex flex-row items-center mt-3 justify-between">
          <h3 className="text-2xl font-bold">Rooms</h3>
          <NewRoomModal />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="w-[100px]">Room Name</TableCell>
              <TableCell className="w-[100px]">Room Type</TableCell>
              <TableCell className="w-[100px]">Layout</TableCell>
              <TableCell className="w-[100px]">Height</TableCell>
              <TableCell className="w-[100px]">Estimated Cost</TableCell>
              <TableCell className="w-[50px]">Actions</TableCell>
              <TableCell className="w-[50px]"></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {project?.rooms
              ?.sort((a, b) => a.id - b.id)
              ?.map((room: any) => (
                <React.Fragment key={room.id}>
                  <NewRoomRow
                    room={room}
                    isOpen={!!openWalls[room.id]}
                    toggleWalls={toggleWalls}
                    roomOptions={roomOptions}
                    layouts={layouts}
                  />

                  {openWalls[room.id] && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                        <WallsSection room={room} wallImage={wallImage} />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            {project?.rooms?.length == 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center ">
                  <Badge variant="outline" className="text-muted p-4 ">
                    Add a room to get started
                  </Badge>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col border-t border-t-muted-foreground pt-4 !mt-24 ">
        Estimated Project Cost:{' '}
        <span className="text-lg font-semibold ms-auto">{toUSD(project?.estimate) || 'Create Cabinets For Estimate'}</span>
      </div>
      <div className="flex flex-col pt-4">{project?.rooms?.length > 0 && <SubmitDisclaimer />}</div>
    </div>
  );
}
