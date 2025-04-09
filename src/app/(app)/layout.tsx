'use client';
import { AppSidebar } from '@/components/app-sidebar';
import Dashboard from '@/components/app/dashboard/Dashboard';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { usePathname } from 'next/navigation';

import NewProjectPage from '@/components/app/dashboard/projects/NewProjectPage';
import { APP_ROUTES } from '@/constants/routes';
import { useGetProjects } from '@/hooks/api/projects.queries';
import { useGetUser } from '@/hooks/api/users.queries';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Documents from './dashboard/documents/page';
import FAQ from './dashboard/faq/page';
import Orders from './dashboard/orders/page';
import Projects from './dashboard/projects/page';
import Settings from './dashboard/settings/page';
import FAQs from './dashboard/faq/FAQs';

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

  const DashboardRender = () => {
    const isDynamicProject = section?.match(/^\/dashboard\/projects\/[^/]+\/?$/);
    if (isDynamicProject) {
      return <NewProjectPage />;
    }
    switch (section) {
      case APP_ROUTES.DASHBOARD.HOME.path:
        return <Dashboard />;
      case APP_ROUTES.DASHBOARD.PROJECTS.PROJECTS.path:
        return <Projects />;
      case APP_ROUTES.DASHBOARD.ORDERS.path:
        return <Orders />;
      case APP_ROUTES.DASHBOARD.DOCUMENTS.path:
        return <Documents />;
      case APP_ROUTES.DASHBOARD.FAQ.path:
        return <FAQs />;
      case APP_ROUTES.DASHBOARD.SETTINGS.PROFILE.path:
        return <Settings />;
      case APP_ROUTES.DASHBOARD.SETTINGS.ACCOUNT.path:
        return <Settings />;
      case APP_ROUTES.DASHBOARD.SETTINGS.SECURITY.path:
        return <Settings />;
      case APP_ROUTES.DASHBOARD.SETTINGS.NOTIFICATIONS.path:
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const DashboardWrapper = () => {
    return (
      <div className="flex flex-col w-full h-full px-4 py-6 ">
        <div className="flex-1">
          <DashboardRender />
        </div>
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
