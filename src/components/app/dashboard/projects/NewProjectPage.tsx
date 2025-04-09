// pages/projects/[id]/edit.tsx
'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { CabinetOptionType, CabinetOptionTypeLabels, ProjectStatusLabels } from '@/constants/enums/project.enums';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cabinet, Project } from '@/constants/models/object.types';
import {
  useDeleteRoom,
  useGetCustomOptions,
  useGetLayoutOptions,
  useGetProjects,
  useGetRoomOptions,
  useUpdateRoom,
  useUpdateWall,
} from '@/hooks/api/projects.queries';
import { ChevronDown, ChevronRight, ChevronUp, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import NewCabinetModal from './NewCabinetModal';
import NewRoomModal from './NewRoomModal';
import { toUSD } from '@/utils/common';
import { Label } from '@/components/ui/label';

export default function NewProjectPage() {
  const path = usePathname();
  const projectId = path.split('/')[3];

  // Track open walls per room by room ID.
  const [openWalls, setOpenWalls] = React.useState<Record<number, boolean>>({});

  const { data: layouts } = useGetLayoutOptions();
  const { data: roomOptions } = useGetRoomOptions();
  const { data: projects } = useGetProjects();

  const project = projects && projects?.find((project: Project) => project?.id == projectId);

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
                  <RoomRow
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
      <div className="flex flex-col pt-4">
        {project?.rooms?.length > 0 && (
          <Button className="w-1/4 ms-auto hover:bg-green-600 hover:text-white" variant="outline">
            Submit Project for Review
          </Button>
        )}
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
  heightOptions = [8, 9, 10],
}: {
  room: any;
  isOpen: boolean;
  toggleWalls: (roomId: number) => void;
  roomOptions: any;
  layouts: any;
  heightOptions?: number[];
}) => {
  const [editRoomOpen, setEditRoomOpen] = useState(false);
  const [editedName, setEditedName] = useState(room.name);
  const [editedHeight, setEditedHeight] = useState(room.height);
  const { data: customOptions } = useGetCustomOptions();
  const roomHeightOptions = customOptions?.filter((option) => option.type === 1).sort((a, b) => a.value - b.value);
  const { mutateAsync: updateRoom } = useUpdateRoom(); // replace with your update logic
  const { mutateAsync: deleteRoom } = useDeleteRoom();

  const handleSave = async () => {
    await updateRoom({
      id: room.id,
      name: editedName,
      height: editedHeight,
    });
    setEditRoomOpen(false);
  };

  return (
    <TableRow className={`cursor-pointer hover:bg-blue-50  ${isOpen && 'border-b-0'}`} onClick={() => toggleWalls(room.id)}>
      <TableCell className="font-bold text-lg">
        {editRoomOpen ? (
          <>
            <Label>Room Name</Label> <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} />
          </>
        ) : (
          room.name
        )}
      </TableCell>
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
            <span className="text-sm text-muted-foreground">Custom</span>
          </div>
        ) : (
          <Image
            src={layouts?.find((layout: any) => layout.id === room.layout)?.image_url || ''}
            alt="Room Layout"
            width={100}
            height={100}
            className="object-cover"
          />
        )}
      </TableCell>
      <TableCell>
        {editRoomOpen ? (
          <>
            {' '}
            <Label>Wall Height</Label>
            <Select value={editedHeight} onValueChange={setEditedHeight}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Height" />
              </SelectTrigger>
              <SelectContent className="z-[999] cursor-pointer">
                {roomHeightOptions?.map((option) => (
                  <SelectItem key={option.id} className=" cursor-pointer" value={option.value}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        ) : room?.height ? (
          `${room?.height} ft`
        ) : (
          'N/A'
        )}
      </TableCell>
      <TableCell>{toUSD(room?.estimate) || '--'}</TableCell>
      <TableCell>
        {editRoomOpen ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
            >
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setEditRoomOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
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
                  setEditRoomOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  deleteRoom(room.id);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
      <TableCell>
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
      <div className="flex flex-row">
        <h4 className="font-bold flex text-lg mb-2"> Walls</h4>
      </div>

      {sortedWalls && room.walls.length > 0 ? (
        sortedWalls.map((wall: any) => <WallRow key={wall.id} wall={wall} room={room} wallImage={wallImage} />)
      ) : (
        <div className="text-sm text-muted-foreground">No walls available</div>
      )}

      {room?.type == 0 && (
        <div className="flex flex-row">
          <NewCabinetModal room={room} wall={null} island={true} />
        </div>
      )}
    </div>
  );
};

const WallRow = ({ wall, room, wallImage }: { wall: any; room: any; wallImage: (roomId: number, wallNumber: number) => string }) => {
  const roomId = room.id;
  const { mutateAsync: updateWall, isPending } = useUpdateWall();
  //const { mutateAsync: deleteWall } = useDeleteWall(); // Ensure this hook exists/imported

  // New state to control inline editing for the wall row.
  const [editWallOpen, setEditWallOpen] = React.useState(false);
  const [editedWallName, setEditedWallName] = React.useState(wall.name);
  const [editedWallLength, setEditedWallLength] = React.useState(wall.length || 0);

  const handleWallSave = async () => {
    await updateWall({
      room_id: roomId,
      wall_number: wall.wall_number,
      length: editedWallLength,
      name: editedWallName,
    });
    setEditWallOpen(false);
  };

  // Render inline editing UI when in edit mode.
  if (editWallOpen) {
    return (
      <div className="flex flex-row justify-between mb-4 border-t border-t-muted-foreground pt-2 px-4">
        <div className="flex items-center">
          {wallImage(roomId, wall.wall_number) ? (
            <Image
              src={wallImage(roomId, wall.wall_number)}
              alt={`Wall ${wall.wall_number}`}
              width={100}
              height={100}
              className="h-20 w-24 rounded-md"
            />
          ) : (
            <div className="h-20 w-24 rounded-md bg-gray-200 flex items-center justify-center">
              <span className="text-sm text-muted-foreground">Custom</span>
            </div>
          )}
          <div className="ml-4 flex flex-row gap-2">
            <div className="ml-4 flex flex-col gap-2">
              <Label>Wall Name</Label>
              <Input value={editedWallName} onChange={(e) => setEditedWallName(e.target.value)} />
            </div>
            <div className="ml-4 flex flex-col gap-2">
              <Label>Wall Length (ft)</Label>
              <Input
                type="number"
                value={editedWallLength}
                onChange={(e) => setEditedWallLength(parseFloat(e.target.value))}
                min={0}
                max={30}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 my-auto">
          <Button size="sm" onClick={handleWallSave} loading={isPending}>
            Save
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setEditWallOpen(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-4 border-t border-t-muted-foreground pt-2 px-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row justify-between w-full items-center">
          {wallImage(roomId, wall.wall_number) ? (
            <Image
              src={wallImage(roomId, wall.wall_number)}
              alt={`Wall ${wall.wall_number}`}
              width={100}
              height={100}
              className="h-20 w-24 rounded-md"
            />
          ) : (
            <div className="h-20 w-24 rounded-md bg-gray-200 flex items-center justify-center">
              <span className="text-sm text-muted-foreground">Custom</span>
            </div>
          )}
          <div className="mx-auto flex flex-col gap-1 w-fit">
            <div className="font-semibold">Name</div>
            <div className="text-sm">{wall.name}</div>
          </div>
          <div className="mx-auto flex flex-col gap-1 w-fit">
            <div className="font-semibold">Wall {wall.wall_number}</div>
            <div className="text-sm">
              {wall?.length ? (
                `Length: ${wall.length}ft`
              ) : (
                <div className="text-blue-400 flex hover:cursor-pointer" onClick={() => setEditWallOpen(true)}>
                  Add Wall Length
                </div>
              )}
            </div>
          </div>
          <div className="mx-auto flex flex-col gap-1 w-fit">
            <div className="font-semibold">Estimated Cost</div>
            <div className="text-sm">{toUSD(wall?.estimate) || '--'}</div>
          </div>

          <div className="ms-auto flex flex-row gap-3 w-fit">
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
                    setEditWallOpen(true);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    //deleteWall({ room_id: roomId, wall_number: wall.wall_number });
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <NewCabinetModal room={room} wall={wall} />
          </div>
        </div>
      </div>
      {wall.cabinets && wall.cabinets.length > 0 && <CabinetsList cabinets={wall.cabinets} />}
    </div>
  );
};

const CabinetsList = ({ cabinets }: { cabinets: Cabinet[] }) => {
  return (
    <div className="ms-3 p-2">
      <div className="flex flex-row">
        <h4 className="font-bold flex text-lg mb-2"> Cabinets</h4>
      </div>

      {cabinets?.map((cabinet) => (
        <CabinetRow key={cabinet.id} cabinet={cabinet} />
      ))}
    </div>
  );
};

const CabinetRow = ({ cabinet }: { cabinet: Cabinet }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState(cabinet.name);
  const [isSaving, setIsSaving] = useState(false);
  const [rowOpen, setRowOpen] = useState(false);
  const handleSave = async () => {
    setIsSaving(true);
    // TODO: hook into updateCabinet mutation
    console.log('Save cabinet name:', name);
    setEditOpen(false);
    setIsSaving(false);
  };
  const { data: customOptions } = useGetCustomOptions();

  const doorMaterialOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.DoorMaterial);
  const subMaterialOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.SubMaterial);
  const constructionMethodOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.ConstructionMethod);
  const toeStyleOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.ToeStyle);
  const crownOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.Crown);
  const lightRailOptions = customOptions?.filter((opt) => opt.type === CabinetOptionType.LightRail);

  let cabinetOptions = [];
  cabinet?.doorMaterial && cabinetOptions.push(doorMaterialOptions?.find((opt) => opt.id == cabinet.doorMaterial));
  cabinet?.subMaterial && cabinetOptions.push(subMaterialOptions?.find((opt) => opt.id == cabinet.subMaterial));
  cabinet?.constructionMethod && cabinetOptions.push(constructionMethodOptions?.find((opt) => opt.id == cabinet.constructionMethod));
  cabinet?.toeStyle && cabinetOptions.push(toeStyleOptions?.find((opt) => opt.id == cabinet.toeStyle));
  cabinet?.crown && cabinetOptions.push(crownOptions?.find((opt) => opt.id == cabinet.crown));
  cabinet?.lightRail && cabinetOptions.push(lightRailOptions?.find((opt) => opt.id == cabinet.lightRail));

  return (
    <div
      className="flex-col items-center justify-between p-2 border rounded-md bg-muted/50 shadow-sm hover:bg-blue-50 hover:cursor-pointer mb-2"
      onClick={() => setRowOpen(!rowOpen)}
    >
      <div className="flex flex-row gap-2">
        <div className="mx-auto flex  flex-col gap-1 w-fit">
          <div className="font-semibold">Name</div>
          <div className="text-sm">{cabinet?.name}</div>
        </div>
        <div className="mx-auto flex flex-col gap-1 w-fit">
          <div className="font-semibold">Length</div>
          <div className="text-sm">{cabinet?.length ? `${cabinet?.length}ft` : ''}</div>
        </div>
        <div className="mx-auto flex flex-col gap-1 w-fit">
          <div className="font-semibold">Height</div>
          <div className="text-sm">{cabinet?.length ? `${cabinet?.height}ft` : ''}</div>
        </div>
        <div className="mx-auto flex flex-col gap-1 w-fit">
          <div className="font-semibold">Estimated Cost</div>
          <div className="text-sm">{toUSD(cabinet?.estimate) || '--'}</div>
        </div>

        <div className="mx-auto flex flex-col gap-1 w-fit">
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
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  //deleteWall({ room_id: roomId, wall_number: wall.wall_number });
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mx-auto flex flex-col gap-1 w-fit">
          <ChevronUp className={`w-6 h-6 transition-transform  my-auto align-middle ${rowOpen && 'rotate-180'}`} />
        </div>
      </div>
      <div className={`flex flex-row gap-2 mt-2 ${rowOpen ? 'block' : 'hidden'}`}>
        {cabinetOptions?.map((opt) => (
          <Card
            key={opt?.id}
            className={`flex flex-col mx-auto  transition   h-24 aspect-square justify-center items-center p-1  `}
            onClick={() => ''}
          >
            {CabinetOptionTypeLabels[opt?.type] && <h3 className="text-xs text-center">{CabinetOptionTypeLabels[opt?.type]}</h3>}
            {opt?.image_url && <img src={opt?.image_url} alt={opt?.name} className="w-12  h-12 rounded-xl  object-cover" />}
            {opt?.icon && opt?.icon}
            <h3 className="text-xs text-center">{opt?.name || 'None'}</h3>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ProjectHeader = ({ project }: { project: any }) => {
  const cabinets = project?.rooms?.reduce((acc: any, room: any) => {
    const roomCabinets = room.walls?.reduce((acc: any, wall: any) => {
      const wallCabinets = wall.cabinets?.map((cabinet: any) => ({
        ...cabinet,
        wall_id: wall.id,
        room_id: room.id,
      }));
      return [...acc, ...(wallCabinets || [])];
    }, []);
    return [...acc, ...(roomCabinets || [])];
  }, []);
  console.log(cabinets);
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col">
        <span className="text-3xl font-bold">{project?.name}</span>
        <p className="text-xs">{project?.description}</p>
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
            <span className="text-sm font-semibold">{cabinets?.length}</span>
          </div>
          <div className="flex flex-col text-center w-24">
            <span className="text-sm text-muted-foreground">Estimate</span>
            <span className="text-sm font-semibold">{toUSD(project?.estimate) || 'Get Started'}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
