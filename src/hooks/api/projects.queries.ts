import {
  createCabinets,
  createProject,
  createRoom,
  deleteCabinet,
  deleteRoom,
  getCabinetById,
  getCustomOptions,
  getProjects,
  getRoomOptions,
  getRoomsByProjectId,
  updateCabinet,
  updateRoom,
} from '@/api/projects.api';
import { Cabinet, Project, Room } from '@/constants/models/object.types';
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

export const useUpdateProject = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (body: Partial<Project>) => createProject(body),
    onSuccess: (response) => {
      toast({ title: 'Project Updated', description: 'Your project has been successfully updated.' });
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
      toast({ title: 'Room Created', description: 'A new room has been added to your project' });
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
export const useGetCabinetById = (cabinetId) => {
  const query = useQuery({
    queryKey: ['getCabinetById'],
    staleTime: 1000 * 60 * 5,
    retry: false,
    queryFn: () => getCabinetById(cabinetId),
  });
  return {
    data: query?.data as Cabinet,
    isSuccess: query.isSuccess,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: (cabinetId) => query.refetch(cabinetId),
  };
};

export const useUpdateCabinet = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (body: Partial<Cabinet>) => updateCabinet(body),
    onSuccess: (response) => {
      toast({ title: 'Cabinet Updated' });
    },
  });
  return mutation;
};
export const useDeleteRoom = () => {
  const { toast } = useToast();
  const { refetch } = useGetProjects();
  const mutation = useMutation({
    mutationFn: (cabinetId: string) => deleteRoom(cabinetId),
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Cabinet Deleted' });
    },
  });
  return mutation;
};

export const useGetRoomOptions = () => {
  const query = useQuery({
    queryKey: ['getRoomOptions'],
    staleTime: 1000 * 60 * 5,
    retry: false,
    queryFn: getRoomOptions,
  });

  return {
    data: query?.data as any[],
    isSuccess: query.isSuccess,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
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

export const useDeleteCabinet = () => {
  const { toast } = useToast();
  const { refetch } = useGetProjects();
  const mutation = useMutation({
    mutationFn: (cabinetId: string) => deleteCabinet(cabinetId),
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Room Deleted' });
    },
  });
  return mutation;
};
