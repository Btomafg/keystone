'use client'
import { useCreateProjects, useGetProjects, useUpdateProject } from '@/hooks/api/projects.queries';
import { useToast } from '@/hooks/use-toast';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import NewProjectCabinets from './NewProjectCabinets';
import NewProjectDetails from './NewProjectDetails';
import NewProjectRooms from './NewProjectRooms';

export default function CabinetProjectFlow() {
  const { mutateAsync: createProject, isPending } = useCreateProjects();
  const { mutateAsync: updateProject, isPending: isUpdating } = useUpdateProject();

  const router = useRouter();
  const path = usePathname();
  const projectId = path.split('/')[4];
  const { data: projects } = useGetProjects();

  const project = projects?.find((p) => p.id == projectId);

  const searchParams = useSearchParams();
  const initialStep = parseInt(searchParams.get('step') || '1', 10);
  const [step, setStep] = useState(initialStep);
  const { toast } = useToast();

  const onNext = () => {
    setStep(step + 1);
    router.push(`/dashboard/projects/new/${project?.id}?step=${step + 1}`);
  }
  const onBack = () => {
    setStep(step - 1);
    router.push(`/dashboard/projects/new/${project?.id}?step=${step - 1}`);
  }
  const createNewProject = async (data) => {
    try {
      let newProject = {
        name: data.name,
        description: data.description,
        type: data.type,
        status: 0,
        step: 2,
      };
      data.id && (newProject = { ...newProject, id: data.id });
      const res = data.id ? await updateProject(newProject) : await createProject(newProject);
      router.push(`/dashboard/projects/new/${res?.id}?step=2`);
      setStep(2);
    } catch (error) {
      toast({ title: 'Error Creating Project' });
    }
  };

  // Main render
  return (
    <div className="container flex flex-col mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-semibold mx-auto">New Cabinet Project</h1>
      <p className="text-muted mx-auto">Create a new cabinet project to start planning your next project.</p>
      <div className="space-y-6 py-6 w-[500px] mx-auto">
        {step === 1 && <NewProjectDetails onNext={createNewProject} loading={isPending} />}
        {step === 2 && <NewProjectRooms project={project} onBack={onBack} onNext={onNext} />}
        {step === 3 && <NewProjectCabinets project={project} onBack={onBack} />}
      </div>
    </div>
  );
}
