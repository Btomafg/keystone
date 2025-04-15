import { Project } from '@/constants/models/object.types';
import { APP_ROUTES } from '@/constants/routes';
import {
  useCreateCabinets,
  useGetCabinetTypes,
  useGetCustomOptions,
  useGetProjects,
  useGetRoomOptions,
} from '@/hooks/api/projects.queries';
import { useScreenWidth } from '@/hooks/uiHooks';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { default as CabinetGrid } from '../../../projects/Grid';

interface NewCabinetInputsProps {}
const NewCabinetInputs: React.FC<NewCabinetInputsProps> = (props) => {
  const { data: customOptions } = useGetCustomOptions();
  const path = usePathname();
  const { data: projects } = useGetProjects();
  const projectId = parseFloat(path.split('/')[3]);
  const roomId = parseFloat(path.split('/')[5]);
  const wallId = parseFloat(path.split('/')[7]);
  const project = projects && projects?.find((project: Project) => project?.id == projectId);
  const room = project?.rooms && project?.rooms.find((room) => room.id == roomId);
  const wall = room?.walls && room?.walls.find((wall) => wall.id == wallId);
  const wallLength = wall?.length;
  const roomHeight = room?.height;
  const router = useRouter();
  //HOOKS
  const screenWidth = useScreenWidth();
  const { mutateAsync: createCabinet, isPending: createLoading } = useCreateCabinets();
  const { data: cabinetTypes, isLoading: loadingCabinetTypes } = useGetCabinetTypes();
  const { data: roomOptions } = useGetRoomOptions();
  const roomType = room?.type;

  const roomTypeOptions = roomOptions?.find((option) => option.id == roomType);

  const roomTypeCabinetOptions = roomTypeOptions?.cabinet_types;
  const filteredCabinetTypes = cabinetTypes?.filter((cabinetType) => roomTypeCabinetOptions?.includes(cabinetType.id));
  const cabinets = wall?.cabinets || [];
  useEffect(() => {
    if (!projectId || !roomId || !wallId) {
      router.back();
    }
  }, [projectId, roomId, wallId]);

  //STATES

  const [newCabinetStep, setNewCabinetStep] = useState(0);

  //VARIABLES

  //FUNCTIONS

  const onCabinetSave = async (data) => {
    const cabinetData = {
      project_id: projectId,
      room_data: {
        id: room.id,
        name: room.name,
        type: room.type,
        height: roomHeight,
        length: wallLength,
        construction_method: room.construction_method,
        crown: room.crown,
        door_material: room.door_material,
        light_rail: room.light_rail,
        sub_material: room.sub_material,
        toe_style: room.toe_style,
      },
      cabinets: data.map((cabinet) => {
        if (typeof cabinet.id !== 'number' && cabinet?.id?.includes('new')) {
          cabinet.id = undefined;
        }
        return cabinet;
      }),
    };

    console.log('Cabinet Data:', cabinetData);
    const response = await createCabinet(cabinetData);
    router.push(`${APP_ROUTES.DASHBOARD.PROJECTS.PROJECTS.path}${projectId}`);
  };

  const NewCabinetStep1 = () => {
    return (
      <div className="mx-auto">
        <CabinetGrid
          cabinetTypes={filteredCabinetTypes}
          onCabinetSave={onCabinetSave}
          onCabinetUpdate={(e) => console.log(e)}
          room={room}
          wall={wall}
          cabinets={cabinets}
          loading={loadingCabinetTypes}
          submitLoading={createLoading}
          onCabinetDelete={() => console.log('delete')}
        />
      </div>
    );
  };

  const stepData = [
    {
      title: 'Add & Edit Cabinets',
      description: `Select the cabinets you want to add to your project. You can adjust the size and position of each cabinet.`,
      content: <NewCabinetStep1 />,
    },
  ];

  return (
    <div style={{ maxWidth: screenWidth * 0.85 }} className="flex flex-col">
      <div className="flex flex-row gap-3 w-full">
        {newCabinetStep > 0 && <IoChevronBack className="text-muted cursor-pointer my-auto text-2xl" onClick={onBack} />}
        <div className="flex flex-col w-full">
          <h2 className="text-xl font-semibold">{stepData[newCabinetStep].title}</h2>
          <p className="text-muted text-sm">{stepData[newCabinetStep].description}</p>
        </div>
      </div>
      {stepData[newCabinetStep].content}
    </div>
  );
};

export default NewCabinetInputs;
