import { API_ROUTES } from '@/constants/api.routes';

export const getAdminResourceById = async (body) => {
  const params = new URLSearchParams(body);
  console.log('params', params);
  const url = `${API_ROUTES.ADMIN.RESOURCES.GET_BYID}?${params.toString()}`;

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

export const getAdminResources = async (body) => {
  const params = new URLSearchParams(body);
  console.log('params', params);
  const url = `${API_ROUTES.ADMIN.RESOURCES.GET}?${params.toString()}`;

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
