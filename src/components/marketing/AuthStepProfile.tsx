'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { useDispatch } from 'react-redux';
import { setStep } from '@/store/slices/authSlice';
import { useUpdateUserProfile } from '@/hooks/api/users.queries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Phone, Badge } from 'lucide-react';

// 1) Define your zod schema for validation
const profileSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
  phone: z.string().nonempty('Phone number is required'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function FancyProfileDialog() {
  // 2) Set up dispatch and API calls
  const dispatch = useDispatch();
  const { mutateAsync: updateProfile, isPending: updatingProfile } = useUpdateUserProfile();

  // 3) Configure react-hook-form with zod schema
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
    },
  });

  // 4) Submission logic
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
      });
      toast({
        title: 'Profile Completed',
        description: 'Your account is now set up!',
      });
      dispatch(setStep('none')); // Possibly hide the dialog or do something else
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update Failed',
        description: error?.message ?? 'An error occurred while updating your profile.',
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Complete Your Profile</h2>
      <p>Enter a few more details so we can set up your account properly.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <div className="relative">
                  <User className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input placeholder="Enter your first name" className="pl-8" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <div className="relative">
                  <Badge className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input placeholder="Enter your last name" className="pl-8" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <div className="relative">
                  <Phone className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input type="tel" placeholder="Enter your phone number" className="pl-8" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" loading={updatingProfile} className="w-full ms-auto sm:w-auto">
              {form.formState.isSubmitting ? 'Saving...' : 'Complete Profile'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
