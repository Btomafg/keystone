import { useMutation, useQuery } from '@tanstack/react-query';

import { createAppointment, getAppointmentByProjectId } from '@/api/appointments.api';
import { API_ROUTES } from '@/constants/api.routes';
import { FAQ } from '@/constants/models/object.types';
import { useGetProjects } from './projects.queries';

export const useGetAppointmentByProjectId = (body: any) => {
  const query = useQuery({
    queryKey: [API_ROUTES.APPOINTMENTS.PROJECTID],
    staleTime: 1000 * 60 * 5,
    queryFn: () => getAppointmentByProjectId(body),
    enabled: true,
  });

  return {
    data: (query?.data || null) as FAQ | null,
    isSuccess: query.isSuccess,
    isLoading: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
};

export const useCreateAppointment = () => {
  const { refetch } = useGetProjects();

  const mutation = useMutation({
    mutationFn: (body) => createAppointment(body),
    onSuccess: (data) => {
      refetch();
      return data;
    },
  });
  return mutation;
};
