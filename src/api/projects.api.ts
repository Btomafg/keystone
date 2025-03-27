// lib/api/users.ts

import { API } from '@/api/api';
import { Cabinet, Project, Room } from '@/constants/models/object.types';
import store from '@/store';

export const createProject = async (body: Partial<Project>) => {
  const user = store.getState().auth.user;
  const newProject = { ...body, user_id: user.id };
  try {
    const res = await API.upsert('Projects', newProject);
    return res;
  } catch (error) {
    console.error('ERROR CREATING PROJECT', error);
  }
  return true;
};

export const updateProject = async (body: Partial<Project>) => {
  try {
    const res = await API.update('Projects', body);
    return res;
  } catch (error) {
    console.error('ERROR UPDATING PROJECT', error);
  }
  return true;
};

export const getProjects = async () => {
  const user = store.getState().auth.user;
  try {
    const res = await API.getAll(
      'Projects',
      'id ,name ,description, status, type, step, rooms: Rooms_project_fkey (id,name,type, cabinets: Cabinets_room_fkey (id, room, ceilingHeight, constructionMethod, crown, doorMaterial, lightRail, subMaterial, toeStyle, length, width, height, sqft, cuft, name, quote, createStep))',
      'user_id',
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
    const res = await API.update('Rooms', body);
    return res;
  } catch (error) {
    console.error('ERROR CREATING PROJECT', error);
  }
  return true;
};
export const deleteRoom = async (roomId) => {
  try {
    const res = await API.delete('Rooms', 'id', roomId);
    return res;
  } catch (error) {
    console.error('ERROR DELETING ROOM', error);
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

export const getRoomOptions = async (projectId) => {
  try {
    const res = await API.getAll('RoomOptions', 'id ,name ,image_url', 'active', true);
    return res || [];
  } catch (error) {
    console.error('ERROR GETTING PROJECTS', error);
  }
};

export const createCabinets = async (body: Partial<Cabinet>) => {
  try {
    const res = await API.upsert('Cabinets', body);
    console.log('Cabinet created', res);
    return res;
  } catch (error) {
    console.error('ERROR CREATING Cabinet', error);
  }
  return true;
};
export const updateCabinet = async (body: Partial<Cabinet>) => {
  try {
    console.log('UPDATING Cabinet', body);
    const res = await API.upsert('Cabinets', body);

    console.log('Cabinet created', res);
    return res;
  } catch (error) {
    console.error('ERROR CREATING Cabinet', error);
  }
  return true;
};
export const deleteCabinet = async (cabinetId) => {
  try {
    const res = await API.delete('Cabinets', 'id', cabinetId);
    return res;
  } catch (error) {
    console.error('ERROR DELETING Cabinet', error);
  }
  return true;
};

export const getCustomOptions = async () => {
  try {
    const res = await API.getAll('CustomOptions', 'id , name ,type,image_url,value', 'active', true);
    return res || [];
  } catch (error) {
    console.error('ERROR GETTING CustomOptions', error);
  }
};
