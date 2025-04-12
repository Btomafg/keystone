import { API_ROUTES } from '@/constants/api.routes';
import store from '@/store';

export const getAdminUsers = async (body) => {
  const params = new URLSearchParams(body);
  const url = `${API_ROUTES.ADMIN.USERS.GET}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('ERROR GETTING USERS', error);
    return [];
  }
};

export const updateAdminUser = async (body) => {
  const admin_key = store.getState().auth.admin_session_key;

  const params = new URLSearchParams({ admin_key: admin_key });
  const url = `${API_ROUTES.ADMIN.USERS.POST}?${params.toString()}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('ERROR MANAGING USER', error);
    return [];
  }
};
export const manageAdminUsers = async (body) => {
  const admin_key = store.getState().auth.admin_session_key;

  const params = new URLSearchParams({ admin_key: admin_key });
  const url = `${API_ROUTES.ADMIN.USERS.MANAGE}?${params.toString()}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('ERROR MANAGING USER', error);
    return [];
  }
};
