import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { PlusCircleIcon } from 'lucide-react';
import React, { useState } from 'react';
import NewProjectDetails from './NewProjectDetails';

interface NewProjectModalProps {
}
const NewProjectModal: React.FC<NewProjectModalProps> = (props) => {
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
                    <span className="text-white">New Project</span>
                </Button>
            </DialogTrigger>
            <DialogOverlay className="fixed inset-0 bg-black/30" />
            <DialogContent className="fixed top-1/2 left-1/2 w-full max-w-md p-6 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg">
                <NewProjectDetails setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
};

export default NewProjectModal;