'use client';

import React from 'react';
import { AdminLeadsTable } from '@/components/app/admin/AdminLeadsTable';
import { useAdminGetLeads, useAdminGetNotes } from '@/hooks/api/admin.queries';
import { usePathname, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface pageProps {}

const Page: React.FC<pageProps> = () => {
  const { data: leads = [], isLoading } = useAdminGetLeads();
  const pathname = usePathname();
  const router = useRouter();
  const leadId = pathname.split('/')[3];
  const lead = leads?.find((lead) => lead?.id == leadId);

  const [noteInput, setNoteInput] = React.useState('');
  const [editableLead, setEditableLead] = React.useState<any>(lead);
  const { data: notes, isLoading: fetchingNotes } = useAdminGetNotes();
  console.log('notes', notes);
  React.useEffect(() => {
    setEditableLead(lead);
  }, [lead]);

  const handleSaveLead = () => {
    // TODO: Add mutation to update lead in DB
    console.log('Saving lead...', editableLead);
  };

  const handleAddNote = () => {
    if (!noteInput) return;
    // TODO: Call API to add note to lead
    console.log('Adding note:', noteInput);
    setNoteInput('');
  };

  return (
    <div className="flex flex-row w-full h-full p-4 gap-6">
      {/* Left: Table */}
      <div className="w-2/3">
        <h1 className="text-2xl font-bold">Leads</h1>
        <p className="text-sm text-muted-foreground mb-2">Manage and track all your leads</p>
        <AdminLeadsTable leads={leads} loading={isLoading} />
      </div>

      {/* Right: Lead Detail Panel */}
      <div className="w-1/3 bg-muted/20 p-4 rounded-xl shadow-sm border">
        {lead ? (
          <>
            <h2 className="text-xl font-semibold mb-2">Lead Details</h2>
            <div className="grid gap-3">
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
            </div>

            <Separator className="my-4" />

            <h3 className="text-md font-semibold mb-2">Add Note</h3>
            <Textarea placeholder="Write a note..." value={noteInput} onChange={(e) => setNoteInput(e.target.value)} />
            <Button className="mt-2" onClick={handleAddNote}>
              Add Note
            </Button>

            {/* TODO: Notes list */}
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-1">Recent Notes</h4>
              <p className="text-sm text-muted-foreground">No notes yet.</p>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-sm">Select a lead to view or edit</p>
        )}
      </div>
    </div>
  );
};

export default Page;
