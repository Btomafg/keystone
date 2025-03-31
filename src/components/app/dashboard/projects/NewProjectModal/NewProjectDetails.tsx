import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProjectType } from '@/constants/enums/project.enums';
import { APP_ROUTES } from '@/constants/routes';
import { useCreateProjects, useGetProjects } from '@/hooks/api/projects.queries';

import { zodResolver } from '@hookform/resolvers/zod';
import { Building, House } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const projectDetailsSchema = z.object({

    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
    firstCustom: z.boolean().optional(),
    street: z.string().nonempty('Street is required'),
    city: z.string().nonempty('City is required'),
    state: z.string().nonempty('State is required'),
    zip: z.string().nonempty('Zip code is required'),
    type: z.number(),
});

export type ProjectDetailsFormValues = z.infer<typeof projectDetailsSchema>;
interface NewProjectDetailsProps {
    setOpen: (open: boolean) => void;

}

const NewProjectDetails: React.FC<NewProjectDetailsProps> = (props) => {
    const { setOpen } = props;
    const path = usePathname();
    const router = useRouter();
    const { mutateAsync: createProject, isPending: loading } = useCreateProjects();
    const projectId = path.split('/')[4];
    const { data: projects } = useGetProjects();
    const project = projects?.find((p) => p.id == projectId);

    const form = useForm<ProjectDetailsFormValues>({
        resolver: zodResolver(projectDetailsSchema),
        defaultValues: {
            name: '',
            description: '',
            firstCustom: false,
            street: '',
            city: '',
            state: '',
            zip: '',
            type: undefined,
        },
        mode: 'onChange',
    });

    const { setValue, watch } = form;
    const selectedType = watch('type');

    const onSubmit = async (data: ProjectDetailsFormValues) => {

        try {
            const newId = await createProject({ ...data, status: 0, step: 0 });
            router.push(`${APP_ROUTES.DASHBOARD.PROJECTS.NEW.path}/${newId?.id as any}`);
            setOpen(false);
        } catch (error) {

        }
    };

    useEffect(() => {
        if (projects && projectId) {
            if (project) {
                setValue('name', project.name);
                setValue('description', project.description);
                setValue('firstCustom', project.firstCustom);
                setValue('street', project.street);
                setValue('city', project.city);
                setValue('state', project.state);
                setValue('zip', project.zip);
                setValue('type', project.type);
            }
        }
    }, [projects, projectId, project, setValue]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Project Name
                                <FormDescription className="text-xs text-muted-foreground">
                                    Give your project a memorable name.
                                </FormDescription>

                            </FormLabel>

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
                            <FormLabel> Description
                                <FormDescription className="text-xs text-muted-foreground">
                                    This will be used to identify your project in the future.
                                </FormDescription>
                            </FormLabel>



                            <FormControl>
                                <Textarea placeholder="Enter description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                    }
                />


                < FormField
                    control={form.control}
                    name="firstCustom"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 ">
                            <FormControl>
                                <Checkbox id='firstCustom' onChange={(e) => field.onChange(e.target.checked)} />

                            </FormControl>
                            <span className='!my-auto text-sm' >Is this your first custom project?</span>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                < div className='flex flex-row justify-between gap-3' >
                    <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Street</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter street" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter city" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div >
                <div className='flex flex-row w-full gap-3'>
                    <FormField
                        control={form.control}

                        name="state"
                        render={({ field }) => (
                            <FormItem
                                className="w-full">
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter state" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="zip"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Zip Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter zip code" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

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
                            !form.formState.isValid
                        }
                    >
                        {loading ? 'Loading...' : 'Start Building!'}
                    </Button>
                </div>
            </form >
        </Form >
    );
}

export default NewProjectDetails;
