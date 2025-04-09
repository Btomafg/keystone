import { API_ROUTES } from '@/constants/api.routes';
import { FAQ } from '@/constants/models/object.types';

export const getAllFaqs = async () => {
  try {
    const res = await fetch(API_ROUTES.GET_ALL_FAQS, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();

    return data?.data;
  } catch (error) {
    console.error('ERROR GETTING PROJECTS', error);
    return [];
  }
};
export const getMyFaqFeedback = async (body) => {
  const { faq_id, faq_version } = body;
  const params = new URLSearchParams({ faq_id, faq_version });
  const url = `${API_ROUTES.GET_MY_FAQ_FEEDBACK}${params.toString()}`;
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
    console.error('ERROR GETTING PROJECTS', error);
    return [];
  }
};
export const faqIncreaseSearchCount = async (body: Partial<FAQ>) => {
  try {
    const res = await fetch(API_ROUTES.INCREASE_SEARCH_COUNT, {
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

export const faqCreateFeedback = async (body: Partial<FAQ>) => {
  try {
    const res = await fetch(API_ROUTES.FAQ_CREATE_FEEDBACK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    console.log('res', res);
    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.error('ERROR UPDATING PROJECT', error);
  }
  return true;
};
