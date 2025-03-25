import { createProject, createRoom, getProjects, getRoomsByProjectId, updateRoom } from '@/api/projects.api';
import { Project, Room } from '@/constants/models/object.types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '../use-toast';

export const useGetProjects = () => {
  const query = useQuery({
    queryKey: ['getProjects'],
    staleTime: 1000 * 60 * 5,
    retry: false,
    queryFn: getProjects,
  });
  console.log(query);
  return {
    data: query?.data as Project[],
    isSuccess: query.isSuccess,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

export const useCreateProjects = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (body: Partial<Project>) => createProject(body),
    onSuccess: (response) => {
      toast({ title: 'Project Created', description: 'Your project has been successfully created.' });
    },
  });
  return mutation;
};

export const useGetRoomsByProjectId = (projectId) => {
  const query = useQuery({
    queryKey: [projectId],
    staleTime: 1000 * 60 * 5,
    queryFn: () => getRoomsByProjectId(projectId),
  });
  return {
    data: query?.data as Project[],
    isSuccess: query.isSuccess,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: () => query.refetch(projectId),
  };
};

export const useCreateRoom = () => {
  const { toast } = useToast();
  const { refetch } = useGetProjects();
  const mutation = useMutation({
    mutationFn: (body: Partial<Room>) => createRoom(body),
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Project Created', description: 'Your project has been successfully created.' });
    },
  });
  return mutation;
};

export const useUpdateRoom = () => {
  const { toast } = useToast();
  const { refetch } = useGetProjects();
  const mutation = useMutation({
    mutationFn: (body: Partial<Room>) => updateRoom(body),
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Room Updated' });
    },
  });
  return mutation;
};
