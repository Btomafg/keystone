'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { APP_ROUTES } from '@/constants/routes';
import { useForgotPassword, useLogin, useRegister } from '@/hooks/api/auth.queries';
import { useGetUser } from '@/hooks/api/users.queries';
import { useToast } from '@/hooks/use-toast';
import PasswordChecker from '@/lib/PasswordChecker';
import { setEmail } from '@/store/slices/authSlice';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
const AuthStep = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { mutateAsync: login, isPending: isLoggingIn } = useLogin();
  const { mutateAsync: signUp, isPending: isSigningUp } = useRegister();
  const { mutateAsync: forgotPassword, isPending: isSending } = useForgotPassword();
  const { data: user, refetch } = useGetUser();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const mode = pathname === '/auth/login/' ? 'login' : pathname === '/auth/register/' ? 'register' : 'forgot';

  const signInWithGoogle = async () => {
    const supabase = createClientComponentClient({
      cookieOptions: {
        name: 'sb-nxqobpvolsbpmgdshejn-auth-token',
      },
    });
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `http://localhost:3000/auth/callback`,
      },
    });
    if (error) throw error;
  };
  const handleAuth = async (data: any) => {
    const { email, password } = data;
    dispatch(setEmail(email));
    try {
      switch (mode) {
        case 'login':
          await login({ email, password });
          await refetch();
          router.push(APP_ROUTES.DASHBOARD.HOME.path);
          break;
        case 'register':
          await signUp({ email, password });
          router.push(APP_ROUTES.DASHBOARD.HOME.path);
          break;
        case 'forgot':
          await forgotPassword({ email });
          toast({ title: 'Reset link sent', description: 'Check your inbox.' });
          router.push(APP_ROUTES.AUTH.LOGIN.path);
          break;
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Auth error',
        description: error?.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <Card className="border-0 shadow-none">
        <CardHeader className="text-center">
          <CardDescription>
            {mode === 'login'
              ? 'Login with your Apple or Google account'
              : mode === 'register'
              ? 'Sign up with your email'
              : 'Enter your email to receive a reset link'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode !== 'forgot' && (
            <div className="flex flex-col gap-4 mb-6">
              <Button variant="outline" className="w-full">
                Login with Apple
              </Button>
              <Button onClick={signInWithGoogle} variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
          )}
          <form onSubmit={handleSubmit(handleAuth)} className="grid gap-6">
            {mode !== 'forgot' && (
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" {...register('email', { required: 'Email is required' })} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {mode !== 'forgot' && (
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register('password', { required: 'Password is required' })} />
                {mode === 'register' && <PasswordChecker password={watch('password')} />}
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
            )}

            <Button type="submit" className="w-full text-white" loading={isLoggingIn || isSigningUp || isSending}>
              {mode === 'login' ? 'Login' : mode === 'register' ? 'Sign Up' : 'Send Reset Link'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center text-sm mt-4">
        {mode === 'login' && (
          <div className="flex flex-col gap-2">
            <Link className="text-blue-500 hover:underline" href={APP_ROUTES.AUTH.RESET_PASSWORD.path}>
              Forgot Password?
            </Link>
            <Link href={APP_ROUTES.AUTH.REGISTER.path}>
              Don&apos;t have an account? <span className="text-blue-500 hover:underline">Sign up</span>
            </Link>
          </div>
        )}
        {mode === 'register' && (
          <Link className="text-blue-500 hover:underline" href={APP_ROUTES.AUTH.LOGIN.path}>
            Already have an account? Login
          </Link>
        )}
        {mode === 'forgot' && (
          <Link className="text-blue-500 hover:underline" href={APP_ROUTES.AUTH.LOGIN.path}>
            Back to Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default AuthStep;
