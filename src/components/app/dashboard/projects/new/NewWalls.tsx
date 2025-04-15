'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateWall } from '@/hooks/api/projects.queries';
import { toUSD } from '@/utils/common';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import CabinetsList from './CabinetList';

// Component for rendering the walls section inside a room
export const WallsSection = ({ room, wallImage }: { room: any; wallImage: (roomId: number, wallNumber: number) => string }) => {
  const sortedWalls = room.walls.sort((a: any, b: any) => a.wall_number - b.wall_number);
  const router = useRouter();
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
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => {
              router.push(`/dashboard/projects/${room.project_id}/cabinets/`);
            }}
          >
            Add & Edit Cabinets
          </Button>
        </div>
      )}
    </div>
  );
};

export const WallRow = ({ wall, room, wallImage }: { wall: any; room: any; wallImage: (roomId: number, wallNumber: number) => string }) => {
  const roomId = room.id;
  const { mutateAsync: updateWall, isPending } = useUpdateWall();
  //const { mutateAsync: deleteWall } = useDeleteWall(); // Ensure this hook exists/imported
  const router = useRouter();
  const pathname = usePathname();
  console.log('pathname', pathname);
  const wallId = wall.id;
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

            <div className="flex flex-row">
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  router.push(`${pathname}/room/${roomId}/wall/${wallId}/cabinets/`);
                }}
                disabled={!wall?.length}
              >
                Add & Edit Cabinets
              </Button>
            </div>
          </div>
        </div>
      </div>
      {wall.cabinets && wall.cabinets.length > 0 && <CabinetsList cabinets={wall.cabinets} />}
    </div>
  );
};
