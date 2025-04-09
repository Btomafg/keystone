import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { useScreenWidth } from '@/hooks/uiHooks';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import NewCabinetInputs from './NewCabinetInputs';

interface NewCabinetModalProps {
  wall: any;
  room: any;
  island?: boolean;
}
const NewCabinetModal: React.FC<NewCabinetModalProps> = (props) => {
  const { wall, room, island } = props;
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
  //EFFECTS

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!island && wall?.length == null} className="flex flex-row flex-nowrap w-32" onClick={() => {}} type="submit">
          {island ? 'Add an island' : 'New Cabinet'} <Plus />
        </Button>
      </DialogTrigger>
      <DialogOverlay className="fixed inset-0 bg-black/30" />
      <DialogContent className=" bg-white min-w-[350px] max-w-fit rounded-lg shadow-lg" closable>
        <NewCabinetInputs room={room} wall={wall} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default NewCabinetModal;
