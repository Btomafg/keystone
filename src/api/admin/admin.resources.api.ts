import { API_ROUTES } from '@/constants/api.routes';
import store from '@/store';

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

export const createAdminResource = async (body) => {
  const admin_key = store.getState().auth.admin_session_key;
  const params = new URLSearchParams({ admin_key: admin_key });
  const url = `${API_ROUTES.ADMIN.RESOURCES.POST}?${params.toString()}`;
  const newBody = {
    type: 'Resources',
    data: body,
  };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify(newBody),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('ERROR CREATING RESOURECE', error);
    return [];
  }
};
export const deleteAdminResource = async (body) => {
  const admin_key = store.getState().auth.admin_session_key;
  const params = new URLSearchParams({ admin_key: admin_key });
  const url = `${API_ROUTES.ADMIN.RESOURCES.DELETE}?${params.toString()}`;
  const newBody = {
    type: 'Resources',
    data: body,
  };
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify(newBody),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('ERROR DELETING RESOURECE', error);
    return [];
  }
};

export const createAdminResourceBlockedTimes = async (body) => {
  const admin_key = store.getState().auth.admin_session_key;
  const params = new URLSearchParams({ admin_key: admin_key });
  const url = `${API_ROUTES.ADMIN.RESOURCES.POST}?${params.toString()}`;
  const newBody = {
    type: 'ResourceBlockedTimes',
    data: body,
  };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify(newBody),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('ERROR CREATING RESOURECE', error);
    return [];
  }
};

export const deleteAdminResourceBlockedTimes = async (body) => {
  const admin_key = store.getState().auth.admin_session_key;
  const params = new URLSearchParams({ admin_key: admin_key });
  const url = `${API_ROUTES.ADMIN.RESOURCES.DELETE}?${params.toString()}`;
  const newBody = {
    type: 'ResourceBlockedTimes',
    data: body,
  };
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify(newBody),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('ERROR DELETING RESOURECE', error);
    return [];
  }
};

export const createAdminResourceAvailabilityRule = async (body) => {
  const admin_key = store.getState().auth.admin_session_key;
  const params = new URLSearchParams({ admin_key: admin_key });
  const url = `${API_ROUTES.ADMIN.RESOURCES.POST}?${params.toString()}`;
  const newBody = {
    type: 'ResourceAvailabilityRules',
    data: body,
  };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify(newBody),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('ERROR CREATING RESOURECE', error);
    return [];
  }
};

export const deleteAdminResourceAvailabilityRule = async (body) => {
  const admin_key = store.getState().auth.admin_session_key;
  const params = new URLSearchParams({ admin_key: admin_key });
  const url = `${API_ROUTES.ADMIN.RESOURCES.DELETE}?${params.toString()}`;
  const newBody = {
    type: 'ResourceAvailabilityRules',
    data: body,
  };
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify(newBody),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('ERROR DELETING RESOURECE', error);
    return [];
  }
};
