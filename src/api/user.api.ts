// lib/api/users.ts

import { getAPI } from '@/lib/api/api';

import store from '@/store';

export const getCurrentUser = async () => {
  console.log('getting user');
  const user = store.getState().auth.user;
  const isAuthenticated = store.getState().auth.isAuthenticated;
  console.log('getCurrentUser', user);
  if (!user) return null;
  const API = await getAPI();
  try {
    const res = await API.getOne(
      'Users',
      'created_at, title, date_of_birth, email, first_name, is_active, last_name, phone, profile_picture_url, mfa, receive_email, receive_promotional, receive_push, receive_sms',
      'id',
      user.id,
    );
    console.log(res);
    if (res?.code === 'PGRST116') {
      await createUser();
      const refetch = await API.getOne('Users', 'first_name, last_name, email', 'id', user.id);
      return refetch;
    }
    console.log('USER', res);
    return res;
  } catch (error) {
    console.error('ERROR GETTING USER', error);
  }
};

export const createUser = async () => {
  const user = store.getState().auth.user;
  const API = await getAPI();
  await (
    await API
  ).insert('Users', {
    id: user.id,
    email: user.email,
  });
  console.log('USER CREATED - REFRESHING');
  return true;
};

export const updateUser = async (payload: any) => {
  const user = store.getState().auth.user;
  const API = await getAPI();
  await API.update('Users', 'id', user.id, payload);
  return true;
};
