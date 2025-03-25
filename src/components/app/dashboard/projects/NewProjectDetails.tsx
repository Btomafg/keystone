import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProjectType } from '@/constants/enums/project.enums';
import { useGetProjects } from '@/hooks/api/projects.queries';

import { zodResolver } from '@hookform/resolvers/zod';
import { Building, House } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const projectDetailsSchema = z.object({
    id: z.number().optional().nullable(),
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
    type: z.number(),
});

export type ProjectDetailsFormValues = z.infer<typeof projectDetailsSchema>;
interface NewProjectDetailsProps {
    loading: boolean;
    onNext: (data: ProjectDetailsFormValues) => void;
}

export default function NewProjectDetails({ onNext, loading }: NewProjectDetailsProps) {

    const path = usePathname()
    const projectId = path.split('/')[4];
    const { data: projects } = useGetProjects();
    const project = projects?.find((p) => p.id == projectId);





    const form = useForm<ProjectDetailsFormValues>({
        resolver: zodResolver(projectDetailsSchema),
        defaultValues: {
            id: null,
            name: '',
            description: '',
            type: undefined,
        },
        mode: 'onChange',
    });

    const { setValue, watch } = form;
    const selectedType = watch('type');


    const onSubmit = (data: ProjectDetailsFormValues) => {
        onNext(data);
    };

    useEffect(() => {
        if (projects && projectId) {

            console.log(project);
            if (project) {
                setValue('id', project.id);
                setValue('name', project.name);
                setValue('description', project.description);
                setValue('type', project.type);
            }
        }
    }, [projects, projectId]);


    console.log(form.getValues());

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter project name" {...field} />
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
                            <FormControl>
                                <Textarea placeholder="Enter description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <div>
                    <FormLabel>Project Type</FormLabel>
                    <div className="flex gap-4 mt-2 w-full">
                        <Card
                            className={`flex flex-col ${selectedType === ProjectType.Residential && 'bg-blue-50'
                                } hover:cursor-pointer h-36 justify-center items-center p-3`}
                            onClick={() => setValue('type', ProjectType.Residential)}
                        >
                            <h3 className="text-xl font-semibold">Residential</h3>
                            <House size={48} />
                            <p className="text-sm text-muted-foreground">
                                Single family homes, apartments, etc.
                            </p>
                        </Card>
                        <Card
                            className={`flex flex-col ${selectedType === ProjectType.Commercial && 'bg-blue-50'
                                } hover:cursor-pointer h-36 justify-center items-center p-3`}
                            onClick={() => setValue('type', ProjectType.Commercial)}
                        >
                            <h3 className="text-xl font-semibold">Commercial</h3>
                            <Building size={48} />
                            <p className="text-sm text-muted-foreground">
                                Commercial properties, office buildings
                            </p>
                        </Card>
                    </div>


                    {form.formState.errors.type && (
                        <p className="text-xs text-red-500 mt-1">
                            {form.formState.errors.type.message}
                        </p>
                    )}
                </div>


                <div className="pt-4 flex flex-row">
                    <Button
                        className="ms-auto"
                        type="submit"
                        disabled={
                            loading ||

                            (selectedType !== ProjectType.Residential &&
                                selectedType !== ProjectType.Commercial)
                        }
                    >
                        {loading ? 'Loading...' : 'Next: Add Rooms'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
