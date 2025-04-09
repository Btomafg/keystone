'use client';
import Logo from '@/assets/images/logo/KW-LOGO.webp';
import {
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircle,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';
import * as React from 'react';
import { NavOpenProjects } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { APP_ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

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
      title: 'Orders',
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <Link href="/dashboard" className={cn(`logo text-primary-foreground `)}>
          <Image alt="" className="p-3" src={Logo} width={'150'} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavOpenProjects />
        {/*  <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
