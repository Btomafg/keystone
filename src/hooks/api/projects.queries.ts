import {
  createCabinets,
  createProject,
  createRoom,
  deleteCabinets,
  deleteRoom,
  getCabinetById,
  getCabinetTypes,
  getCustomOptions,
  getLayoutOptions,
  getProjectById,
  getProjects,
  getRoomOptions,
  getRoomsByProjectId,
  reviewProject,
  updateCabinet,
  updateDrawing,
  updateProject,
  updateRoom,
  updateWall,
} from '@/api/projects.api';
import { API_ROUTES } from '@/constants/api.routes';
import { Cabinet, Drawing, Project, Room, Wall } from '@/constants/models/object.types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useToast } from '../use-toast';

export const useGetProjects = () => {
  const query = useQuery({
    queryKey: [API_ROUTES.GET_PROJECTS],
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
export const useGetProjectById = (body: any) => {
  console.log;
  const query = useQuery({
    queryKey: [API_ROUTES.PROJECTS.GET_BY_ID, body],
    staleTime: 1000 * 60 * 5,
    queryFn: () => getProjectById(body),
  });
  return {
    data: query?.data,
    isSuccess: query.isSuccess,
    isLoading: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
};

export const useCreateProjects = () => {
  const { toast } = useToast();
  const { refetch } = useGetProjects();
  const mutation = useMutation({
    mutationFn: (body: Partial<Project>) => createProject(body),
    onSuccess: (response) => {
      toast({ title: 'Project Created', description: 'Your project has been successfully created.' });
      refetch();
    },
  });
  return mutation;
};

export const useUpdateProject = () => {
  const { toast } = useToast();
  const { refetch } = useGetProjects();
  const mutation = useMutation({
    mutationFn: (body: Partial<Project>) => updateProject(body),
    onSuccess: (response) => {
      refetch();
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
    mutationFn: (body: Partial<Cabinet>[]) => createCabinets(body),
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
    mutationFn: (roomId: number) => deleteRoom(roomId),
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Room Deleted' });
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
export const useGetCabinetTypes = () => {
  const query = useQuery({
    queryKey: [API_ROUTES.GET_CABINET_TYPES],
    staleTime: 1000 * 60 * 5,
    retry: false,
    queryFn: getCabinetTypes,
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
    mutationFn: (cabinetIds: string[]) => deleteCabinets(cabinetIds),
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Room Deleted' });
    },
  });
  return mutation;
};

export const useGetLayoutOptions = () => {
  const query = useQuery({
    queryKey: ['getLayoutOptions'],
    staleTime: 1000 * 60 * 5,
    retry: false,
    queryFn: getLayoutOptions,
  });

  return {
    data: query?.data as any[],
    isSuccess: query.isSuccess,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

//walls

export const useUpdateWall = () => {
  const { toast } = useToast();
  const { refetch } = useGetProjects();
  const mutation = useMutation({
    mutationFn: (body: Partial<Wall>) => updateWall(body),
    onSuccess: (response) => {
      toast({ title: 'Wall Updated' });
      refetch();
    },
  });
  return mutation;
};

export const useReviewProject = () => {
  const { toast } = useToast();
  const { refetch } = useGetProjects();
  const mutation = useMutation({
    mutationFn: (body: Partial<Wall>) => reviewProject(body),
    onSuccess: (response) => {
      refetch();
      toast({ title: 'Project Submitted', description: 'Your project has been submitted for review!' });
    },
  });
  return mutation;
};

export const useUpdateDrawing = () => {
  const { toast } = useToast();
  const pathName = usePathname();
  const projectId = parseFloat(pathName.split('/')[3]);
  const { refetch } = useGetProjectById({ id: projectId });
  const mutation = useMutation({
    mutationFn: (body: Partial<Drawing>) => updateDrawing(body),
    onSuccess: (response) => {
      console.log('RESPONSE', response);
      if (response?.id) {
        refetch();
        toast({ title: 'Drawing Review Submitted ', description: 'Your review has been submitted to the team.' });
      }
    },
  });
  return mutation;
};
