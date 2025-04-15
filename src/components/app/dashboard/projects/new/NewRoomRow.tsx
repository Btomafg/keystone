// pages/projects/[id]/edit.tsx
'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';
import { useDeleteRoom, useGetCustomOptions, useUpdateRoom } from '@/hooks/api/projects.queries';
import { toUSD } from '@/utils/common';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const NewRoomRow = ({
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

export default NewRoomRow;
