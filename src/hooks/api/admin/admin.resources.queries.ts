// Created by: Brandon Thomas
'use client';
import {
  createAdminResource,
  createAdminResourceAvailabilityRule,
  createAdminResourceBlockedTimes,
  deleteAdminResource,
  deleteAdminResourceAvailabilityRule,
  deleteAdminResourceBlockedTimes,
  getAdminResourceById,
  getAdminResources,
} from '@/api/admin/admin.resources.api';
import { API_ROUTES } from '@/constants/api.routes';
import { useToast } from '@/hooks/use-toast';
import store from '@/store';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

export const useAdminGetResourceById = (body) => {
  const admin_key = store.getState().auth.admin_session_key;
  const pathName = usePathname();
  const resourceId = pathName.split('/')[4];
  const query = useQuery({
    queryKey: [API_ROUTES.ADMIN.RESOURCES.GET_BYID, resourceId],
    enabled: !!admin_key,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    queryFn: () => getAdminResourceById({ ...body, admin_key: admin_key }),
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
export const useAdminGetResources = () => {
  const admin_key = store.getState().auth.admin_session_key;
  const query = useQuery({
    queryKey: [API_ROUTES.ADMIN.RESOURCES.GET],
    enabled: !!admin_key,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    queryFn: () => getAdminResources({ admin_key: admin_key }),
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

export const useAdminCreateResource = () => {
  const { refetch } = useAdminGetResources();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (body: any) => createAdminResource(body),
    onError: (error) => {},
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Resource Created', description: response?.message });
    },
  });
  return mutation;
};

export const useAdminDeleteResource = () => {
  const { refetch } = useAdminGetResources();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (body: any) => deleteAdminResource(body),
    onError: (error) => {},
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Resource Deleted', description: response?.message });
    },
  });
  return mutation;
};

export const useAdminCreateResourceBlockedTimes = () => {
  const { refetch } = useAdminGetResources();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (body: any) => createAdminResourceBlockedTimes(body),
    onError: (error) => {},
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Resource Blocked Time Created', description: response?.message });
    },
  });
  return mutation;
};

export const useAdminDeleteResourceBlockedTimes = () => {
  const { refetch } = useAdminGetResources();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (body: any) => deleteAdminResourceBlockedTimes(body),
    onError: (error) => {},
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Resource Blocked Time Deleted', description: response?.message });
    },
  });
  return mutation;
};

export const useAdminCreateResourceAvailabilityRule = () => {
  const { refetch } = useAdminGetResources();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (body: any) => createAdminResourceAvailabilityRule(body),
    onError: (error) => {},
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Resource Availability Rule Created', description: response?.message });
    },
  });
  return mutation;
};

export const useAdminDeleteResourceAvailabilityRule = () => {
  const { refetch } = useAdminGetResources();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (body: any) => deleteAdminResourceAvailabilityRule(body),
    onError: (error) => {},
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Resource Availability Rule Deleted', description: response?.message });
    },
  });
  return mutation;
};
