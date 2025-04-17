import { useQuery } from '@tanstack/react-query';

import { getResources } from '@/api/resources.api';
import { API_ROUTES } from '@/constants/api.routes';
import { FAQ } from '@/constants/models/object.types';

export const useGetResources = () => {
  const query = useQuery({
    queryKey: [API_ROUTES.RESOURCES.GET],
    staleTime: 1000 * 60 * 5,
    queryFn: getResources,
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
