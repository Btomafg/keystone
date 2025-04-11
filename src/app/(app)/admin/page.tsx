'use client';
import React from 'react';
import Dashboard from '@/components/app/dashboard/Dashboard';
import store from '@/store';
import { useTypedSelector } from '@/hooks/useTypedSelector';
interface pageProps {}
const page: React.FC<pageProps> = (props) => {
  //HOOKS

  //STATES

  //VARIABLES

  const admin = useTypedSelector((state) => state.auth.is_admin);
  const admin_key = store.getState().auth.admin_session_key;
  const admin_key_expires_at = store.getState().auth.admin_session_expires_at;
  //FUNCTIONS

  //EFFECTS

  return (
    <>
      <Dashboard />

      <p>Admin Key: {admin_key}</p>
      <p>Admin Key Expires At: {admin_key_expires_at}</p>
      <p>Admin: {admin ? 'true' : 'false'}</p>
    </>
  );
};

export default page;
