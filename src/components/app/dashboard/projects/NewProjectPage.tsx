// pages/projects/[id]/edit.tsx
'use client';;
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { ProjectStatusLabels } from '@/constants/enums/project.enums';
import { Project } from '@/constants/models/object.types';
import {
  useDeleteRoom,
  useGetLayoutOptions,
  useGetProjects,
  useGetRoomOptions,
  useUpdateWall,
} from '@/hooks/api/projects.queries';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react';
import NewCabinetModal from './NewCabinetModal';
import NewRoomModal from './NewRoomModal';

export default function NewProjectPage() {
  const path = usePathname();
  const projectId = path.split('/')[4];

  // Track open walls per room by room ID.
  const [openWalls, setOpenWalls] = React.useState<Record<number, boolean>>({});

  const { data: layouts } = useGetLayoutOptions();
  const { data: roomOptions } = useGetRoomOptions();
  const { data: projects } = useGetProjects();

  const project = projects?.find((project: Project) => project?.id == projectId)


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

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <ProjectHeader project={project} />
      <div className="flex flex-col">
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
            {project?.rooms?.map((room: any) => (
              <React.Fragment key={room.id}>
                <RoomRow room={room} isOpen={!!openWalls[room.id]} toggleWalls={toggleWalls} roomOptions={roomOptions} layouts={layouts} />
                {openWalls[room.id] && (
                  <TableRow>
                    <TableCell colSpan={7} className="p-0">
                      <WallsSection room={room} wallImage={wallImage} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col border-t border-t-muted-foreground pt-4">
        Estimated Project Cost: <span className="text-lg font-semibold ms-auto">$2,500</span>
      </div>
    </div>
  );
}


const RoomRow = ({
  room,
  isOpen,
  toggleWalls,
  roomOptions,
  layouts,
}: {
  room: any;
  isOpen: boolean;
  toggleWalls: (roomId: number) => void;
  roomOptions: any;
  layouts: any;
}) => {

  const { mutateAsync: deleteRoom } = useDeleteRoom();
  return (
    <TableRow className={`cursor-pointer hover:bg-blue-50  ${isOpen && 'border-b-0'}`} onClick={() => toggleWalls(room.id)}>
      <TableCell className="font-bold text-lg">{room.name}</TableCell>
      <TableCell className="relative">
        <Image
          src={roomOptions?.find((option: any) => option.id === room.type)?.image_url || ''}
          alt="Room Layout"
          width={100}
          height={100}
          className="h-24 w-24 object-cover rounded-md"
        />
        <span className="text-sm absolute -translate-y-[50px] translate-x-[15px] text-white font-bold">
          {roomOptions?.find((option: any) => option.id === room.type)?.name}
        </span>
      </TableCell>
      <TableCell>
        {room?.layout == 9 ? (
          <div className="h-20 w-24 rounded-md bg-gray-200 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Custom </span>
          </div>) : (
          <Image
            src={layouts?.find((layout: any) => layout.id === room.layout)?.image_url || ''}
            alt="Room Layout"
            width={100}
            height={100}
            className="object-cover"
          />)}
      </TableCell>
      <TableCell>{room?.height ? `${room?.height} ft` : 'N/A'}</TableCell>
      <TableCell>$--</TableCell>
      {/* Actions column */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button onClick={(e) => e.stopPropagation()} className="p-2 hover:bg-gray-100 rounded">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implement edit logic here
                console.log('Edit room', room.id);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {

                deleteRoom(room.id);
                console.log('Delete room', room.id);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      {/* Toggle cell */}
      <TableCell role="">
        <ChevronDown className={`w-6 h-6 transition-transform mx-auto my-auto align-middle ${isOpen ? 'rotate-180' : ''}`} />
      </TableCell>
    </TableRow>
  );
};

// Component for rendering the walls section inside a room
const WallsSection = ({ room, wallImage }: { room: any; wallImage: (roomId: number, wallNumber: number) => string }) => {

  const sortedWalls = room.walls.sort((a: any, b: any) => a.wall_number - b.wall_number);
  return (
    <div className="ms-6 p-2">
      <div className='flex flex-row'>
        <h4 className="font-bold text-lg mb-2">Walls</h4>
      </div>

      {sortedWalls && room.walls.length > 0 ? (
        sortedWalls.map((wall: any) => <WallRow key={wall.id} wall={wall} room={room} wallImage={wallImage} />)
      ) : (
        <div className="text-sm text-muted-foreground">No walls available</div>
      )}
    </div>
  );
};

// Component for a single wall row
const WallRow = ({ wall, room, wallImage }: { wall: any; room: any; wallImage: (roomId: number, wallNumber: number) => string }) => {
  const { mutateAsync: updateWall, isPending } = useUpdateWall();
  const [wallUpdateOpen, setWallUpdateOpen] = React.useState(false);
  const [wallLength, setWallLength] = React.useState(wall.length || 0);
  const roomId = room.id;
  const handleWallUpdate = async () => {
    await updateWall({ room_id: roomId, wall_number: wall.wall_number, length: wallLength });
    setWallUpdateOpen(false);
  };


  return (
    <div className="flex flex-col mb-4 border-t border-t-muted-foreground pt-2 px-4">
      <div className="flex justify-between">
        {wallImage(roomId, wall.wall_number) ? (
          <Image
            src={wallImage(roomId, wall.wall_number) || ''}
            alt={`Wall ${wall.wall_number}`}
            width={100}
            height={100}
            className="h-20 w-24 rounded-md"
          />) : (
          <div className="h-20 w-24 rounded-md bg-gray-200 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Custom </span>
          </div>
        )}
        <div className="ml-4">
          <div className="font-semibold">Name</div>
          <div className="text-sm">{wall.name}</div>
        </div>
        <div className="ml-4 flex flex-col">
          <div className="font-semibold">Wall {wall.wall_number}</div>
          <div className="text-sm"> {wall?.length && `Length: ${wall.length}ft`}</div>
          <Popover open={wallUpdateOpen} onOpenChange={setWallUpdateOpen}>
            <PopoverTrigger className="text-blue-600 cursor-pointer mt-3">{
              wall?.length ? 'Edit Length' : 'Add Wall Length'}</PopoverTrigger>
            <PopoverContent className="w-48 ">
              <div className=" flex flex-col p-2">
                <h3 className="text-sm font-semibold">Wall Length</h3>
                <Input type="number" placeholder="Wall Length" className="border p-1 mt-2 rounded w-18"
                  maxLength={2}
                  max={30} min={0}
                  onChange={(e) => setWallLength(parseFloat(e.target.value))} />
                <Button className="mt-2 w-18 ms-auto" size='xs' loading={isPending} onClick={handleWallUpdate}>Save</Button>
              </div>
            </PopoverContent>
          </Popover>




        </div>
        <div className="ml-4">
          <div className="font-semibold">Estimated Cost</div>
          <div className="text-sm">$16,000</div>
        </div>
      </div>
      {wall.cabinets && wall.cabinets.length > 0 && <CabinetsList cabinets={wall.cabinets} />}
      <div className='flex flex-row ms-auto'>
        <NewCabinetModal room={room} wall={wall} />
      </div>
    </div >
  );
};

// Component for rendering a list of cabinets under a wall
const CabinetsList = ({ cabinets }: { cabinets: any[] }) => {
  return (
    <div className="ml-8 mt-2">
      <div className="font-semibold">Cabinets</div>
      {cabinets.map((cabinet) => (
        <div key={cabinet.id} className="ml-4 text-sm">
          {cabinet.name}
        </div>
      ))}
    </div>
  );
};

const ProjectHeader = ({ project }: { project: any }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col">
        <span className="text-3xl font-bold">{project?.name}</span>
        <p>{project?.description}</p>
      </div>
      <Card className="min-h-[100px] p-2 flex flex-col justify-between">
        <div className="flex flex-row items-center">
          <span className="text-2xl font-bold">Project Overview</span>
          <Badge className="ms-auto" variant="outline">
            {ProjectStatusLabels[project?.status]}
          </Badge>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col text-center w-24">
            <span className="text-sm text-muted-foreground">Rooms</span>
            <span className="text-sm font-semibold">{project?.rooms?.length}</span>
          </div>
          <div className="flex flex-col text-center w-24">
            <span className="text-sm text-muted-foreground">Cabinets</span>
            <span className="text-sm font-semibold">{project?.id}</span>
          </div>
          <div className="flex flex-col text-center w-24">
            <span className="text-sm text-muted-foreground">Estimate</span>
            <span className="text-sm font-semibold">$------</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
