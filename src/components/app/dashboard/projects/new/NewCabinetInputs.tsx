import { useCreateCabinets, useGetCustomOptions } from '@/hooks/api/projects.queries';
import { useScreenWidth } from '@/hooks/uiHooks';
import React, { useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import Grid from '../../../projects/Grid';
import OptionStep from '../CabinetBuilderModal/OptionStep';
import UploadPhotosStep from '../CabinetBuilderModal/UploadPhotosStep';
import OptionReview from '../CabinetBuilderModal/OptionReview';
import { Cabinet } from '@/constants/models/object.types';
import { set } from 'date-fns';
import { CabinetOptionType } from '@/constants/enums/project.enums';

interface NewCabinetInputsProps {
  room: any;
  wall: any;
  setOpen: (open: boolean) => void;
}
const NewCabinetInputs: React.FC<NewCabinetInputsProps> = (props) => {
  const { wall, room, setOpen } = props;
  const { data: customOptions } = useGetCustomOptions();
  const [spacePhotos, setSpacePhotos] = useState<File[]>([]);
  const [inspirationPhotos, setInspirationPhotos] = useState<File[]>([]);

  const wallLength = wall?.length;
  const roomHeight = room?.height;

  //HOOKS
  const screenWidth = useScreenWidth();
  const { mutateAsync: createCabinet, isPending: createLoading } = useCreateCabinets();
  //STATES

  const [newCabinetStep, setNewCabinetStep] = useState(0);
  const [newCabinetData, setNewCabinetData] = useState<Partial<Cabinet>>({});
  const [selectedOptions, setSelectedOptions] = useState<Partial<Cabinet>>({});
  //VARIABLES

  //FUNCTIONS
  const onBack = () => {
    if (newCabinetStep > 0) {
      setNewCabinetStep(newCabinetStep - 1);
    } else {
      setOpen(false);
    }
  };
  const onOptionComplete = (data) => {
    setSelectedOptions({ ...selectedOptions, ...data });
    setNewCabinetStep(newCabinetStep + 1);
  };

  const onCabinetSave = (data) => {
    setNewCabinetData(data);
    setNewCabinetStep(newCabinetStep + 1);
  };

  const onReviewComplete = async () => {
    const cabinetData = {
      name: newCabinetData.name,
      wall_id: wall.id,
      constructionMethod: selectedOptions[CabinetOptionType.ConstructionMethod],
      crown: selectedOptions[CabinetOptionType.Crown],
      doorMaterial: selectedOptions[CabinetOptionType.DoorMaterial],
      lightRail: selectedOptions[CabinetOptionType.LightRail],
      subMaterial: selectedOptions[CabinetOptionType.SubMaterial],
      toeStyle: selectedOptions[CabinetOptionType.ToeStyle],
      length: (newCabinetData.end.x - newCabinetData.start.x) * 2,
      grid_start_x: newCabinetData.start.x,
      grid_start_y: newCabinetData.start.y,
      grid_end_x: newCabinetData.end.x,
      grid_end_y: newCabinetData.end.y,
    };

    try {
      const response = await createCabinet(cabinetData);
      //console.log('Cabinet created', response);
      setOpen(false);
      setNewCabinetStep(0);
      setNewCabinetData({});
      setSelectedOptions({});
    } catch (error) {
      console.error('Error creating cabinet', error);
    }
  };

  const NewCabinetStep1 = () => {
    return (
      <div className="mx-auto">
        <Grid roomHeight={roomHeight} wall={wall} onCabinetSave={onCabinetSave} />
      </div>
    );
  };
  const NewCabinetStep2 = () => {
    return (
      <div>
        <OptionStep customOptions={customOptions} onOptionComplete={onOptionComplete} />
      </div>
    );
  };
  const NewCabinetStep3 = () => {
    return (
      <div>
        <OptionReview
          customOptions={customOptions}
          selectedOptions={selectedOptions}
          onOptionComplete={onReviewComplete}
          loading={createLoading}
        />
      </div>
    );
  };

  const stepData = [
    {
      title: 'Add a new cabinet section',
      description: `Please draw where your cabinets will be placed on ${wall.name}. `,
      content: <NewCabinetStep1 />,
    },
    { title: 'Customize your cabinets', description: '', content: <NewCabinetStep2 /> },
    { title: 'Review your selected options', description: '', content: <NewCabinetStep3 /> },
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
