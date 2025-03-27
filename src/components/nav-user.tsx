import { Bell, Bug, Building, ChevronsUpDown, LogOut, User } from "lucide-react";
import { useState } from "react";

import ReportBug from "@/components/app/ReportBug";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

import { APP_ROUTES } from "@/constants/routes";

import { useReportBug } from "@/components/app/bug-provider";
import { useLogout } from "@/hooks/api/auth.queries";
import { useGetUser } from "@/hooks/api/users.queries";
import { useRouter } from "next/navigation";


export const NavUser: React.FC = () => {
  const { isMobile } = useSidebar();
  const [bugOpen, setBugOpen] = useState(false);
  const { mutateAsync: logOut } = useLogout();
  const { data: user } = useGetUser();
  const { showReportBug } = useReportBug();
  const router = useRouter();

  const menuItems = [
    {
      icon: <User />,
      label: "Profile",
      path: APP_ROUTES.DASHBOARD.SETTINGS.SETTINGS.path,
    },
    {
      icon: <Building />,
      label: "Account",
      path: APP_ROUTES.DASHBOARD.SETTINGS.ACCOUNT.path,
    },

    {
      icon: <Bell />,
      label: "Notifications",
      path: APP_ROUTES.DASHBOARD.SETTINGS.NOTIFICATIONS.path,
    },
  ];

  const otherItems = [
    {
      icon: <Bug />,
      label: "Report a problem",
      onClick: () => showReportBug(),
    },
    {
      icon: <LogOut />,
      label: "Log out",
      onClick: () => logOut(),
    },
  ];

  return (
    <SidebarMenu >


      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.profile_picture_url} alt={`${user?.first_name} ${user?.last_name}`} />
                <AvatarFallback className="rounded-lg">BT</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{`${user?.first_name} ${user?.last_name}`}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="size-4 ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 w-[--radix-dropdown-menu-trigger-width] rounded-lg bg-white"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >

            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.profile_picture_url} alt={`${user?.first_name} ${user?.last_name}`} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{`${user?.first_name} ${user?.last_name}`}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />


            <DropdownMenuGroup>
              {menuItems.map((item, index) => (
                <DropdownMenuItem key={index} onClick={() => router.push(item.path)} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />


            <ReportBug open={bugOpen} setOpen={setBugOpen} />


            <DropdownMenuGroup>
              {otherItems.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={item.onClick}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
