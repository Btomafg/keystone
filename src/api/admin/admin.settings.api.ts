import { API_ROUTES } from '@/constants/api.routes';
import store from '@/store';

export const getAdminSettings = async (body) => {
  const params = new URLSearchParams(body);
  const url = `${API_ROUTES.ADMIN.SETTINGS.GET}?${params.toString()}`;

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
    console.error('ERROR GETTING SETTINGS', error);
    return [];
  }
};
export const updateCreateSettings = async (body) => {
  const admin_key = store.getState().auth.admin_session_key;

  const params = new URLSearchParams({ admin_key: admin_key });
  const url = `${API_ROUTES.ADMIN.SETTINGS.POST}?${params.toString()}`;
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
    console.error('ERROR UPDATING ADMIN SETTINGS', error);
    return [];
  }
};
export const updateAdminSettings = async (body) => {
  const admin_key = store.getState().auth.admin_session_key;

  const params = new URLSearchParams({ admin_key: admin_key });
  const url = `${API_ROUTES.ADMIN.SETTINGS.UPDATE}?${params.toString()}`;
  console.log('URL', url);
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    console.log('RES', res);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('ERROR UPDATING ADMIN SETTINGS', error);
    return [];
  }
};
export const createAdminSettings = async (body) => {
  const admin_key = store.getState().auth.admin_session_key;

  const params = new URLSearchParams({ admin_key: admin_key });
  const url = `${API_ROUTES.ADMIN.SETTINGS.POST}?${params.toString()}`;
  console.log('URL', url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    console.log('RES', res);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('ERROR UPDATING ADMIN SETTINGS', error);
    return [];
  }
};
export const deleteAdminSettings = async (body) => {
  const admin_key = store.getState().auth.admin_session_key;

  const params = new URLSearchParams({ admin_key: admin_key });
  const url = `${API_ROUTES.ADMIN.SETTINGS.DELETE}?${params.toString()}`;
  console.log('URL', url);
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    console.log('RES', res);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('ERROR UPDATING ADMIN SETTINGS', error);
    return [];
  }
};
