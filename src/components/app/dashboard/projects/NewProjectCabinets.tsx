import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Cabinet, Project, Room } from '@/constants/models/object.types';
import { useCreateCabinets, useDeleteCabinet, useUpdateCabinet, useUpdateRoom } from '@/hooks/api/projects.queries';
import { useScreenWidth } from '@/hooks/uiHooks';
import { toUSD } from '@/utils/common';
import { Check, Delete, Edit } from 'lucide-react';
import React, { useState } from 'react';
import CabinetBuilderModal from './CabinetBuilderModal';

interface NewProjectCabinetsProps {
    project: Project;
    onBack: () => void;
}

export default function NewProjectCabinets({ project, onBack }: NewProjectCabinetsProps) {
    const { mutateAsync: createCabinet } = useCreateCabinets();
    const { mutateAsync: updateCabinet } = useUpdateCabinet();
    const { mutateAsync: deleteCabinet } = useDeleteCabinet();
    const { mutateAsync: updateRoom } = useUpdateRoom();
    const screenWidth = useScreenWidth();

    const updateRoomName = async (roomId: string, newName: string) => {
        await updateRoom({ id: roomId, name: newName });
    };

    const deleteRoom = async (roomId: string) => {
        console.log("Deleting room", roomId);
        // e.g., await deleteRoomById(roomId);
    };

    const totalCost = project?.rooms?.reduce(
        (acc, room) =>
            acc +
            room?.cabinets?.reduce((cabAcc, cabinet) => cabAcc + cabinet.quote, 0),
        0
    );

    const addCabinetToRoom = async (roomId: string) => {
        try {
            await createCabinet({ room: roomId });
        } catch (error) {
            console.error(error);
        }
    };

    const updateCabinetName = async (cabinetId: string, roomId: string, newName: string) => {
        try {
            await updateCabinet({ id: cabinetId, room: roomId, name: newName });
        } catch (error) {
            console.error(error);
        }
    };

    const deleteCabinetById = async (cabinetId: string) => {
        try {
            await deleteCabinet(cabinetId);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ maxWidth: screenWidth * .9 }} className="space-y-6 max-w-md md:max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold">Cabinet Planner</h2>
            <p className="text-muted">Add cabinet sections to each room.</p>
            {project?.rooms?.sort((a, b) => a.id - b.id)?.map((room) => (
                <div key={room.id} className="space-y-2 border-b p-2 ">

                    <RoomHeader room={room} updateRoomName={updateRoomName} deleteRoom={deleteRoom} />

                    <div className="overflow-x-auto">
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-sm text-muted w-1/4">Name</TableHead>
                                    <TableHead className="text-sm text-muted w-1/4">Customize</TableHead>
                                    <TableHead className="text-sm text-muted w-1/4">Actions</TableHead>
                                    <TableHead className="text-sm text-muted w-1/4">Estimate</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {room?.cabinets?.map((cabinet: Cabinet, index) => (
                                    <CabinetRow
                                        key={index}
                                        cabinet={cabinet}
                                        project={project}
                                        updateCabinetName={updateCabinetName}
                                        deleteCabinet={deleteCabinetById}
                                    />
                                ))}
                                <tr>
                                    <td colSpan={4}>
                                        <Button className="my-2 w-fit" size="sm" onClick={() => addCabinetToRoom(room.id)}>
                                            + Add Cabinet Section
                                        </Button>
                                    </td>
                                </tr>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            ))}
            <div className="flex justify-between items-center">
                <h3 className="font-medium">Total Estimated Project Cost:</h3>
                <h3 className="font-medium">{toUSD(totalCost)}</h3>
            </div>
            <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={onBack}>
                    Back
                </Button>
                <Button onClick={onBack}>
                    Continue
                </Button>
            </div>
        </div>
    );
}

interface RoomHeaderProps {
    room: Room;
    updateRoomName: (roomId: string, newName: string) => void;
    deleteRoom: (roomId: string) => void;
}

function RoomHeader({ room, updateRoomName, deleteRoom }: RoomHeaderProps) {
    const [isEditing, setIsEditing] = useState(false);
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
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                {isEditing ? (
                    <Input
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder="Enter room name"
                        className="w-full"
                    />
                ) : (
                    <h3 className="font-medium">{room.name || <span className="text-muted">No name</span>}</h3>
                )}
                {isEditing ? (
                    <Button size="sm" variant="outline" onClick={handleSaveClick}>
                        Save <Check className="text-green-400 ml-1" />
                    </Button>
                ) : (
                    <Edit
                        size={18}
                        onClick={handleEditClick}
                        className="cursor-pointer hover:scale-105 text-blue-600"
                    />
                )}
            </div>
            <Popover>
                <PopoverTrigger>
                    <Delete size={18} className="cursor-pointer hover:scale-105 my-auto text-red-600" />
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-2 p-4 bg-white text-black rounded-md shadow-md">
                    <p className="text-sm">Are you sure you want to delete?</p>
                    <div className="flex flex-row justify-between gap-2">
                        <Button size="xs" variant="outline">
                            No
                        </Button>
                        <Button
                            size="xs"
                            variant="destructive"
                            onClick={() => deleteRoom(room.id)}
                        >
                            Yes
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

interface CabinetRowProps {
    cabinet: Cabinet;
    project: Project;
    updateCabinetName: (cabinetId: number, roomId: string, newName: string) => void;
    deleteCabinet: (cabinetId: string) => void;
}

const CabinetRow = React.memo(({ cabinet, project, updateCabinetName, deleteCabinet }: CabinetRowProps) => {
    const [isEditing, setIsEditing] = useState(cabinet.name ? false : true);
    const [tempName, setTempName] = useState(cabinet.name || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState(cabinet?.createStep || 0);
    const handleEditClick = () => {
        setTempName(cabinet.name);
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        updateCabinetName(cabinet.id, cabinet.room, tempName);
        setIsEditing(false);
    };

    return (
        <TableRow>
            <TableCell className="w-1/4">
                {isEditing ? (
                    <Input
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder="Enter cabinet name"
                        className="w-full"
                    />
                ) : (
                    cabinet.name || <span className="text-muted">No name</span>
                )}
            </TableCell>
            <TableCell className="w-1/4">
                <Button size="sm" variant="outline" onClick={() => setModalOpen(true)}>
                    Customize
                </Button>
                <CabinetBuilderModal step={modalStep} setStep={setModalStep} open={modalOpen} setOpen={() => setModalOpen(false)} project={project} cabinetId={cabinet.id} />
            </TableCell>
            <TableCell className="w-1/4">
                {isEditing ? (
                    <Button size="sm" variant="outline" onClick={handleSaveClick}>
                        Save <Check className="text-green-400 ml-1" />
                    </Button>
                ) : (
                    <div className="flex items-center gap-2">
                        <Edit
                            size={18}
                            onClick={handleEditClick}
                            className="cursor-pointer hover:scale-105 text-blue-600"
                        />
                        <Popover>
                            <PopoverTrigger>
                                <Delete size={18} className="cursor-pointer hover:scale-105 my-auto text-red-600" />
                            </PopoverTrigger>
                            <PopoverContent className="flex flex-col gap-2 p-4 bg-white text-black rounded-md shadow-md">
                                <p className="text-sm">Are you sure you want to delete?</p>
                                <div className="flex flex-row justify-between gap-2">
                                    <Button size="xs" variant="outline">
                                        No
                                    </Button>
                                    <Button size="xs" variant="destructive" onClick={() => deleteCabinet(cabinet.id)}>
                                        Yes
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
            </TableCell>
            <TableCell className="w-1/4">{toUSD(cabinet.quote)}</TableCell>
        </TableRow>
    );
});
