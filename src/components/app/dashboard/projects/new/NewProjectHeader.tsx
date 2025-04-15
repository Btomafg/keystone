import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ProjectStatusLabels } from '@/constants/enums/project.enums';
import { toUSD } from '@/utils/common';

const NewProjectHeader = ({ project }: { project: any }) => {
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
export default NewProjectHeader;
