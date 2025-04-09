// hooks/api/useUser.ts

import { createUser, getCurrentUser, updateUser } from '@/api/user.api';
import { API_ROUTES } from '@/constants/api.routes';
import { User } from '@/constants/models/object.types';
import store from '@/store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../use-toast';

export const useGetUser = () => {
  const query = useQuery({
    queryKey: [API_ROUTES.GET_USER],
    staleTime: 0,
    refetchInterval: false,
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
    mutationFn: (body: Partial<User>) => updateUser(body),
    onSuccess: (response) => {
      refetch();
      toast({ title: 'User Updated', description: 'Your profile has been successfully updated.' });
    },
  });
  return mutation;
};
