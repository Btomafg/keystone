import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { bugTypes } from "@/constants/general";
import { zodResolver } from "@hookform/resolvers/zod";
import { List } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


interface ReportBugProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

// Form validation schema
const reportBugSchema = z.object({
    type: z.string().min(1, { message: "Bug title is required." }),
    description: z.string().min(1, { message: "Description is required." }),
});

type ReportBugFormValues = z.infer<typeof reportBugSchema>;

const ReportBug: React.FC<ReportBugProps> = ({ open, setOpen }) => {

    const form = useForm<ReportBugFormValues>({
        resolver: zodResolver(reportBugSchema),
        defaultValues: {
            type: "",
            description: "",
        },
    });

    const onSubmit = async (data: ReportBugFormValues) => {
        console.log("Bug report submitted:", data);

        setOpen(false);
        form.reset();
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[90%] max-w-lg">
                <div className="border-b p-4 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Report a Problem
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Please let us know the details of the issue you're facing.
                    </p>
                </div>


                <Form {...form}>
                    <form
                        className="p-4 space-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="">Issue Type</FormLabel>
                                    <FormDescription className="" >Please select the type of issue you're experiencing</FormDescription>
                                    <FormControl>
                                        <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                                            <SelectTrigger className="w-full h-18">
                                                <SelectValue placeholder={
                                                    <div> <div className="flex flex-row items-center gap-2">
                                                        <List />
                                                        <span>Select Issue Type</span>
                                                    </div>
                                                        <div className="text-sm">Choose from a list of issue types</div>
                                                    </div>

                                                } />
                                            </SelectTrigger>
                                            <SelectContent className="cursor-pointer max-w-[85vw]">
                                                {bugTypes.map((type) => (
                                                    <SelectItem key={type.key} value={type.key}>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            {type.icon}
                                                            <p className="flex-wrap">{type.title}</p>
                                                        </div>
                                                        <div className="text-sm">{type.description}</div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormDescription>
                                        Provide detailed information about the problem.
                                    </FormDescription>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            rows={4}
                                            placeholder="Describe the issue in detail"
                                            required
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Buttons */}
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default ReportBug;
