import { useGetCustomOptions } from '@/hooks/api/projects.queries';
import { useScreenWidth } from '@/hooks/uiHooks';
import React, { useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import Grid from '../../projects/Grid';
import OptionStep from './CabinetBuilderModal/OptionStep';
import UploadPhotosStep from './CabinetBuilderModal/UploadPhotosStep';


interface NewCabinetInputsProps {
  room: any
  wall: any
}
const NewCabinetInputs: React.FC<NewCabinetInputsProps> = (props) => {
  const { data: customOptions } = useGetCustomOptions();
  const [spacePhotos, setSpacePhotos] = useState<File[]>([]);
  const [inspirationPhotos, setInspirationPhotos] = useState<File[]>([]);

  const { wall, room } = props;
  const wallLength = wall?.length;
  const roomHeight = room?.height;

  //HOOKS
  const screenWidth = useScreenWidth();
  //STATES
  const [open, setOpen] = useState(false);
  const [newCabinetStep, setNewCabinetStep] = useState(0);
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
    console.log('Option complete', data);
    setNewCabinetStep(newCabinetStep + 1);
  }
  const onCabinetSave = (data) => {

    console.log('Cabinet saved', data);
    setNewCabinetStep(newCabinetStep + 1);
  }

  const NewCabinetStep1 = () => {
    return (
      <div>
        <Grid roomHeight={roomHeight} wallLength={wallLength} onCabinetSave={onCabinetSave} />
      </div>
    );
  }
  const NewCabinetStep2 = () => {
    return (
      <div>

        <OptionStep customOptions={customOptions} onOptionComplete={onOptionComplete} />

      </div>
    );
  }
  const NewCabinetStep3 = () => {
    return (
      <div>
        <UploadPhotosStep spacePhotos={spacePhotos} setSpacePhotos={setSpacePhotos} inspirationPhotos={inspirationPhotos} setInspirationPhotos={setInspirationPhotos} />
      </div>
    );
  }

  const stepData = [
    { title: 'Add a new cabinet section', description: `Please draw where your cabinets will be placed on ${wall.name}. `, content: <NewCabinetStep1 /> },
    { title: 'Step 2', description: '', content: <NewCabinetStep2 /> },
    { title: 'Step 3', description: '', content: <NewCabinetStep3 /> },
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
