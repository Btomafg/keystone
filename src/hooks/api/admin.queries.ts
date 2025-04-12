// Created by: Brandon Thomas
'use client';
import { API_ROUTES } from '@/constants/api.routes';
import { Lead, User } from '@/constants/models/object.types';
import store from '@/store';
import { useToast } from '../use-toast';
import { validateAdmin } from '@/api/admin/admin.api';
import { logoutAdmin, setAdminSession } from '@/store/slices/authSlice';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { deleteLeads, getAdminLeads } from '@/api/admin/admin.leads.api';
import { createNote, deleteNote, getAdminNotes } from '@/api/admin/admin.notes.api';
import { getAdminUsers, manageAdminUsers, updateAdminUser } from '@/api/admin/admin.users.api';

export const useValidateAdmin = () => {
  const { toast } = useToast();
  const dispatch = store.dispatch;

  const mutation = useMutation({
    mutationFn: (body: Partial<User>) => validateAdmin(body),
    onSuccess: (response) => {
      console.log('Admin Validation Response:', response);
      if (response?.success) {
        dispatch(
          setAdminSession({
            admin_session_key: response?.data?.key?.admin_session_key,
            admin_session_expires_at: response?.data?.key?.admin_session_expires_at,
          }),
        );

        toast({ title: 'Admin Validated', description: 'Your Admin Session is Active' });
      } else {
        dispatch(logoutAdmin());

        toast({ title: 'Admin Validation Failed', description: response?.message });
      }
    },
  });
  return mutation;
};

export const useAdminGetLeads = () => {
  const admin_key = store.getState().auth.admin_session_key;
  const query = useQuery({
    queryKey: [API_ROUTES.ADMIN.LEADS.GET],
    enabled: !!admin_key,
    staleTime: 1000 * 60 * 5,
    queryFn: () => getAdminLeads(admin_key),
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

export const useAdminDeleteLeads = () => {
  const { refetch } = useAdminGetLeads();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (body: any) => deleteLeads(body),
    onError: (error) => {},
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Leads Deleted', description: response?.message });
      console.log('Delete Leads Response:', response);
    },
  });
  return mutation;
};

export const useAdminGetNotes = () => {
  const admin_key = store.getState().auth.admin_session_key;
  const pathName = usePathname();
  const type = pathName.split('/')[2];
  const id = pathName.split('/')[3];
  const body = {
    admin_key: admin_key,
    type: type,
    id: id,
  };

  const query = useQuery({
    queryKey: [API_ROUTES.ADMIN.NOTES.GET],
    enabled: !!admin_key,
    staleTime: 1000 * 60 * 5,
    queryFn: () => getAdminNotes(body),
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

export const useAdminCreateNote = () => {
  const { refetch } = useAdminGetNotes();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (body: any) => createNote(body),
    onError: (error) => {},
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Note Created', description: response?.message });
      console.log('Create Note Response:', response);
    },
  });
  return mutation;
};

export const useAdminDeleteNote = () => {
  const { refetch } = useAdminGetNotes();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (body: any) => deleteNote(body),
    onError: (error) => {},
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Note Deleted', description: response?.message });
      console.log('Delete Note Response:', response);
    },
  });
  return mutation;
};

export const useAdminGetUsers = () => {
  const admin_key = store.getState().auth.admin_session_key;
  const query = useQuery({
    queryKey: [API_ROUTES.ADMIN.USERS.GET],
    enabled: !!admin_key,
    staleTime: 1000 * 60 * 5,
    queryFn: () => getAdminUsers({ admin_key: admin_key }),
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
export const useAdminUpdateUser = () => {
  const { refetch } = useAdminGetUsers();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (body: any) => updateAdminUser(body),
    onError: (error) => {},
    onSuccess: (response) => {
      refetch();
      toast({ title: 'User Updated', description: response?.message });
      console.log('Delete Note Response:', response);
    },
  });
  return mutation;
};

export const useAdminManageUsers = () => {
  const { refetch } = useAdminGetUsers();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (body: any) => manageAdminUsers(body),
    onError: (error) => {},
    onSuccess: (response) => {
      refetch();
      toast({ title: 'User Updated', description: response?.message });
      console.log('Delete Note Response:', response);
    },
  });
  return mutation;
};
