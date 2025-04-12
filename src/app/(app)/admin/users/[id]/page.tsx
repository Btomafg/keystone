'use client';

import React, { use } from 'react';
import { AdminUsersTable } from '@/components/app/admin/AdminUsersTable';
import {
  useAdminCreateNote,
  useAdminDeleteNote,
  useAdminGetNotes,
  useAdminGetUsers,
  useAdminManageUsers,
  useAdminUpdateUser,
} from '@/hooks/api/admin.queries';
import { usePathname, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Trash2Icon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const Page: React.FC = () => {
  const { data: users = [], isLoading } = useAdminGetUsers();
  const pathname = usePathname();
  const router = useRouter();
  const userId = pathname.split('/')[3];
  const user = users.find((u) => String(u.id) === userId);
  const [popoverOpen, setPopoverOpen] = React.useState({ 1: false, 2: false, 3: false });
  const [noteInput, setNoteInput] = React.useState('');
  const [editableUser, setEditableUser] = React.useState<any>(user);
  const { data: notes = [], isLoading: fetchingNotes, refetch } = useAdminGetNotes({ type: 'user', id: userId });
  const { mutateAsync: createNote, isPending: creatingNote } = useAdminCreateNote();
  const { mutateAsync: deleteNote, isPending: deletingNote } = useAdminDeleteNote();
  const { mutateAsync: manageUser, isPending: managingUser } = useAdminManageUsers();
  const { mutateAsync: updateUser, isPending: updatingUser } = useAdminUpdateUser();

  const closeSheet = () => {
    router.push('/admin/users');
  };

  const handleSaveUser = async () => {
    console.log('Saving user...', editableUser);

    await updateUser({
      id: userId,
      first_name: editableUser.first_name,
      last_name: editableUser.last_name,
      email: editableUser.email,
      phone: editableUser.phone,
    });
  };

  const handleAddNote = async () => {
    if (!noteInput) return;
    await createNote({
      user_id: userId,
      note: noteInput,
    });
    setNoteInput('');
    refetch();
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote({ id: noteId });
    refetch();
  };

  const handleManageUser = async (type: 'magic' | 'reset' | 'deactivate') => {
    console.log('Managing user...', type);
    await manageUser({
      id: userId,
      email: editableUser.email,
      type: type,
    });
    setPopoverOpen({ 1: false, 2: false, 3: false });
  };

  React.useEffect(() => {
    if (user) {
      setEditableUser(user);
      if (userId) {
        refetch();
      }
    }
  }, [user]);

  return (
    <div className="w-full h-full p-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <p className="text-sm text-muted-foreground mb-2">Manage and track your users</p>

      <AdminUsersTable users={users} loading={isLoading} />

      <Sheet open={!!userId} onOpenChange={closeSheet}>
        <SheetContent className="p-4 flex flex-col w-[480px]">
          {user && (
            <>
              <SheetHeader>
                <SheetTitle>Edit User</SheetTitle>
                <SheetDescription>Make changes to this user's details.</SheetDescription>
              </SheetHeader>

              <div className="grid gap-3 px-4">
                <Input
                  placeholder="First Name"
                  value={editableUser?.first_name || ''}
                  onChange={(e) => setEditableUser({ ...editableUser, first_name: e.target.value })}
                />
                <Input
                  placeholder="Last Name"
                  value={editableUser?.last_name || ''}
                  onChange={(e) => setEditableUser({ ...editableUser, last_name: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  value={editableUser?.email || ''}
                  onChange={(e) => setEditableUser({ ...editableUser, email: e.target.value })}
                />
                <Input
                  placeholder="Phone"
                  value={editableUser?.phone || ''}
                  onChange={(e) => setEditableUser({ ...editableUser, phone: e.target.value })}
                />
                <Button loading={updatingUser} onClick={handleSaveUser}>
                  Save User
                </Button>
                (NOT FUNCTIONAL BELOW YET)
                <Popover open={popoverOpen[1]} onOpenChange={(open) => setPopoverOpen({ ...popoverOpen, 1: open })}>
                  <PopoverTrigger asChild>
                    <Button className="bg-orange-400">Reset Password</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-4 z-50 pointer-events-auto bg-white shadow-xl border rounded-md">
                    <h3 className="text-sm">Are you sure you want to reset this user's password?</h3>
                    <div className="flex flex-row justify-between">
                      <Button size="sm" variant="outline" className="mt-2 w-fit">
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleManageUser('reset')}
                        loading={managingUser}
                        size="sm"
                        className="mt-2 w-fit bg-orange-400 hover:cursor-pointer z-[999]"
                      >
                        Confirm
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <Popover open={popoverOpen[2]} onOpenChange={(open) => setPopoverOpen({ ...popoverOpen, 2: open })}>
                  <PopoverTrigger asChild>
                    <Button className="bg-purple-400">Send Magic Link</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-4 z-50 pointer-events-auto bg-white shadow-xl border rounded-md">
                    <h3 className="text-sm">
                      Are you sure you want to send this user a Magic Link that will allow them to login via link?
                    </h3>
                    <div className="flex flex-row justify-between">
                      <Button size="sm" variant="outline" className="mt-2 w-fit">
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleManageUser('magic')}
                        loading={managingUser}
                        size="sm"
                        className="mt-2 w-fit bg-purple-400 hover:cursor-pointer z-[999]"
                      >
                        Confirm
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <Popover open={popoverOpen[3]} onOpenChange={(open) => setPopoverOpen({ ...popoverOpen, 3: open })}>
                  <PopoverTrigger asChild>
                    <Button className="bg-red-400">Deactivate User</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-4 z-50 pointer-events-auto bg-white shadow-xl border rounded-md">
                    <h3 className="text-sm">Are you sure you want to deactivate this user?</h3>
                    <div className="flex flex-row justify-between">
                      <Button size="sm" variant="outline" className="mt-2 w-fit">
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleManageUser('deactivate')}
                        loading={managingUser}
                        size="sm"
                        className="mt-2 w-fit bg-red-400 hover:cursor-pointer z-[999]"
                      >
                        Confirm
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
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
                    <p className="text-sm">Loading...</p>
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
                                loading={deletingNote}
                              >
                                {!deletingNote && <Trash2Icon className="text-red-500" />}
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

              <Button className="mt-auto w-auto px-4" variant="outline" onClick={closeSheet}>
                Close
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Page;
