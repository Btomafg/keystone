// app/admin/projects/[projectId]/_components/AdminQuickNoteCard.tsx

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast'; // Adjust path
import { format } from 'date-fns'; // Or your preferred date formatting
import { Loader2, NotebookPen, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// --- Type Definitions --- (Defined above or imported)
interface Note {
  /* ... */
}
interface User {
  /* ... */
}

// --- Placeholder Data & Functions ---

// !!! REPLACE WITH ACTUAL LOGGED IN USER ID !!!
const currentAdminUserId = 'admin-user-uuid-placeholder';

// DUMMY DATA - Replace with API call using useEffect and projectId prop
const DUMMY_NOTES: Note[] = [
  {
    id: 'n1',
    project_id: 68,
    note: 'Customer mentioned potential scope change for the island during initial call.',
    issued_by: 'admin-user-uuid-placeholder',
    created_at: '2025-04-17T11:05:00Z',
    issuer: { first_name: 'Admin', last_name: 'User' },
  },
  {
    id: 'n2',
    project_id: 68,
    note: 'Sent initial quote estimate via email.',
    issued_by: 'admin-user-uuid-placeholder',
    created_at: '2025-04-18T09:15:00Z',
    issuer: { first_name: 'Admin', last_name: 'User' },
  },
];

// --- Helper Function ---
const formatDate = (date: Date | string | null | undefined, fmt: string = 'Pp'): string => {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), fmt);
  } catch (error) {
    return 'Invalid Date';
  }
};

// --- Component Props ---
interface AdminQuickNoteCardProps {
  project: any;
  isLoading?: boolean; // Optional loading state
}

export function AdminQuickNoteCard({ project, isLoading: isLoadingNotes }: AdminQuickNoteCardProps) {
  const recentNotes = project?.notes || [];
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // --- Add Note Handler ---
  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast({ title: 'Info', description: 'Note cannot be empty.' });
      return;
    }
    setIsSubmitting(true);
    console.log(`API CALL: Add note for project ${project?.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <NotebookPen className="h-5 w-5 text-muted-foreground" /> Internal Notes
        </CardTitle>
        <CardDescription className="text-xs">Add quick notes for internal team reference.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Note Form */}
        <div className="flex flex-col space-y-2">
          <Textarea
            placeholder="Type your note here..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
            disabled={isSubmitting}
            className="text-sm"
          />
          <Button
            size="sm"
            onClick={handleAddNote}
            loading={isSubmitting}
            disabled={isSubmitting || !newNote.trim()}
            className=" ms-auto w-fit " // Align right on larger screens
          >
            <Send className="mr-2  h-4 w-4" />
            Add Note
          </Button>
        </div>

        {/* Recent Notes Display */}
        {(isLoadingNotes || recentNotes.length > 0) && (
          <Separator className="my-4" /> // Add separator only if notes will be shown
        )}

        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 text-xs">
          {' '}
          {/* Scrollable area */}
          {isLoadingNotes ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : recentNotes.length === 0 ? (
            <p className="text-muted-foreground italic text-center text-xs py-2">No recent notes.</p>
          ) : (
            recentNotes.map((note) => (
              <div key={note.id} className="pb-2 border-b last:border-b-0">
                <p className=" font-semibold">
                  {note.issuer?.first_name} {note.issuer?.last_name} on {formatDate(note.created_at)}:
                </p>
                <p className="whitespace-pre-wrap mb-1 text-foreground/90">{note.note}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 pb-3">
        <Button variant="link" size="sm" asChild className="text-xs p-0 h-auto mx-auto">
          <Link href={`#notes`}>
            {' '}
            {/* Link to the Notes tab on the same page */}
            View All Notes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
