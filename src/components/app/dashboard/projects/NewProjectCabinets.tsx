import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, Edit, Delete } from 'lucide-react';
import { useCreateCabinets, useDeleteCabinet } from '@/hooks/api/projects.queries';
import { toUSD } from '@/utils/common';
import CabinetBuilderModal from './CabinetBuilderModal';
import { Project, Cabinet } from '@/constants/models/object.types';

interface NewProjectCabinetsProps {
  project: Project;
  onBack: () => void;
}

export default function NewProjectCabinets({ project, onBack }: NewProjectCabinetsProps) {
  const { mutateAsync: createCabinet } = useCreateCabinets();
  const { mutateAsync: deleteCabinet } = useDeleteCabinet();
  const totalCost = project?.rooms?.reduce((acc, room) => acc + room?.cabinets?.reduce((cabAcc, cabinet) => cabAcc + cabinet.quote, 0), 0);

  const addCabinetToRoom = async (roomId: string) => {
    try {
      await createCabinet({ room: roomId });
    } catch (error) {
      console.error(error);
    }
  };

  const updateCabinetName = async (cabinetId: string, roomId, newName: string) => {
    try {
      await createCabinet({ id: cabinetId, room: roomId, name: newName });
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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Cabinet Planner</h2>
      <p className="text-muted">Add cabinet sections to each room.</p>
      {project?.rooms?.map((room) => (
        <div key={room.id} className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{room.name}</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm !text-muted">Cabinet Name</TableHead>
                <TableHead className="text-sm !text-muted">Customize</TableHead>
                <TableHead className="text-sm !text-muted">Actions</TableHead>
                <TableHead className="text-sm !text-muted">Estimate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {room?.cabinets?.map((cabinet: Cabinet) => (
                <CabinetRow
                  key={cabinet.id}
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
      ))}
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Total Estimated Project Cost:</h3>
        <h3 className="font-medium">{toUSD(totalCost)}</h3>
      </div>
      <div className="flex justify-start mt-6">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}

interface CabinetRowProps {
  cabinet: Cabinet;
  project: Project;
  updateCabinetName: (cabinetId: string, roomId, newName: string) => void;
  deleteCabinet: (cabinetId: string) => void;
}

function CabinetRow({ cabinet, project, updateCabinetName, deleteCabinet }: CabinetRowProps) {
  const [isEditing, setIsEditing] = useState(cabinet.name ? false : true);
  const [tempName, setTempName] = useState(cabinet.name);

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
          <Input value={tempName} onChange={(e) => setTempName(e.target.value)} placeholder="Enter cabinet name" className="w-full" />
        ) : (
          cabinet.name || <span className="text-muted">No name</span>
        )}
      </TableCell>
      <TableCell className="w-1/4">
        <CabinetBuilderModal project={project} cabinetId={cabinet.id} />
      </TableCell>
      <TableCell className="w-1/4">
        {isEditing ? (
          <Button size="sm" variant="outline" onClick={handleSaveClick}>
            Save <Check className="text-green-400 ml-1" />
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Edit size={18} onClick={handleEditClick} className="cursor-pointer hover:scale-105 text-blue-600" />
            <Delete size={18} onClick={() => deleteCabinet(cabinet.id)} className="cursor-pointer hover:scale-105 text-red-600" />
          </div>
        )}
      </TableCell>
      <TableCell className="w-1/4">{toUSD(cabinet.quote)}</TableCell>
    </TableRow>
  );
}
