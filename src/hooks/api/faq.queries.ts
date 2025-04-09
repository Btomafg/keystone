import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import { getAllFaqs, faqIncreaseSearchCount, faqCreateFeedback, getMyFaqFeedback } from '@/api/faq.api';
import { API_ROUTES } from '@/constants/api.routes';
import { FAQ, FAQFeedback } from '@/constants/models/object.types';

export const useGetAllFaqs = () => {
  const query = useQuery({
    queryKey: [API_ROUTES.GET_ALL_FAQS],
    staleTime: 1000 * 60 * 5,
    queryFn: getAllFaqs,
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

export const useGetMyFaqFeedback = (body: any) => {
  const query = useQuery({
    queryKey: [API_ROUTES.GET_MY_FAQ_FEEDBACK, body],
    staleTime: 1000 * 60 * 5,
    queryFn: () => getMyFaqFeedback(body),
    enabled: !!body.faq_id,
  });
  return {
    data: query?.data as FAQFeedback | [],
    isSuccess: query.isSuccess,
    isLoading: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
};
export const useFaqIncreaseSearchCount = () => {
  const mutation = useMutation({
    mutationFn: (body: { faq_id: string }) => faqIncreaseSearchCount(body),
  });
  return mutation;
};

export const useFaqCreateFeedback = (update: any) => {
  const mutation = useMutation({
    mutationFn: (body: Partial<FAQFeedback>) => faqCreateFeedback(body),
  });
  return mutation;
};
