// lib/api/users.ts

import { API_ROUTES } from '@/constants/api.routes';
import { API } from '@/lib/api/browser';
import store from '@/store';

export const getCurrentUser = async () => {
  const user = store.getState().auth.user;
  const isAuthenticated = store.getState().auth.isAuthenticated;
  console.log('getCurrentUser', user);
  if (!user) return null;
  console.log('getting user');

  try {
    const res = await fetch(API_ROUTES.GET_USER, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    console.log('USER DATA', data);
    if (data?.code === 'PGRST116') {
      await createUser();
      const refetch = await API.getOne('Users', 'first_name, last_name, email', 'id', user.id);
      return refetch;
    }
    return data;
  } catch (error) {
    console.error('ERROR GETTING USER', error);
  }
};

export const createUser = async () => {
  const user = store.getState().auth.user;
  await API.insert('Users', {
    id: user.id,
    email: user.email,
  });
  console.log('USER CREATED - REFRESHING');
  return true;
};

export const updateUser = async (payload: any) => {
  const user = store.getState().auth.user;
  await API.update('Users', 'id', user.id, payload);
  return true;
};
