import { Button } from '@/components/ui/button';
import { BackgroundCard } from '@/components/ui/cards/backgroundCard';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCreateRoom, useDeleteRoom, useGetRoomOptions, useUpdateRoom } from '@/hooks/api/projects.queries';
import { useScreenWidth } from '@/hooks/uiHooks';
import { Check, Delete, Edit } from 'lucide-react';
import { useState } from 'react';




interface NewProjectRoomsProps {
    project: any;
    onBack: () => void;
    onNext: () => void;
}

export default function NewProjectRooms({
    project,
    onBack,
    onNext,
}: NewProjectRoomsProps) {
    const screenWidth = useScreenWidth();
    const { mutateAsync: createRoom, isPending } = useCreateRoom();
    const { mutateAsync: updateRoom, isPending: isUpdating } = useUpdateRoom();
    const { mutateAsync: deleteRoom, isPending: isDeleting } = useDeleteRoom();

    const { data: commonRooms } = useGetRoomOptions();
    const sortedCommonRooms = commonRooms?.sort((a, b) => a.id - b.id);
    const addRoom = async (type: number) => {
        const newRoom = {
            name: '',
            type: type,
            project: project.id,
        };
        await createRoom(newRoom);
    };

    // Update the room name in the project state.
    const updateRoomName = async (roomId: string, newName: string) => {
        console.log('updateRoomName', roomId, newName);
        await updateRoom({ id: roomId, name: newName, project: project.id });

    };

    // Delete the room.
    const deleteRoomById = async (roomId: string) => {
        await deleteRoom(roomId);
    };

    const roomsMissingNames = project?.rooms?.filter((room) => !room.name);
    const roomsMissingNamesCount = roomsMissingNames?.length;
    console.log('roomsMissingNames', roomsMissingNames);
    console.log('roomsMissingNamesCount', roomsMissingNamesCount);

    return (
        <div style={{ maxWidth: screenWidth * .85 }} className="flex flex-col mx-auto">
            <h2 className="text-xl font-semibold">Add Rooms</h2>
            <p className="text-muted text-sm">
                Select a room type to add a new room. Then fill in the room name inline.
            </p>
            <div className="grid grid-cols-3 gap-1 md:gap-3 p-2 mx-auto">
                {sortedCommonRooms?.map((room) => (
                    <BackgroundCard key={room.id} imageUrl={room.image_url} title={room.name} description='sdsd' variant="outline" onClick={() => addRoom(room.id)}>
                        {room.name}
                    </BackgroundCard>
                ))}
            </div>

            {project?.rooms?.length === 0 ? (
                <p className="text-muted text-center">
                    No rooms added yet. Click a room type to add one.
                </p>
            ) : (
                <Table className=" mx-auto">
                    <TableHeader>
                        <TableRow >
                            <TableHead className="text-sm !text-muted">Room Name</TableHead>
                            <TableHead className="text-sm !text-muted">Room Type</TableHead>
                            <TableHead className="text-sm !text-muted">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {project?.rooms?.sort((a, b) => a.id - b.id).map((room) => (
                            <RoomRow
                                key={room.id}
                                room={room}
                                updateRoomName={updateRoomName}
                                deleteRoom={deleteRoomById}
                            />
                        ))}
                    </TableBody>
                </Table>
            )}

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack}>
                    Back
                </Button>
                <Button disabled={project?.rooms?.length === 0 || roomsMissingNamesCount != 0} onClick={onNext}>
                    Next: Select Your Cabinets
                </Button>
            </div>
        </div>
    );
}

interface Room {
    id: string;
    name: string;
    type: string;
    cabinets: any[];
}

interface RoomRowProps {
    room: Room;

    updateRoomName: (roomId: string, newName: string) => void;
    deleteRoom: (roomId: string) => void;
}

function RoomRow({ room, updateRoomName, deleteRoom }: RoomRowProps) {
    const [isEditing, setIsEditing] = useState(room && !room.name);
    const [tempName, setTempName] = useState(room.name);
    const { data: commonRooms } = useGetRoomOptions();

    const roomTypeName = (type: number) => {
        return commonRooms?.find((room) => room.id === type)?.name;
    };
    const handleEditClick = () => {
        setTempName(room.name);
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        updateRoomName(room.id, tempName);
        setIsEditing(false);
    };

    return (
        <TableRow className=" ">
            <TableCell>
                {isEditing ? (
                    <Input
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder="What should we call this room?"
                        className="w-full h-6"
                    />
                ) : (
                    room.name || <span className="text-muted">No name</span>
                )}
            </TableCell>
            <TableCell>{roomTypeName(room.type)}</TableCell>
            <TableCell className="flex flex-row flex-1 align-middle justify-center gap-2">
                {isEditing ? (


                    <Button size='sm' variant='outline' onClick={handleSaveClick}>
                        Save <Check className='text-green-400' /> </Button>
                ) : (
                    <div className="flex flex-row justify-between gap-2">
                        <Edit size={18} onClick={handleEditClick} className="cursor-pointer hover:scale-105 my-auto text-blue-600" />

                        <Popover>
                            <PopoverTrigger><Delete size={18} className="cursor-pointer hover:scale-105 my-auto text-red-600" /></PopoverTrigger>
                            <PopoverContent className='flex flex-col gap-2 p-4 bg-white text-black rounded-md shadow-md'>

                                <p className='text-sm'>Are you sure you want to delete?</p>
                                <div className='flex flex-row justify-between gap-2'>
                                    <Button size='xs' variant='outline'>No</Button>
                                    <Button size='xs' variant='destructive' onClick={() => deleteRoom(room.id)}>Yes</Button>

                                </div>
                            </PopoverContent>
                        </Popover>

                    </div>
                )}



            </TableCell>
        </TableRow>
    );
}
