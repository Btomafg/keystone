'use client';
import { PlusCircleIcon, type LucideIcon } from 'lucide-react';

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { APP_ROUTES } from '@/constants/routes';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const router = useRouter();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Button size="sm" onClick={() => router.push(APP_ROUTES.DASHBOARD.PROJECTS.NEW.path)}>
              <PlusCircleIcon className="h-4 w-4" />
              <span className="ml-2">New Project</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className="bg-background hover:bg-muted hover:text-white active:bg-muted active:font-bold active:text-white"
                tooltip={item.title}
                onClick={() => router.push(item.url, undefined)}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
