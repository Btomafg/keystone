import { API } from '@/lib/api/api';

export const createBugReport = async (body) => {
  await API.insert('BugReport', body);
  console.log('Bug Report created');
  return true;
};
