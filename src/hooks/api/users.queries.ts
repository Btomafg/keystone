// hooks/api/useUser.ts

import { createUser, getCurrentUser, updateUser } from '@/api/user.api';
import { User } from '@/constants/models/object.types';
import store from '@/store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../use-toast';

const defaultUser = {
  id: '',
  email: '',
};
const dud = () => defaultUser;
export const useGetUser = () => {
  const userId = store.getState().auth.user?.id;
  const query = useQuery({
    queryKey: [userId],
    staleTime: 1000 * 60 * 5,
    queryFn: getCurrentUser,
  });
  return {
    data: query?.data,
    isSuccess: query.isSuccess,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
};

export const useUpdateUserProfile = () => {
  const { toast } = useToast();
  const { refetch } = useGetUser();
  const mutation = useMutation({
    mutationFn: (body: User) => updateUser(body),
    onSuccess: (response) => {
      refetch();
      toast({ title: 'User Updated', description: 'Your profile has been successfully updated.' });
    },
  });
  return mutation;
};
