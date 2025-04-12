'use client';
import React from 'react';
import Dashboard from '@/components/app/dashboard/Dashboard';
import store from '@/store';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import AdminDashboardWidgets from '@/components/app/admin/AdminDashboardWidgets';
import AdminActionWidgets from '@/components/app/admin/AdminActionWidgets';
import { useGetUser } from '@/hooks/api/users.queries';
interface pageProps {}
const page: React.FC<pageProps> = (props) => {
  //HOOKS

  //STATES

  //VARIABLES
  const { data: user } = useGetUser();
  const admin = useTypedSelector((state) => state.auth.is_admin);
  const admin_key = store.getState().auth.admin_session_key;
  const admin_key_expires_at = store.getState().auth.admin_session_expires_at;
  //FUNCTIONS

  //EFFECTS

  return (
    <div className="container gap-4 flex flex-1 flex-col">
      <AdminDashboardWidgets totalUsers={104} totalProjects={37} totalValue={2256000} growth="+18%" />
      <AdminActionWidgets projectsToReview={6} actionsThisWeek={12} unreadMessages={4} />
      <span className="text-red-500">WIDGETS ARE DUMBY DATA. DO NOT CLICK ON THEM. THEY DO NOTHING.</span>
      <p>Admin Key: {admin_key}</p>
      <p>Admin Key Expires At: {admin_key_expires_at}</p>
      <p>Admin: {admin ? 'true' : 'false'}</p>
    </div>
  );
};

export default page;
