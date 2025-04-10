import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { useScreenWidth } from '@/hooks/uiHooks';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import NewProjectRooms from './NewProjectRooms';

interface NewRoomModalProps {}
const NewRoomModal: React.FC<NewRoomModalProps> = (props) => {
  //HOOKS
  const screenWidth = useScreenWidth();
  //STATES
  const [open, setOpen] = useState(false);
  //VARIABLES

  //FUNCTIONS

  //EFFECTS

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex flex-row flex-nowrap w-32" onClick={() => {}} type="submit">
          New Room <Plus />
        </Button>
      </DialogTrigger>
      <DialogOverlay className="fixed inset-0 bg-black/30" />
      <DialogContent
        className="fixed top-1/2 left-1/2 w-full max-w-xl p-6 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg"
        closable
      >
        <NewProjectRooms open={open} setOpen={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default NewRoomModal;
