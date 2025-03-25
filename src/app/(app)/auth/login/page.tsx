'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { APP_ROUTES } from '@/constants/routes';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { forgotPasswordAction, signInAction, signUpAction } from '../../../../lib/actions/auth';

export default function AuthStepLogin() {
    const [mode, setMode] = useState('login'); // Modes: 'login', 'otp', 'register', 'forgot'
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    interface handleResponseProps {
        function: string;
        success: boolean;
        message: string;
        type: string;
    }
    const handleResponse = (response: handleResponseProps) => {
        console.log(response);
        const dispatch = useDispatch();
        switch (response.function) {
            case 'signin':
                if (response.success) {

                    router.push(APP_ROUTES.DASHBOARD.HOME.path);
                    toast({ title: response.type, description: response.message });
                } else {
                    toast({ title: response.type, description: response.message });
                }
                break;
            case 'register':
                if (response.success) {
                    router.push(APP_ROUTES.AUTH.OTP.path);
                    toast({ title: response.type, description: response.message });
                } else {
                    toast({ title: response.type, description: response.message });
                }
                break;
            case 'forgot':
                if (response.success) {
                    toast({ title: response.type, description: response.message });
                } else {
                    toast({ title: response.type, description: response.message });
                }
                break;
        }

        setLoading(false);
    }

    const handleAuth = async (data: FormData) => {
        setLoading(true);
        console.log('submitting')
        switch (mode) {
            case 'login':
                handleResponse(await signInAction(data));
                break;
            case 'register':
                handleResponse(await signUpAction(data));
                break;
            case 'forgot':
                handleResponse(await forgotPasswordAction(data));
                break;
        }
    };

    console.log('mode', mode);
    return (
        <div className='flex flex-col h-screen min-w-5xl' >
            <div className='mx-auto my-auto flex flex-col min-w-96 ' >
                <Card className=' flex-1'>
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
                        <form onSubmit={handleSubmit(handleAuth)} className="grid gap-6">
                            {mode !== 'forgot' && (
                                <div className="flex flex-col gap-4">
                                    <Button variant="outline" className="w-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                                            <path
                                                d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        Login with Apple
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                                            <path
                                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        Login with Google
                                    </Button>
                                </div>
                            )}
                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" {...register('email', { required: 'Email is required' })} />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message as any}</p>}
                            </div>

                            {mode !== 'forgot' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" {...register('password', { required: 'Password is required' })} />
                                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message as any}</p>}
                                </div>
                            )}

                            <Button type="submit" className="w-full text-white" loading={loading} >
                                {mode === 'login' ? 'Login' : mode === 'register' ? 'Sign Up' : 'Send Reset Link'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center text-sm mt-4">
                    {mode === 'login' && (
                        <>
                            <p className="cursor-pointer text-blue-500 hover:underline" onClick={() => setMode('forgot')}>
                                Forgot Password?
                            </p>
                            <p>
                                Don't have an account?{' '}
                                <span className="cursor-pointer text-blue-500 hover:underline" onClick={() => setMode('register')}>
                                    Sign up
                                </span>
                            </p>
                        </>
                    )}
                    {mode === 'register' && (
                        <p className="cursor-pointer text-blue-500 hover:underline" onClick={() => setMode('login')}>
                            Already have an account? Login
                        </p>
                    )}
                    {mode === 'forgot' && (
                        <p className="cursor-pointer text-blue-500 hover:underline" onClick={() => setMode('login')}>
                            Back to Login
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
