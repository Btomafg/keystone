import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCreateCabinets } from '@/hooks/api/projects.queries';
import { toUSD } from '@/utils/common';
import CabinetBuilderModal from './CabinetBuilderModal';
import { Project } from './NewCabinetProjectFlow';

interface NewProjectCabinetsProps {
    project: Project;
    updateCabinet: (cabinetId: string, data: any) => void;
    addCabinetToRoom: (roomId: string) => void;
    onBack: () => void;
}

export default function NewProjectCabinets({
    project,
    updateCabinet,

    onBack,
}: NewProjectCabinetsProps) {
    const { mutateAsync: createCabinet, isPending } = useCreateCabinets();
    const totalCost = project?.rooms?.reduce(
        (acc, room) =>
            acc +
            room?.cabinets?.reduce(
                (cabAcc, cabinet) => cabAcc + cabinet.quote,
                0
            ),
        0
    );
    const addCabinetToRoom = async (roomId: string) => {
        try {
            await createCabinet({ room: roomId });
        } catch (error) {
            console.error(error
            );
        };
    }


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
                                <TableHead className="text-sm !text-muted">
                                    Cabinet Section
                                </TableHead>
                                <TableHead className="text-sm !text-muted">Actions</TableHead>
                                <TableHead className="text-sm !text-muted">
                                    Status
                                </TableHead>
                                <TableHead className="text-sm !text-muted">
                                    Estimate
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {room?.cabinets?.map((cabinet) => (
                                <TableRow key={cabinet.id}>
                                    <TableCell>{cabinet.label}</TableCell>
                                    <TableCell>
                                        <CabinetBuilderModal
                                            project={project}
                                            cabinetId={cabinet.id}
                                            updateCabinet={updateCabinet}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="default" className="text-white text-xs">
                                            {cabinet.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{toUSD(cabinet.quote)}</TableCell>
                                </TableRow>
                            ))}
                            <Button
                                className="my-2 w-fit"
                                size="sm"
                                onClick={() => addCabinetToRoom(room.id)}
                            >
                                + Add Cabinet Section
                            </Button>
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
