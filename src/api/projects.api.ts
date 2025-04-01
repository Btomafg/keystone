// lib/API/users.ts

import { Cabinet, Project, Room } from '@/constants/models/object.types';
import { getAPI } from '@/lib/api/api';

import store from '@/store';
export const createProject = async (body: Partial<Project>) => {
  const API = await getAPI();
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
  const {
    auth: { user },
  } = store.getState();

  if (!user) {
    console.error('No user found in store.');
    return [];
  }

  const query = `
    id,
    name,
    description,
    status,
    type,
    step,
    rooms: Rooms_project_fkey (
      id,
      name,
      type,
      layout,
      height,
      walls: Walls_room_id_fkey (
        id,
        name,
        wall_number,
        length,
        cabinets: Cabinets_wall_id_fkey (
          id,
          wall_id,
          ceilingHeight,
          constructionMethod,
          crown,
          doorMaterial,
          lightRail,
          subMaterial,
          toeStyle,
          length,
          width,
          height,
          sqft,
          cuft,
          name,
          quote,
          createStep
        )
      )
    )
  `;

  try {
    const res = await API.getAll('Projects', query, 'user_id', user.id);
    return res || [];
  } catch (error) {
    console.error('ERROR GETTING PROJECTS', error);
    return [];
  }
};

export const createRoom = async (body: Partial<Room>) => {
  try {
    const res = await API.upsert('Rooms', body);
    return res;
  } catch (error) {
    console.error('ERROR CREATING ROOM', error);
  }
  return true;
};

export const updateRoom = async (body: Partial<Room>) => {
  try {
    console.log('UPDATING ROOM', body);
    const res = await API.update('Rooms', body);
    return res;
  } catch (error) {
    console.error('ERROR UPDATING ROOM', error);
  }
  return true;
};

export const deleteRoom = async (roomId: string) => {
  try {
    const res = await API.delete('Rooms', 'id', roomId);
    return res;
  } catch (error) {
    console.error('ERROR DELETING ROOM', error);
  }
  return true;
};

export const getRoomsByProjectId = async (projectId: string) => {
  try {
    const res = await API.getAll('Rooms', 'id, name, type', 'project', projectId);
    return res || [];
  } catch (error) {
    console.error('ERROR GETTING ROOMS', error);
  }
};

export const getRoomOptions = async () => {
  try {
    const res = await API.getAll('RoomOptions', 'id, name, image_url', 'active', true);
    return res || [];
  } catch (error) {
    console.error('ERROR GETTING ROOM OPTIONS', error);
  }
};

export const createCabinets = async (body: Partial<Cabinet>) => {
  try {
    const res = await API.upsert('Cabinets', body);
    console.log('Cabinet created', res);
    return res;
  } catch (error) {
    console.error('ERROR CREATING CABINET', error);
  }
  return true;
};

export const getCabinetById = async (cabinetId: string) => {
  try {
    const res = await API.getAll(
      'Cabinets',
      'id, room, ceilingHeight, constructionMethod, crown, doorMaterial, lightRail, subMaterial, toeStyle, length, width, height, sqft, cuft, name, quote, createStep',
      'id',
      cabinetId,
    );
    return res;
  } catch (error) {
    console.error('ERROR GETTING CABINET', error);
  }
};

export const updateCabinet = async (body: Partial<Cabinet>) => {
  try {
    console.log('UPDATING CABINET', body);
    const res = await API.update('Cabinets', body);
    console.log('Cabinet updated', res);
    return res;
  } catch (error) {
    console.error('ERROR UPDATING CABINET', error);
  }
  return true;
};

export const deleteCabinet = async (cabinetId: string) => {
  try {
    const res = await API.delete('Cabinets', 'id', cabinetId);
    return res;
  } catch (error) {
    console.error('ERROR DELETING CABINET', error);
  }
  return true;
};

export const getCustomOptions = async () => {
  try {
    const res = await API.getAll('CustomOptions', 'id, name, type, image_url, value', 'active', true);
    return res || [];
  } catch (error) {
    console.error('ERROR GETTING CUSTOM OPTIONS', error);
  }
};

export const getLayoutOptions = async () => {
  try {
    const res = await API.getAll(
      'Layouts',
      'id, name, image_url, walls, wall_one_image_url, wall_two_image_url, wall_three_image_url, room_option_id',
      'active',
      true,
    );
    return res || [];
  } catch (error) {
    console.error('ERROR GETTING LAYOUT OPTIONS', error);
  }
};
