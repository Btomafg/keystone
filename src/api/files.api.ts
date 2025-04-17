import { API_ROUTES } from '@/constants/api.routes';
import { FAQ } from '@/constants/models/object.types';

export const getAppointmentByProjectId = async (body) => {
  const { project_id } = body;
  const params = new URLSearchParams({ project_id });
  const url = `${API_ROUTES.APPOINTMENTS.PROJECTID}?${params.toString()}`;
  console.log('url', url);
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
    console.error('ERROR GETTING Appointments', error);
    return [];
  }
};

export const createAppointment = async (body: Partial<FAQ>) => {
  try {
    const res = await fetch(API_ROUTES.APPOINTMENTS.POST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.error('ERROR UPDATING PROJECT', error);
  }
  return true;
};
