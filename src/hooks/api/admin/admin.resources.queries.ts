// Created by: Brandon Thomas
'use client';
import { getAdminResourceById, getAdminResources } from '@/api/admin/admin.resources.api';
import { API_ROUTES } from '@/constants/api.routes';
import store from '@/store';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const useAdminGetResourceById = (body) => {
  const admin_key = store.getState().auth.admin_session_key;
  const query = useQuery({
    queryKey: [API_ROUTES.ADMIN.RESOURCES.GET_BYID],
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
