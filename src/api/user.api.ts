// lib/api/users.ts

import { API } from '@/api/api';
import store from '@/store';

export const getCurrentUser = async () => {
  const user = store.getState().auth.user;
  const isAuthenticated = store.getState().auth.isAuthenticated;
  console.log('getCurrentUser', user);
  if (!user) return null;
  console.log('getting user');

  try {
    const res = await API.getOne(
      'Users',
      'created_at, title, date_of_birth, email, first_name, is_active, last_name, phone, profile_picture_url, mfa, receive_email, receive_promotional, receive_push, receive_sms',
      'id',
      user.id,
    );

    if (res?.code === 'PGRST116') {
      await createUser();
      const refetch = await API.getOne('Users', 'first_name, last_name, email', 'id', user.id);
      return refetch;
    }
    return res;
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
