'use client';
import React from 'react';
import Dashboard from '@/components/app/dashboard/Dashboard';
import { useAdminGetUsers } from '@/hooks/api/admin.queries';
import { AdminUsersTable } from '@/components/app/admin/AdminUsersTable';
interface pageProps {}
const page: React.FC<pageProps> = (props) => {
  //HOOKS
  const { data: users = [], isLoading, refetch } = useAdminGetUsers();
  console.log('users', users);
  //STATES

  //VARIABLES

  //FUNCTIONS

  //EFFECTS

  return <AdminUsersTable users={users} loading={isLoading} refetch={refetch} />;
};

export default page;
