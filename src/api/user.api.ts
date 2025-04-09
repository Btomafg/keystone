// lib/api/users.ts

import { API_ROUTES } from '@/constants/api.routes';
import { API } from '@/lib/api/browser';
import store from '@/store';

export const getCurrentUser = async () => {
  const user = store.getState().auth.user;
  const isAuthenticated = store.getState().auth.isAuthenticated;
  if (!user) return null;

  try {
    const res = await fetch(API_ROUTES.GET_USER, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();

    if (data?.code === 'PGRST116') {
      await createUser();
      const res = await fetch(API_ROUTES.GET_USER, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const refetch = await res.json();
      return refetch;
    }
    return data;
  } catch (error) {
    console.error('ERROR GETTING USER', error);
  }
};

export const createUser = async () => {
  const user = store.getState().auth.user;
  try {
    const res = await fetch(API_ROUTES.CREATE_USER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: user.id,
        email: user.email,
        active: true,
      }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('ERROR GETTING USER', error);
  }
};

export const updateUser = async (body: any) => {
  const user = store.getState().auth.user;
  try {
    const res = await fetch(API_ROUTES.UPDATE_USER, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('ERROR GETTING USER', error);
  }
};
