// Created by: Brandon Thomas
'use client';
import { getAdminProjectById, getAdminProjects, updateAdminProject } from '@/api/admin/admin.projects.api';
import { API_ROUTES } from '@/constants/api.routes';
import { useToast } from '@/hooks/use-toast';
import store from '@/store';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

export const useAdminGetProjectById = () => {
  const admin_key = store.getState().auth.admin_session_key;
  const pathName = usePathname();
  const projectId = pathName.split('/')[3];
  console.log('PROJECT ID', projectId);
  const query = useQuery({
    queryKey: [API_ROUTES.ADMIN.PROJECTS.GET_BYID, projectId],
    enabled: !!admin_key,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    queryFn: () => getAdminProjectById({ project_id: parseFloat(projectId), admin_key: admin_key }),
    retry: false,
  });
  return {
    data: query?.data?.data,
    isSuccess: query.isSuccess,
    isLoading: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
};
export const useAdminGetProjects = () => {
  const admin_key = store.getState().auth.admin_session_key;

  const query = useQuery({
    queryKey: [API_ROUTES.ADMIN.PROJECTS.GET],
    enabled: !!admin_key,
    staleTime: 1000 * 60 * 5,
    queryFn: () => getAdminProjects({ admin_key: admin_key }),
    retry: false,
  });
  return {
    data: query?.data?.data,
    isSuccess: query.isSuccess,
    isLoading: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
};
export const useAdminUpdateProject = () => {
  const { refetch } = useAdminGetProjectById();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (body: any) => updateAdminProject(body),
    onError: (error) => {},
    onSuccess: (response) => {
      if (!response.data) return;
      refetch();
      toast({ title: 'Resource Created', description: response?.message });
    },
  });
  return mutation;
};
