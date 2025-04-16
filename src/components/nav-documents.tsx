'use client';

import { Clipboard, MoreHorizontalIcon } from 'lucide-react';

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { APP_ROUTES } from '@/constants/routes';
import { useGetProjects } from '@/hooks/api/projects.queries';
import Loader from './ui/loader';

export function NavOpenProjects() {
  const { data: projects, isLoading } = useGetProjects();
  const { isMobile } = useSidebar();
  const items = projects
    ? projects?.slice(0, 3)?.map((project) => ({
        name: project?.name,
        url: `/dashboard/projects/${project?.id}`,
        icon: <Clipboard />,
      }))
    : [];

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Open Projects</SidebarGroupLabel>
      <SidebarMenu>
        {isLoading ? (
          <div className="flex w-12 h-12 items-center">
            <Loader className="mx-auto my-auto" />
          </div>
        ) : (
          items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
              <SidebarMenuButton className="hidden group-data-[state=open]:inline-flex group-data-[state=closed]:inline-flex">
                <a href={APP_ROUTES.DASHBOARD.PROJECTS.PROJECTS.path}>
                  {' '}
                  <MoreHorizontalIcon />
                  <span className="sr-only">More</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))
        )}
        {items?.length > 3 && (
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <MoreHorizontalIcon className="text-sidebar-foreground/70" />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
