import { createBugReport } from '@/api/settings.api';
import { BugReport } from '@/constants/models/object.types';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '../use-toast';

export const useCreateBugReport = () => {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (body: Partial<BugReport>) => createBugReport(body),
    onSuccess: (response) => {
      toast({ title: 'Bug Report Created', description: 'Thank you for submitting your feedback!' });
    },
  });
  return mutation;
};
