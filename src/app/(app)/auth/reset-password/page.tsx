'use client';;
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useGetSession, useResetPassword } from "@/hooks/api/auth.queries";
import PasswordChecker from "@/lib/PasswordChecker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const resetPasswordSchema = z
    .object({
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { mutateAsync: getSession } = useGetSession();
    const { mutateAsync: resetPassword, isPending } = useResetPassword();
    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const {
        handleSubmit,
        control,
        watch,
        formState: { isSubmitting },
    } = form;

    const password = watch("password");

    const onSubmit = async (data: ResetPasswordFormValues) => {
        console.log(data)
        try {
            await resetPassword({ password: data.password, confirmPassword: data.confirmPassword });
            router.push("/home");
        }
        catch (error) {
            toast({ title: 'Password Reset Failed', description: error.message });
        }
    };



    useEffect(() => {
        getSession();
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Reset Your Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <Input type="password" placeholder="New password" {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <Input type="password" placeholder="Confirm password" {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <PasswordChecker password={password} />

                            <Button loading={isPending} type="submit" disabled={isSubmitting} className="w-full">
                                {isPending ? "Resetting..." : "Reset Password"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
