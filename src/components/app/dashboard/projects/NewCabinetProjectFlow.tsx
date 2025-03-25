import { Cabinet } from '@/constants/models/object.types';
import { useCreateProjects, useGetProjects } from '@/hooks/api/projects.queries';
import { useToast } from '@/hooks/use-toast';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import NewProjectCabinets from './NewProjectCabinets';
import NewProjectDetails from './NewProjectDetails';
import NewProjectRooms from './NewProjectRooms';



export default function CabinetProjectFlow() {

    const { mutateAsync: createProject, isPending } = useCreateProjects(); const router = useRouter();
    const path = usePathname()
    const projectId = path.split('/')[4];
    const { data: projects } = useGetProjects();
    const project = projects?.find((p) => p.id == projectId);

    const [step, setStep] = useState(project?.step || 1);
    const { toast } = useToast();


    const addCabinetToRoom = (roomId: string) => {

    };


    const updateCabinet = (cabinetId: string, data: Partial<Cabinet>) => {
        const quote =
            (parseFloat(data.ceilingHeight || '0') +
                parseFloat(data.constructionMethod || '0') +
                parseFloat(data.crown || '0') +
                parseFloat(data.doorMaterial || '0') +
                parseFloat(data.lightRail || '0') +
                parseFloat(data.subMaterial || '0') +
                parseFloat(data.toeStyle || '0')) *
            (data.sqft || 0);

    };

    const createNewProject = async (data) => {
        try {
            let newProject = {

                name: data.name,
                description: data.description,
                type: data.type,
                status: 0,
                step: 2
            }
            data.id && (newProject = { ...newProject, id: data.id });
            const res = await createProject(newProject);

            router.push(`/dashboard/projects/new/${res?.id}`);
            toast({ title: 'Project created successfully' });

            setStep(2);
        } catch (error) {
            toast({ title: 'Error Creating Project' });
        }
    };

    // Main render
    return (
        <div className="container flex flex-col mx-auto space-y-6 p-4">
            <h1 className="text-3xl font-semibold mx-auto">New Cabinet Project</h1>
            <p className="text-muted mx-auto">
                Create a new cabinet project to start planning your next project.
            </p>
            <div className="space-y-6 py-6 w-[500px] mx-auto">
                {step === 1 && (
                    <NewProjectDetails

                        onNext={createNewProject}
                        loading={isPending}
                    />
                )}
                {step === 2 && (
                    <NewProjectRooms

                        project={project}
                        onBack={() => setStep(1)}
                        onNext={() => setStep(3)}
                    />
                )}
                {step === 3 && (
                    <NewProjectCabinets
                        project={project}
                        updateCabinet={updateCabinet}
                        addCabinetToRoom={addCabinetToRoom}
                        onBack={() => setStep(2)}
                    />
                )}
            </div>
        </div>
    );
}
