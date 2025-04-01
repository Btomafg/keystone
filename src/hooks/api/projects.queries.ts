// hooks/apiHooks.ts
import type { Cabinet, Project, Room } from '@/constants/models/object.types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '../use-toast';

// GET Projects
export const useGetProjects = () => {
  const query = useQuery({
    queryKey: ['getProjects'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await fetch('/api/projects', { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch projects');
      const { data } = await res.json();
      return data as Project[];
    },
  });

  return {
    data: query.data,
    isSuccess: query.isSuccess,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

// Create Project
export const useCreateProjects = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (body: Partial<Project>) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to create project');
      const { data } = await res.json();
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Project Created', description: 'Your project has been successfully created.' });
    },
  });
  return mutation;
};

// Update Project
export const useUpdateProject = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (body: Partial<Project>) => {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to update project');
      const { data } = await res.json();
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Project Updated', description: 'Your project has been successfully updated.' });
    },
  });
  return mutation;
};

// Get Rooms By Project Id (assume a dedicated query on the projects route)
export const useGetRoomsByProjectId = (projectId: string) => {
  const query = useQuery({
    queryKey: ['getRoomsByProjectId', projectId],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      // Assuming the same endpoint returns rooms filtered by project id via query param
      const res = await fetch(`/api/projects?projectId=${projectId}`, { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch rooms');
      const { data } = await res.json();
      return data;
    },
  });
  return {
    data: query.data,
    isSuccess: query.isSuccess,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

// Create Room
export const useCreateRoom = () => {
  const { toast } = useToast();
  const { refetch } = useGetProjects(); // or a dedicated refetch if you have one for rooms

  const mutation = useMutation({
    mutationFn: async (body: Partial<Room>) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, type: 'createRoom' }), // Use a discriminator if needed
      });
      if (!res.ok) throw new Error('Failed to create room');
      const { data } = await res.json();
      return data;
    },
    onSuccess: () => {
      refetch();
      toast({ title: 'Room Created', description: 'A new room has been added to your project' });
    },
  });
  return mutation;
};

// Update Room
export const useUpdateRoom = () => {
  const { toast } = useToast();
  const { refetch } = useGetProjects();

  const mutation = useMutation({
    mutationFn: async (body: Partial<Room>) => {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, type: 'updateRoom' }),
      });
      if (!res.ok) throw new Error('Failed to update room');
      const { data } = await res.json();
      return data;
    },
    onSuccess: () => {
      refetch();
      toast({ title: 'Room Updated' });
    },
  });
  return mutation;
};

// Create Cabinets
export const useCreateCabinets = () => {
  const { toast } = useToast();
  const { refetch } = useGetProjects();

  const mutation = useMutation({
    mutationFn: async (body: Partial<Room>) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, type: 'createCabinets' }),
      });
      if (!res.ok) throw new Error('Failed to create cabinet');
      const { data } = await res.json();
      return data;
    },
    onSuccess: () => {
      refetch();
      toast({ title: 'Cabinet Created', description: 'A cabinet has been added!' });
    },
  });
  return mutation;
};

// Get Cabinet By Id
export const useGetCabinetById = (cabinetId: string) => {
  const query = useQuery({
    queryKey: ['getCabinetById', cabinetId],
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: async () => {
      const res = await fetch(`/api/projects?cabinetId=${cabinetId}`, { method: 'GET' });
      if (!res.ok) throw new Error('Failed to get cabinet');
      const { data } = await res.json();
      return data;
    },
  });
  return {
    data: query.data as Cabinet,
    isSuccess: query.isSuccess,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

// Update Cabinet
export const useUpdateCabinet = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (body: Partial<Cabinet>) => {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, type: 'updateCabinet' }),
      });
      if (!res.ok) throw new Error('Failed to update cabinet');
      const { data } = await res.json();
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Cabinet Updated' });
    },
  });
  return mutation;
};

// Delete Room
export const useDeleteRoom = () => {
  const { toast } = useToast();
  const { refetch } = useGetProjects();

  const mutation = useMutation({
    mutationFn: async (roomId: string) => {
      const res = await fetch(`/api/projects?id=${roomId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete room');
      const { data } = await res.json();
      return data;
    },
    onSuccess: () => {
      refetch();
      toast({ title: 'Room Deleted' });
    },
  });
  return mutation;
};

// Get Room Options
export const useGetRoomOptions = () => {
  const query = useQuery({
    queryKey: ['getRoomOptions'],
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: async () => {
      const res = await fetch('/api/projects?roomOptions=true', { method: 'GET' });
      if (!res.ok) throw new Error('Failed to get room options');
      const { data } = await res.json();
      return data;
    },
  });
  return {
    data: query.data as any[],
    isSuccess: query.isSuccess,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

// Get Custom Options
export const useGetCustomOptions = () => {
  const query = useQuery({
    queryKey: ['getCustomOptions'],
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: async () => {
      const res = await fetch('/api/projects?customOptions=true', { method: 'GET' });
      if (!res.ok) throw new Error('Failed to get custom options');
      const { data } = await res.json();
      return data;
    },
  });
  return {
    data: query.data as any[],
    isSuccess: query.isSuccess,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

// Delete Cabinet
export const useDeleteCabinet = () => {
  const { toast } = useToast();
  const { refetch } = useGetProjects();

  const mutation = useMutation({
    mutationFn: async (cabinetId: string) => {
      const res = await fetch(`/api/projects?cabinetId=${cabinetId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete cabinet');
      const { data } = await res.json();
      return data;
    },
    onSuccess: () => {
      refetch();
      toast({ title: 'Cabinet Deleted' });
    },
  });
  return mutation;
};

// Get Layout Options
export const useGetLayoutOptions = () => {
  const query = useQuery({
    queryKey: ['getLayoutOptions'],
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: async () => {
      const res = await fetch('/api/projects?layoutOptions=true', { method: 'GET' });
      if (!res.ok) throw new Error('Failed to get layout options');
      const { data } = await res.json();
      return data;
    },
  });
  return {
    data: query.data as any[],
    isSuccess: query.isSuccess,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
