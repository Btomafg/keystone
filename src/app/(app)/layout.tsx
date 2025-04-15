'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { usePathname } from 'next/navigation';

import { Toaster } from '@/components/ui/toaster';
import { useGetUser } from '@/hooks/api/users.queries';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page({ children }) {
  const router = useRouter();
  const isAuthenticated = useTypedSelector((state) => state.auth.isAuthenticated);
  const { data: user } = useGetUser();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated]);

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
        <Toaster />
        <SiteHeader />
        <DashboardWrapper />
      </SidebarInset>
    </SidebarProvider>
  );
}
