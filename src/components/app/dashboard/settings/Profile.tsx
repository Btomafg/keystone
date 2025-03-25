import { DatePicker } from "@/components/app/DatePicker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl, FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGetUser, useUpdateUserProfile } from "@/hooks/api/users.queries";
import { cleanPhoneNumber, formatPhoneNumber } from "@/utils/common";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  first_name: z.string().nonempty("First Name is required."),
  last_name: z.string().nonempty("Last Name is required."),
  title: z.string().nonempty("Title is required."),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone number."),
  date_of_birth: z.date().optional(),

});

const Profile: React.FC = () => {
  const { data: user, isSuccess } = useGetUser();
  const { mutateAsync: updateUser, isPending, } = useUpdateUserProfile();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      title: user?.title,
      phone: formatPhoneNumber(user?.phone),
      date_of_birth: user?.date_of_birth ? new Date(user?.date_of_birth.split("T")[0] + "T00:00:00") : undefined,


    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {

    values.phone = cleanPhoneNumber(values?.phone);
    values.date_of_birth = values?.date_of_birth?.toISOString().split("T")[0] as any;
    updateUser(values);
  };

  const today: any = new Date();
  const fourteenYearsAgo = new Date(today - 1000 * 60 * 60 * 24 * 365 * 14)
  const fourteenYearsAgoYear = fourteenYearsAgo.toISOString().split("-")[0]


  useEffect(() => {
    if (isSuccess) {
      form.reset({
        first_name: user?.first_name,
        last_name: user?.last_name,
        title: user?.title,
        phone: formatPhoneNumber(user?.phone),
        date_of_birth: user?.date_of_birth ? new Date(user?.date_of_birth.split("T")[0] + "T00:00:00") : undefined,
      });
    }
  }, [isSuccess]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="john@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2 md:col-span-1">

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="(123)456-7890" onChange={(e) => form.setValue("phone", formatPhoneNumber(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem className="flex flex-col col-span-2 md:col-span-1">
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={form.getValues('date_of_birth')}
                    onDateChange={(date: any) => {
                      field.onChange(date);
                    }}
                    disabled={{ after: fourteenYearsAgo }}
                    startMonth={new Date(2015, 5)}
                    fromYear={1900}
                    toYear={fourteenYearsAgoYear}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>


        <Button loading={isPending} className="flex ms-auto" type="submit">Save Changes</Button>
      </form>
    </Form>
  );
};

export default Profile;
