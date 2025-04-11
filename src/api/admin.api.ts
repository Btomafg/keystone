import { API_ROUTES } from '@/constants/api.routes';
import store from '@/store';

export const validateAdmin = async (body: any) => {
  const user = store.getState().auth.user;
  if (!user) return null;
  body.id = user.id;
  try {
    const res = await fetch(API_ROUTES.VALIDATE_ADMIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.error('ERROR GETTING USER', error);
  }
};
