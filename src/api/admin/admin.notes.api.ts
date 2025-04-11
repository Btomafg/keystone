import { API_ROUTES } from '@/constants/api.routes';
import store from '@/store';

export const getAdminNotes = async (body) => {
  const params = new URLSearchParams(body);
  const url = `${API_ROUTES.ADMIN.NOTES.GET}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.error('ERROR GETTING NOTES', error);
    return [];
  }
};
export const createNote = async (body) => {
  const admin_key = store.getState().auth.admin_session_key;

  const params = new URLSearchParams({ admin_key: admin_key });
  const url = `${API_ROUTES.ADMIN.NOTES.DELETE}?${params.toString()}`;
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
    console.error('ERROR DELETING NOTES', error);
    return [];
  }
};

export const deleteNote = async (body) => {
  const admin_key = store.getState().auth.admin_session_key;

  const params = new URLSearchParams({ admin_key: admin_key });
  const url = `${API_ROUTES.ADMIN.NOTES.DELETE}?${params.toString()}`;
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('ERROR DELETING NOTES', error);
    return [];
  }
};
