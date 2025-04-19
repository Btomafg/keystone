import { API_ROUTES } from '@/constants/api.routes';
import store from '@/store';

export const getAdminProjectById = async (body) => {
  const params = new URLSearchParams(body);
  console.log('params', params);
  const url = `${API_ROUTES.ADMIN.PROJECTS.GET_BYID}?${params.toString()}`;
  console.log('URL', url);
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
export const getAdminProjects = async (body) => {
  const params = new URLSearchParams(body);
  console.log('params', params);
  const url = `${API_ROUTES.ADMIN.PROJECTS.GET}?${params.toString()}`;
  console.log('URL', url);
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
export const updateAdminProject = async (body) => {
  const admin_key = store.getState().auth.admin_session_key;
  const params = new URLSearchParams({ admin_key: admin_key });
  const url = `${API_ROUTES.ADMIN.RESOURCES.POST}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('ERROR CREATING RESOURECE', error);
    return [];
  }
};
