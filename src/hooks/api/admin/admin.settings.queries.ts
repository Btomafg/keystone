// Created by: Brandon Thomas
'use client';
import { createAdminSettings, deleteAdminSettings, getAdminSettings, updateAdminSettings } from '@/api/admin/admin.settings.api';
import { API_ROUTES } from '@/constants/api.routes';
import { Lead } from '@/constants/models/object.types';
import { useToast } from '@/hooks/use-toast';
import store from '@/store';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

export const useAdminGetSettings = () => {
  const admin_key = store.getState().auth.admin_session_key;
  const query = useQuery({
    queryKey: [API_ROUTES.ADMIN.SETTINGS.GET],
    enabled: !!admin_key,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    queryFn: () => getAdminSettings({ admin_key: admin_key }),
    retry: false,
  });
  return {
    data: query?.data as Lead | [],
    isSuccess: query.isSuccess,
    isLoading: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
};

export const useAdminUpdateSettings = () => {
  const { refetch } = useAdminGetSettings();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (body: any) => updateAdminSettings(body),
    onError: (error) => {},
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Settings Updated', description: response?.message });
    },
  });
  return mutation;
};
export const useAdminCreateSettings = () => {
  const { refetch } = useAdminGetSettings();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (body: any) => createAdminSettings(body),
    onError: (error) => {},
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Settings Created', description: response?.message });
    },
  });
  return mutation;
};
export const useAdminDeleteSettings = () => {
  const { refetch } = useAdminGetSettings();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (body: any) => deleteAdminSettings(body),
    onError: (error) => {},
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Item Deleted', description: response?.message });
    },
  });
  return mutation;
};
