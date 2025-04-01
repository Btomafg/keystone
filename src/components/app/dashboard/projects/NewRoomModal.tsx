import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Plus, PlusCircleIcon } from 'lucide-react';
import React, { useState } from 'react';
import NewProjectRooms from './NewProjectRooms';


interface NewRoomModalProps { }
const NewRoomModal: React.FC<NewRoomModalProps> = (props) => {
  //HOOKS

  //STATES
  const [open, setOpen] = useState(false);
  //VARIABLES

  //FUNCTIONS

  //EFFECTS

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => { }} size="xs" type="submit">
          <PlusCircleIcon className="text-white" />
          <span className="text-white">New Room <Plus /></span>
        </Button>
      </DialogTrigger>
      <DialogOverlay className="fixed inset-0 bg-black/30" />
      <DialogContent className="fixed top-1/2 left-1/2 w-full max-w-xl p-6 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg">
        <NewProjectRooms open={open} setOpen={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default NewRoomModal;
