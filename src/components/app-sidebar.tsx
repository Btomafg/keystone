'use client';
import Logo from '@/assets/images/logo/KW-LOGO.webp';
import { NavOpenProjects } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { APP_ROUTES } from '@/constants/routes';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { cn } from '@/lib/utils';
import { ClipboardListIcon, FolderIcon, HelpCircle, LayoutDashboardIcon, SettingsIcon, UsersIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import AdminPinPopover from './AdminPinPopover';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: APP_ROUTES.DASHBOARD.HOME.path,
      icon: LayoutDashboardIcon,
    },

    {
      title: 'Projects',
      url: APP_ROUTES.DASHBOARD.PROJECTS.PROJECTS.path,
      icon: FolderIcon,
    },
    {
      title: 'Appointments',
      url: APP_ROUTES.DASHBOARD.ORDERS.path,
      icon: UsersIcon,
    },
    {
      title: 'Documents',
      url: APP_ROUTES.DASHBOARD.DOCUMENTS.path,
      icon: ClipboardListIcon,
    },
    {
      title: 'FAQ',
      url: APP_ROUTES.DASHBOARD.FAQ.path,
      icon: HelpCircle,
    },
  ],
};

const adminItems = [
  {
    title: 'Dashboard',
    url: APP_ROUTES.ADMIN.DASHBOARD.path,
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Leads',
    url: APP_ROUTES.ADMIN.LEADS.path,
    icon: UsersIcon,
  },
  {
    title: 'Projects',
    url: APP_ROUTES.ADMIN.PROJECTS.path,
    icon: FolderIcon,
  },
  {
    title: 'Users',
    url: APP_ROUTES.ADMIN.USERS.path,
    icon: UsersIcon,
  },
  {
    title: 'Settings',
    url: APP_ROUTES.ADMIN.SETTINGS.path,
    icon: SettingsIcon,
  },
];

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar>) {
  const admin = useTypedSelector((state) => state.auth.is_admin);
  const adminSessionKey = useTypedSelector((state) => state.auth.admin_session_key);
  const adminMode = admin && adminSessionKey ? true : false;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <Link href="/dashboard" className={cn(`logo text-primary-foreground `)}>
          <Image alt="" className="p-3" src={Logo} width={'150'} />
        </Link>
        <span className="text-xs ms-4">V1.01</span>
        <span className="text-xs ms-4">17-Apr @ 0709</span>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminMode ? adminItems : data.navMain} />
        {!user?.is_admin && <NavOpenProjects />}
        {/*  <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
        {user?.is_admin && <AdminPinPopover />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
