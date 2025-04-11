'use client';

import React from 'react';
import { AdminLeadsTable } from '@/components/app/admin/AdminLeadsTable';
import { useAdminCreateNote, useAdminDeleteNote, useAdminGetLeads, useAdminGetNotes } from '@/hooks/api/admin.queries';
import { usePathname, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { DeleteIcon, Trash2Icon, TrashIcon } from 'lucide-react';

const Page: React.FC = () => {
  const { data: leads = [], isLoading } = useAdminGetLeads();
  const pathname = usePathname();
  const router = useRouter();
  const leadId = pathname.split('/')[3];
  const lead = leads.find((l) => String(l.id) === leadId);

  const [noteInput, setNoteInput] = React.useState('');
  const [editableLead, setEditableLead] = React.useState<any>(lead);
  const { data: notes = [], isLoading: fetchingNotes, refetch } = useAdminGetNotes();
  const { mutateAsync: createNote, isPending: creatingNote } = useAdminCreateNote();
  const { mutateAsync: deleteNote, isPending: deleting } = useAdminDeleteNote();
  console.log('notes', notes);

  const closeDrawer = () => {
    router.push('/admin/leads'); // adjust this if your base path differs
  };

  const handleSaveLead = () => {
    console.log('Saving lead...', editableLead);
  };

  const handleAddNote = async () => {
    if (!noteInput) return;
    console.log('Adding note:', noteInput);
    await createNote({
      lead_id: leadId,
      note: noteInput,
    });
    setNoteInput('');
  };
  const handleDeleteNote = async (noteId: string) => {
    await deleteNote({ id: noteId });
  };

  React.useEffect(() => {
    if (lead) {
      setEditableLead(lead);
      if (leadId) {
        refetch();
      }
    }
  }, [lead]);

  return (
    <div className="w-full h-full p-4">
      <h1 className="text-2xl font-bold">Leads</h1>
      <p className="text-sm text-muted-foreground mb-2">Manage and track all your leads</p>

      <AdminLeadsTable leads={leads} loading={isLoading} />

      <Sheet open={!!leadId} onOpenChange={closeDrawer}>
        <SheetContent className="p-4 flex flex-col">
          {lead ? (
            <>
              <SheetHeader>
                <DrawerTitle>Edit Lead</DrawerTitle>
                <DrawerDescription>Make changes to this lead's details.</DrawerDescription>
              </SheetHeader>

              <div className="grid gap-3 px-4">
                <Input
                  placeholder="First Name"
                  value={editableLead?.first_name || ''}
                  onChange={(e) => setEditableLead({ ...editableLead, first_name: e.target.value })}
                />
                <Input
                  placeholder="Last Name"
                  value={editableLead?.last_name || ''}
                  onChange={(e) => setEditableLead({ ...editableLead, last_name: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  value={editableLead?.email || ''}
                  onChange={(e) => setEditableLead({ ...editableLead, email: e.target.value })}
                />
                <Input
                  placeholder="Phone"
                  value={editableLead?.phone || ''}
                  onChange={(e) => setEditableLead({ ...editableLead, phone: e.target.value })}
                />
                <Textarea
                  placeholder="Message"
                  value={editableLead?.message || ''}
                  onChange={(e) => setEditableLead({ ...editableLead, message: e.target.value })}
                />
                <Button onClick={handleSaveLead}>Save Lead</Button>

                <Separator className="my-4" />

                <h3 className="text-md font-semibold">Add Note</h3>
                <Textarea placeholder="Write a note..." value={noteInput} onChange={(e) => setNoteInput(e.target.value)} />
                <Button className="mt-2" onClick={handleAddNote} loading={creatingNote}>
                  Add Note
                </Button>

                <Separator className="my-4" />

                <div>
                  <h4 className="text-sm font-medium mb-1">Recent Notes</h4>
                  {fetchingNotes ? (
                    <p className=" text-sm">Loading...</p>
                  ) : notes?.length ? (
                    <ul className="text-sm space-y-1">
                      {notes.map((note) => (
                        <li key={note.id} className="border-b py-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex">
                              <div className="flex flex-col gap-1">
                                <h3 className="font-bold mb-0 text-xs">
                                  {note.created_by.first_name} {note.created_by.last_name}
                                </h3>

                                <p className="text-xs text-muted-foreground mt-0 pt-0">{new Date(note.created_at).toLocaleString()}</p>
                              </div>
                              <Button
                                variant="ghost"
                                className="ml-auto hover:bg-white hover:scale-105"
                                onClick={() => handleDeleteNote(note.id)}
                                loading={deleting}
                              >
                                {!deleting && <Trash2Icon className="text-red-500" />}
                              </Button>
                            </div>
                            <span className="text-sm">{note.note}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-sm">No notes yet.</p>
                  )}
                </div>
              </div>

              <Button className="mt-auto w-auto px-4" variant="outline" onClick={closeDrawer}>
                Close
              </Button>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Page;
