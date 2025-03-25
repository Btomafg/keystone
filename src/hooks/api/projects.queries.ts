import {
  createCabinets,
  createProject,
  createRoom,
  deleteRoom,
  getCustomOptions,
  getProjects,
  getRoomsByProjectId,
  updateCabinet,
  updateRoom,
} from '@/api/projects.api';
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

export const useCreateCabinets = () => {
  const { toast } = useToast();
  const { refetch } = useGetProjects();
  const mutation = useMutation({
    mutationFn: (body: Partial<Room>) => createCabinets(body),
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Cabinet Created', description: 'A cabinet as been added!' });
    },
  });
  return mutation;
};

export const useUpdateCabinet = () => {
  const { toast } = useToast();
  const { refetch } = useGetProjects();
  const mutation = useMutation({
    mutationFn: (body: Partial<Room>) => updateCabinet(body),
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Cabinet Updated' });
    },
  });
  return mutation;
};
export const useDeleteRoom = () => {
  const { toast } = useToast();
  const { refetch } = useGetProjects();
  const mutation = useMutation({
    mutationFn: (roomId: string) => deleteRoom(roomId),
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Room Deleted' });
    },
  });
  return mutation;
};

export const useGetCustomOptions = () => {
  const query = useQuery({
    queryKey: ['getCustomOptions'],
    staleTime: 1000 * 60 * 5,
    retry: false,
    queryFn: getCustomOptions,
  });

  return {
    data: query?.data as any[],
    isSuccess: query.isSuccess,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
