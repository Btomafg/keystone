'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

import { useGetUser } from '@/hooks/api/users.queries';

export default function Page({ children }) {
  const { data: user } = useGetUser();

  const path = usePathname();
  const section = path;

  const DashboardWrapper = () => {
    return (
      <div className="flex flex-col w-full h-full px-4 py-6 ">
        <div className="flex-1">{children}</div>
      </div>
    );
  };
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        <SiteHeader />
        <DashboardWrapper />
      </SidebarInset>
    </SidebarProvider>
  );
}
