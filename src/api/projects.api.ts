// lib/api/users.ts

import { API } from '@/api/api';
import { Project, Room } from '@/constants/models/object.types';
import store from '@/store';

export const createProject = async (body: Partial<Project>) => {
  const user = store.getState().auth.user;
  const newProject = { ...body, user: user.id };
  try {
    const res = await API.upsert('Projects', newProject);
    return res;
  } catch (error) {
    console.error('ERROR CREATING PROJECT', error);
  }
  return true;
};

export const getProjects = async () => {
  const user = store.getState().auth.user;
  try {
    const res = await API.getAll(
      'Projects',
      'id ,name ,description, status, type, step, rooms: Rooms_project_fkey (id,name,type)',
      'user',
      user.id,
    );
    return res || [];
  } catch (error) {
    console.error('ERROR GETTING PROJECTS', error);
  }
};

export const createRoom = async (body: Partial<Room>) => {
  try {
    const res = await API.upsert('Rooms', body);
    return res;
  } catch (error) {
    console.error('ERROR CREATING PROJECT', error);
  }
  return true;
};
export const updateRoom = async (body: Partial<Room>) => {
  try {
    console.log('UPDATING ROOM', body);
    const res = await API.update('Rooms', body, 'id', body.id);
    return res;
  } catch (error) {
    console.error('ERROR CREATING PROJECT', error);
  }
  return true;
};

export const getRoomsByProjectId = async (projectId) => {
  const user = store.getState().auth.user;
  try {
    const res = await API.getAll('Rooms', 'id ,name ,type', 'project', projectId);
    return res || [];
  } catch (error) {
    console.error('ERROR GETTING PROJECTS', error);
  }
};
