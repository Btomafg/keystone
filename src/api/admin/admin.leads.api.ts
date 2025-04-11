import { API_ROUTES } from '@/constants/api.routes';
import store from '@/store';

export const getAdminLeads = async (body) => {
  const params = new URLSearchParams({ admin_key: body });
  const url = `${API_ROUTES.ADMIN.LEADS.GET}?${params.toString()}`;

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
    console.error('ERROR GETTING LEADS', error);
    return [];
  }
};

export const deleteLeads = async (body) => {
  const admin_key = store.getState().auth.admin_session_key;

  const params = new URLSearchParams({ admin_key: admin_key });
  const url = `${API_ROUTES.ADMIN.LEADS.DELETE}?${params.toString()}`;
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
    console.error('ERROR DELETING LEADS', error);
    return [];
  }
};
