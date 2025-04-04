import { APP_ROUTES } from '@/constants/routes';
import { SupabaseAuthService } from '@/lib/actions/auth';
import store from '@/store';
import { logout, setEmail, setIsAuthenticated, setRefreshTokenInterval, setStep, setToken, setUser } from '@/store/slices/authSlice';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useToast } from '../use-toast';
import { useTypedSelector } from '../useTypedSelector';
import { useGetUser } from './users.queries';

const ONE_MINUTE = 60000;

// LOGIN
export const useLogin = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => SupabaseAuthService.signIn(email, password),
    onError: (error: any) => {
      console.error(error);
      toast({ title: 'Login Failed', description: error.error });
    },
    onSuccess: async (res) => {
      if (!res.data) {
        toast({ title: 'Login Failed', description: res.message });
        if (res.type == 'email_not_confirmed') {
          dispatch(setStep('otp'));
        }
      } else {
        console.log(res);
        store.dispatch(setToken(res.data.session.access_token));
        store.dispatch(setRefreshTokenInterval(new Date().toISOString()));
        store.dispatch(setIsAuthenticated(true));
        store.dispatch(setUser(res.data.session.user));

        toast({ title: 'Login Successful', description: res.data.message });
      }
    },
  });
};

export const useLogout = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: () => SupabaseAuthService.signOut(),
    onError: (error: any) => {
      console.error(error);
    },
    onSuccess: () => {
      console.log('signedout');
      dispatch(logout());
      toast({ title: `You've Successfully Signed Out` });
    },
  });
};

// REGISTER
export const useRegister = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => SupabaseAuthService.signUp(email, password),
    onError: (error: any) => {
      toast({ title: 'Registration Failed', description: error.message });
    },
    onSuccess: (res, variables) => {
      dispatch(setStep('otp'));
      dispatch(setEmail(variables.email));
      toast({ title: res.message });
    },
  });
};

// OTP VERIFICATION
export const useAccountVerification = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { refetch } = useGetUser();
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) => SupabaseAuthService.verifyOtpCode(email, code),
    onError: (error: any) => {
      toast({ title: 'Verification Failed', description: error.message });
    },
    onSuccess: (res) => {
      router.push(APP_ROUTES.DASHBOARD.HOME.path);
      toast({ title: res.message });
      refetch();
    },
  });
};

// PASSWORD RESET FLOW

export const useResetPassword = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ password, confirmPassword }: { password: string; confirmPassword: string }) =>
      SupabaseAuthService.resetPassword(password, confirmPassword),
    onError: (error: any) => {
      toast({ title: 'Password Reset Failed', description: error.message });
    },
    onSuccess: (res, variables) => {
      toast({ title: res.message });
    },
  });
};

// PASSWORD CHANGE (for authenticated users)
export const useForgotPassword = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ email }: { email: string }) => SupabaseAuthService.forgotPassword(email),
    onError: (error: any) => {
      console.log(JSON.stringify(error));
      toast({ title: 'Password Reset Failed', description: error.message });
    },
    onSuccess: (res, variables) => {
      dispatch(setEmail(variables.email));
      dispatch(setStep('login'));
      toast({ title: res.message });
    },
  });
};

export const useGetSession = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: () => SupabaseAuthService.getSession(),
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message });
      router.push(APP_ROUTES.HOME.path);
    },
    onSuccess: (session) => {
      console.log(session);
      dispatch(setToken(session.access_token));
      dispatch(setEmail(session.user.email || ''));
      dispatch(setIsAuthenticated(true));
      dispatch(setRefreshTokenInterval(new Date().toISOString()));
      dispatch(setUser(session.user));
    },
  });
};

// VERIFY & REFRESH SESSION TOKEN
export const useVerifyToken = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [tokenVerified, setTokenVerified] = useState(false);
  const refreshTokenInterval = useTypedSelector((state) => state.auth.refreshTokenInterval);

  useEffect(() => {
    const handleInterval = async () => {
      if (!refreshTokenInterval) return;

      const diff = dayjs().diff(new Date(refreshTokenInterval), 'minutes');
      if (diff >= 55) {
        await SupabaseAuthService.getSession();
        dispatch(setRefreshTokenInterval(new Date().toISOString()));
      }
    };

    const interval = setInterval(handleInterval, ONE_MINUTE);
    return () => clearInterval(interval);
  }, [refreshTokenInterval]);

  useEffect(() => {
    handleTokenVerify();
  }, []);

  const handleTokenVerify = async () => {
    setLoading(true);
    try {
      const session = await SupabaseAuthService.getSession();
      if (session) {
        dispatch(setToken(session.access_token));
        dispatch(setEmail(session.user.email || ''));
        dispatch(setIsAuthenticated(true));
        dispatch(setRefreshTokenInterval(new Date().toISOString()));
        dispatch(setUser(session.user));
        setTokenVerified(true);
      } else {
        dispatch(logout());
        setTokenVerified(false);
      }
    } catch (err) {
      dispatch(logout());
      setTokenVerified(false);
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, mutateAsync: handleTokenVerify, tokenVerified };
};
