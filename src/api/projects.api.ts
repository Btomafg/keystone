// lib/api/users.ts

import { API_ROUTES } from '@/constants/api.routes';
import { Cabinet, Project, Room } from '@/constants/models/object.types';
import { API } from '@/lib/api/browser';
import store from '@/store';

export const createProject = async (body: Partial<Project>) => {
  const user = store.getState().auth.user;
  const newProject = { ...body, user_id: user.id };
  try {
    const res = await fetch(API_ROUTES.CREATE_PROJECT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('ERROR CREATING PROJECT', error);
  }
  return true;
};

export const updateProject = async (body: Partial<Project>) => {
  try {
    const res = await fetch(API_ROUTES.UPDATE_PROJECT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('ERROR UPDATING PROJECT', error);
  }
  return true;
};

export const getProjects = async () => {
  try {
    const res = await fetch(API_ROUTES.GET_PROJECTS, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.error('ERROR GETTING PROJECTS', error);
    return [];
  }
};
export const createRoom = async (body: Partial<Room>) => {
  try {
    const res = await fetch(API_ROUTES.CREATE_ROOM, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.error('ERROR CREATING PROJECT', error);
  }
  return true;
};
export const updateRoom = async (body: Partial<Room>) => {
  try {
    const res = await fetch(API_ROUTES.UPDATE_ROOM, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.error('ERROR CREATING PROJECT', error);
  }
  return true;
};
export const deleteRoom = async (roomId) => {
  try {
    const res = await fetch(API_ROUTES.DELETE_ROOM, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomId),
    });

    const data = await res.json();

    return data;
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
    const res = await fetch(API_ROUTES.ROOM_OPTIONS, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.error('ERROR GETTING PROJECTS', error);
  }
};

export const createCabinets = async (body: Partial<Cabinet>) => {
  try {
    const res = await fetch(API_ROUTES.CREATE_CABINET, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.error('ERROR CREATING Cabinet', error);
  }
  return true;
};
export const getCabinetById = async (cabinetId) => {
  try {
    const res = await API.getAll(
      'Cabinets',
      'id, room, ceilingHeight, constructionMethod, crown, doorMaterial, lightRail, subMaterial, toeStyle, length, width, height, sqft, cuft, name, quote, createStep',
      'id',
      cabinetId,
    );
    return res;
  } catch (error) {
    console.error('ERROR GETTING Cabinet', error);
  }
};
export const updateCabinet = async (body: Partial<Cabinet>) => {
  try {
    console.log('UPDATING Cabinet', body);
    const res = await API.update('Cabinets', body);

    console.log('Cabinet updated', res);
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
    const res = await fetch(API_ROUTES.CABINET_OPTIONS, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.error('ERROR GETTING CustomOptions', error);
  }
};

export const getLayoutOptions = async () => {
  try {
    const res = await API.getAll(
      'Layouts',
      'id , name ,image_url,walls, wall_one_image_url, wall_two_image_url, wall_three_image_url, room_option_id',
      'active',
      true,
    );
    return res || [];
  } catch (error) {
    console.error('ERROR GETTING LayoutOptions', error);
  }
};

export const updateWall = async (body: Partial<Cabinet>) => {
  try {
    const res = await fetch(API_ROUTES.UPDATE_WALL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.error('ERROR CREATING Cabinet', error);
  }
  return true;
};

export const reviewSubmittedProject = async (body: Partial<Project>) => {
  try {
    const res = await fetch(API_ROUTES.REVIEW_PROJECT, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.error('ERROR Reviewing Project', error);
  }
  return true;
};
