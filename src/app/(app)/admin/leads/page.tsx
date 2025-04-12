'use client';
import { AdminLeadsTable } from '@/components/app/admin/AdminLeadsTable';
import { useAdminGetLeads } from '@/hooks/api/admin.queries';
import React from 'react';
interface pageProps {}
const page: React.FC<pageProps> = (props) => {
  //HOOKS
  const { data: leads = [], isLoading, refetch } = useAdminGetLeads();
  console.log('leads', leads);
  //EFFECTS

  return <AdminLeadsTable leads={leads} loading={isLoading} refetch={refetch} />;
};

export default page;
