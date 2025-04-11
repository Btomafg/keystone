// hooks/api/useUser.ts

import { createUser, getCurrentUser, updateUser } from '@/api/user.api';
import { API_ROUTES } from '@/constants/api.routes';
import { User } from '@/constants/models/object.types';
import store from '@/store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../use-toast';
import { validateAdmin } from '@/api/admin.api';
import { logoutAdmin, setAdminSession } from '@/store/slices/authSlice';

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
