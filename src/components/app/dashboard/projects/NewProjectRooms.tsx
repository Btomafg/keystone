import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RoomType } from '@/constants/enums/project.enums';
import { useCreateRoom, useUpdateRoom } from '@/hooks/api/projects.queries';
import { Check, Delete, Edit } from 'lucide-react';
import { useState } from 'react';


const commonRooms = ['Kitchen', 'Bathroom', 'Mudroom', 'Laundry', 'Office', 'Garage', 'Closet', 'Other'];

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

    const { mutateAsync: createRoom, isPending } = useCreateRoom();
    const { mutateAsync: updateRoom, isPending: isUpdating } = useUpdateRoom();
    const addRoom = async (type: string) => {
        const newRoom = {
            name: '',
            type: RoomType[type as keyof typeof RoomType],
        };
        await createRoom({ ...newRoom, project: project.id });
    };

    // Update the room name in the project state.
    const updateRoomName = async (roomId: string, newName: string) => {
        console.log('updateRoomName', roomId, newName);
        await createRoom({ id: roomId, name: newName, project: project.id });

    };

    // Delete the room.
    const deleteRoom = (roomId: string) => {

    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Add Rooms</h2>
            <p className="text-muted">
                Select a room type to add a new room. Then fill in the room name inline.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {commonRooms?.map((type) => (
                    <Button key={type} variant="outline" onClick={() => addRoom(type)}>
                        {type}
                    </Button>
                ))}
            </div>

            {project?.rooms?.length === 0 ? (
                <p className="text-muted text-center">
                    No rooms added yet. Click a room type to add one.
                </p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-sm !text-muted">Room Name</TableHead>
                            <TableHead className="text-sm !text-muted">Room Type</TableHead>
                            <TableHead className="text-sm !text-muted">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {project?.rooms?.map((room) => (
                            <RoomRow
                                key={room.id}
                                room={room}
                                updateRoomName={updateRoomName}
                                deleteRoom={deleteRoom}
                            />
                        ))}
                    </TableBody>
                </Table>
            )}

            <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={onBack}>
                    Back
                </Button>
                <Button disabled={project?.rooms?.length === 0} onClick={onNext}>
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

    const handleEditClick = () => {
        setTempName(room.name);
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        updateRoomName(room.id, tempName);
        setIsEditing(false);
    };

    return (
        <TableRow>
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
            <TableCell>{room.type}</TableCell>
            <TableCell className="flex flex-row flex-1 align-middle justify-center gap-2">
                {isEditing ? (


                    <Button size='sm' variant='outline' onClick={handleSaveClick}>
                        Save <Check className='text-green-400' /> </Button>
                ) : (
                    <div className="flex flex-row gap-2">
                        <Edit size={18} onClick={handleEditClick} className="cursor-pointer hover:scale-105 my-auto text-blue-600" />
                        <Delete size={18} onClick={() => deleteRoom(room.id)} className="cursor-pointer hover:scale-105 my-auto text-red-600" />
                    </div>
                )}



            </TableCell>
        </TableRow>
    );
}
