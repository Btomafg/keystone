'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAccountVerification } from '@/hooks/api/auth.queries';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { setStep } from '@/store/slices/authSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod';

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
});

export default function AuthStepOTP() {
  const email = useTypedSelector((state) => state.auth.email);
  const { mutateAsync: verifyOtpCode, isPending } = useAccountVerification();
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: '',
    },
  });

  const onSubmit = async () => {
    const res = await verifyOtpCode({ email, code: form.watch('pin') });
    if (res) {
      dispatch(setStep('profile'));
      console.log('OTP verified successfully', res);
    } else {
      // Handle error
      console.error('OTP verification failed');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6 flex flex-col items-center mx-auto">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>Please enter the one-time password sent to your phone.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button loading={isPending} className="ms-auto text-white" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
