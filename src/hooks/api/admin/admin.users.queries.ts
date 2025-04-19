// Created by: Brandon Thomas
'use client';
import { getAdminUsersById } from '@/api/admin/admin.users.api';
import { API_ROUTES } from '@/constants/api.routes';
import store from '@/store';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const useAdminGetUserById = (body) => {
  const admin_key = store.getState().auth.admin_session_key;
  const userId = body?.user_id;
  console.log('USER ID', body);
  const query = useQuery({
    queryKey: [API_ROUTES.ADMIN.USERS.GET_BYID, userId],
    enabled: !!admin_key,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    queryFn: () => getAdminUsersById({ user_id: userId, admin_key: admin_key }),
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
