import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, PasswordInput } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useResetPassword } from '@/hooks/api/auth.queries';
import PasswordChecker from '@/lib/PasswordChecker';

const passwordSchema = z
  .object({
    currentPassword: z.string().nonempty('Current password is required.'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters.').nonempty('New password is required.'),
    confirmPassword: z.string().nonempty('Please confirm your password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

const mfaSchema = z.object({
  phoneNumber: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone number.'),
});

const Security: React.FC = () => {
  const { mutateAsync: updatePassword, isPending: loading } = useResetPassword();
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const mfaForm = useForm<z.infer<typeof mfaSchema>>({
    resolver: zodResolver(mfaSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const onPasswordSubmit = (values: z.infer<typeof passwordSchema>) => {
    console.log('Password updated:', values);
    updatePassword({ old_password: values.currentPassword, new_password: values.confirmPassword });
  };

  const onMFASubmit = (values: z.infer<typeof mfaSchema>) => {
    console.log('MFA added:', values);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        *** NOT FUNCTIONAL YET ***
        <h2 className="text-lg font-semibold">Update Password</h2>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="flex flex-col space-y-4">
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} placeholder="Enter current password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} placeholder="Enter new password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} placeholder="Confirm new password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {passwordForm.watch('newPassword').length > 0 && (
              <div className="flex max-w-[300px]">
                <PasswordChecker password={passwordForm.watch('newPassword')} />
              </div>
            )}

            <Button className="ms-auto" type="submit">
              Update Password
            </Button>
          </form>
        </Form>
      </div>

      <div>
        {' '}
        *** NOT FUNCTIONAL YET ***
        <h2 className="text-lg font-semibold">Add Multi-Factor Authentication</h2>
        <Form {...mfaForm}>
          <form onSubmit={mfaForm.handleSubmit(onMFASubmit)} className="flex flex-col space-y-4">
            <FormField
              control={mfaForm.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormDescription>Add a phone number for MFA authentication.</FormDescription>
                  <FormControl>
                    <Input {...field} placeholder="(123) 456-7890" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="ms-auto" type="submit">
              Add MFA
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Security;
